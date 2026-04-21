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
3. (auth)/_layout.tsx

create links for these above pages with a button in the index page

To hide the headings in the top
set screenOptions ={{headerShown: false}} to the <Stack> in layout files

Also create a button link to the pages "spotify Subscriptions", "Claude max subscriptions"

npm i react-native-safe-area-context --to override the new iphone home edge at bottom tab which is 34 pix 
where as in the older one it is null--






