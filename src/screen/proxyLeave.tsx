import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button, Select, Radio, HStack, Input, VStack, Box } from 'native-base';
import Sidebar from '../layout/SideBar';
import { Calendar } from 'react-native-calendars';

const LeaveHeader = ({ toggleDrawer }) => {
  return (
    <View>
      <Pressable onPress={toggleDrawer}>
        <Image
          source={require('../../assets/Images/menu.png')}
          height={10}
          width={20}
          style={styles.menuImg}
        />
      </Pressable>
      <View style={styles.borderLine}></View>
    </View>
  );
};

const ProxyLeave = ({ navigation }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleDayPress = (day) => {
    const dateString = day.dateString;

    if (startDate && !endDate) {
      // Completing the range selection
      setEndDate(dateString);

      const datesInRange = getDatesInRange(startDate, dateString);
      const newRange = { ...selectedRange };
      datesInRange.forEach((date) => {
        newRange[date] = {
          selected: true,
          color: '#054582',
          startingDay: date === startDate,
          endingDay: date === dateString,
        };
      });
      setSelectedRange(newRange);
    } else {
      // Start of a new selection
      setStartDate(dateString);
      setEndDate(null);
      setSelectedRange({
        [dateString]: {
          selected: true,
          color: '#054582',
          startingDay: true,
          endingDay: true,
        },
      });
    }
  };

  const getDatesInRange = (start, end) => {
    const dates = [];
    const currentDate = new Date(start);

    while (currentDate <= new Date(end)) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  const onCloseDrawer = () => {
    setIsDrawerVisible(false);
  };

  const getSelectedDaysCount = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timeDiff = Math.abs((end as any) - (start as any));

      const dayCount = Math.ceil(timeDiff / (24 * 60 * 60 * 1000)) + 1; // Including both start and end dates
      return dayCount;
    }
    return 0;
  };

  return (
    <View style={styles.container}>
      <LeaveHeader toggleDrawer={toggleDrawer} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }} // Set flex to 1 to allow the content to expand
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled" // Allow scrolling even when keyboard is visible
        >
          <Sidebar isVisible={isDrawerVisible} onCloseDrawer={onCloseDrawer} navigation={navigation} />
          <Text style={styles.moduleHea}>proxy leave</Text>
          <View style={styles.content}>
            <Text style={styles.label}>Employee Name</Text>
            <Select variant="underlined">
              <Select.Item label="aaa" value="aaa" />
              <Select.Item label="bbb" value="bbb" />
            </Select>
            <Text style={styles.label}>Approver Name</Text>
            <Select variant="underlined">
              <Select.Item label="Vacation" value="vacation" />
              <Select.Item label="Sick Leave" value="sick" />
            </Select>

            <Calendar
              style={styles.calendar}
              current={'2023-08-01'}
              onDayPress={handleDayPress}
              markingType="period"
              markedDates={selectedRange}
             
            />

            <View>
              {startDate && endDate && <Text style={styles.label}>Date</Text>}
              {startDate && endDate && (
                <Input variant="underlined" value={`${startDate ? '' + startDate : ''} to ${endDate ? ' ' + endDate : ''}`} />
              )}
            </View>
            <View style={styles.radioGroup}>
              <Radio.Group name="leaveType">
                <HStack space={4}>
                  <VStack>
                    <Radio style={styles.radio} value="vacation" colorScheme="red" />
                    <Text>Half-day</Text>
                  </VStack>
                  <VStack>
                    <Radio style={styles.radio} value="sick" colorScheme="red" />
                    <Text>Full-day</Text>
                  </VStack>
                </HStack>
              </Radio.Group>
            </View>
            <View>
              <Text style={styles.label}>Number of Days</Text>
              <TextInput value={`${getSelectedDaysCount()} days`} style={styles.textInput} keyboardType="numeric" />
            </View>
            <View>
              <Text style={styles.label}>Description</Text>
              <Input variant="underlined" type="text" />
            </View>

            <Button  mt={10} style={styles.applyBtn}>
              Save
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
  menuImg: {
    marginTop: 60,
    marginLeft: 20,
    height: 25,
    width: 35,
  },
  radioGroup: {
    marginTop: 30,
    alignItems: 'center',
  },
  radio: {
    alignSelf: 'center',
  },
  label: {
    color: 'gray',
    marginLeft: 12,
    marginTop: 10,
    fontSize: 11,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingLeft: 10,
  },
  applyBtn: {
    backgroundColor: '#054582',
    width: 150,
    alignSelf: 'center',
  },
  borderLine: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: screenWidth,
  },
  moduleHea: {
    fontWeight: 'bold',
    color: '#054582',
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 15,
    textTransform: 'uppercase',
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#eeee',
    height: 350,
    marginTop: 10,
  },
});

export default ProxyLeave;
