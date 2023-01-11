import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useDoubleTap } from 'use-double-tap';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThinkContainer = styled.ScrollView`
  flex:1;
  margin-bottom: 40px;
`;
const ThinkText = styled.Text`
  background-color: white;
  padding: 10px 15px;
  border-radius: 15px;
  width: 90%;
  height:200px;
  margin: 10px auto;
  margin-bottom: 40px;
  textAlignVertical: top
`;
const Think = ({ navigation: { navigate, addListener, goBack }, route }) => {
  const [query, setQuery] = useState('');
  const [think, setThink] = useState([]);
  const onChangeText = (text: string) => setQuery(text);
  const noteId = route.params.noteId;
  const item = route.params.item;
  const thinkId = item._id;
  useEffect(() => {
    setQuery(route.params.item.thinkText);
    const goBackListener = addListener('focus', () => {
      loadThink();
      return goBackListener;
    });
  }, []);

  const thinkEdit = useDoubleTap((event) => {
    navigate('Stacks', {
      screen: 'ThinkWrite',
      params: { edit: true, noteId, item: think },
    });
  });

  const loadThink = async () => {
    try {
      const s = await AsyncStorage.getItem(noteId);
      const jsonS = JSON.parse(s);
      const arrIndex = jsonS.findIndex((d) => d._id == thinkId);
      setQuery(jsonS[arrIndex].thinkText);
      setThink(jsonS[arrIndex]);
    } catch (e) {
      alert(e);
    }
  };
  return (
    <ThinkContainer>
      <ThinkText {...thinkEdit}>{query}</ThinkText>
    </ThinkContainer>
  );
};
export default Think;
