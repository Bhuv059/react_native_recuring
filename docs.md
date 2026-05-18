npx create-expo-app@latest --template default@sdk-54 ./


npm run reset-project

npx expo start

npx expo install nativewind@preview react-native-css react-native-reanimated react-native-safe-area-context

npx expo install --dev tailwindcss @tailwindcss/postcss postcss

postcss.config.mjs-->  create a file-- paste the content

npx expo customize metro.config.js -- this will create a  file

npx expo start


In case error with global.css due to lightningCSS overides in package.json-->
do delete the node_modules and package-lock file and reinstall it again-
this will clear the error.

create new files
1. (auth)/sign-in
2. (auth)/sign-up
3. (auth)/_layoutListHeading.tsx

create links for these above pages with a button in the index page

To hide the headings in the top
set screenOptions ={{headerShown: false}} to the <Stack> in layout files

Also create a button link to the pages "spotify Subscriptions", "Claude max subscriptions"

npm i react-native-safe-area-context --to override the new iphone home edge at bottom tab which is 34 pix 
where as in the older one it is null--

npm install dayjs

Create a currency formatting function in  that takes
in a value and currency as params and formats a number as standart
u.s money ($ with exactly two decimal places, defaulting to 
USD. you can use a try-catch and handle the fallback)




.env--file -content before fix
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dGVhY2hpbmctaGVkZ2Vob2ctNDcuY2xlcmsuYWNjb3VudHMuZGV2JA
EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_BvEZdi47vheH8yDda2VsNVddyNHmgYogSL6LgWBMJP9s
EXPO_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
