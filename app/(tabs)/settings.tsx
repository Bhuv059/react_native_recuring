import {Pressable, Text, View} from 'react-native'
import {useRouter} from 'expo-router'
import {useAuth, useUser} from '@clerk/expo'
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind"
import {usePostHog} from 'posthog-react-native'
const SafeAreaView = styled(RNSafeAreaView)


const Settings = () => {
	const {signOut} = useAuth()
	const {user} = useUser()
	const router = useRouter()
	const posthog = usePostHog()
	const joinedDate = user?.createdAt
		? new Intl.DateTimeFormat('en', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}).format(new Date(user.createdAt))
		: 'Not available'

	const accountDetails = [
		{label: 'Account ID', value: user?.id ?? 'Not available'},
		{label: 'Name', value: user?.fullName ?? user?.username ?? 'Not available'},
		{label: 'Email', value: user?.primaryEmailAddress?.emailAddress ?? 'Not available'},
		{label: 'Joined', value: joinedDate},
	]

	const handleLogout = async () => {
		posthog.capture('user_logged_out')
		posthog.reset()
		await signOut()
		router.replace('/(auth)/sign-in')
	}

	return (
		<SafeAreaView className="settings-safe-area">
			<View className="settings-content">
				<View className="auth-brand-block">
					<View className="auth-logo-wrap">
						<View className="auth-logo-mark">
							<Text className="auth-logo-mark-text">R</Text>
						</View>
						<View>
							<Text className="auth-wordmark">Recurrly</Text>
							<Text className="auth-wordmark-sub">SUBSCRIPTIONS</Text>
						</View>
					</View>
					<Text className="auth-title">Settings</Text>
					<Text className="auth-subtitle">
						Manage your account and session
					</Text>
				</View>

				<View className="settings-card">
					<View className="settings-section">
						<Text className="settings-label">Account</Text>
						<View className="settings-details">
							{accountDetails.map((item) => (
								<View className="settings-detail-row" key={item.label}>
									<Text className="settings-detail-label">{item.label}</Text>
									<Text className="settings-detail-value">{item.value}</Text>
								</View>
							))}
						</View>
					</View>

					<Pressable className="settings-logout-button" onPress={handleLogout}>
						<Text className="settings-logout-button-text">Log Out</Text>
					</Pressable>
				</View>
			</View>
		</SafeAreaView >
	)
}
export default Settings
