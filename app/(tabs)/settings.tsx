import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind"
const SafeAreaView = styled(RNSafeAreaView)

import { View, Text, Image, Pressable } from "react-native"
import { useUser, useClerk } from "@clerk/expo"
import dayjs from "dayjs"

export default function Settings() {
	const { user } = useUser()
	const { signOut } = useClerk()

	if (!user) return null

	return (
		<SafeAreaView className="flex-1 bg-background p-5">

			{/* Header */}
			<View className="home-header">
				<Text className="list-title">Settings</Text>
			</View>

			{/* Profile */}
			<View className="items-center mt-4">
				{user.imageUrl && (
					<Image
						source={{ uri: user.imageUrl }}
						className="size-24 rounded-full"
					/>
				)}

				<Text className="text-xl font-sans-bold text-primary mt-3">
					{user.fullName || "User"}
				</Text>

				<Text className="text-sm text-muted-foreground mt-1">
					{user.primaryEmailAddress?.emailAddress}
				</Text>
			</View>

			{/* Account Info Card */}
			<View className="auth-card mt-8 gap-5">

				<View className="sub-row">
					<Text className="sub-label">User ID</Text>
					<Text className="sub-value">{user.id}</Text>
				</View>

				<View className="sub-row">
					<Text className="sub-label">Email</Text>
					<Text className="sub-value">
						{user.primaryEmailAddress?.emailAddress}
					</Text>
				</View>

				<View className="sub-row">
					<Text className="sub-label">Joined</Text>
					<Text className="sub-value">
						{dayjs(user.createdAt).format("MMM D, YYYY")}
					</Text>
				</View>

			</View>

			{/* Actions */}
			<View className="mt-8">
				<Pressable
					className="auth-button"
					onPress={() => signOut()}
				>
					<Text className="auth-button-text">
						Sign out
					</Text>
				</Pressable>
			</View>

		</SafeAreaView>
	)
}