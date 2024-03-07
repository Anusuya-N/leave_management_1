
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions, TextInput, Platform, Linking, TouchableOpacity } from 'react-native';
import { Button, HStack, Modal, VStack } from "native-base";
import Sidebar from '../layout/SideBar';
import Header from '../layout/header';
import { Calendar } from 'react-native-calendars';
import { useAuth } from '../context/AuthContext';


const Notify = ({ navigation }) => {

    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');

    const [roaster, setRoaster] = useState([]);
    const [blockedDates, setBlockedDates] = useState([]);

    const { email, userStatus } = useAuth()
    const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1); // Initialize with the current month


    const handleMonthChange = (month) => {
        setCalendarMonth(parseInt(month.month, 10)); // Update calendarMonth when month changes
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://118.189.74.190:1016/api/roasterapi', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        BranchCode: userStatus
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setRoaster(data.roaster);
                    setBlockedDates(data.roaster);
                } else {
                    console.error('Error fetching user status');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userStatus]);

    const addEvent = (day) => {
        setSelectedDay(day.dateString);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const markedDatesObject = Object.fromEntries(
        blockedDates.map((item) => {
            const dateParts = item.LeaveDate.split(' ')[0].split('/');
            const formattedDate = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
            return [formattedDate, { marked: true, dotColor: 'red' }];
        })
    );


    const eventsCountByDate = blockedDates.reduce((acc, curr) => {
        acc[curr.date] = (acc[curr.date] || 0) + 1;
        return acc;
    }, {});



    const toggleDrawer = () => {
        setIsDrawerVisible(!isDrawerVisible);
    };

    const onCloseDrawer = () => {
        setIsDrawerVisible(false);
    };

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
        'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // const uniqueDates = [...new Set(blockedDates.map(dateData => dateData.date && dateData.date.split('-')[2]))];

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

                    <HStack style={{ justifyContent: "space-around", marginBottom: 15 }}>
                        <HStack>


                            <Image source={require("../../assets/Apply/green.png")} />
                            <Text style={{ color: "#000" }}>Approved</Text>
                        </HStack>
                        <HStack>
                            <Image source={require("../../assets/Apply/cal.png")} />
                            <Text style={{ color: "#000" }}>Pending</Text>
                        </HStack>

                    </HStack>

                    <HStack style={{ justifyContent: "space-around", marginBottom: 15 }}>
                        <HStack>

                            <Text style={styles.dotRed}>●</Text>


                            <Text style={{ color: "#000" }}>Employees on leave</Text>
                        </HStack>
                        <HStack>

                            <Text style={styles.dot}>●</Text>


                            <Text style={{ color: "#000" }}>Employees count on leave</Text>
                        </HStack>
                    </HStack>

                    <Calendar
                        onMonthChange={handleMonthChange}
                        markedDates={markedDatesObject}
                        onDayPress={addEvent}
                        markingType={'period'}
                        renderDay={(day, markedDates) => {
                            const date = day.dateString;
                            const marked = markedDates[date] && markedDates[date].selected;
                            const eventsCount = eventsCountByDate[date] || 0;
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

                    <View style={styles.cardsContainer}>
                        {blockedDates && blockedDates.length > 0 &&
                            Object.entries(
                                blockedDates
                                    .filter(item => {
                                        const leaveDateParts = item.LeaveDate.split(' ')[0].split('/');
                                        const month = parseInt(leaveDateParts[0], 10); // Extract month from LeaveDate
                                        return month === calendarMonth; // Filter by the calendar month
                                    })
                                    .reduce((accumulator, item) => {
                                        const leaveDateParts = item.LeaveDate.split(' ')[0].split('/');
                                        const monthAbbreviation = months[parseInt(leaveDateParts[0], 10) - 1]; // Get month abbreviation
                                        const formattedDay = leaveDateParts[1].padStart(2, '0'); // Get formatted day

                                        const formattedDate = `${monthAbbreviation} ${formattedDay}`;

                                        // If the formatted date is already in the accumulator, increment the count
                                        if (accumulator[formattedDate]) {
                                            accumulator[formattedDate]++;
                                        } else {
                                            // If not, initialize the count to 1
                                            accumulator[formattedDate] = 1;
                                        }

                                        return accumulator;
                                    }, {})
                            )
                                .map(([date, count], index) => (
                                    <View key={index} style={styles.cardBox}>
                                        <View style={styles.cardRound}>
                                            <Text style={styles.roundText}>{date}</Text>
                                        </View>
                                        <Text style={styles.boxText}>
                                            <Text style={styles.dot}>●</Text> Employee Count: {count}
                                        </Text>
                                    </View>
                                ))}
                    </View>





                    <Modal isOpen={isModalVisible} onClose={closeModal}>
                        <Modal.Content>
                            <Modal.CloseButton />
                            <Modal.Header >

                                <Text style={styles.modHea}>Event</Text>
                                <Text style={styles.submodHea}> {selectedDay}</Text>
                            </Modal.Header>
                            <Modal.Body style={{ alignItems: "center" }}>
                                {blockedDates && blockedDates.length > 0 ? (
                                    <>
                                        {blockedDates
                                            .filter(item => {
                                                const leaveDateParts = item.LeaveDate.split(' ')[0].split('/');
                                                const formattedLeaveDate = `${leaveDateParts[2]}-${leaveDateParts[0].padStart(2, '0')}-${leaveDateParts[1].padStart(2, '0')}`;
                                                const formattedSelectedDay = selectedDay.split(' ')[0]; // Assuming selectedDay is in the format "YYYY-MM-DD"
                                                return formattedLeaveDate === formattedSelectedDay;
                                            })
                                            .map((event, index) => (
                                                <View style={styles.leaveDetails} key={`${event.LeaveDate}-${index}`}>
                                                    {/* Display the Employee Name and Leave Code */}
                                                    <HStack space={3}>
                                                        {/* Display an image based on the leave status */}
                                                        {event.Status === 'pending' ? (
                                                            <Image source={require("../../assets/Apply/cal.png")} /> // Pending image
                                                        ) : (
                                                            <Image source={require("../../assets/Apply/green.png")} /> // Approved image
                                                        )}
                                                        <Text style={styles.leaveText}>{event.EmpName} ({event.LeaveCode})</Text>
                                                    </HStack>
                                                </View>
                                            ))
                                        }
                                        {blockedDates
                                            .filter(item => {
                                                const leaveDateParts = item.LeaveDate.split(' ')[0].split('/');
                                                const formattedLeaveDate = `${leaveDateParts[2]}-${leaveDateParts[0].padStart(2, '0')}-${leaveDateParts[1].padStart(2, '0')}`;
                                                const formattedSelectedDay = selectedDay.split(' ')[0]; // Assuming selectedDay is in the format "YYYY-MM-DD"
                                                return formattedLeaveDate === formattedSelectedDay;
                                            })
                                            .length === 0 && <Text style={styles.leaveText}>No leaves are blocked</Text>
                                        }
                                    </>
                                ) : (
                                    <Text style={styles.leaveText}>No leaves are blocked</Text>
                                )}
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
        width: 200



    },
    cardBox: {
        borderWidth: 1,
        borderColor: "#eee",
        backgroundColor: "#fff",
        margin: 25,
        height: 120,
        width: 150,



    },
    cardRound: {
        borderWidth: 2,
        borderColor: "#054582",
        backgroundColor: "#054582",
        marginVertical: 5,
        borderRadius: 100,
        height: 50,
        width: 50,
        alignSelf: "center"
    },
    roundText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },

    dot: {
        fontWeight: 'bold',
        color: '#054582',
        //  marginRight: 5, 
    },
    dotRed: {
        fontWeight: 'bold',
        color: 'red',
        //  marginRight: 5, 
    },

    boxText: {
        alignSelf: "center",
        color: "#000",




    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',

    },
    leaveDetails: {
        marginBottom: 10,
    },
    leaveText: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
        // alignSelf:"center"
    },

});

export default Notify;
