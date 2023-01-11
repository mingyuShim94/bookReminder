import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  VictoryChart,
  VictoryBar,
  VictoryLabel,
  VictoryStack,
  VictoryAxis,
} from 'victory-native';

const Container = styled.ScrollView`
`;

const tempNoteData = Array.from({ length: 30 }, (v, i) => {
  const num = Math.floor(Math.random() * 10);
  const charNum = Math.floor(Math.random() * 100);
  const obj = { writings: num, characters: charNum };
  return obj;
});
const tempThinkData = Array.from({ length: 30 }, (v, i) => {
  const num = Math.floor(Math.random() * 10);
  const charNum = Math.floor(Math.random() * 100);
  const obj = { writings: num, characters: charNum };
  return obj;
});
const day = ['월', '화', '수', '목', '금', '토', '일'];
const Report = () => {
  const today = new Date();
  var todayDate = today.toLocaleDateString();
  const dateIndex = today.getDate() - 1;
  const dayIndex = today.getDay();
  const width = 400;
  const height = 400;
  //console.dir(dayIndex);
  const NoteCountKey = `@NoteChar${today.getMonth() + 1}`;
  const ThinkCountKey = `@ThinkChar${today.getMonth() + 1}`;
  const [noteCountData, setNoteCountData] = useState(null);
  const [thinkCountData, setThinkCountData] = useState(null);
  useEffect(() => {
    loadNoteCount();
  }, []);
  const loadNoteCount = async () => {
    const noteCountS = await AsyncStorage.getItem(NoteCountKey);
    const noteCount = JSON.parse(noteCountS);
    const thinkCountS = await AsyncStorage.getItem(ThinkCountKey);
    const thinkCount = JSON.parse(thinkCountS);

    var dateMonday;
    dayIndex === 0
      ? (dateMonday = dateIndex - 6)
      : (dateMonday = dateIndex - (dayIndex - 1));
    const weekNoteData = tempNoteData.slice(dateMonday, dateMonday + 7);
    const weekThinkData = tempThinkData.slice(dateMonday, dateMonday + 7);
    setNoteCountData(
      weekNoteData.map((note, index) => ({
        x: day[index],
        y: note.writings,
      }))
    );
    setThinkCountData(
      weekThinkData.map((think, index) => ({
        x: day[index],
        y: think.writings,
      }))
    );
  };
  // console.dir(noteCountData);
  // console.dir(thinkCountData);
  return (
    <Container>
      {noteCountData && thinkCountData ? (
        <VictoryChart horizontal height={height} width={width} padding={40}>
          <VictoryStack
            style={{ data: { width: 25 }, labels: { fontSize: 15 } }}>
            <VictoryBar
              style={{ data: { fill: 'tomato' } }}
              data={noteCountData}
              y={(data) => -Math.abs(data.y)}
              labels={({ datum }) => `${datum.y}`}
            />
            <VictoryBar
              style={{ data: { fill: 'orange' } }}
              data={thinkCountData}
              labels={({ datum }) => `${datum.y}`}
            />
          </VictoryStack>
          <VictoryLabel
            x={70}
            y={390}
            text="note"
            style={[{ fill: 'tomato', fontSize: 25 }]}
          />
          <VictoryLabel
            x={300}
            y={390}
            text="think"
            style={[{ fill: 'orange', fontSize: 25 }]}
          />
          <VictoryAxis
            style={{
              axis: { stroke: 'transparent' },
              ticks: { stroke: 'transparent' },
              tickLabels: { fontSize: 15, fill: 'black' },
            }}
            /*
            Use a custom tickLabelComponent with
            an absolutely positioned x value to position
            your tick labels in the center of the chart. The correct
            y values are still provided by VictoryAxis for each tick
          */
            tickLabelComponent={
              <VictoryLabel x={width / 2} textAnchor="middle" />
            }
            tickValues={noteCountData.map((point) => point.x).reverse()}
          />
        </VictoryChart>
      ) : null}
    </Container>
  );
};
export default Report;

// return (
//   <Container>
//     {noteCountData ? (
//       <VictoryChart height={350} width={400} domainPadding={30}>
//         <VictoryBar
//           data={noteCountData}
//           barWidth={30}
//           animate={{
//             duration: 2000,
//             onLoad: { duration: 1000 },
//           }}
//           labels={({ datum }) => `${datum.y}`}
//           alignment="middle"
//           style={{ data: { fill: '#c43a31' } }}></VictoryBar>
//       </VictoryChart>
//     ) : null}
//   </Container>
// );
