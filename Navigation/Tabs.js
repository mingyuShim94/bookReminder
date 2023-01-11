import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Home from '../Screens/Home';
import Library from '../Screens/library';
import Report from '../Screens/report';
import Calendars from '../Screens/calendars';
import Setting from '../Screens/setting';
import Record from '../Screens/record';

const Tab = createBottomTabNavigator();

const Tabs = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="기록"
      component={Record}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name="checkbox"
            size={24}
            color={focused ? 'skyblue' : 'grey'}
          />
        ),
      }}
    />
    <Tab.Screen
      name="서재"
      component={Library}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name="book"
            size={24}
            color={focused ? 'skyblue' : 'grey'}
          />
        ),
      }}
    />

  </Tab.Navigator>
);

export default Tabs;
    // <Tab.Screen
    //   name="통계"
    //   component={Report}
    //   options={{
    //     tabBarIcon: ({ focused, color, size }) => (
    //       <Ionicons
    //         name="stats-chart"
    //         size={24}
    //         color={focused ? 'skyblue' : 'grey'}
    //       />
    //     ),
    //   }}
    // />
    // <Tab.Screen
    //   name="설정"
    //   component={Setting}
    //   options={{
    //     tabBarIcon: ({ focused, color, size }) => (
    //       <Ionicons
    //         name="settings"
    //         size={24}
    //         color={focused ? 'skyblue' : 'grey'}
    //       />
    //     ),
    //   }}
    // />