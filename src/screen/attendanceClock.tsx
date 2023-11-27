import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions, Image, Pressable, Platform, TouchableOpacity } from 'react-native';
import { Button, HStack, VStack } from "native-base";
import * as Location from 'expo-location';

import Sidebar from '../layout/SideBar';
import { useAuth } from '../context/AuthContext';

const AttendanceClockScreen = ({ navigation }) => {
    const { email, password, userStatus } = useAuth();
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);
    const LeaveHeader = ({ toggleDrawer }) => {
        return (
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
        );
    };
    const currentDate = new Date();
    const timeUpdate = async () => {

        const formattedDate = currentDate.toISOString().split('T')[0];
        const formattedTime = currentDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        try {
            const requestBody = {
                Branch: userStatus,
                EmployeeID: email,
                InDate: formattedDate,
                InTime: formattedTime,
                OutTime: "",
                outImage: "",
                InImage: capturedPhoto,
            };
            console.log('InTime: ', requestBody.InTime);
            console.log('outImage: ', requestBody.outImage);
            console.log('OutTime: ', requestBody.OutTime);
            console.log('requestBody: ', requestBody);

            const response = await fetch("http://118.189.74.190:1016/api/emptimeupdate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('data: ', data);
                // Handle the response data as needed
            } else {
                console.error("API request failed with status:", response.status);
            }
        } catch (error) {
            console.error("Error occurred during API request:", error);
        }
    };


    const initialRowCount = 3;

    const handleCapturePicture = (photoUri) => {
        setCapturedPhoto(photoUri);
    };



    const toggleDrawer = () => {
        setIsDrawerVisible(!isDrawerVisible);
    };

    const onCloseDrawer = () => {
        setIsDrawerVisible(false);
    };


    const [data, setData] = useState([
        { date: '2023-08-23', day: 'Monday', clockIn: '09:00 AM', clockOut: '05:00 PM', timeBelow: '03:00 PM' },
        { date: '2023-08-24', day: 'Tuesday', clockIn: '08:30 AM', clockOut: '04:30 PM', timeBelow: '02:30 PM' },
        { date: '2023-08-25', day: 'Wednesday', clockIn: '08:30 AM', clockOut: '04:30 PM', timeBelow: '03:00 PM' },
        { date: '2023-08-26', day: 'Thursday', clockIn: '08:30 AM', clockOut: '04:30 PM', timeBelow: '02:45 PM' },
        { date: '2023-08-26', day: 'Friday', clockIn: '08:30 AM', clockOut: '04:30 PM', timeBelow: '02:45 PM' },
        { date: '2023-08-26', day: 'Saturday', clockIn: '08:30 AM', clockOut: '04:30 PM', timeBelow: '02:45 PM' },
        // Add more data as needed
    ]);

    // useEffect(() => {
    //     // You can use this effect to fetch data from an API and update the data state
    //     // For now, we're using the mock data in the initial state
    // }, []);

    const toggleShowAll = () => {
        setShowAll(!showAll);
    };
    const renderViewButton = () => {
        if (showAll) {
            return (
                <TouchableOpacity onPress={toggleShowAll} style={styles.viewMoreButton}>
                    <Text style={styles.viewMoreText}>View Less</Text>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={toggleShowAll} style={styles.viewMoreButton}>
                    <Text style={styles.viewMoreText}>View More</Text>
                </TouchableOpacity>
            );
        }
    };


    return (
        <View style={styles.container}>
            <LeaveHeader toggleDrawer={toggleDrawer} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingContainer}
            >
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContainer}>

                    <Sidebar isVisible={isDrawerVisible} onCloseDrawer={onCloseDrawer} navigation={navigation} />
                    <Text style={styles.moduleHea}>attendance clock</Text>
                    <View style={styles.content}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around', // You can adjust the alignment as needed
                                alignItems: 'center',
                                padding: 10,
                            }}
                        >
                            <View style={{ flex: 2 }}>
                                <Text style={styles.currentTime}>
                                    Current Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                </Text>
                                <Text style={styles.currentDate}>
                                    Current Date:
                                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                {capturedPhoto ? (
                                    <></>

                                ) : <Button style={styles.checkIn} onPress={() => navigation.navigate('CameraScreen', { onPictureTaken: handleCapturePicture })} >

                                    <Text style={styles.checkInTxt}>Clock In</Text>
                                </Button>}
                            </View>
                        </View>



                        <LocationScreen />


                        {capturedPhoto && (
                            <View style={styles.preview}>
                                <Image source={{ uri: `data:image/jpeg;base64,${capturedPhoto}` }} style={styles.previewImage} />
                            </View>
                        )}

                        <Button mt={3} onPress={timeUpdate}>Submit</Button>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontWeight: "bold", marginLeft: 5 }}>Clock In / Clock Out Status</Text>
                            <View >
                                <View style={styles.header}>
                                    <Text style={styles.headerText}>Date</Text>
                                    <Text style={styles.headerText}>Day</Text>
                                    <Text style={styles.headerText}>Clock In</Text>
                                    <Text style={styles.headerText}>Clock Out</Text>
                                </View>
                                {data.slice(0, showAll ? data.length : initialRowCount).map((entry, index) => (
                                    <View style={styles.row} key={index}>
                                        <View style={styles.dateContainer}>
                                            <Text style={styles.date}>{entry.date}</Text>
                                            <Text style={styles.timeBelow}>{entry.timeBelow}</Text>
                                        </View>
                                        <Text style={styles.cell}>{entry.day}</Text>
                                        <Text style={[styles.cell, styles.clockIn]}>{entry.clockIn}</Text>
                                        <Text style={[styles.cell, styles.clockOut]}>{entry.clockOut}</Text>
                                    </View>
                                ))}
                                {renderViewButton()}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const screenWidth = Dimensions.get('window').width;
let fontSize = 16;
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
        marginTop: 30,
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
    moduleHea: {
        fontWeight: "bold",
        color: "#054582",
        fontSize: 18,
        alignSelf: "center",
        marginTop: 20,
        textTransform: "uppercase"
    },
    checkIn: {
        backgroundColor: "green",
        marginTop: 30,
        height: 40,
    },
    checkInTxt: {

        fontSize: 12,
        color: "#fff",
        fontWeight: "bold",

    },
    selectedTime: {
        fontSize: 15,
        marginTop: 20,
        fontWeight: "bold",
        alignSelf: "center"
    },
    location: {
        borderColor: "gray",
        borderWidth: 1,
        height: Dimensions.get('window').height * 0.3, // Adjust the multiplier as needed
        width: screenWidth * 0.9,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,



    },
    currentTime: {
        fontSize: 14,
        marginTop: 20,
        fontWeight: "bold",

    },
    currentDate: {
        fontSize: 15,
        marginTop: 10,

    },
    hStack: {

        width: screenWidth * 0.8,
        marginBottom: "2%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap:2,


    },
    preview: {
        alignItems: 'center',
        marginTop: 20,
    },
    previewImage: {
        width: 300, // Adjust the width as needed
        height: 300, // Adjust the height as needed
        resizeMode: 'contain',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // borderBottomWidth: 1,
        paddingBottom: 5,
        marginBottom: 10,
        marginTop: 10,
        width: 390,


    },
    headerText: {
        fontWeight: 'bold',
        flex: 1,
        backgroundColor: "#eee",
        height: 30,

    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    dateContainer: {
        flexDirection: 'column',
        alignItems: 'center', // Center align text within the container
        paddingRight: 12,
    },
    date: {
        fontWeight: 'bold',
    },
    timeBelow: {
        color: 'gray',
    },
    cell: {
        flex: 1,
    },
    clockIn: {
        color: 'green',
    },
    clockOut: {
        color: 'red',
    },
    viewMoreButton: {

        alignItems: 'flex-end',
    },
    viewMoreText: {
        textDecorationLine: 'underline',

    },
});

export default AttendanceClockScreen;


const LocationScreen = () => {
    const [location, setLocation] = useState(null);
    const [locationName, setLocationName] = useState(null);
    const [error, setError] = useState(null);
    const [isLoadingLocationName, setIsLoadingLocationName] = useState(true);

    useEffect(() => {
        const fetchLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Permission to access location was denied');
                return;
            }

            try {
                let location = await Location.getCurrentPositionAsync({});
                setLocation(location.coords);

                const latitude = location.coords.latitude;
                const longitude = location.coords.longitude;

                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
                    latitude
                )}&lon=${encodeURIComponent(longitude)}`;

                const response = await fetch(url);
                const data = await response.json();
                if (data && data.display_name) {
                    setLocationName(data.display_name);
                }
            } catch (error) {
                // setError(error.message);
                setError("Permission to access location was denied");
            }

            setIsLoadingLocationName(false);
        };

        fetchLocation();
    }, []);

    return (
        <View style={{ marginTop: 5, alignItems: 'center' }}>
            {location ? (
                <View style={styles.location}>
                    <View style={styles.hStack}>
                        <Image source={require('../../assets/Attendance/lat.png')} />
                        <Text>Latitude: {location.latitude}</Text>
                    </View>
                    <View style={styles.hStack}>
                        <Image source={require('../../assets/Attendance/lon.png')} />
                        <Text>Longitude: {location.longitude}</Text>
                    </View>
                    <View style={styles.hStack}>
                        <Image source={require('../../assets/Attendance/location.png')} />
                        {isLoadingLocationName ? (
                            <Text>Loading location name...</Text>
                        ) : (
                            <Text>{locationName}</Text>
                        )}
                    </View>
                </View>
            ) : (
                <Text>Loading location...</Text>
            )}
            {error && <Text style={{ color: "red" }}>Error: {error}</Text>}
        </View>
    );
};



