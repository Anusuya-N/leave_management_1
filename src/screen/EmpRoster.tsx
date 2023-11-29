import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    Image,
    StyleSheet,
    TextInput,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { Button, Select, Radio, HStack, Input, VStack, Box, Modal } from 'native-base';
import Sidebar from '../layout/SideBar';
import { Calendar } from 'react-native-calendars';
import { useAuth } from '../context/AuthContext';
import Header from '../layout/header';






const EmpRoster = ({ navigation }) => {
    const { email, userStatus } = useAuth()
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [events, setEvents] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [eventName, setEventName] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const toggleDrawer = () => {
        setIsDrawerVisible(!isDrawerVisible);
    };

    const onCloseDrawer = () => {
        setIsDrawerVisible(false);
    };
    useEffect(() => {
        // Dummy data for testing
        const dummyData = {
            '2023-11-20': [
                { name: 'John', description: 'On Leave', status: "Out of Office" },
                { name: 'Jane', description: 'Working remotely', status: "Work from Home" },
            ],
            '2023-11-21': [
                { name: 'Bob', description: 'In the office', status: "Available" },
            ],
            // Add more dummy data as needed
        };

        setEvents(dummyData);
    }, []);
    const addEvent = (day) => {

        setSelectedDay(day.dateString);
        setIsModalVisible(true);
    };

    const saveEvent = () => {
        const newEvent = {
            name: eventName,
            description: `Start Time: ${startTime}, End Time: ${endTime}`,
        };

        setEvents((prevEvents) => {
            const existingEvents = prevEvents[selectedDay] || [];
            return {
                ...prevEvents,
                [selectedDay]: [...existingEvents, newEvent],
            };
        });

        setIsModalVisible(false);
        setEventName('');
        setStartTime('');
        setEndTime('');
    };


    const data = [
        { day: 'Nov 20, 2023', event: 'Five employees are there in office ' },
        { day: 'Dec 5, 2023', event: 'Five of the employees are out of office' },
        { day: 'Jan 15, 2024', event: 'Two of them is there in meeting' },
        { day: 'Feb 3, 2024', event: 'One employee is unavailable' },
        { day: 'Feb 3, 2024', event: 'One employee is unavailable' },

        // Add more sample data as needed
    ];


    return (
        <View style={styles.container}>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }} // Set flex to 1 to allow the content to expand
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled" // Allow scrolling even when keyboard is visible
                >
                    <Sidebar isVisible={isDrawerVisible} onCloseDrawer={onCloseDrawer} navigation={navigation} />
                    <View>

                        <Header toggleDrawer={toggleDrawer} />

                    </View>
                    <Text style={styles.moduleHea}>employee roster</Text>


                    <View style={styles.content}>
                        <Calendar
                            markedDates={{
                                ...events,
                                [selectedDay]: {
                                    selected: true,
                                    selectedColor: '#44a6c6',
                                },
                            }}
                            onDayPress={addEvent}
                        />

                        <Text style={styles.moduleHea}>events</Text>
                        <View style={styles.mainCard}>
                            {data.map((data) => (
                                <View style={styles.customerItem}>
                                    <View style={[styles.dateContainer, { backgroundColor: '#6972b1' }]}>
                                        <Text style={styles.customerText}>
                                            {data.day}
                                        </Text>
                                    </View>
                                    <View >
                                        <Text style={styles.customerSubText}>
                                            {data.event}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>









                        <Modal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
                            <Modal.Content>
                                <Modal.Header>
                                    <Text style={styles.modalText} >Events in {selectedDay}</Text>
                                </Modal.Header>
                                <Modal.Body>
                                    {events[selectedDay] && events[selectedDay].map((event, index) => (
                                        <View key={index} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
                                            <Text>Name :{event.name}</Text>
                                            <Text> Description :{event.description}</Text>
                                            <Text> Status :{event.status}</Text>
                                        </View>
                                    ))}


                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onPress={() => setIsModalVisible(false)}>
                                        <Text >Close</Text>
                                    </Button>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>




                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
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
    radioGroup: {
        marginTop: 30,
        alignItems: 'center',
    },
    radio: {
        alignSelf: 'center',
    },
    label: {
        color: '#000',
        marginLeft: 13,
        marginTop: 10,
        fontSize: 13,
    },
    Nlabel: {
        color: 'gray',
        marginLeft: 14,
        marginTop: 10,
        fontSize: 11,

    },
    textInput: {
        width: '100%',
        height: 40,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingLeft: 10,
    },
    applyBtn: {
        backgroundColor: '#054582',
        width: 150,
        alignSelf: 'center',
    },
    borderLine: {
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: screenWidth,
    },
    moduleHea: {
        fontWeight: 'bold',
        color: '#054582',
        fontSize: 18,
        alignSelf: 'center',
        marginTop: 15,
        textTransform: 'uppercase',
    },
    calendar: {
        borderWidth: 1,
        borderColor: '#eeee',
        height: 350,
        marginTop: 10,
    },
    dateSelection: {
        alignItems: 'center',
        margin: 20,
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#eee',
        padding: 10,
        margin: 5,
    },
    selectedButton: {
        backgroundColor: '#0074d9',
    },
    sendButton: {
        backgroundColor: '#0074d9',
        padding: 10,
        margin: 20,
    },
    buttonText: {
        color: 'white',
    },
    succMsg: {
        color: "green",
        justifyContent: "center",
        alignSelf: "center",
        fontWeight: "bold",
        marginTop: 3,
    },
    card: {
        // Set the width of the card as needed

        height: "30%",
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10, // Add border radius to the entire card
        // Ensure the border radius is applied correctly
    },

    redText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },


    modalText: {
        fontWeight: "bold"
    },
    customerItem: {
        flexDirection: 'column', // Set flexDirection to row to align date and event horizontally
        height: 200,
        width: "40%",
        marginBottom: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 15,


    },

    dateContainer: {
        width: 70,  // Set the width and height to make it a perfect circle
        height: 70, // You can adjust the size based on your preference
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        borderColor: "gray",
        margin: "3%",
        backgroundColor: '#6972b1',
        borderRadius: 50,  // Set the border radius to half of the width (or height)
    },




    customerText: {
        fontWeight: 'bold',
        color: '#fff',
        alignSelf: 'center',
        textAlign: 'center',

    },

    customerSubText: {
        fontSize: 15,
        fontWeight: "bold",
        textAlign: 'center',
        color: "#000"
    },
    mainCard: {
        flexDirection: 'row', // Set the flexDirection to 'row' to display cards in a row format
        flexWrap: 'wrap',     // Allow items to wrap to the next row if needed
        justifyContent: 'space-evenly',
        margin: "3%",
    }

});

export default EmpRoster;
