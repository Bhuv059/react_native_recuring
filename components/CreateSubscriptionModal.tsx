import { clsx } from "clsx";
import dayjs from "dayjs";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	View,
} from "react-native";

import { icons } from "@/constants/icons";
import {posthog} from "@/lib/posthog";

type Frequency = "Monthly" | "Yearly";

interface CreateSubscriptionModalProps {
	visible: boolean;
	onClose: () => void;
	onCreate: (subscription: Subscription) => void;
}

const categories = [
	"Entertainment",
	"AI Tools",
	"Developer Tools",
	"Design",
	"Productivity",
	"Cloud",
	"Music",
	"Other",
];

const categoryColors: Record<string, string> = {
	Entertainment: "#f5c7d8",
	"AI Tools": "#b8d4e3",
	"Developer Tools": "#e8def8",
	Design: "#f5c542",
	Productivity: "#b8e8d0",
	Cloud: "#c7ddff",
	Music: "#c8f0d4",
	Other: "#f2dfbb",
};

const CreateSubscriptionModal = ({
	visible,
	onClose,
	onCreate,
}: CreateSubscriptionModalProps) => {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [frequency, setFrequency] = useState<Frequency>("Monthly");
	const [category, setCategory] = useState("Entertainment");
	const [submitted, setSubmitted] = useState(false);

	const normalizedName = name.trim();
	const parsedPrice = Number(price.replace(",", "."));
	const formValid = normalizedName.length > 0 && Number.isFinite(parsedPrice) && parsedPrice > 0;
	const showNameError = submitted && normalizedName.length === 0;
	const showPriceError = submitted && (!Number.isFinite(parsedPrice) || parsedPrice <= 0);

	const resetForm = () => {
		setName("");
		setPrice("");
		setFrequency("Monthly");
		setCategory("Entertainment");
		setSubmitted(false);
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleSubmit = () => {
		setSubmitted(true);

		if (!formValid) return;

		const startDate = dayjs();
		const renewalDate =
			frequency === "Monthly" ? startDate.add(1, "month") : startDate.add(1, "year");

		onCreate({
			id: `subscription-${Date.now()}`,
			name: normalizedName,
			price: parsedPrice,
			frequency,
			category,
			status: "active",
			startDate: startDate.toISOString(),
			renewalDate: renewalDate.toISOString(),
			icon: icons.plus,
			billing: frequency,
			color: categoryColors[category],
			currency: "USD",
		});
		posthog.capture('subscription_created', {
			subscription_name: name.trim(),
			subscription_price: price,
			subscription_category: category,
			subscription_frequency: frequency,
		});
		resetForm();
		onClose();
	};

	return (
		<Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				className="modal-overlay"
			>
				<Pressable className="flex-1" onPress={handleClose} />
				<View className="modal-container">
					<View className="modal-header">
						<Text className="modal-title">New Subscription</Text>
						<Pressable className="modal-close" onPress={handleClose}>
							<Text className="modal-close-text">x</Text>
						</Pressable>
					</View>

					<ScrollView
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
					>
						<View className="modal-body">
							<View className="auth-field">
								<Text className="auth-label">Name</Text>
								<TextInput
									className={clsx("auth-input", showNameError && "auth-input-error")}
									value={name}
									onChangeText={setName}
									placeholder="Subscription name"
									placeholderTextColor="rgba(0, 0, 0, 0.4)"
									autoCapitalize="words"
									returnKeyType="next"
								/>
								{showNameError && <Text className="auth-error">Name is required</Text>}
							</View>

							<View className="auth-field">
								<Text className="auth-label">Price</Text>
								<TextInput
									className={clsx("auth-input", showPriceError && "auth-input-error")}
									value={price}
									onChangeText={setPrice}
									placeholder="0.00"
									placeholderTextColor="rgba(0, 0, 0, 0.4)"
									keyboardType="decimal-pad"
								/>
								{showPriceError && <Text className="auth-error">Enter a positive price</Text>}
							</View>

							<View className="auth-field">
								<Text className="auth-label">Frequency</Text>
								<View className="picker-row">
									{(["Monthly", "Yearly"] as Frequency[]).map((option) => {
										const active = frequency === option;

										return (
											<Pressable
												key={option}
												className={clsx("picker-option", active && "picker-option-active")}
												onPress={() => setFrequency(option)}
											>
												<Text
													className={clsx(
														"picker-option-text",
														active && "picker-option-text-active"
													)}
												>
													{option}
												</Text>
											</Pressable>
										);
									})}
								</View>
							</View>

							<View className="auth-field">
								<Text className="auth-label">Category</Text>
								<View className="category-scroll">
									{categories.map((option) => {
										const active = category === option;

										return (
											<Pressable
												key={option}
												className={clsx("category-chip", active && "category-chip-active")}
												onPress={() => setCategory(option)}
											>
												<Text
													className={clsx(
														"category-chip-text",
														active && "category-chip-text-active"
													)}
												>
													{option}
												</Text>
											</Pressable>
										);
									})}
								</View>
							</View>

							<Pressable
								className={clsx("auth-button", !formValid && "auth-button-disabled")}
								onPress={handleSubmit}
							>
								<Text className="auth-button-text">Create Subscription</Text>
							</Pressable>
						</View>
					</ScrollView>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
};

export default CreateSubscriptionModal;
