import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import { View } from 'native-base';

const TopBar = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={styles.header}
    >
      <Image
        style={styles.menuIcon}
        source={require('../../../assets/Images/menu.png')}
      />
       
          <Image alt="logo" source={require('../../assets/Logo/new.png')} />
        
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    marginTop: 40,
    backgroundColor: '#054582',
  },
  menuIcon: {
    marginLeft: 10,
    marginTop: 4,
    width: 20,
    height: 20,
  },
});

export default TopBar;
