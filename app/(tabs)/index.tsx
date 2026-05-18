import {FlatList, Image, Pressable, Text, View} from "react-native";
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind"
import images from "@/constants/images";
import {HOME_BALANCE, UPCOMING_SUBSCRIPTIONS} from "@/constants/data";
import formatCurrency from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import {useState} from "react";
import { useUser } from '@clerk/expo'
import {usePostHog} from 'posthog-react-native'
import {icons} from "@/constants/icons";
import {useSubscriptions} from "@/components/SubscriptionsProvider";
const SafeAreaView = styled(RNSafeAreaView)

export default function App() {
    const { user } = useUser()
    const posthog = usePostHog()
    const {subscriptions, addSubscription} = useSubscriptions()

    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string|null>(null);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const displayName = user?.firstName || user?.fullName || user?.emailAddresses[0]?.emailAddress || 'User';

    const handleSubscriptionPress = (item: Subscription) => {
        const isCurrentlyExpanded = expandedSubscriptionId === item.id
        if (isCurrentlyExpanded) {
            posthog.capture('subscription_card_collapsed', {
                subscription_name: item.name,
                subscription_id: item.id,
                category: item.category ?? null,
            })
        } else {
            posthog.capture('subscription_card_expanded', {
                subscription_name: item.name,
                subscription_id: item.id,
                category: item.category ?? null,
                price: item.price,
                currency: item.currency ?? null,
                billing: item.billing,
            })
        }
        setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id))
    }

    const handleCreateSubscription = (subscription: Subscription) => {
        addSubscription(subscription)
        setExpandedSubscriptionId(null)
    }

    return (
        <SafeAreaView className="flex-1 bg-background p-5">

                <FlatList
                          ListHeaderComponent={(
                              <>
                                  <View className="home-header" >
                                      <View className="home-user">
                                          <Image
                                              source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
                                              className="home-avatar"
                                          />
                                          <Text className="home-user-name">{displayName}</Text>
                                      </View>
                                      <Pressable onPress={() => setCreateModalVisible(true)}>
                                          <Image source={icons.add} className="home-add-icon" />
                                      </Pressable>

                                  </View>
                                  <View className="home-balance-card" >
                                      <Text className="home-balance-label"> Balance</Text>
                                      <View className="home-balance-row" >
                                          <Text className="home-balance-amount"> {formatCurrency(HOME_BALANCE.amount)}</Text>
                                          <Text className="home-balance-date"> {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}</Text>
                                      </View>
                                  </View>
                                  <View>
                                      <ListHeading title="Upcoming" />

                                      <FlatList data={UPCOMING_SUBSCRIPTIONS}
                                                renderItem={({item})=>(<UpcomingSubscriptionCard {...item} />)}
                                                keyExtractor={(item) => item.id}
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                ListEmptyComponent={ <Text className="home-empty-state">No Upcoming renewals yet.</Text> }
                                      />
                                  </View>
                                  <ListHeading title="All Subscriptions" />
                              </>
                          )}
                          data={subscriptions}
                          keyExtractor={(item) => item.id}
                          renderItem={({item})=> (
                              <SubscriptionCard
                                  {...item}
                                  expanded={expandedSubscriptionId === item.id}
                                  onPress={() => handleSubscriptionPress(item)}
                              />
                          )}
                          extraData={expandedSubscriptionId}
                          ItemSeparatorComponent={()=><View className="h-4" /> }
                          showsVerticalScrollIndicator={false}
                          ListEmptyComponent={<Text className="home-empty-state">No Subscriptions yet. </Text> }
                          contentContainerClassName="pb-30"
                />
                <CreateSubscriptionModal
                    visible={createModalVisible}
                    onClose={() => setCreateModalVisible(false)}
                    onCreate={handleCreateSubscription}
                />

        </SafeAreaView>
    );
}
