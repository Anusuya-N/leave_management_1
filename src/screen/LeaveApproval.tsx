import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions, TextInput, Platform, Linking } from 'react-native';
import { Button, HStack, VStack, Modal } from "native-base";
import Sidebar from '../layout/SideBar';
import Header from '../layout/header';
import { useAuth } from '../context/AuthContext';


const Notify = ({ navigation }) => {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [approval, setApproval] = useState([]);
    // console.log('approval: ', approval);
    const { email } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];



    //     const date = new Date(2024, 2, 5); // Note: Months are 0-based, so 2 represents March
    // const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    // const dayOfWeek = daysOfWeek[date.getDay()];

    // Output: Tuesday

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://118.189.74.190:1016/api/approverleavelist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        NricID: email
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setApproval(data.list)
                } else {
                    console.error('Error fetching user status');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [email]);


    const formatDate = (dateString) => {
        const dateParts = dateString.split(" ")[0].split("/");
        const year = dateParts[2];
        const month = String(dateParts[0]).padStart(2, '0');
        const day = String(dateParts[1]).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };





    const leaveUpdate = async (nricID, leaveDate, status) => {
        const formattedDate = formatDate(leaveDate);
        console.log('formattedDate: ', formattedDate);
        try {
            const requestBody = {
                NricId: nricID,
                Date: formattedDate,
                Status: status
            };

            console.log('requestBody: ', requestBody);

            const response = await fetch("http://118.189.74.190:1016/api/approverleaveupd", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const data = await response.json();

                console.log(data.Status)
                if (data.Status == "Succcess") {
                    toggleModal();
                }

                else {

                }

            } else {
                console.error("API request failed with status:", response.status);
            }
        } catch (error) {
            console.error("Error occurred during API request:", error);
        }
    };



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

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const getDateParts = (leaveDate) => {
        const leaveDateParts = leaveDate.split(' ')[0].split('/');
        const monthIndex = parseInt(leaveDateParts[0], 10) - 1; // Subtract 1 to convert to 0-based index
        const month = monthNames[monthIndex];
        const day = parseInt(leaveDateParts[1], 10);
        const year = parseInt(leaveDateParts[2], 10);
        return { month, day, year };
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
                        <Image source={require("../../assets/Apply/all.png")} />
                        <Pressable onPress={handleSelectAll}>

                            <Text style={styles.allText}>  Select All</Text>

                        </Pressable>
                        {/* <Button onPress={handleApproveSelected}>Approve Selected</Button> */}
                    </View>
                    {approval.map((leave, index) => {
                        const { month, day, year } = getDateParts(leave.LeaveDate);
                        const numericMonth = monthsOfYear.indexOf(month.substring(0, 3)); // Get numerical representation of month
                        const date = new Date(year, numericMonth, day);
                        const dayOfWeek = daysOfWeek[date.getDay()];



                        return (
                            <View key={index} style={styles.boxlist}>
                                <HStack style={styles.hstack}>
                                    <Pressable style={{ alignSelf: "center" }} onPress={() => handleToggleSelect(leave.id)}>
                                        <Image source={leave.selected ? require("../../assets/Apply/select.png") : require("../../assets/Apply/unselect.png")} />
                                    </Pressable>
                                    <View style={[styles.calendar, index % 2 !== 0 ? { borderColor: "#7CB9E8" } : null]}>
                                        <Text style={[styles.month, index % 2 !== 0 ? styles.evenMonth : null]}>{month}</Text>
                                        <View>
                                            <Text style={[styles.date, index % 2 !== 0 ? { color: "#7CB9E8" } : null]}>{day}</Text>
                                            <Text style={[styles.year, index % 2 !== 0 ? { color: "#7CB9E8" } : null]}>{year}</Text>
                                            <Text style={{ alignSelf: "center" }} >{dayOfWeek}</Text>

                                        </View>

                                    </View>

                                    <VStack>
                                        <View style={styles.empDetails} >
                                            <Text style={styles.name}>{leave.EmpName} </Text>
                                            <Text>({leave.LTypeName})</Text>
                                            <Text style={styles.subText}>Role: {leave.Designation} </Text>
                                            {/* <Text>Leave Type:  <Text style={styles.subLeaveType}>{leave.LTypeName}</Text>  </Text> */}
                                            <Text>Reason: {leave.Reason} </Text>
                                        </View>
                                        <HStack style={{ justifyContent: "space-evenly" }}>
                                            <Pressable onPress={() => leaveUpdate(leave.NricID, leave.LeaveDate, "approved")}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image source={require("../../assets/Apply/approval.png")} />

                                                    <Text style={styles.approvalbtn}>Accept</Text>
                                                </View>
                                            </Pressable>
                                            <Pressable onPress={() => leaveUpdate(leave.NricID, leave.LeaveDate, "rejected")}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image source={require("../../assets/Apply/cancel.png")} />
                                                    <Text style={styles.approvalbtn}>Reject</Text>
                                                </View>
                                            </Pressable>
                                        </HStack>
                                    </VStack>
                                </HStack>
                            </View>
                        );
                    })}
                    <Modal isOpen={modalVisible} onClose={toggleModal}>
                        <Modal.Content>
                            <Modal.CloseButton />
                            {/* <Modal.Header>Modal Title</Modal.Header> */}
                            <Modal.Body>
                                <Text style={styles.succ}>Updated Successfully</Text>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onPress={toggleModal}>
                                    <Text>Close</Text>
                                </Button>
                            </Modal.Footer>
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
        height: 100,
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
    subLeaveType: {
        color: "gray",
        fontSize: 12,
    },
    buttonsContainer: {
        flexDirection: 'row',
        margin: 10,

    },
    approvalbtn: {
        color: "#000",
        alignSelf: "center",
        fontSize: 12,
        textDecorationLine: "underline"
    },
    allText: {
        alignSelf: "center",
        fontWeight: "bold",
        color: "#000",

    },
    empDetails: {
        // backgroundColor:"red",
        width: 200
    },
    succ: {
        color: "green",
        fontWeight: "bold",
    },
    dayofweek: {
        fontWeight: "bold",
        color: "#000",
        padding: 15
    }
});

export default Notify;
