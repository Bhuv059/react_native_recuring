<<<<<<< HEAD
/*
import { Stack } from "expo-router";
=======
>>>>>>> 0858a5a (Clerk auth implementation)
import "@/global.css"

import { useAuth } from '@clerk/expo'
import { Redirect, Stack } from 'expo-router'


export default function RootLayout() {
	const { isLoaded, isSignedIn } = useAuth()

	if (!isLoaded) return null

	if (isSignedIn) {
		return <Redirect href="/" />
	}

	return <Stack  screenOptions={{ headerShown: false }}/>;
}


<<<<<<< HEAD
*/

import { useAuth } from '@clerk/expo'
import { Redirect, Stack } from 'expo-router'

export default function AuthRoutesLayout() {
	const { isSignedIn, isLoaded } = useAuth()

	if (!isLoaded) {
		return null
	}

	if (isSignedIn) {
		return <Redirect href={'/'} />
	}

	return <Stack  screenOptions={{ headerShown: false }}/>;
}
=======
>>>>>>> 0858a5a (Clerk auth implementation)
