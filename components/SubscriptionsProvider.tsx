import * as SecureStore from "expo-secure-store";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

import { HOME_SUBSCRIPTIONS } from "@/constants/data";

interface SubscriptionsContextValue {
	subscriptions: Subscription[];
	addSubscription: (subscription: Subscription) => void;
}

const SubscriptionsContext = createContext<SubscriptionsContextValue | undefined>(undefined);
const SUBSCRIPTIONS_STORAGE_KEY = "recurrly-subscriptions";

const readStoredSubscriptions = async () => {
	if (Platform.OS === "web") {
		const storedValue = window.localStorage.getItem(SUBSCRIPTIONS_STORAGE_KEY);
		return storedValue ? (JSON.parse(storedValue) as Subscription[]) : null;
	}

	const storedValue = await SecureStore.getItemAsync(SUBSCRIPTIONS_STORAGE_KEY);
	return storedValue ? (JSON.parse(storedValue) as Subscription[]) : null;
};

const writeStoredSubscriptions = async (subscriptions: Subscription[]) => {
	const serializedSubscriptions = JSON.stringify(subscriptions);

	if (Platform.OS === "web") {
		window.localStorage.setItem(SUBSCRIPTIONS_STORAGE_KEY, serializedSubscriptions);
		return;
	}

	await SecureStore.setItemAsync(SUBSCRIPTIONS_STORAGE_KEY, serializedSubscriptions);
};

const mergeSubscriptionLists = (...subscriptionLists: Subscription[][]) => {
	const subscriptionIds = new Set<string>();
	const mergedSubscriptions: Subscription[] = [];

	subscriptionLists.flat().forEach((subscription) => {
		if (subscriptionIds.has(subscription.id)) return;

		subscriptionIds.add(subscription.id);
		mergedSubscriptions.push(subscription);
	});

	return mergedSubscriptions;
};

export const SubscriptionsProvider = ({ children }: { children: ReactNode }) => {
	const [subscriptions, setSubscriptions] = useState<Subscription[]>(HOME_SUBSCRIPTIONS);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		const loadSubscriptions = async () => {
			try {
				const storedSubscriptions = await readStoredSubscriptions();

				if (storedSubscriptions) {
					setSubscriptions((currentSubscriptions) => {
						if (currentSubscriptions === HOME_SUBSCRIPTIONS) {
							return mergeSubscriptionLists(storedSubscriptions, HOME_SUBSCRIPTIONS);
						}

						return mergeSubscriptionLists(
							currentSubscriptions,
							storedSubscriptions,
							HOME_SUBSCRIPTIONS
						);
					});
				}
			} catch (error) {
				console.warn("Failed to load stored subscriptions", error);
			} finally {
				setHydrated(true);
			}
		};

		loadSubscriptions();
	}, []);

	useEffect(() => {
		if (!hydrated) return;

		writeStoredSubscriptions(subscriptions).catch((error) => {
			console.warn("Failed to store subscriptions", error);
		});
	}, [hydrated, subscriptions]);

	const addSubscription = (subscription: Subscription) => {
		setSubscriptions((currentSubscriptions) => {
			const nextSubscriptions = [subscription, ...currentSubscriptions];

			writeStoredSubscriptions(nextSubscriptions).catch((error) => {
				console.warn("Failed to store subscriptions", error);
			});

			return nextSubscriptions;
		});
	};

	return (
		<SubscriptionsContext.Provider value={{ subscriptions, addSubscription }}>
			{children}
		</SubscriptionsContext.Provider>
	);
};

export const useSubscriptions = () => {
	const context = useContext(SubscriptionsContext);

	if (!context) {
		throw new Error("useSubscriptions must be used within SubscriptionsProvider");
	}

	return context;
};
