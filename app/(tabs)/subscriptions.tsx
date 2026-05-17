import {FlatList, KeyboardAvoidingView, Platform, Text, TextInput, View} from 'react-native'
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind"
import {useMemo, useState} from "react";
import SubscriptionCard from "@/components/SubscriptionCard";
import {useSubscriptions} from "@/components/SubscriptionsProvider";
const SafeAreaView = styled(RNSafeAreaView)

const Subscriptions = () => {
	const [searchQuery, setSearchQuery] = useState("")
	const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null)
	const {subscriptions} = useSubscriptions()

	const filteredSubscriptions = useMemo(() => {
		const normalizedQuery = searchQuery.trim().toLowerCase()

		if (!normalizedQuery) {
			return subscriptions
		}

		return subscriptions.filter((subscription) => {
			const searchableValues = [
				subscription.name,
				subscription.category,
				subscription.plan,
				subscription.billing,
				subscription.paymentMethod,
				subscription.status,
			]

			return searchableValues.some((value) =>
				value?.toLowerCase().includes(normalizedQuery)
			)
		})
	}, [searchQuery, subscriptions])

	const handleSubscriptionPress = (item: Subscription) => {
		setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id))
	}

	return (
		<SafeAreaView className="flex-1 bg-background px-5 pt-5">
			<KeyboardAvoidingView
				className="flex-1"
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
			>
				<FlatList
					ListHeaderComponent={(
						<View className="subscriptions-header">
							<Text className="subscriptions-title">Subscriptions</Text>
							<TextInput
								value={searchQuery}
								onChangeText={setSearchQuery}
								placeholder="Search subscriptions"
								placeholderTextColor="rgba(0, 0, 0, 0.45)"
								autoCapitalize="none"
								autoCorrect={false}
								clearButtonMode="while-editing"
								className="subscriptions-search"
							/>
						</View>
					)}
					data={filteredSubscriptions}
					keyExtractor={(item) => item.id}
					renderItem={({item}) => (
						<SubscriptionCard
							{...item}
							expanded={expandedSubscriptionId === item.id}
							onPress={() => handleSubscriptionPress(item)}
						/>
					)}
					extraData={expandedSubscriptionId}
					ItemSeparatorComponent={() => <View className="h-4" />}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					ListEmptyComponent={(
						<Text className="home-empty-state">
							No subscriptions match your search.
						</Text>
					)}
					contentContainerClassName="pb-30"
				/>
			</KeyboardAvoidingView>
		</SafeAreaView >
	)
}
export default Subscriptions
