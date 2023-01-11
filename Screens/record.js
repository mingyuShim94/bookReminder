import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Modal from "react-native-modal";
import { weekNumber } from 'weeknumber'
import AsyncStorage from '@react-native-async-storage/async-storage';
const STORAGE_KEY_RECENT_BOOKS = '@recentBooks';
import { useFonts } from 'expo-font';
import { useQuery } from 'react-query';
import { bookSearchData } from '../api';
import Loader from '../components/Loader';

import { Ionicons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const RecordContainer = styled.View`
  //flex:1;
  background-color: white;
`;

const Header = styled.Text`
  padding-left:5px;
  font-size: ${windowWidth/20};
`;

const DayContainer = styled.View`
  //height: ${windowWidth / 10};
  paddingHorizontal: 10px;
  background-color: white;
`;
const Day = styled.View`
  //background-color: white;
  //align-items: center;
  margin-top: 10px;
`;

const BookContainer = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  paddingHorizontal: 10px;
  //height: ${windowWidth/2};
`;

const BookRecorder = styled.View`
  background-color: white;
  height: ${windowWidth/3.3};
`;

const Book = styled.TouchableOpacity`
  background-color: gainsboro;
  //align-items: center;
  margin-top: 10px;
  height: ${windowWidth / 8 * 1.45};
  width: ${windowWidth / 8};
  border-radius: 5px;
`;

const BookDetailContainer = styled.View`
  height: ${windowWidth / 3.5};
  background-color: skyblue;
  border-radius: 5px;
`;

const NoteContainer = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  paddingHorizontal: 10px;
  //height: ${windowWidth / 4};
`;

const NoteRecorder = styled.View`
  background-color: white;
  height: ${windowWidth/4};
`;

const Note = styled.TouchableOpacity`
  background-color: gainsboro;
  //align-items: center;
  margin-top: 10px;
  height: ${windowWidth / 8};
  width: ${windowWidth / 8};
  border-radius: 5px;
`;

const NoteDetailContainer = styled.View`
  //margin-top: 20px;
  height: ${windowWidth / 3.5};
  background-color: skyblue;
  border-radius: 5px;
`;
// const ThinkContainer = styled(Animated.createAnimatedComponent(View))`
//   background-color: white;
//   paddingHorizontal: 10px;
//   height: ${windowHeight / 4};
// `;

// const ThinkRecorder = styled.View`
//   background-color: white;
//   //flex:1;
// `;

// const Think = styled.TouchableOpacity`
//   background-color: gainsboro;
//   //align-items: center;
//   margin-top: 10px;
//   height: ${windowHeight / 15};
//   width: ${windowWidth / 8};
//   border-radius: 5px;
// `;
// const ThinkDetailContainer = styled(Animated.createAnimatedComponent(View))`
//   margin-top: 20px;
//   height: ${windowHeight / 6};
//   background-color: skyblue;
//   border-radius: 5px;
// `;

const BottomCover = styled(Animated.createAnimatedComponent(View))`
  height: ${windowWidth/1.5};
  background-color: white;
  //paddingHorizontal: 10px;
  //z-index: 50;
`;

const AddBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 10px;
  right: 6px;
  height: 26px;
  width: 26px;
  border-radius: 13px;
  justify-content: center;
  align-items: center;
  // elevation: 5;
  // box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
  background-color: white;
`;

const TrashBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 10px;
  right: 40px;
  height: 26px;
  width: 26px;
  border-radius: 13px;
  justify-content: center;
  align-items: center;
  // elevation: 5;
  // box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
  background-color: white;
`;

const BookDelBtn = styled.TouchableOpacity`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -12px;
  margin-top: -12px;//아이콘 크기 절반
  width: 26px;
  //border-radius: 13px;
  //justify-content: center;
  //align-items: center;
  // elevation: 5;
  // box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
  // background-color: white;
  z-index: 20;
`;

const CursorContainer = styled.View`
  background-color: white;
  height: ${windowWidth / 20};
  //align-items: center;
  // z-index: 100;
`;

const BookModal = styled.View`
  flex:0.6;
  background-color: white;
  border-radius: 10px;
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

const RecentBooksImage = styled.Image`
  width: ${windowWidth / 4 / 1.45};
  height: ${windowWidth / 4};
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.5);
`;

const SearchBar = styled.TextInput`
  background-color: white;
  padding: 10px 15px;
  border-radius: 15px;
  width: 90%;
  margin: 5px auto;
  margin-bottom: 10px;
  border-color: black;
  border-width: 1.5;
`;
const HListSeparator = styled.View`
  width: 10px;
`;

const ImageContainer = styled.View`
  //background-color: red;
  justify-content: center;
  padding-left: 5px;
`;

const BookDelCover = styled.View`
  width: ${windowWidth / 4 / 1.45};
  height: ${windowWidth / 4};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  position: absolute; 
  background-color: grey;
  opacity: 0.7
  z-index: 10;
`;

const WeekBookImage = styled.Image`
  height: ${windowWidth / 8 * 1.45};
  width: ${windowWidth / 8};
  border-radius: 5px;
  resizeMode: "cover";
`;

const NoteTitle = styled.TextInput`
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

const NoteContent = styled.TextInput`
  //background-color: white;
  padding: 10px 15px;
  border-radius: 10px;
  width: 90%;
  height: 70%;
  margin: 5px auto;
  margin-top: 20px;
  //margin-bottom: 10px;
  border-color: black;
  border-width: 1.5;
  //textAlignVertical: top;
`;

const NoteSaveBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: ${windowWidth / 100 };
  right: ${windowWidth / 100 };
  height: 26px;
  width: 26px;
  border-radius: 13px;
  justify-content: center;
  align-items: center;
  // elevation: 5;
  // box-shadow: 1px 1px 3px rgba(41, 30, 95, 0.2);
  //background-color: white;
  border-color: black;
  border-width: 1.5;
`;

const TodayNoteContainer = styled.View`
  margin-top:5px;
  padding-left: 5px;
  justify-content: center;
  //background-color: red;
`;

const TodayNoteCover = styled.TouchableOpacity`
  width: ${windowWidth / 4 / 1.45};
  height: ${windowWidth / 4};
  border-radius: 5px;
  background-color: white;
`;

const NoteSnippetText = styled.Text`
  padding: 5px;
  fontFamily: 'SnippetNotefont';
  fontWeight:700;
  fontSize: ${windowWidth/30};
  // margin-bottom:2px;
`;

const dayArr = ['월', '화', '수', '목', '금', '토', '일'];
const blankArr = ['', '', '', '', '', '', ''];

const today = new Date();
const dayIndex = (today.getDay() + 6) % 7;
const thisYear = today.getFullYear();
var currentWeekNumber = require('current-week-number');
const thisWeek = currentWeekNumber();
const STORAGE_KEY_THISWEEK = `@${thisYear}y${thisWeek}w`;
const STORAGE_KEY_LIBRARY = `@library`;

const RecordTable = ({ navigation: { navigate } }) => {
  
  const [fontsLoaded] = useFonts({
    SnippetNotefont: require('../assets/fonts/handwriting.ttf'),
  });
  const [daySelect, setDaySelect] = useState(dayIndex); //초기화문제 생기면 useRef사용해보기
  const [isBookModalVisible, setBookModalVisible] = useState(false);
  const [isNoteModalVisible, setNoteModalVisible] = useState(false);
  const [recentBooks, setRecentBooks] = useState([]);
  const [isDelBtnVisible, setDelBtnVisible] = useState(false);
  // const [weekBooks, setWeekBooks] = useState(Array.from({length: 7}, () => ''));
  const [todayNotes, setTodayNotes] = useState([]);
  const [weekRecord, setWeekRecord] = useState(Array.from({length:7}, () => {return {book:null,notes:null}}));
  const [isNoteEdit, setNoteEdit] = useState(false);
  const [noteIdForEdit, setIdForEdit] = useState(null);
  const [isCursor, setIcursor] = useState('set');
  const [libraryData, setLibraryData] = useState([]);
  useEffect(() => {
    loadRecentBooks();
    loadWeekData();
    //loadLibrary();
    //AsyncStorage.removeItem(STORAGE_KEY_LIBRARY);
    // AsyncStorage.clear();
  }, []);

  const loadLibrary = async()=>{
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY_LIBRARY);
      return JSON.parse(s);
    } catch (e) {
      alert(e);
    }
  };

  const saveLibrary = async(newBook, newNote)=>{
    const newData ={book:newBook, notes:[newNote]};
    var newLibrary = await loadLibrary();

    if(newLibrary===null) newLibrary=[newData];
      
    else{
      const bookIndex = newLibrary.findIndex((d) => d.book.isbn == newBook.isbn);
      // console.dir(newLibrary);
      // console.dir(bookIndex);
      if(bookIndex==-1){//같은 책이 없으니 새로운 배열을 추가할 것.
        // console.dir('서재에 같은 책이 없습니다.');
        const oldLibray = [...newLibrary];
        newLibrary=[...oldLibray, newData];
      }
      else{
        // console.dir('서재에 같은 책이 있습니다.');
        const oldNotes = newLibrary[bookIndex].notes;
        newLibrary[bookIndex].notes = [...oldNotes, newNote];
      }
    }
    // console.dir('서재');
    // console.dir(newLibrary);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(newLibrary));
    } catch (e) {
      alert(e);
    }

  };

  const editLibrary = async(newBook, editNote)=>{
    var newLibrary = await loadLibrary();

    const bookIndex = newLibrary.findIndex((d) => d.book.isbn == newBook.isbn);
    const noteIndex = newLibrary[bookIndex].notes.findIndex((d) => d.id == editNote.id);

    newLibrary[bookIndex].notes[noteIndex] = editNote;

    // console.dir('서재');
    // console.dir(newLibrary);

    try {
      await AsyncStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(newLibrary));
    } catch (e) {
      alert(e);
    }

  };


  const delLibrary = async(newBook, delNoteId)=>{
    var newLibrary = await loadLibrary();
    var oldLibray = [...newLibrary];

    const bookIndex = newLibrary.findIndex((d) => d.book.isbn == newBook.isbn);

    newLibrary[bookIndex].notes = oldLibray[bookIndex].notes.filter((d) => {
      return d.id !== delNoteId;
    });

    if(newLibrary[bookIndex].notes.length ==0){
      // console.dir('책삭제할게요');
      newLibrary.splice(bookIndex,1);
    }

    // console.dir('서재');
    // console.dir(newLibrary);

    try {
      await AsyncStorage.setItem(STORAGE_KEY_LIBRARY, JSON.stringify(newLibrary));
    } catch (e) {
      alert(e);
    }

  };

  
  const loadWeekData = async()=>{
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY_THISWEEK);
      // console.dir(JSON.parse(s));
      if (s===null) return;
      setWeekRecord(JSON.parse(s));
    } catch (e) {
      alert(e);
    }
  };
  
  const saveWeekData = async (saveBook, saveNote) => {
    var newWeekRecord = [...weekRecord];
    // var thisBook = (saveBook ===null ? weekRecord[daySelect].book:saveBook);
    if(saveBook!=null) {//책 저장하려 했을 때.
      const oldBook = newWeekRecord[daySelect].book;
      if(oldBook?.isbn === saveBook.isbn) return;
//  && oldWeekRecord[daySelect].notes.length != 0
      if(newWeekRecord[daySelect].notes!=null){
        alert('노트가 있을땐 책수정이 안됩니다.');
        return;
      }

      newWeekRecord[daySelect].book = saveBook;
      
    }
    //노트 저장하려 했을 때.
    else{
      const thisBook = weekRecord[daySelect].book;
      const newNotes = newWeekRecord[daySelect].notes;
      
      newNotes ===null ? 
      newWeekRecord[daySelect].notes = [saveNote]: 
      newWeekRecord[daySelect].notes = [...newNotes, saveNote];
      
      saveLibrary(thisBook, saveNote);
    }
    
    setWeekRecord(newWeekRecord);
    // console.dir(newWeekRecord);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY_THISWEEK, JSON.stringify(newWeekRecord));
    } catch (e) {
      alert(e);
    }
  };

  const editWeekData = async (editNote, noteIndex) => {
    var newWeekRecord = [...weekRecord];
    var thisBook = weekRecord[daySelect].book;
    
    newWeekRecord[daySelect].notes[noteIndex] = editNote;
    setWeekRecord(newWeekRecord);
    // console.dir(newWeekRecord);

    editLibrary(thisBook, editNote);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY_THISWEEK, JSON.stringify(newWeekRecord));
    } catch (e) {
      alert(e);
    }

  };
  
  const delWeekData = async (delNoteId) => {
    var newWeekRecord = [...weekRecord];
    var thisBook = weekRecord[daySelect].book;
    
    newWeekRecord[daySelect].notes = weekRecord[daySelect].notes.filter((d) => {
      return d.id !== delNoteId;
    });

    if(newWeekRecord[daySelect].notes.length ==0) newWeekRecord[daySelect].notes =null

    setWeekRecord(newWeekRecord);
    setTodayNotes(newWeekRecord[daySelect].notes);
    // console.dir(newWeekRecord);
    
    delLibrary(thisBook, delNoteId);


    try {
      await AsyncStorage.setItem(STORAGE_KEY_THISWEEK, JSON.stringify(newWeekRecord));
    } catch (e) {
      alert(e);
    }
  }; 

  const saveRecentBooks = async (toSave) => {
    setRecentBooks(toSave);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_RECENT_BOOKS, JSON.stringify(toSave));
    } catch (e) {
      alert(e);
    }
  };

  const loadRecentBooks = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY_RECENT_BOOKS);
      setRecentBooks(JSON.parse(s));
    } catch (e) {
      alert(e);
    }
  };

  const delRecentBooks = async (id) => {
    var tempBookList = recentBooks.filter((d) => {
      return d.isbn !== id;
    });

    saveRecentBooks(tempBookList);
    setRecentBooks(tempBookList);
  };

  const bookSelect = (index) => {
    setIcursor('Book');
    setDelBtnVisible(false)
    setDaySelect(index);
    Animated.parallel([goDownNote, goDownBottom]).start();
    // Animated.parallel([goDownNote, goDownThink, goDownBottom]).start();
  };
  const noteSelect = (index) => {
    if(weekRecord[index].book === null)
    { 
      alert('오늘 읽은 책이 무엇인가요?');
      return;
    }
    setIcursor('Note');
    setDelBtnVisible(false);
    setDaySelect(index);
    const tempTodayNote = weekRecord[index].notes;
    // console.dir('오늘노트');
    // console.dir(tempTodayNote);
    setTodayNotes(tempTodayNote);
    // console.dir(weekRecord[index]);
    Animated.parallel([goUpNote, goDownBottom]).start();
    // Animated.parallel([goUpNote, goDownThink, goDownBottom]).start();
  };
  // const thinkSelect = (index) => {
  //   setDaySelect(index);
  //   Animated.parallel([goUpNote, goDownBottom]).start();
  //   // Animated.parallel([goUpNote, goUpThink, goDownBottom]).start();
  // };
  const bookWrite =(selBook)=>{
    saveWeekData(selBook,null);
    setIcursor('set');
    Animated.parallel([goUpNote, goUpBottom]).start();
   
  };
//
  const DayBox = () => (
    <DayContainer>
      <FlatList
        data={dayArr}
        numColumns={7}
        keyExtractor={(item) => item.id + ''}
        columnWrapperStyle={{
          justifyContent: 'space-around',
        }}
        renderItem={({ item, index }) => (
          <Day>
            <Text
              style={{
                fontSize: windowHeight/45,
                color: index === daySelect ? 'red' : 'black',
              }}>
              {item}
            </Text>
          </Day>
        )}
      />
    </DayContainer>
  );
  // <Book onPress={() => bookSelect(index)}>
  // <Poster source={{ uri: item.thumbnail }} />
  // </Book>
  //console.info(weekRecord)
  const BookBox = () => (
    <BookContainer>
      <BookRecorder>
        <Header>책</Header>
        <FlatList
          data={weekRecord}
          numColumns={7}
          columnWrapperStyle={{
            justifyContent: 'space-around',
          }}
          renderItem={({ item, index }) => (
            <Book onPress={() => bookSelect(index)}>
              {item.book ===null ? null:(<WeekBookImage source={{ uri: item.book.thumbnail }} />)}
            </Book>
          )}
        />
      </BookRecorder>
      <CursorContainer>
        <FlatList
          data={blankArr}
          numColumns={7}
          columnWrapperStyle={{
          justifyContent: 'space-around',
        }}
          renderItem={({item, index}) => (
            <Ionicons name="triangle" size={windowWidth/23} color= {index===daySelect ? (isCursor == 'Book'? 'red':'white') : 'white'} />
          )}
        />
      </CursorContainer>
      <BookDetailContainer>
        <FlatList
            data={recentBooks}
            horizontal={true}
            keyExtractor={(item) => item.isbn + ''}
            ItemSeparatorComponent={HListSeparator}
            renderItem={({ item }) => (
              <ImageContainer>
                <TouchableOpacity onPress={()=>bookWrite(item)}>
                  <RecentBooksImage source={{ uri: item.thumbnail }} />
                </TouchableOpacity>
                {isDelBtnVisible ? 
                (
                  <>
                <BookDelCover>
                </BookDelCover>
                <BookDelBtn onPress={()=>
                {
                  delRecentBooks(item.isbn);
                  setDelBtnVisible(false)}}>
                  <Ionicons name="trash-outline" color="black" size={24}/>
                </BookDelBtn>
                </>):(null)}
                
              </ImageContainer>
            )}
          />
        <AddBtn onPress={()=>setBookModalVisible(true)} >
          <Ionicons name="add" color="black" size={24} />
        </AddBtn>
        <TrashBtn onPress={()=>setDelBtnVisible(true)}>
          <Ionicons name="trash-outline" color="black" size={22}/>
        </TrashBtn>
      </BookDetailContainer>
    </BookContainer>
  );

  const NoteBox = () => (
    <NoteContainer
      style={{
        transform: [{ translateY: positionNote }],
      }}>
      <NoteRecorder>
        <Header>노트</Header>
        <FlatList
          data={blankArr}
          numColumns={7}
          columnWrapperStyle={{
            justifyContent: 'space-around',
          }}
          renderItem={({ item, index }) => (
            <Note onPress={() => noteSelect(index)}></Note>
          )}
        />
      </NoteRecorder>
      <CursorContainer>
        <FlatList
          data={blankArr}
          numColumns={7}
          columnWrapperStyle={{
          justifyContent: 'space-around',
        }}
          renderItem={({item, index}) => (
            <Ionicons name="triangle" size={windowWidth/23} color= {index===daySelect ? (isCursor=='Note'? 'red':'white')  : 'white'} />
          )}
        />
      </CursorContainer>
      <NoteDetailContainer>
        <FlatList
            data={todayNotes}
            horizontal={true}
            ItemSeparatorComponent={HListSeparator}
            renderItem={({ item }) => (
              <TodayNoteContainer>
                <TodayNoteCover onPress={()=>{
                  // console.dir(item.id);
                  setIdForEdit(item.id);
                  setNoteEdit(true);
                  setNoteModalVisible(true);
                  }}>
                  <NoteSnippetText numberOfLines={6}>
                  {item.noteText.note}
                  </NoteSnippetText>
                  {isDelBtnVisible ? 
                (
                  <>
                <BookDelCover>
                </BookDelCover>
                <BookDelBtn onPress={()=>
                {
                  delWeekData(item.id);
                  setDelBtnVisible(false)}}>
                  <Ionicons name="trash-outline" color="black" size={24}/>
                </BookDelBtn>
                </>):(null)}
                </TodayNoteCover>
              </TodayNoteContainer>
            )}
          />
        <AddBtn onPress={()=>setNoteModalVisible(true)}>
          <Ionicons name="add" color="black" size={24} />
        </AddBtn>
        <TrashBtn onPress={()=>setDelBtnVisible(true)}>
          <Ionicons name="trash-outline" color="black" size={22}/>
        </TrashBtn>
      </NoteDetailContainer>
    </NoteContainer>
  );

  // const ThinkBox = () => (
  //   <ThinkContainer
  //     style={{
  //       transform: [{ translateY: positionThink }],
  //     }}>
  //     <ThinkRecorder>
  //       <Header>생각</Header>
  //       <FlatList
  //         data={blankArr}
  //         numColumns={7}
  //         columnWrapperStyle={{
  //           justifyContent: 'space-around',
  //         }}
  //         renderItem={({ item, index }) => (
  //           <Think onPress={() => thinkSelect(index)}></Think>
  //         )}
  //       />
  //     </ThinkRecorder>
  //     <ThinkDetailContainer></ThinkDetailContainer>
  //   </ThinkContainer>
  // );
  
  const ModalBookBox = () => {
    const [query, setQuery] = useState('');
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
    return(
    <BookModal>
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
          keyExtractor={(item) => item.isbn + ''}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ alignItems: 'center' }}
              onPress={async() =>{
                var tempBookList;
                if (recentBooks === null) {
                  tempBookList = [item];

                } else {
                  tempBookList = [...recentBooks, item];
                }
                saveRecentBooks(tempBookList);
                setQuery('');
                searchBooks();
                setBookModalVisible(false);
                }}
              >
              <Poster source={{ uri: item.thumbnail }} />
              <Title>{item.title}</Title>
            </TouchableOpacity>
          )}
        />
        ) : (null)}
      </BookModal>
    );
  };

  // const [queryTitle, setQueryTitle] = useState('');
  // const [queryNote, setQueryNote] = useState('');
// console.dir(todayNotes);
  const ModalNoteBox = ()=>{
    const [queryTitle, setQueryTitle] = useState('');
    const [queryNote, setQueryNote] = useState('');
    const [noteIndex,setNoteIndex] = useState(null);
    useEffect(() => {
      isNoteEdit? loadNoteEdit():null;
    }, []);
    // const resetQuery = () =>{
    //   setQueryTitle('');
    //   setQueryNote('');
    // }
    const loadNoteEdit =() =>{
      const tempNoteIndex = todayNotes.findIndex((d) => d.id == noteIdForEdit);
      setNoteIndex(tempNoteIndex);
      setQueryTitle(todayNotes[tempNoteIndex].noteText.title);
      setQueryNote(todayNotes[tempNoteIndex].noteText.note);
    };
    const titleText = (text: string) => setQueryTitle(text);
    const noteText = (text: string) => setQueryNote(text);

    const saveNotes = () =>{
      var newNoteList;
      const item = {id:Date.now(), noteText:{title: queryTitle, note: queryNote}};
      if (todayNotes === null) {
        newNoteList = [item];
      } else {
        newNoteList = [...todayNotes, item];
      }
      // console.dir('tempLoteList');
      // console.dir(tempNoteList);
      setTodayNotes(newNoteList);
      saveWeekData(null,item);
      setNoteModalVisible(false);
    }

    const editNotes =()=>{
      var newNoteList = [...todayNotes];
      // console.dir(tempNoteList);
      const text = {title: queryTitle, note: queryNote};
      // const item = {id:Date.now(), noteText:tempItem};
      // console.dir(item);
      if (JSON.stringify(newNoteList[noteIndex].noteText) === JSON.stringify(text))
        {
          setNoteModalVisible(false);
          setNoteEdit(false);
          return;
        }
      else newNoteList[noteIndex].noteText = text;
      // console.dir('newNoteList');
      // console.dir(newNoteList);
      
      //console.dir(tempNoteList);
      
      setTodayNotes(newNoteList);
      editWeekData(newNoteList[noteIndex], noteIndex);
      setNoteModalVisible(false);
      setNoteEdit(false);
    };

    return(
      <BookModal>
        <NoteTitle 
        placeholder="노트제목을 입력하세요."
        onChangeText={titleText}
        defaultValue={queryTitle}
        />
        <NoteContent 
        placeholder="책내용을 입력하세요." 
        onChangeText={noteText}
        defaultValue={queryNote}
        multiline={true}/>
        <NoteSaveBtn 
        onPress={()=>isNoteEdit? editNotes():saveNotes()}>
          <Ionicons name="checkmark" size={25} color="black" />
        </NoteSaveBtn>
      </BookModal>
    );
  }


    // if (notes === null) {
    //   newNoteList = [{ _id: String(Date.now()), noteText: item }];
    // } else {
    //   newNoteList = [...notes, { _id: String(Date.now()), noteText: item }];
    // }
  const positionNote = useRef(new Animated.Value(-windowWidth/3)).current;
  //const positionNoteDetail = useRef(new Animated.Value(-160)).current;
  // const positionThink = useRef(new Animated.Value(-250)).current;
  // const positionThinkDetail = useRef(new Animated.Value(0)).current;
  const positionBottom = useRef(new Animated.Value(-windowWidth/1.5)).current;

  const goDownNote = Animated.timing(positionNote, {
    toValue: windowWidth/25,
    useNativeDriver: true,
  });

  // const goDownThink = Animated.timing(positionThink, {
  //   toValue: -110,
  //   useNativeDriver: true,
  // });
  //
  // const goUpThink = Animated.timing(positionThink, {
  //   toValue: -250,
  //   useNativeDriver: true,
  // });
  //
  const goDownBottom = Animated.timing(positionBottom, {
    toValue: -windowWidth/3.2,
    useNativeDriver: true,
  });

  const goUpNote = Animated.timing(positionNote, {
    toValue: -windowWidth/3,
    useNativeDriver: true,
  });

  const goUpBottom = Animated.timing(positionBottom, {
    toValue: -windowWidth/1.5,
    useNativeDriver: true,
  });
  return (
      <RecordContainer>
        <DayBox />
        <BookBox />
        <Modal isVisible={isBookModalVisible} avoidKeyboard={true} onBackdropPress={() => setBookModalVisible(false)}>
          <ModalBookBox/>
        </Modal>
        <NoteBox />
          <Modal isVisible={isNoteModalVisible} avoidKeyboard={true} onBackdropPress={() => {setNoteModalVisible(false); setNoteEdit(false);}}>
        <ModalNoteBox/>
        </Modal>
        <BottomCover
          style={{
            transform: [{ translateY: positionBottom }],
          }}></BottomCover>
      </RecordContainer>
  );
};
export default RecordTable;
