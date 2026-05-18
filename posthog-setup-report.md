<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Recurrly subscription tracking app. The following changes were made:

- **Installed** `posthog-react-native` and peer dependencies (`expo-file-system`, `expo-application`, `expo-device`, `expo-localization`)
- **Created** `lib/posthog.ts` — PostHog singleton client configured from environment variables (`EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN`, `EXPO_PUBLIC_POSTHOG_HOST`)
- **Updated** `app/_layout.tsx` — wrapped the app with `PostHogProvider` (outermost) and added manual screen tracking via `usePathname` + `useEffect`
- **Instrumented** sign-in, sign-up, logout, subscription card expand/collapse, and subscription detail view events with user identification calls on login and registration

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in (password or MFA) | `app/(auth)/sign-in.tsx` |
| `user_signed_up` | User completes registration and email verification | `app/(auth)/sign-up.tsx` |
| `user_logged_out` | User taps Log Out in Settings | `app/(tabs)/settings.tsx` |
| `subscription_card_expanded` | User expands a subscription card to see details | `app/(tabs)/index.tsx` |
| `subscription_card_collapsed` | User collapses an already-expanded subscription card | `app/(tabs)/index.tsx` |
| `subscription_detail_viewed` | User navigates to a subscription detail page | `app/subscriptions/[id].tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/677003)
- [New sign-ups over time](/insights/TYpsMROR)
- [Sign-ins over time](/insights/9awrClUr)
- [Sign-up to Sign-in conversion funnel](/insights/AE1dyBCB)
- [Subscription card engagement](/insights/Brc26xfN)
- [Churn signal: logouts over time](/insights/9tZo71Mo)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
