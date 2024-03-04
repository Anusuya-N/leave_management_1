
import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions, TextInput, Platform, Linking, TouchableOpacity } from 'react-native';
import { Button, HStack, Modal, VStack } from "native-base";
import Sidebar from '../layout/SideBar';
import Header from '../layout/header';
import { Calendar } from 'react-native-calendars';


const Notify = ({ navigation }) => {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const blockedDates = [
        { date: '2024-03-26', reason: 'John on leave', status: "pending" },
        { date: '2024-03-25', reason: 'kia on leave', status: "approved" },
        { date: '2024-03-24', reason: 'Ju on leave', status: "approved" },
        { date: '2024-03-23', reason: 'Employee on leave', status: "pending" },
        { date: '2024-03-13', reason: 'Employee on leave', status: "pending" },
        { date: '2024-03-10', reason: 'Employee on leave', status: "pending" },
        // Add more blocked dates here if needed
    ]; // Sample blocked dates with reasons

    const addEvent = (day) => {
        setSelectedDay(day.dateString);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const markedDatesObject = blockedDates.reduce((acc, curr) => {
        acc[curr.date] = { marked: true, dotColor: 'red' };
        return acc;
    }, {});

    const toggleDrawer = () => {
        setIsDrawerVisible(!isDrawerVisible);
    };

    const onCloseDrawer = () => {
        setIsDrawerVisible(false);
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

                <Text style={styles.moduleHea}>Employee Roaster</Text>
                <View style={styles.content}>

                    <HStack style={{ justifyContent: "space-evenly",marginBottom:15 }}>
                        <HStack>
                            <Image source={require("../../assets/Apply/green.png")} />
                            <Text style={{color:"#000"}}>Approved</Text>
                        </HStack>
                        <HStack>
                            <Image source={require("../../assets/Apply/cal.png")} />
                            <Text style={{color:"#000"}}>Pending</Text>
                        </HStack>
                    </HStack>

                    <Calendar
                        markedDates={markedDatesObject}
                        onDayPress={addEvent}
                        markingType={'period'}
                        renderDay={(day, markedDates) => {
                            const date = day.dateString;
                            const marked = markedDates[date] && markedDates[date].selected;
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        if (marked) {
                                            setSelectedDay(date);
                                            setIsModalVisible(true);
                                        }
                                    }}
                                    style={[styles.dayContainer, marked && { backgroundColor: 'red' }]}>
                                    <Text style={[styles.dateText, marked && { color: 'black' }]}>
                                        {day.day}
                                    </Text>

                                </TouchableOpacity>
                            );
                        }}
                    />
                    <Modal isOpen={isModalVisible} onClose={closeModal}>
                        <Modal.Content>
                            <Modal.CloseButton />
                            <Modal.Header >

                                <Text style={styles.modHea}>Event</Text>
                                <Text style={styles.submodHea}> {selectedDay}</Text>
                            </Modal.Header>
                            <Modal.Body style={{ alignItems: "center" }}>
                                <HStack space={3}>
                                    {blockedDates.find(item => item.date === selectedDay)?.status === 'pending' ? (
                                        <Image source={require("../../assets/Apply/cal.png")} />
                                    ) : (
                                        <Image source={require("../../assets/Apply/green.png")} />
                                    )}

                                    <Text style={styles.modbody}>
                                        {blockedDates.find(item => item.date === selectedDay)?.reason}
                                    </Text>
                                </HStack>

                            </Modal.Body>

                        </Modal.Content>
                    </Modal>
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
        marginTop: 10,
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
    moduleHeader: {
        fontWeight: 'bold',
        color: '#054582',
        fontSize: 18,
        alignSelf: 'center',
        marginTop: 15,
        textTransform: 'uppercase',
    },
    dayContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    dateText: {
        textAlign: 'center',
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modHea: {
        alignSelf: "center",
        color: "#054582",
        fontSize: 18,
        fontWeight: "bold",
    },
    submodHea: {
        alignSelf: "center",
        color: "gray",
        fontSize: 12,

    },
    modbody: {

        color: "gray",
        fontSize: 15,



    }

});

export default Notify;
