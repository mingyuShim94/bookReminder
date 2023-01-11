import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@selectedTime';

const Setting = () => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    currentDate === undefined ? null : setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const showTimepicker = async () => {
    showMode('time');
    ///////////temp code////////////
    const timeArr = new Date('2022-03-12 10:20:30');
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timeArr));
  };

  return (
    <View>
    </View>
  );
};

export default Setting;
