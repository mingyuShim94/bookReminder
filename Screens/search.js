import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useQuery } from 'react-query';
import { bookSearchData } from '../api';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';

const STORAGE_KEY = '@selectedBook';

const SearchBar = styled.TextInput`
  background-color: white;
  padding: 10px 15px;
  border-radius: 15px;
  width: 90%;
  margin: 10px auto;
  margin-bottom: 40px;
`;

const ListContainer = styled.ScrollView`
  margin-bottom: 40px;
`;

const Title = styled.Text`
  color: black;
  font-weight: 600;
  margin-top: 7px;
  margin-bottom: 5px;
`;

const Poster = styled.Image`
  width: 100px;
  height: 160px;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.5);
`;
const ResultContatiner = styled.View`
  
`;
const VListSeparator = styled.View`
  height: 30px;
`;

const Search = ({ navigation: { navigate } }) => {
  const [query, setQuery] = useState('');
  const [selBook, setSelBook] = useState([]);
  const {
    isLoading: bookDataLoading,
    data: bookData,
    refetch: searchBooks,
  } = useQuery(['bookSearchData', query], bookSearchData, { enabled: false });
  const onChangeText = (text: string) => setQuery(text);
  const onSubmitText = () => {
    if (query === '') {
      return;
    }
    searchBooks();
  };
  return (
    <ListContainer>
      <SearchBar
        placeholder="Search for Book"
        placeholderTextColor="grey"
        returnKeyType="search"
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitText}
      />
      {bookDataLoading ? <Loader /> : null}
      {bookData ? (
        <FlatList
          data={bookData.documents}
          ItemSeparatorComponent={VListSeparator}
          renderItem={({ item }) => (
            <ResultContatiner>
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={() =>
                  navigate('Tabs', { screen: '서재', params: { item } })
                
                }>
                <Poster source={{ uri: item.thumbnail }} />
                <Title>{item.title}</Title>
              </TouchableOpacity>
            </ResultContatiner>
          )}
        />
      ) : null}
    </ListContainer>
  );
};
export default Search;
