import {SplashScreen, Stack, usePathname, useGlobalSearchParams} from "expo-router";
import "@/global.css"
import {useEffect, useRef} from "react";
import {useFonts} from "expo-font";

import { ClerkProvider } from '@clerk/expo'
import { tokenCache } from '@clerk/expo/token-cache'
import { PostHogProvider } from 'posthog-react-native'
import { posthog } from '@/lib/posthog'

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
const EXCLUDED_ANALYTICS_PARAM_KEYS = new Set([
  'access_token',
  'auth_code',
  'code',
  'id_token',
  'password',
  'refresh_token',
  'secret',
  'session',
  'token',
])

function getSafeAnalyticsParams(params: Record<string, string | string[]>) {
  return Object.fromEntries(
    Object.entries(params).filter(([key, value]) => {
      const normalizedKey = key.toLowerCase()

      return (
        normalizedKey.startsWith('utm_') &&
        !EXCLUDED_ANALYTICS_PARAM_KEYS.has(normalizedKey) &&
        typeof value === 'string'
      )
    })
  )
}

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const pathname = usePathname()
  const params = useGlobalSearchParams()
  const previousPathname = useRef<string | undefined>(undefined)

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      const safeParams = getSafeAnalyticsParams(params)

      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...safeParams,
      })
      previousPathname.current = pathname
    }
  }, [pathname, params])

  return <Stack screenOptions={{ headerShown: false }} />
}

export default function RootLayout() {
  const [fontsLoaded]= useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  },[fontsLoaded])

  if(!fontsLoaded) return null;

  return(
    <PostHogProvider
      client={posthog}
      autocapture={{
        captureScreens: false,
        captureTouches: true,
        propsToCapture: ['testID'],
      }}
    >
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <RootLayoutNav />
      </ClerkProvider>
    </PostHogProvider>
  )
}
