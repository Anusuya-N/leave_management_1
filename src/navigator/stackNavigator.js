import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Sidebar from "../layout/SideBar"; // Import the Sidebar component
import Login from "../screen/auth/login";
import Signup from "../screen/auth/signup";
import Forgotpassword from "../screen/auth/forgotpassword";
import Home from "../screen/home";
import Notify from '../screen/notify';
import CancelLeave from '../screen/cancelLeave';
import EmpRoster from '../screen/EmpRoster';
import Payslip from '../screen/paySlip';
import ProxyLeave from '../screen/proxyLeave';
import AttendanceClockScreen from '../screen/attendanceClock';
import CameraScreen from '../screen/CameraScreen';
import ClaimPage from '../screen/claimPage';
import AddLeave from '../screen/applyLeave';

const AuthStack = createStackNavigator();
const AuthStackScreen = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Login'>
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="Signup" component={Signup} />
    <AuthStack.Screen name="Forgotpassword" component={Forgotpassword} />
  </AuthStack.Navigator>
);

const RootStack = createStackNavigator();
export default function RootStackScreen() {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  const onCloseDrawer = () => {
    setIsDrawerVisible(false);
  };

  return (
    <RootStack.Navigator
      initialRouteName={isLoggedIn ? "Home" : "Auth"}
      screenOptions={{ headerShown: false }}
    >
      {isLoggedIn ? (
        <>
          <RootStack.Screen
            name="Home"
            component={Home}
            options={{
              title: 'Home',
              headerLeft: () => <HeaderButton onPress={toggleDrawer} />,
            }}
            initialParams={{ setIsLoggedIn }}
          />

          <RootStack.Screen
            name="AttendanceClockScreen"
            component={AttendanceClockScreen}
            options={{ title: 'AttendanceClockScreen' }}
          />

          <RootStack.Screen
            name="Notify"
            component={Notify}
            options={{ title: 'Notify' }}
          />
          <RootStack.Screen
            name="CancelLeave"
            component={CancelLeave}
            options={{ title: 'CancelLeave' }}
          />
          <RootStack.Screen
            name="EmpRoster"
            component={EmpRoster}
            options={{ title: 'EmpRoster' }}
          />
          <RootStack.Screen
            name="Payslip"
            component={Payslip}
            options={{ title: 'Payslip' }}
          />
          <RootStack.Screen
            name="ProxyLeave"
            component={ProxyLeave}
            options={{ title: 'ProxyLeave' }}
          />
          <RootStack.Screen
            name="CameraScreen"
            component={CameraScreen}
            options={{ title: 'CameraScreen' }}
          />
          <RootStack.Screen
            name="ClaimPage"
            component={ClaimPage}
            options={{ title: 'ClaimPage' }}
          />
          <RootStack.Screen
            name="AddLeave"
            component={AddLeave}
            options={{ title: 'AddLeave' }}
          />

        </>
      ) : (
        <RootStack.Screen name="Auth" component={AuthStackScreen} />
      )}
      <RootStack.Screen name="Home" component={Home} options={{ title: 'Home' }} initialParams={{ setIsLoggedIn }} />
      <RootStack.Screen name="Notify" component={Notify} options={{ title: 'Notify' }} />
      <RootStack.Screen name="CancelLeave" component={CancelLeave} options={{ title: 'CancelLeave' }} />
      <RootStack.Screen name="EmpRoster" component={EmpRoster} options={{ title: 'EmpRoster' }} />
      <RootStack.Screen name="Payslip" component={Payslip} options={{ title: 'Payslip' }} />
      <RootStack.Screen name="ProxyLeave" component={ProxyLeave} options={{ title: 'ProxyLeave' }} />
      <RootStack.Screen name="AttendanceClockScreen" component={AttendanceClockScreen} options={{ title: 'AttendanceClockScreen' }} />
      <RootStack.Screen name="CameraScreen" component={CameraScreen} options={{ title: 'CameraScreen' }} />
      <RootStack.Screen name="ClaimPage" component={ClaimPage} options={{ title: 'ClaimPage' }} />
      <RootStack.Screen name="AddLeave" component={AddLeave} options={{ title: 'AddLeave' }} />
      <RootStack.Screen
        name="Sidebar"
        component={Sidebar}
        options={{
          title: 'Sidebar',
          headerShown: false,
        }}

      />
    </RootStack.Navigator>
  );
}
