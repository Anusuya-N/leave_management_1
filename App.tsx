import {AuthProvider} from './src/context/AuthContext';
import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import React,{useEffect} from 'react';
import RootStackScreen from './src/navigator/stackNavigator';



export default function App() {

  return (
    <AuthProvider>
      <NativeBaseProvider>
        <NavigationContainer>
          <RootStackScreen />
        </NavigationContainer>
      </NativeBaseProvider>
    </AuthProvider>
  );
}
