import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';
import Modal from 'react-native-modal';
import DrawerMenu from '../navigator/DrawerContent'; // Import the DrawerMenu component
import { useAuth } from '../context/AuthContext';


const Sidebar = ({ isVisible, onCloseDrawer, navigation }) => {
  const {firstEmployee}=useAuth();
  const menuItems = [
    { text: 'Dashboard', screenName: 'Home', menuType: 'subheading',  },
    { text: 'Attendance Clock', screenName: 'AttendanceClockScreen', menuType: 'subheading' },
    { text: 'Notify', screenName: 'Notify', menuType: 'subheading' },
    { text: 'Leave Manager', screenName: 'Screen4', menuType: 'heading' },
    { text: 'Add/Cancel Leaves', screenName: 'AddLeave', menuType: 'subheading' },
    { text: 'Proxy Leave Application', screenName: 'ProxyLeave', menuType: 'subheading' },
    { text: 'Comp-Off Application', screenName: 'Screen7', menuType: 'subheading' },
    { text: 'Approve/Reject Leave', screenName: 'Screen8', menuType: 'subheading' },
    { text: 'Reports', screenName: 'Screen9', menuType: 'heading' },
    { text: 'Pay Slip', screenName: 'Payslip', menuType: 'subheading' },
    { text: 'Claim page', screenName: 'ClaimPage', menuType: 'subheading' },
    { text: 'Leaves Per Type', screenName: 'Screen11', menuType: 'subheading' },
    { text: 'Planned & Unplanned leaves', screenName: 'Screen12', menuType: 'subheading' },
    // { text: 'Total Paid LWP', screenName: 'Screen13', menuType: 'subheading' },
    { text: 'Authorized & Unauthorized Leaves', screenName: 'Screen14', menuType: 'subheading' },
    { text: 'Log Out', screenName: 'Login', menuType: 'Login' },
  ];

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCloseDrawer}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      style={{ margin: 0 }}
    >
      <View style={styles.drawerContainer}>
        
        {/* <Image style={{backgroundColor:"aqua"}} source={require('../../assets/Images/menu.png')} /> */}
        <View style={styles.userCircle}>
          {
            firstEmployee && (
              <Text style={styles.userName}>{firstEmployee.EmpName.substring(0, 2)}</Text>
            )
          }
        
        </View>
        {menuItems.map((menuItem, index) => (
          <DrawerMenu
            key={index}
            menuText={menuItem.text}
            onCloseDrawer={onCloseDrawer}
            navigation={navigation}
            screenName={menuItem.screenName}
            menuType={menuItem.menuType}
           
          />
        ))}
     <View style={styles.footer} >
              <Text style={styles.footerText}>Copyright © GSK Technology. (Ver-1.0)</Text>
              </View>
      </View>
    </Modal>
  );
};

export default Sidebar;

const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({

  drawerContainer: {
    flex: 1,
    backgroundColor: '#ffff',
    width: 250,
    height: windowHeight,
    position: 'absolute',
    top: 50,
    borderTopRightRadius: 30,
  },
  userCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    borderColor: '#054582',
    borderWidth: 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  userName: {
    fontSize: 18,
    color: '#054582',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
  right: 0,
    bottom:60,
    padding: 5,
  
  },
  footerText: {
    color: '#000',
    fontSize: 10,
    fontWeight:"bold"
  },




});
