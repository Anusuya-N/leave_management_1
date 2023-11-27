import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions, TextInput, Platform, Linking } from 'react-native';
import { Button } from "native-base";
import Sidebar from '../layout/SideBar';

const Notify = ({ navigation }) => {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerVisible(!isDrawerVisible);
    };

    const onCloseDrawer = () => {
        setIsDrawerVisible(false);
    };

    // const sendEmail = () => {
    //     const to = 'anusuyaaug10t@gmail.com';
    //     const cc = 'anusuyaaug10t@gmail.com';
    //     const subject = 'Notification Subject';
    //     const body = 'This is the body of the notification email.';

    //     const mailtoUrl = `mailto:${to}?cc=${cc}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    //     Linking.openURL(mailtoUrl);
    // };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingContainer}
                >
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
                    <Sidebar isVisible={isDrawerVisible} onCloseDrawer={onCloseDrawer} navigation={navigation} />
                    <Text style={styles.moduleHea}>Notify</Text>
                    <View style={styles.content}>
                        <View style={styles.textContainer}>
                            <Text>
                                To: <Text style={styles.innerText}>Reporting Managers</Text>
                            </Text>
                            <Text>
                                CC: <Text style={styles.innerText}>HR Manager</Text>
                            </Text>
                            <TextInput
                                style={styles.input}
                                multiline={true}
                                placeholder="Enter message contents here"
                            />
                        </View>
                        <Button mt={10} style={styles.notifyBtn} >Send</Button>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
};

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    scrollContainer: {
        flexGrow: 1,
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    content: {
        flex: 1,
        marginTop: 40,
        alignItems: "center",
    },
    menuImg: {
        marginTop: 60,
        marginLeft: 20,
        height: 25,
        width: 35,
    },
    borderLine: {
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: screenWidth,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        marginTop: 20,
        fontSize: 13,
        height: 100,
    },
    notifyBtn: {
        backgroundColor: "#054582",
        width: 150,
        alignSelf: "center",
    },
    textContainer: {
        width: 300, // Adjust the width as needed
    },
    innerText: {
        fontWeight: 'bold', // Apply any styles you want here
    },
    moduleHea:{
        fontWeight:"bold",
        color:"#054582",
        fontSize:18,
        alignSelf:"center",
        marginTop:40,
        textTransform:"uppercase"
    }
});

export default Notify;
