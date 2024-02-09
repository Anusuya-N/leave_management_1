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
import { Button, Select, Radio, HStack, Input, VStack, Box } from 'native-base';
import Sidebar from '../layout/SideBar';
import { useAuth } from '../context/AuthContext';
import Header from '../layout/header';




export default function cancelLeave({ navigation }) {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [leaveData, setLeaveData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const { email } = useAuth()
    const [selectedYear, setSelectedYear] = useState(null);
    const [error, setError] = useState(null);
    const [submitBtn, setSubmitBtn] = useState(false);
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toISOString().split('T')[0];
    const [formStatus, setFormStatus] = useState(null);
    console.log('formattedCurrentDate: ', formattedCurrentDate);

    const months = [
        { label: 'January', value: 1 },
        { label: 'February', value: 2 },
        { label: 'March', value: 3 },
        { label: 'April', value: 4 },
        { label: 'May', value: 5 },
        { label: 'June', value: 6 },
        { label: 'July', value: 7 },
        { label: 'August', value: 8 },
        { label: 'September', value: 9 },
        { label: 'October', value: 10 },
        { label: 'November', value: 11 },
        { label: 'December', value: 12 },
    ];
    const years = [];
    for (let year = 2020; year <= 2040; year++) {
        years.push({ label: year.toString(), value: year.toString() });
    }


    const handleMonthSelect = (value) => {
        setSelectedMonth(value);
        // Perform any other actions needed when a month is selected
    };
    const toggleDrawer = () => {
        setIsDrawerVisible(!isDrawerVisible);
    };

    const onCloseDrawer = () => {
        setIsDrawerVisible(false);
    };
    const sampleData = [
        { id: 'Type1', type: '001', date: 'Item 1', days: '$10.99' },
        { id: 'Type1', type: '001', date: 'Item 1', days: '$10.99' },
        { id: 'Type1', type: '001', date: 'Item 1', days: '$10.99' },
        { id: 'Type1', type: '001', date: 'Item 1', days: '$10.99' },
        { id: 'Type1', type: '001', date: 'Item 1', days: '$10.99' },

        // Add more data as needed
    ];

    const leaveList = async () => {
        try {

            setSubmitBtn(true)

            const requestBody = {
                monthno: selectedMonth,
                yearno: selectedYear,
                NricID: email
            };

            console.log('requestBody: ', requestBody);

            const response = await fetch("http://118.189.74.190:1016/api/empleavelist", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const data = await response.json();

                console.log(data.Message)
                if (data.Message === "No Data Found") {
                    setError(data.Message)
                    setSubmitBtn(false)
                    setLeaveData([])

                }
                else {
                    const leaveList = data.empleave
                    setLeaveData(leaveList)
                    setError(null)
                    console.log('data: ', data);
                }


            } else {
                console.error("API request failed with status:", response.status);
            }
        } catch (error) {
            console.error("Error occurred during API request:", error);
        }
    };
    const cancelLeaves = async (selectedItem) => {
        try {
            const dateParts = selectedItem.split(' ')[0].split('/');
            const formattedDate = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
            console.log('Formatted Date:', formattedDate);

            // Now `formattedDate` contains the date in "YYYY-MM-DD" format
            // Perform cancellation logic here


            const requestBody = {
                NricID: email,
                AppDateFrom: formattedDate,
                Status: "Cancel Pending",
                Remarks: ""
            }

            console.log('requestBody: ', requestBody);

            const response = await fetch("http://118.189.74.190:1016/api/empcancelleaveupd ", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const data = await response.json();
                const submitForm = data.Status
                setFormStatus(submitForm)
                console.log('data: ', data);

            } else {
                console.error("API request failed with status:", response.status);
            }
        } catch (error) {
            console.error("Error occurred during API request:", error);
        }
    };

    return (
        <>
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
                        <Text style={styles.moduleHea}>cancel leave</Text>
                        <View>
                            <Text style={styles.label}>Select Month</Text>
                            <Select
                                selectedValue={selectedMonth}
                                minWidth={200}
                                placeholder="Select Month"
                                onValueChange={(itemValue) => handleMonthSelect(itemValue)}
                            >
                                {months.map((month) => (
                                    <Select.Item key={month.value} label={month.label} value={month.value} />
                                ))}
                            </Select>

                            <Text style={styles.label}>Select Year</Text>
                            <Select
                                selectedValue={selectedYear}
                                minWidth={200}
                                placeholder="Select Year"
                                onValueChange={(itemValue) => setSelectedYear(itemValue)}
                            >
                                {years.map((year) => (
                                    <Select.Item key={year.value} label={year.label} value={year.value} />
                                ))}
                            </Select>
                            {formStatus === "Succcess" ? (
                                <Text style={styles.succMsg}>Selected leave cancelled Successfully</Text>
                            ) : null}
                            {selectedMonth && selectedYear && (
                                <Button mt={5} onPress={leaveList} style={{ backgroundColor: "#054582" }} alignSelf={"center"} width={150} >
                                    <Text style={{ color: "white" }}>SUBMIT</Text>
                                </Button>

                            )}

                            {error ? (
                                <><Text style={styles.err}>{error}</Text></>
                            ) : null}
                            {submitBtn && (
                                //   <Text style={styles.selectedMonthText}>
                                //     Selected Month: {selectedMonth}
                                //   </Text>
                                <View>
                                    <View style={styles.headerRow}>
                                        <HStack space={2}>
                                            <Image
                                                // style={styles.menuIcon}
                                                source={require('../../assets/Cancel/emp.png')}
                                            />
                                        </HStack>
                                        <Text style={styles.headerCell}> Id</Text>
                                        <Image
                                            // style={styles.menuIcon}
                                            source={require('../../assets/Cancel/type.png')}
                                        />
                                        <Text style={styles.headerCell}> Type</Text>

                                        <Image
                                            // style={styles.menuIcon}
                                            source={require('../../assets/Cancel/count.png')}
                                        />
                                        <Text style={[styles.headerCell, { marginHorizontal: 4 }]}>Days</Text>

                                        <Image
                                            // style={styles.menuIcon}
                                            source={require('../../assets/Cancel/date.png')}
                                        />
                                        <Text style={[styles.headerCell, { marginHorizontal: 4 }]}>Date</Text>
                                        <Text style={styles.headerCell}></Text>
                                    </View>
                                    {leaveData.map((item, index) => {
                                        // Format LeaveDate in "YYYY-MM-DD" format
                                        const dateParts = item.LeaveDate.split(' ')[0].split('/');
                                        const formattedLeaveDate = `${dateParts[2]}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;

                                        // Check if the formattedLeaveDate is greater than or equal to formattedCurrentDate
                                        const isLeaveDateValid = formattedLeaveDate >= formattedCurrentDate;

                           



                                        return (
                                            <View style={styles.dataRow} key={index}>
                                                <Text style={styles.dataCell}>{email}</Text>
                                                <Text style={styles.dataCell}>{item.name}</Text>
                                                <Text style={styles.dataCell}>{item.Days}</Text>
                                                <Text style={styles.dataCell}>{item.LeaveDate}</Text>

                                                {isLeaveDateValid ? (
                                                    <TouchableOpacity
                                                        style={styles.cancelButton}
                                                        onPress={() => cancelLeaves(item.LeaveDate)}
                                                    >
                                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <TouchableOpacity
                                                        style={[styles.cancelButton, styles.disabledCancelButton]}
                                                        disabled={true} // Optionally, disable the button to prevent interactions
                                                    >
                                                        <Text style={[styles.cancelButtonText, styles.disabledCancelButtonText]}>Cancel</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        );
                                    })}

                                </View>
                            )}
                        </View>



                    </ScrollView>
                </KeyboardAvoidingView>
            </View >
        </>
    )
}

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

    moduleHea: {
        fontWeight: 'bold',
        color: '#054582',
        fontSize: 18,
        alignSelf: 'center',
        marginTop: 15,
        textTransform: 'uppercase',
    },
    borderLine: {
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: screenWidth,
    },
    selectedMonthText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#054582',
    },
    label: {
        color: '#000',
        marginLeft: 13,
        marginTop: 10,
        fontSize: 13,
    },
    headerRow: {
        marginTop: 20,
        flexDirection: 'row',
        backgroundColor: '#054582',
        padding: 8,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        width: 100,
        color: '#fff',
    },
    dataRow: {
        flexDirection: 'row',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    dataCell: {
        margin: 2,
        flex: 1,
        width: 100,
        fontSize: 13
    },
    cancelButton: {
        backgroundColor: 'red', // Change the background color as needed
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
    },
    cancelButtonText: {
        color: 'white', // Change the text color as needed
        fontWeight: 'bold',
    },
    err: {
        color: "red",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        fontWeight: "bold",
        marginTop: 5,
    },
    disabledCancelButton: {
        opacity: 0.5, // Adjust the opacity to make it visually appear disabled
    },
    disabledCancelButtonText: {

        color: 'gray',
    },
    succMsg: {
        color: "green",
        justifyContent: "center",
        alignSelf: "center",
        fontWeight: "bold",
        marginTop: 3,
    }


});