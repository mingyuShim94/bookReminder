import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const NoteContainer = styled.ScrollView`
  flex:1;
  margin-bottom: 40px;
`;
const NoteText = styled.TextInput`
  background-color: white;
  padding: 10px 15px;
  border-radius: 15px;
  width: 90%;
  height:200px;
  margin: 10px auto;
  margin-bottom: 40px;
  textAlignVertical: top;
`;
// textAlignVertical: 'top'//안드로이드에서 cursor 맨위에 오게 하는 법
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

const NoteWrite = ({ navigation: { goBack }, route }) => {
  const today = new Date();
  var todayDate = today.toLocaleDateString();
  //todayDate = '2022. 3. 29.'
  const NoteCountKey = `@NoteChar${today.getMonth() + 1}`;
  const [query, setQuery] = useState('');
  const [notes, setNotes] = useState([]);
  const [edit, setEdit] = useState(false);
  const onChangeText = (text: string) => setQuery(text);
  const STORAGE_KEY = String(route.params.bookId);
  useEffect(() => {
    setEdit(route.params.edit);
    loadNote();
  }, [edit]);
  const loadNote = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      const jsonS = JSON.parse(s);
      setNotes(jsonS);
      edit ? setQuery(route.params.item.noteText) : null;
    } catch (e) {
      alert(e);
    }
  };
  const saveNote = async (toSave) => {
    //console.dir(toSave);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      alert(e);
    }
  };

  const saveNoteList = async (item) => {
    var newNoteList;
    if (notes === null) {
      newNoteList = [{ _id: String(Date.now()), noteText: item }];
    } else {
      newNoteList = [...notes, { _id: String(Date.now()), noteText: item }];
    }
    // const noteChar = item.length;
    // saveCharacters(noteChar);
    await saveNote(newNoteList);
  };

  const editNoteList = async (query) => {
    const _id = route.params.item._id;
    const preNoteList = [...notes];
    const arrIndex = preNoteList.findIndex((d) => d._id == _id);
    const preNoteCount = preNoteList[arrIndex].noteText.length;
    preNoteList[arrIndex].noteText = query;
    const diffNoteCount = query.length - preNoteCount;
    const noteChar = diffNoteCount;
    saveCharacters(noteChar);
    await saveNote(preNoteList);
  };

  const onSubmit = async () => {
    if (query === '') {
      return alert('Please write anything');
    }
    edit ? await editNoteList(query) : await saveNoteList(query);
    goBack();
  };

  const saveCharacters = async (noteChar) => {
    const s = await AsyncStorage.getItem(NoteCountKey);
    var preNoteCount = JSON.parse(s);
    // console.dir(preNoteCount);
    const days = daysPerMonth[today.getMonth()];
    const day = today.getDate() - 1;
    if (preNoteCount === null) {
      preNoteCount = Array.from({ length: days }, () => null);
    }
    if (preNoteCount[day] === null) {
      //오늘 첫 글
      edit === true
        ? null
        : (preNoteCount[day] = { writings: 1, characters: noteChar });
    } else {
      edit === true ? null : (preNoteCount[day].writings += 1);

      preNoteCount[day].characters += noteChar;
    }

    // if (preNoteCount === null) {
    //   preNoteCount = [];
    // }
    // const todayCheck = preNoteCount.hasOwnProperty(todayDate);
    // if (todayCheck === false) {
    //   newNoteCount = { ...preNoteCount, ...charObj };
    // } else {
    //   const preCount = preNoteCount[todayDate];
    //   const newCount = preCount + charObj[todayDate];
    //   newNoteCount[todayDate] = newCount;
    // } //true
    console.dir(preNoteCount);
    await AsyncStorage.setItem(NoteCountKey, JSON.stringify(preNoteCount));
  };
  return (
    <NoteContainer>
      <NoteText
        placeholder="Write book text"
        placeholderTextColor="grey"
        returnKeyType="write"
        onChangeText={onChangeText}
        multiline={true}
        onSubmitEditing={onSubmit}
        defaultValue={query}
      />
      <SaveBtn onPress={onSubmit}>
        <Ionicons name="checkmark" size={25} color="black" />
      </SaveBtn>
    </NoteContainer>
  );
};
export default NoteWrite;
