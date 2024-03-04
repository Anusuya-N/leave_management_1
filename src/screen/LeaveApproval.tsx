import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions, TextInput, Platform, Linking } from 'react-native';
import { Button, HStack, VStack } from "native-base";
import Sidebar from '../layout/SideBar';
import Header from '../layout/header';


const Notify = ({ navigation }) => {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerVisible(!isDrawerVisible);
    };

    const onCloseDrawer = () => {
        setIsDrawerVisible(false);
    };

    const approval = [
        {
            name: "john", role: "Manager", type: "Annual Leave", Reason: "Covid", date: "03", month: "march", year: "2024"
        },
        {
            name: "john", role: "Manager", type: "Annual Leave", Reason: "Covid", date: "03", month: "April", year: "2024"
        },
        {
            name: "john", role: "Manager", type: "Annual Leave", Reason: "Covid", date: "03", month: "August", year: "2024"
        },
        {
            name: "john", role: "Manager", type: "Annual Leave", Reason: "Covid", date: "03", month: "September", year: "2024"
        },
        {
            name: "john", role: "Manager", type: "Annual Leave", Reason: "Covid", date: "03", month: "October", year: "2024"
        },
    ]


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingContainer}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>


                <Sidebar isVisible={isDrawerVisible} onCloseDrawer={onCloseDrawer} navigation={navigation} />
                <View>

                    <Header toggleDrawer={toggleDrawer} />

                </View>
                <Text style={styles.moduleHea}>Leave Approval</Text>
                <View >
                    {approval.map((leave, index) =>
                    (
                        <View key={index} style={styles.boxlist}>
                            <HStack style={styles.hstack}>
                               
                                <View style={[styles.calendar, index % 2 !== 0 ? { borderColor: "#7CB9E8" } : null]}>
                                    <Text style={[styles.month, index % 2 !== 0 ? styles.evenMonth : null]}>{leave.month}</Text>
                                    <View>
                                        <Text style={[styles.date, index % 2 !== 0 ? { color: "#7CB9E8" } : null]} >{leave.date}</Text>
                                        <Text style={[styles.year, index % 2 !== 0 ? { color: "#7CB9E8" } : null]} >{leave.year}</Text>
                                    </View>

                                </View>


                             


                                <VStack>
                                    <View >
                                        <Text style={styles.name}>{leave.name}</Text>
                                        <Text style={styles.subText} >Role:{leave.role} </Text>
                                        <Text >Leave Type: {leave.type} </Text>
                                        <Text>Reason :{leave.Reason}  </Text>

                                    </View>

                                    <HStack style={{ justifyContent: "space-evenly" }}>
                                    <View style={{flexDirection:"row"}}>
                                        <Image source={require("../../assets/Apply/approval.png")} />
                                        <Text style={styles.approvalbtn}>Accept</Text>
                                    </View>
                                    <View style={{flexDirection:"row"}}>
                                        <Image source={require("../../assets/Apply/cancel.png")} />
                                        <Text style={styles.approvalbtn}>Reject</Text>
                                    </View>
                                </HStack>
                               
                                </VStack>
                            </HStack>

                        </View>
                    )
                    )}




                </View>
            </ScrollView>
        </KeyboardAvoidingView>

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

        alignItems: "center",
    },
    menuImg: {
        marginTop: 60,
        marginLeft: 20,
        height: 25,
        width: 35,
    },


    moduleHea: {
        fontWeight: "bold",
        color: "#054582",
        fontSize: 18,
        alignSelf: "center",
        marginTop: 40,
        textTransform: "uppercase"
    },
    boxlist: {
        borderWidth: 1,
        borderColor: "silver",
        margin: 10,
        height: 120,

    },
    calendar: {
        borderWidth: 2,
        borderColor: "#FABA5F",
        borderRadius: 5,
        marginTop: 10,
        height: 80,


    },
    month: {
        borderBottomColor: "#FABA5F",
        borderBottomWidth: 1,
        backgroundColor: "#FABA5F",
        textAlign: "center",
        color: "#fff",
        width: 100
    },
    evenMonth: {
        borderBottomColor: "#7CB9E8",
        borderBottomWidth: 1,
        backgroundColor: "#7CB9E8",
        textAlign: "center",
        color: "#fff",
        width: 100
    },
    date: {
        textAlign: "center",
        fontWeight: "bold",
        color: "orange",
        fontSize: 18

    },
    year: {
        textAlign: "center",

        color: "orange",
        fontSize: 12

    },
    hstack: {
        justifyContent: "space-evenly"
    },
    name: {
        fontWeight: "bold",
        color: "#000",

        textTransform: "uppercase",

    },
    subText: {
        color: "gray",
        fontSize: 15,

    },
    approvalbtn:{
        color:"#000",
        alignSelf:"center",
        fontSize:12,
     textDecorationLine:"underline"
    }
});

export default Notify;
