<<<<<<< HEAD
import {FlatList, Image, Pressable, Text, View, StyleSheet } from "react-native";
=======
import {FlatList, Image, Text, View, Button} from "react-native";
>>>>>>> 0858a5a (Clerk auth implementation)
import {SafeAreaView as RNSafeAreaView} from "react-native-safe-area-context";
import {styled} from "nativewind"
import images from "@/constants/images";
import {HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS} from "@/constants/data";
import {icons} from "@/constants/icons";
import formatCurrency from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import React, {useState} from "react";
import { Show, useUser } from '@clerk/expo'
import { useClerk } from '@clerk/expo'
import {Link} from "expo-router";
const SafeAreaView = styled(RNSafeAreaView)

import {  useUser } from '@clerk/expo'

export default function App() {
<<<<<<< HEAD
    const { user } = useUser()
    const { signOut } = useClerk()
=======

    const { user } = useUser()

>>>>>>> 0858a5a (Clerk auth implementation)

    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string|null>(null);
    const displayName = user?.firstName || user?.fullName || user?.emailAddresses[0]?.emailAddress || 'User';
    return (
        <SafeAreaView className="flex-1 bg-background p-5">

                <FlatList
                          ListHeaderComponent={(
                              <>
                                  <View className="home-header" >
<<<<<<< HEAD
                                      <View className="home-user" >
                                          <Show when="signed-out">
                                              <Link href="/(auth)/sign-in">
                                                  <Text>Sign in</Text>
                                              </Link>
                                              <Link href="/(auth)/sign-up">
                                                  <Text>Sign up</Text>
                                              </Link>
                                          </Show>
                                          {/*<Show when="signed-in">
                                              <Text>Hello  {user?.firstName || 'there'}</Text>
                                              <Pressable style={styles.button} onPress={() => signOut()}>
                                                  <Text style={styles.buttonText}>Sign out</Text>
                                              </Pressable>
                                          </Show>*/}
                                          {user?.imageUrl && (
                                              <Image
                                                  source={{ uri: user.imageUrl }}
                                                  className="home-avatar"
                                              />
                                          )}

                                          <Text className="home-user-name">
                                              {user?.firstName || user?.fullName || 'User'}
                                          </Text>
=======
                                      <View className="home-user">
                                          <Image
                                              source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
                                              className="home-avatar"
                                          />
                                          <Text className="home-user-name">{displayName}</Text>
>>>>>>> 0858a5a (Clerk auth implementation)
                                      </View>

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
                          data={HOME_SUBSCRIPTIONS}
                          keyExtractor={(item) => item.id}
                          renderItem={({item})=> (
                              <SubscriptionCard
                                  {...item}
                                  expanded={expandedSubscriptionId === item.id}
                                  onPress={()=>setExpandedSubscriptionId((currentId)=>(currentId===item.id? null: item.id))}
                              />
                          )}
                          extraData={expandedSubscriptionId}
                          ItemSeparatorComponent={()=><View className="h-4" /> }
                          showsVerticalScrollIndicator={false}
                          ListEmptyComponent={<Text className="home-empty-state">No Subscriptions yet. </Text> }
                          contentContainerClassName="pb-30"
                />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
        gap: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#0a7ea4',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
})
