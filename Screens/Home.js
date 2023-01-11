import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState, useEffect } from 'react';
import {
  Animated,
  PanResponder,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
const STORAGE_KEY = '@allBooks';

const BookTitle = styled.Text`
  font-size: 20px;
`;
const NoteTitle = styled.Text`
  font-size: 15px;
`;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #00a8ff;
`;
const Card = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  width: 300px;
  height: 300px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  position: absolute;
`;
const Btn = styled(Animated.createAnimatedComponent(TouchableOpacity))`
  position: absolute;
`;
const BtnContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  flex: 1;
`;
const CardContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;

const Home = ({ navigation: { navigate } }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesNum, setNotesNum] = useState(5);
  const date = new Date();
  useEffect(() => {
    randNoteArr();
  }, []);
  const randomIndex = (num) => {
    return Math.floor(Math.random() * num);
  };
  const loadBooks = async () => {};
  const randNoteLoad = async () => {
    const sBooks = await AsyncStorage.getItem(STORAGE_KEY);
    const books = JSON.parse(sBooks);
    if (books === null) {
      console.dir('저장된 책이 없습니다.');
      return;
    }
    const bookLength = books.length;
    const randBookIndex = randomIndex(bookLength);
    const rBookId = books[randBookIndex]._id;
    const s = await AsyncStorage.getItem(rBookId);
    const notes = JSON.parse(s);
    if (notes === null) {
      const randNoteObj = {
        book: books[randBookIndex],
        note: { noteText: '데이터를 입력해 주세요' },
        bookId: rBookId,
      };
      return randNoteObj;
    }
    const notesLength = notes.length;
    const randNoteIndex = randomIndex(notesLength);

    const randNoteObj = {
      book: books[randBookIndex],
      note: notes[randNoteIndex],
      bookId: rBookId,
    };
    return randNoteObj;
  };

  const randNoteArr = async () => {
    var notesArr = [];
    // const note = await todayNote();
    // console.dir(note);
    for (var i = 0; i < notesNum; i++) {
      const note = await randNoteLoad();
      notesArr.push(note);
    }
    if (notesArr[0] === undefined) return;
    // const coverCard = {
    //   book: { book: { title: '오늘의 카드' } },
    //   note: { noteText: '넘겨주세요' },
    // };
    // notesArr.unshift(coverCard);
    //console.dir(notesArr);
    setNotes(notesArr);
    setLoading(false);
  };
  // Values
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotation = position.interpolate({
    inputRange: [-250, 250],
    outputRange: ['-15deg', '15deg'],
  });
  const secondScale = position.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.7, 1],
    extrapolate: 'clamp',
  });
  // Animations
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const onPressIn = Animated.spring(scale, {
    toValue: 0.95,
    useNativeDriver: true,
  });
  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const goRight = Animated.spring(position, {
    toValue: 500,
    tension: 5,
    useNativeDriver: true,
    restDisplacementThreshold: 100,
    restSpeedThreshold: 100,
  });
  // Pan Responders
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
      onPanResponderGrant: () => onPressIn.start(),
      onPanResponderRelease: (_, { dx }) => {
        if (dx > 250) {
          goRight.start(onDismiss);
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
    })
  ).current;
  // State
  const [index, setIndex] = useState(0);
  const onDismiss = () => {
    scale.setValue(1);
    position.setValue(0);
    setIndex((prev) => prev + 1);
    // Animated.timing(position, { toValue: 0, useNativeDriver: true }).start();
  };
  const checkPress = () => {
    goRight.start(onDismiss);
  };
  return (
    <Container>
      {loading === true ? (
        <CardContainer>
          <Card>
            <Text>데이터가 없어요;;</Text>
          </Card>
        </CardContainer>
      ) : (
        <CardContainer>
          //뒤에 있는 카드
          <Card style={{ transform: [{ scale: secondScale }] }}>
            <BookTitle>
              {notes[(index + 1) % notesNum].book.book.title}
            </BookTitle>
            <NoteTitle>{notes[(index + 1) % notesNum].note.noteText}</NoteTitle>
          </Card>
          <Card
            {...panResponder.panHandlers}
            style={{
              transform: [
                { scale },
                { translateX: position },
                { rotateZ: rotation },
              ],
            }}>
            <BookTitle>{notes[index % notesNum].book.book.title}</BookTitle>
            <NoteTitle>{notes[index % notesNum].note.noteText}</NoteTitle>
          </Card>
        </CardContainer>
      )}
      <BtnContainer>
        <Btn onPress={checkPress}>
          <Ionicons name="checkmark-circle" color="white" size={58} />
        </Btn>
      </BtnContainer>
    </Container>
  );
};
export default Home;
