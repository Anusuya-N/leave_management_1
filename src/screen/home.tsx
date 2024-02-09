import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Button, HStack } from 'native-base';
import Sidebar from '../layout/SideBar'; // Import the Sidebar component
import Header from '../layout/header';
import { Calendar } from 'react-native-calendars';
import { useAuth } from '../context/AuthContext';
const Home = ({ navigation }: any) => {
  const { email } = useAuth()
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [leaveData, setLeaveData] = useState([]);
  const todayDate = new Date();
  const formattedTodayDate = `${todayDate.getMonth() + 1}/${todayDate.getDate()}/${todayDate.getFullYear()}`;
  const isLeaveApplied = leaveData.some(leaveItem => leaveItem.LeaveDate.split(' ')[0] === formattedTodayDate);

  const markedDates = {};
  leaveData.forEach(leaveItem => {
    const dateParts = leaveItem.LeaveDate.split(' ')[0].split('/');
    const formattedLeaveDate = `${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
    markedDates[formattedLeaveDate] = { marked: true };
  });


  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  const onCloseDrawer = () => {
    setIsDrawerVisible(false);
  };

  // const currentDate = new Date();
  // const currentMonth = currentDate.getMonth() + 1; // Months are zero-based (0 to 11)
  // const currentYear = currentDate.getFullYear();
  // useEffect(() => {
  //   const leaveList = async () => {
  //     try {



  //       const requestBody = {
  //         monthno: currentMonth,
  //         yearno: currentYear,
  //         NricID: email
  //       };

  //       const response = await fetch("http://118.189.74.190:1016/api/empleavelist", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify(requestBody)
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         if (data.Message === "No Data Found") {
  //           setLeaveData([]);
  //         } else {
  //           const leaveList = data.empleave;
  //           setLeaveData(leaveList);
  //         }
  //       } else {
  //         console.error("API request failed with status:", response.status);
  //       }
  //     } catch (error) {
  //       console.error("Error occurred during API request:", error);
  //     }
  //   };

  //   leaveList();
  // }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <Sidebar isVisible={isDrawerVisible} onCloseDrawer={onCloseDrawer} navigation={navigation} />
        <View>

          <Header toggleDrawer={toggleDrawer} />

        </View>
        <View style={styles.content}>
          <View style={styles.main}   >
            <View >
              <Pressable onPress={() => navigation.navigate("Notify")}>
                <Image style={styles.dashImg} source={require("../../assets/DashBoard/notify.png")}></Image>
              </Pressable>
              <Text>Notify</Text>
            </View>

            <View>
              <Pressable onPress={() => navigation.navigate("AttendanceClockScreen")}>
                <Image style={styles.dashImg} source={require("../../assets/DashBoard/attendance.png")}></Image></Pressable>
              <Text>Attendance Clock</Text>
            </View>
            <View>
              <Pressable onPress={() => navigation.navigate("AddLeave")}>
                <Image style={styles.dashImg} source={require("../../assets/DashBoard/apply.png")}></Image></Pressable>
              <Text>Apply Leave</Text>
            </View>
            {/* <View>
            <Pressable onPress={() => navigation.navigate("ProxyLeave")}>
              <Image style={styles.dashImg} source={require("../../assets/DashBoard/proxy.png")}></Image></Pressable>
              <Text>Proxy Leave</Text>
            </View> */}
            <View>
              <Pressable onPress={() => navigation.navigate("CancelLeave")}>
                <Image style={styles.dashImg} source={require("../../assets/DashBoard/cancel.png")}></Image></Pressable>
              <Text>Cancel Leave</Text>
            </View>
            <View>
              <Pressable onPress={() => navigation.navigate("EmpRoster")}>
                <Image style={styles.dashImg} source={require("../../assets/DashBoard/roster.png")}></Image></Pressable>
              <Text>Employee Roster</Text>
            </View>
          </View>

          {/* <View style={styles.Calcontainer}>
            <View style={styles.calendarContainer}>
              <Calendar
                markedDates={markedDates}
                theme={{
                  todayTextColor: 'blue',
                  selectedDayBackgroundColor: 'green',
                  selectedDayTextColor: 'white'
                }}

              />
                {isLeaveApplied ? (
              <Text style={styles.calendar}>Leave Applied for Today</Text>
            ) : (
              <Text style={styles.calendar}>No Leave Applied for Today</Text>
            )}
            </View>
          
          </View> */}

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  menuImg: {
    marginTop: 60,
    marginLeft: 20,
    height: 25,
    width: 35,
  },
  dashImg: {

    alignSelf: "center"
  },
  borderLine: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: screenWidth,
  },
  main: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 1,
    justifyContent: "space-evenly",
    marginTop: "3%",
    padding: 5,

  },
  calendar: {
    alignSelf: "center",
    fontWeight: "bold",
    color: "#054582",

  },
  calendarContainer: {
    width: '70%', // Adjust width of the calendar container
    height: '80%', // Adjust width of the calendar container
    margin: 55, // Add margin to separate calendar from text
  },
  Calcontainer: {
    flex: 1,
    backgroundColor: '#eee',
    justifyContent: 'flex-end', // Align calendar and text to bottom
    borderTopLeftRadius: 15, // Border radius to the top left corner
    borderTopRightRadius: 15, 
  },
});

export default Home;
