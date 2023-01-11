import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThinkContainer = styled.ScrollView`
  flex:1;
  margin-bottom: 40px;
`;
const ThinkText = styled.TextInput`
  background-color: white;
  padding: 10px 15px;
  border-radius: 15px;
  width: 90%;
  height:200px;
  margin: 10px auto;
  margin-bottom: 40px;
  textAlignVertical: top
`;
const SaveBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;
  right: 20px;
  height: 30px;
  width: 30px;
  justify-content: center;
  align-items: center;
  elevation: 5;
  box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
  background-color: skyblue;
`;

const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const ThinkWrite = ({ navigation: { navigate, goBack }, route }) => {
  const today = new Date();
  var todayDate = today.toLocaleDateString();
  //todayDate = '2022. 3. 29.'
  const ThinkCountKey = `@ThinkChar${today.getMonth() + 1}`;
  const [query, setQuery] = useState('');
  const [thinks, setThinks] = useState([]);
  const [edit, setEdit] = useState(false);
  const onChangeText = (text: string) => setQuery(text);
  const STORAGE_KEY = route.params.noteId;

  useEffect(() => {
    setEdit(route.params.edit);
    loadThink();
  }, [edit]);

  const loadThink = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      const jsonS = JSON.parse(s);
      setThinks(jsonS);
      edit ? setQuery(route.params.item.thinkText) : null;
    } catch (e) {
      alert(e);
    }
  };

  const saveThink = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      alert(e);
    }
  };

  const saveThinkList = async (item) => {
    var newThinkList;
    if (thinks === null) {
      newThinkList = [{ _id: String(Date.now()), thinkText: item }];
    } else {
      newThinkList = [...thinks, { _id: String(Date.now()), thinkText: item }];
    }
    const thinkChar = item.length;
    saveCharacters(thinkChar);
    await saveThink(newThinkList);
  };

  const editThinkList = async (query) => {
    const _id = route.params.item._id;
    const preThinkList = [...thinks];
    // console.dir(preThinkList);
    const arrIndex = preThinkList.findIndex((d) => d._id == _id);
    const preThinkCount = preThinkList[arrIndex].thinkText.length;
    preThinkList[arrIndex].thinkText = query;
    const diffThinkCount = query.length - preThinkCount;
    const thinkChar = diffThinkCount;
    // console.dir(charObj);
    saveCharacters(thinkChar);
    await saveThink(preThinkList);
  };

  const onSubmit = async () => {
    if (query === '') {
      return alert('Please write anything');
    }
    edit ? await editThinkList(query) : await saveThinkList(query);
    goBack();
  };
  const saveCharacters = async (thinkChar) => {
    const s = await AsyncStorage.getItem(ThinkCountKey);
    var preThinkCount = JSON.parse(s);

    const days = daysPerMonth[today.getMonth()];
    const day = today.getDate() - 1;
    if (preThinkCount === null) {
      preThinkCount = Array.from({ length: days }, () => null);
    }

    if (preThinkCount[day] === null) {
      //오늘 첫 글
      edit === true
        ? null
        : (preThinkCount[day] = { writings: 1, characters: thinkChar });
    } else {
      edit === true ? null : (preThinkCount[day].writings += 1);

      preThinkCount[day].characters += thinkChar;
    }
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
    <ThinkContainer>
      <ThinkText
        placeholder="Write your think"
        placeholderTextColor="grey"
        returnKeyType="write"
        onChangeText={onChangeText}
        multiline={true}
        defaultValue={query}
      />
      <SaveBtn onPress={onSubmit}>
        <Ionicons name="checkmark" size={25} color="black" />
      </SaveBtn>
    </ThinkContainer>
  );
};
export default ThinkWrite;
