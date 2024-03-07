import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions, TextInput, Platform, Linking } from 'react-native';
import { Button, HStack, VStack } from "native-base";
import Sidebar from '../layout/SideBar';
import Header from '../layout/header';


const Notify = ({ navigation }) => {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [approval, setApproval] = useState([
        {
            id: 1, name: "john", role: "Manager", type: "Annual Leave", Reason: "Covid", date: "03", month: "march", year: "2024", selected: false
        },
        {
            id: 2, name: "john", role: "Manager", type: "Annual Leave", Reason: "Covid", date: "03", month: "April", year: "2024", selected: false
        },
        {
            id: 3, name: "john", role: "Manager", type: "Annual Leave", Reason: "Covid", date: "03", month: "August", year: "2024", selected: false
        },
        {
            id: 4, name: "john", role: "Manager", type: "Annual Leave", Reason: "Covid", date: "03", month: "September", year: "2024", selected: false
        },
        {
            id: 5, name: "john", role: "Manager", type: "Annual Leave", Reason: "Covid", date: "03", month: "October", year: "2024", selected: false
        },
        {
            id: 6, name: "john", role: "Manager", type: "Annual Leave", Reason: "Covid", date: "03", month: "October", year: "2024", selected: false
        },
        {
            id: 7, name: "john", role: "Manager", type: "Annual Leave", Reason: "Covid", date: "03", month: "October", year: "2024", selected: false
        },
        {
            id: 8, name: "john", role: "Manager", type: "Annual Leave", Reason: "Covid", date: "03", month: "October", year: "2024", selected: false
        },
        {
            id: 9, name: "john", role: "Manager", type: "Annual Leave", Reason: "Covid", date: "03", month: "October", year: "2024", selected: false
        },
        {
            id: 10, name: "john", role: "Manager", type: "Annual Leave", Reason: "Covid", date: "03", month: "October", year: "2024", selected: false
        },
    ]);

//     const date = new Date(2024, 2, 5); // Note: Months are 0-based, so 2 represents March
// const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// const dayOfWeek = daysOfWeek[date.getDay()];

 // Output: Tuesday


    const toggleDrawer = () => {
        setIsDrawerVisible(!isDrawerVisible);
    };

    const onCloseDrawer = () => {
        setIsDrawerVisible(false);
    };

    const handleSelectAll = () => {
        const updatedApproval = approval.map(request => {
            return { ...request, selected: true };
        });
        setApproval(updatedApproval);
    };

    const handleApproveSelected = () => {
        // Logic to approve selected requests
        // For now, let's just log the selected requests
        const selectedRequests = approval.filter(request => request.selected);
        console.log("Selected Requests for Approval:", selectedRequests);
    };

    const handleToggleSelect = (id) => {
        const updatedApproval = approval.map(request => {
            if (request.id === id) {
                return { ...request, selected: !request.selected };
            }
            return request;
        });
        setApproval(updatedApproval);
    };

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
                    <View style={styles.buttonsContainer}>
                    <Image source= {require("../../assets/Apply/all.png")}/>
                        <Pressable onPress={handleSelectAll}>

                            <Text style={styles.allText}>  Select All</Text>
                          
                            </Pressable>
                        {/* <Button onPress={handleApproveSelected}>Approve Selected</Button> */}
                    </View>
                    {approval.map((leave, index) => (
                        <View key={index} style={styles.boxlist}>
                            <HStack style={styles.hstack}>
                            <Pressable style={{alignSelf:"center"}} onPress={() => handleToggleSelect(leave.id)}>
                                            <Image source={leave.selected ? require("../../assets/Apply/select.png") : require("../../assets/Apply/unselect.png")} />
                                        </Pressable>
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
                    ))}
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
    buttonsContainer: {
        flexDirection: 'row',
      margin:10,
      
    },
    approvalbtn:{
        color:"#000",
        alignSelf:"center",
        fontSize:12,
     textDecorationLine:"underline"
    },
    allText:{
        alignSelf:"center",
        fontWeight:"bold",
        color:"#000",
      
    }
});

export default Notify;
