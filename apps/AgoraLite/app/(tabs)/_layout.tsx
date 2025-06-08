import { Tabs } from 'expo-router';
import React from 'react';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { BlurView }from 'expo-blur';

export default function TabLayout() {

  return (
    <>
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          headerTitle: "토론스",
          headerShown: true,
          headerStyle: {
            backgroundColor: "blue",
          },
          headerBackground: () => (
            <BlurView intensity={100} style={{ flex: 1 }} />
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: '토론',
          headerTitle: "토론스",
          headerShown: true,
          headerStyle: {
            backgroundColor: "blue",
          },
          headerBackground: () => (
            <BlurView intensity={100} style={{ flex: 1 }} />
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: '프로필',
          headerTitle: "토론스",
          headerShown: true,
          headerStyle: {
            backgroundColor: "blue",
          },
          headerBackground: () => (
            <BlurView intensity={100} style={{ flex: 1 }} />
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
    </>
  );
}
