import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions, } from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';
import { Ionicons } from '@expo/vector-icons';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const LibraryContainer = styled.View`
  flex:1;
  background-color: white;
  padding: 10px;
  // border-radius: 5px;
  //align-items: center;
  
`;

//1.45 = 174/120 : 카카오 책 이미지 크기 174x120
const BookCover = styled.Image`
  height:${windowWidth / 3.5 * 1.45*0.9};
  width:${windowWidth / 3.5*0.9};
  resizeMode:contain;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.5);
`;

const BookDetail = styled.TouchableOpacity`
  flex: 0.333;
  //background-color: purple;
  align-items: center;
`;

const BookSeparator = styled.View`
  height: 10px;
`;

const today = new Date();
const thisYear = today.getFullYear();
var currentWeekNumber = require('current-week-number');
const thisWeek = currentWeekNumber();
const STORAGE_KEY_LIBRARY = `@library`;



const Library = ({ navigation: { navigate, addListener } }) => {
  const [libraryData, setLibraryData] = useState([]);

   useEffect(() => {
     const goBackListener = addListener('focus', () => {
      loadLibrary();
      return goBackListener;
    });
    //AsyncStorage.removeItem(STORAGE_KEY_LIBRARY);
    // AsyncStorage.clear();
  }, []);

  const loadLibrary = async()=>{
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY_LIBRARY);
      setLibraryData(JSON.parse(s));
      // console.dir(JSON.parse(s))
    } catch (e) {
      alert(e);
    }
  };
  
        // columnWrapperStyle={{
        //   justifyContent: "space-between",
        // }}
  return(
    <LibraryContainer>
      <FlatList
        data={libraryData}
        numColumns={3}
        ItemSeparatorComponent = {BookSeparator}
        renderItem={({ item }) => (
          <BookDetail onPress={() =>
                navigate('Stacks', { screen: 'NoteList', params: { item } })
              }>
            <BookCover
            
              source={{
                uri: item.book.thumbnail,
              }}
            />
          </BookDetail>
        )}
      />
    </LibraryContainer>
  );
};
export default Library;
