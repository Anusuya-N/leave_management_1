import { HStack } from 'native-base';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet,Image } from 'react-native';

const DrawerMenu = ({ navigation, onCloseDrawer, screenName, menuType, menuText ,icon}) => {
    const handleMenuClick = () => {
        onCloseDrawer();
        // navigation.navigate(screenName);
        if (menuType !== 'heading') {
            navigation.navigate(screenName);
        }
    };

    const getMenuStyle = () => {
        if (menuType === 'heading') {
            return styles.drawerHeading;
        } else if (menuType === 'subheading') {
            return styles.drawerSubheading;
        } else {
            return styles.drawerMenuItemText;
        }
    };

    return (
        <View >
            <TouchableOpacity onPress={handleMenuClick}>

                <HStack space={2} style={{padding:9}}>
            <Image
                source={icon}
               
            />
                <Text style={[getMenuStyle(), { /* Additional styles if needed */ }]}>
                    {menuText}
                </Text>
                </HStack>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({

    drawerHeading: {
        fontSize: 17,
        color: '#c90016',
    



    },
    drawerSubheading: {
        fontSize: 13,
    },

});

export default DrawerMenu;
