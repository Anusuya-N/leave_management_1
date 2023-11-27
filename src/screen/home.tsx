import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Button, HStack } from 'native-base';
import Sidebar from '../layout/SideBar'; // Import the Sidebar component

const Home = ({ navigation }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  const onCloseDrawer = () => {
    setIsDrawerVisible(false);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View >
          <Pressable onPress={toggleDrawer}>
            <Image
              source={require('../../assets/Images/menu.png')}
              height={10}
              width={20}
              style={styles.menuImg}
            />
          </Pressable>
          <View style={styles.borderLine} ></View>
        </View>
        <Sidebar isVisible={isDrawerVisible} onCloseDrawer={onCloseDrawer} navigation={navigation} />
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
  main:{
    flexDirection:"row",
    flexWrap:"wrap",
    gap:1,
    justifyContent:"space-evenly",
    marginTop:"3%",
    padding:5,
    
  }
});

export default Home;
