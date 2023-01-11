import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDoubleTap } from 'use-double-tap';

const NoteContainer = styled.View`
  flex:1;
`;
const ThinkContatiner = styled.View`
 justify-content: center;
 align-items: center;
`;
const NoteText = styled.Text`
  background-color: white;
  padding: 10px 15px;
  border-radius: 15px;
  width: 90%;
  height:200px;
  margin: 10px auto;
  margin-bottom: 40px;
  textAlignVertical: top;
`;
const ThinkList = styled.FlatList`
`;
const ThinkAddBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  right: 20px;
  height: 50px;
  width: 50px;
  border-radius: 25px;
  justify-content: center;
  align-items: center;
  elevation: 5;
  box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
  background-color: white;
`;
const Separator = styled.View`
  height: 10px;
`;
const NoteAndThinkBtn = styled.TouchableOpacity`
`;
const ThinkRecord = styled.View`
  background-color: #E2DEA9;
  flex-direction: row;
  align-items: center;
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 1px 1px 1px rgba(41, 30, 95, 0.1);
  width:300px;
`;
const ThinkText = styled.Text`
  font-size: 18px;
`;
const DeleteBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 13px;
  right: 20px;
  height: 20px;
  width: 20px;
  justify-content: center;
  align-items: center;
  elevation: 5;
  box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
  background-color: white;
`;
const NoteAndThink = ({ navigation: { navigate, addListener }, route }) => {
  const today = new Date();
  var todayDate = today.toLocaleDateString();
  const ThinkCountKey = `@ThinkChar${today.getMonth() + 1}`;
  const [query, setQuery] = useState('');
  const [note, setNote] = useState([]);
  const [thinks, setThinks] = useState([]);
  const bookId = String(route.params.bookId);
  const item = route.params.item;
  const noteId = item._id;
  useEffect(() => {
    setQuery(route.params.item.noteText);
    const goBackListener = addListener('focus', () => {
      loadNote();
      loadThink();
      return goBackListener;
    });
  }, []);

  const loadNote = async () => {
    try {
      const s = await AsyncStorage.getItem(bookId);
      const jsonS = JSON.parse(s);
      const arrIndex = jsonS.findIndex((d) => d._id == noteId);
      setNote(jsonS[arrIndex]);
      setQuery(jsonS[arrIndex].noteText);
    } catch (e) {
      alert(e);
    }
  };

  const saveThink = async (toSave) => {
    try {
      await AsyncStorage.setItem(noteId, JSON.stringify(toSave));
    } catch (e) {
      alert(e);
    }
  };
  const noteEdit = useDoubleTap((event) => {
    navigate('Stacks', {
      screen: 'NoteWrite',
      params: { edit: true, bookId, item: note },
    });
  });

  const deleteThink = async (_id) => {
    const preThinkList = [...thinks];
    const arrIndex = preThinkList.findIndex((d) => d._id == _id);
    const subThinkCount = preThinkList[arrIndex].thinkText.length;
    const newThinkList = preThinkList.filter((d) => {
      return d._id !== _id;
    });
    const thinkChar = -subThinkCount;
    saveCharacters(thinkChar);
    setThinks(newThinkList);
    await saveThink(newThinkList);
  };

  const loadThink = async () => {
    try {
      const s = await AsyncStorage.getItem(noteId);
      const jsonS = JSON.parse(s);
      setThinks(jsonS);
    } catch (e) {
      alert(e);
    }
  };
  const saveCharacters = async (thinkCount) => {
    const s = await AsyncStorage.getItem(ThinkCountKey);
    var preThinkCount = JSON.parse(s);
    const day = today.getDate() - 1;
    preThinkCount[day].writings -= 1;
    preThinkCount[day].characters += thinkCount;
    // var newThinkCount = preThinkCount;
    // if (preThinkCount === null) {
    //   preThinkCount = [];
    // }
    // const todayCheck = preThinkCount.hasOwnProperty(todayDate);
    // if (todayCheck === false) {
    //   newThinkCount = { ...preThinkCount, ...charObj };
    // } else {
    //   const preCount = preThinkCount[todayDate];
    //   const newCount = preCount + charObj[todayDate];
    //   newThinkCount[todayDate] = newCount;
    // } //true
    console.dir(preThinkCount);
    await AsyncStorage.setItem(ThinkCountKey, JSON.stringify(preThinkCount));
  };
  return (
    <View style={{ flex: 1 }}>
      <NoteContainer>
        <NoteText {...noteEdit}>{query}</NoteText>
      </NoteContainer>
      <ThinkList
        data={thinks}
        ItemSeparatorComponent={Separator}
        renderItem={({ item }) => (
          <ThinkContatiner>
            <NoteAndThinkBtn
              onPress={() =>
                navigate('Stacks', {
                  screen: 'Think',
                  params: { noteId, item },
                })
              }>
              <ThinkRecord>
                <ThinkText>{item.thinkText}</ThinkText>
              </ThinkRecord>
            </NoteAndThinkBtn>
            <DeleteBtn onPress={() => deleteThink(item._id)}>
              <Ionicons name="close" size={20} color="black" />
            </DeleteBtn>
          </ThinkContatiner>
        )}
      />
      <ThinkAddBtn
        onPress={() =>
          navigate('Stacks', {
            screen: 'ThinkWrite',
            params: { edit: false, noteId, item },
          })
        }>
        <Ionicons name="bulb-outline" size={30} color="black" />
      </ThinkAddBtn>
    </View>
  );
};
export default NoteAndThink;
