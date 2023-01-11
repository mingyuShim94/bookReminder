import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, TouchableOpacity } from 'react-native';
import Search from '../Screens/search';
import NoteList from '../Screens/noteList';
import NoteWrite from '../Screens/noteWrite';
import Think from '../Screens/think';
import ThinkWrite from '../Screens/thinkWrite';
import NoteAndThink from '../Screens/noteAndThink';
import BookSelect from '../Screens/bookSelect';
const NativeStack = createNativeStackNavigator();

const Stack = () => (
  <NativeStack.Navigator>
    <NativeStack.Screen name="Search" component={Search} />
    <NativeStack.Screen name="NoteList" component={NoteList} />
    <NativeStack.Screen name="NoteAndThink" component={NoteAndThink} />
    <NativeStack.Screen name="NoteWrite" component={NoteWrite} />
    <NativeStack.Screen name="Think" component={Think} />
    <NativeStack.Screen name="ThinkWrite" component={ThinkWrite} />
    <NativeStack.Screen
      name="BookSelect"
      component={BookSelect}
      options={{ presentation: 'card' }}
    />
  </NativeStack.Navigator>
);
export default Stack;
