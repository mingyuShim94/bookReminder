import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  LayoutAnimation,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Modal from "react-native-modal";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const NoteListContainer = styled.View`
  flex:1;
  background-color: white;
  padding: 10px;
`;

const NoteDetail = styled.View`
  flex: 0.333;
  align-items: center;
`;

const NoteSeparator = styled.View`
  height: 10px;
`;

const NoteCover = styled.TouchableOpacity`
  height:${windowWidth / 3.5 * 1.45*0.9};
  width:${windowWidth / 3.5*0.9};
  border-radius: 5px;
  background-color: #15133C;
  justify-content: center;
  align-items: center;
`;

const NoteView = styled.View`
  height:${windowWidth / 3.5 * 1.45*0.8};
  width:${windowWidth / 3.5*0.8};
  border-radius: 5px;
  background-color: white;
`;

const NoteSnippetText = styled.Text`
  padding: 5px;
  fontFamily: 'SnippetNotefont'
  fontWeight:700;
  margin-bottom:2px;
`;
const BookModal = styled.View`
  flex:0.8;
  background-color: white;
  border-radius: 10px;
  align-items: center;
`;
const NoteTitle = styled.Text`
  //background-color: white;
  padding: 10px 15px;
  border-radius: 10px;
  width: 90%;
  margin: 5px auto;
  margin-top: 30px;
  margin-bottom: 10px;
  border-color: black;
  border-width: 1.5;
`;

const NoteContent = styled.ScrollView`
  //background-color: white;
  padding: 10px 15px;
  border-radius: 10px;
  width: 90%;
  flex:0.95;
  margin: 5px auto;
  margin-top: 20px;
  //margin-bottom: 10px;
  border-color: black;
  border-width: 1.5;
  //textAlignVertical: top;
`;
const ThinkModal = styled.View`
  flex:0.7;
  background-color: white;
  border-radius: 10px;
  align-items: center;
`;
const ThinkTitle = styled.TextInput`
  //background-color: white;
  padding: 10px 15px;
  border-radius: 10px;
  width: 90%;
  margin: 5px auto;
  margin-top: 30px;
  margin-bottom: 10px;
  border-color: black;
  border-width: 1.5;
`;

const ThinkContent = styled.TextInput`
  //background-color: white;
  padding: 10px 15px;
  border-radius: 10px;
  width: 90%;
  height: 65%;
  margin: 5px auto;
  margin-top: 20px;
  //margin-bottom: 10px;
  border-color: black;
  border-width: 1.5;
  //textAlignVertical: top;
`;
const Note = ({ navigation: { setOptions, navigate }, route }) => {
  const [isNoteModalVisible, setNoteModalVisible] = useState(false);
  const [isThinkModalVisible, setThinkModalVisible] = useState(false);
  const [noteModalDate,setNoteModalDate] = useState(null);
  const [fontsLoaded] = useFonts({
    SnippetNotefont: require('../assets/fonts/handwriting.ttf'),
  });
  
  const bookData = route.params.item.book;
  const noteData = route.params.item.notes;
  const title = bookData.title;

  useEffect(() => {
    setOptions({ title });
    // console.dir(bookData);
    // console.dir(noteData);
  });

  const ModalNoteBox = ()=>{
    const [queryTitle, setQueryTitle] = useState('');
    const [queryNote, setQueryNote] = useState('');

    useEffect(() => {
      loadNote();
    }, []);
  
    const loadNote =() =>{
      if(noteModalDate===null) return;
      setQueryTitle(noteModalDate.noteText.title);
      setQueryNote(noteModalDate.noteText.note);
    };
    return(
      <BookModal>
        <NoteTitle>
          {queryTitle}
        </NoteTitle>
        <NoteContent>
          {queryNote}
        </NoteContent>
        <TouchableOpacity onPress={()=>{setThinkModalVisible(true); setNoteModalVisible(false);}}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={50} color="black" />
        </TouchableOpacity>
      </BookModal>
    );
}

  const ModalThinkBox = ()=>{
    const [queryTitle, setQueryTitle] = useState('');
    const [queryNote, setQueryNote] = useState('');

    return(
      <ThinkModal>
        <ThinkTitle 
        defaultValue={queryTitle}/>
        <ThinkContent
        multiline={true}
        defaultValue={queryNote}/>
      </ThinkModal>
    );
}
  return (
    <NoteListContainer>
      <FlatList
        data={noteData}
        numColumns={3}
        ItemSeparatorComponent = {NoteSeparator}
        renderItem={({ item }) => (
          <NoteDetail>
            <NoteCover onPress={()=>{setNoteModalVisible(true); setNoteModalDate(item);}}>
              <NoteView>
                <NoteSnippetText numberOfLines={8} >
                {item.noteText.note}
                </NoteSnippetText>
              </NoteView>
            </NoteCover>
          </NoteDetail>
        )}
      />
      <Modal isVisible={isNoteModalVisible} 
      avoidKeyboard={true} 
      animationIn="slideInLeft" 
      animationOut="slideOutLeft" 
      onBackdropPress={() => setNoteModalVisible(false)}>
        <ModalNoteBox/>
      </Modal>
      <Modal isVisible={isThinkModalVisible} animationInTiming={500} avoidKeyboard={true} onBackdropPress={() => setThinkModalVisible(false)}>
        <ModalThinkBox/>
      </Modal>
    </NoteListContainer>
  );
};
export default Note;
