import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions, TouchableOpacity } from 'react-native';
import { Button, Container, HStack, Card } from 'native-base';
import Sidebar from '../layout/SideBar'; // Import the Sidebar component
import Header from '../layout/header';
import { Calendar } from 'react-native-calendars';
import { useAuth } from '../context/AuthContext';
const Home = ({ navigation }: any) => {
  const { email, leaveLoad, userType, responseData, firstEmployee } = useAuth()
  console.log('userType: ', userType);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  const onCloseDrawer = () => {
    setIsDrawerVisible(false);
  };


  const [showAll, setShowAll] = useState(false);

  const displayedAlerts = showAll ? responseData && responseData : responseData && responseData.slice(0, 3);
  console.log('displayedAlerts: ', displayedAlerts);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('http://118.189.74.190:1016//api/empDetailshome', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           NricId: email,
  //         }),
  //       });

  //       if (response.ok) {
  //         const data = await response.json();
  //         const firstEmployeeData = data.emphomedetails[0];
  //         const joinDateParts = firstEmployeeData.JoinDate.split(' ')[0];
  //         firstEmployeeData.JoinDate = joinDateParts;
  //         setFirstEmployee(firstEmployeeData);

  //         setResponseData(data.emphomedetails)

  //       } else {
  //         console.error('Error fetching user status');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, [email]);

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

            {userType === "approval" && (
              <View >
                <Pressable onPress={() => navigation.navigate("Approval")}>
                  <Image style={styles.dashImg} source={require("../../assets/DashBoard/approvalLeave.png")}></Image>
                </Pressable>
                <Text>Leave Approval</Text>
              </View>
            )}


          </View>
          {/* <Calendar
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
          )} */}

          <View style={styles.line} />
          <View style={styles.width}>
            {firstEmployee && (
              <>
                <Text style={styles.homeContents}>
                  Greetings {firstEmployee.EmpName}, Your leave status can be found here.
                </Text>
                <Text style={styles.homeContents}>
                  Date of Joining: {firstEmployee.JoinDate}
                </Text>
              </>
            )}
          </View>
          <View style={styles.line} />

          <View>

            <View >
              {/* {leaveDetails.map((leave) =>

              (
                <>
                  <View>
                    <Text style={styles.headerText}>Leave Type :
                      <Text>{leave.leaveType}</Text>
                    </Text>
                  </View>
                  <View style={styles.leaveDetail}>
                    <Text style={styles.detailLabel}>Entitled</Text>
                    <Text style={styles.detailValue}>{leave.leaveTaken}</Text>
                  </View>
                  <View style={styles.leaveDetail}>
                    <Text style={styles.detailLabel}>Balance Leave:</Text>
                    <Text style={styles.detailValue}>{leave.balanceLeave}</Text>
                  </View>
                  <View style={styles.leaveDetail}>
                    <Text style={styles.detailLabel}>Adjusted Balance Leave BF:</Text>
                    <Text style={styles.detailValue}>{leave.adjustedBalanceLeaveBF}</Text>
                  </View>
                  <View style={styles.leaveDetail}>
                    <Text style={styles.detailLabel}>Earned:</Text>
                    <Text style={styles.detailValue}>{leave.adjustedBalanceLeaveBF}</Text>
                  </View>
                  <View style={styles.line} />
                </>

              )


              )} */}
              <Text style={styles.homeHea}>Alerts </Text>
              {displayedAlerts?.map((alert) => (
                <>
                  <Text style={styles.bulletPoint}>●

                    <Text style={styles.homeContent}>
                      Your {alert.nDays} day leave <Text style={{ color: "gray" }}>({alert.LTypeName} - {alert.LeaveCode})</Text>  from {alert.LeaveDate.split(' ')[0]} to {alert.LeaveDate.split(' ')[0]} 
                      {alert.Status === "approved" ? (
                        <Text style={{ color: "green" }}> has been approved</Text>
                      ) : alert.Status === "rejected" ? (
                        <Text style={{ color: "red" }}>has been rejected</Text>
                      ) : alert.Status === "Cancel Pending" ? (
                        <Text style={{ color: "red" }}> has been canceled</Text>
                      ) : (
                        <Text style={{ color: "#ff6700" }}>  is {alert.Status}</Text>
                      )}
                      {/* <Text>  </Text>
                      <Text style={{ color: "#fff", backgroundColor: "gray" }}>  {alert.Approve1} </Text> */}
                    </Text>
                  </Text>

                </>
              ))}
            </View>
            {responseData && responseData.length > 3 && (
              <TouchableOpacity onPress={toggleShowAll}>
                <Text style={styles.viewToggle}>{showAll ? 'View less' : 'View more'}</Text>
              </TouchableOpacity>
            )}
            {/* <View style={styles.line} /> */}

          </View>


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
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: "#ffc40c",
    alignSelf: "center"
  },
  leaveDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
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
  homeHea: {
    color: "#054582",
    margin: 10,
    justifyContent: 'flex-start',
    fontWeight: `500`,
    fontSize: 16,

  },
  homeContents: {
    color: "#000",
    padding: 10,
    fontWeight: `400`,
    fontSize: 14,


  },
  homeContent: {
    color: "#000",
    // padding: 10,
    fontWeight: `300`,
    fontSize: 14,

  },
  width: {
    width: screenWidth
  },

  line: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  bulletPoint: {
    marginRight: 5,
    color: "red"
  },
  viewToggle: {
    color: 'blue',
    alignSelf: 'flex-end',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});

export default Home;
