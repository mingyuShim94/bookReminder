import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@allBooks';

const BookSelect = () => {
  const [books, setBooks] = useState([]);
  const loadBooks = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setBooks(JSON.parse(s));
    } catch (e) {
      alert(e);
    }
  };

  return (
    <View style={{ alignContent: 'center', justifyContent: 'center' }}>
      <Text>책선택</Text>
    </View>
  );
};
export default BookSelect;
