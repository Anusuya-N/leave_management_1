import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions, Image, Pressable, Platform, TouchableOpacity, PermissionsAndroid, Alert, Linking } from 'react-native';
import { Button, HStack, VStack } from "native-base";
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Home from "../screen/home";


import Sidebar from '../layout/SideBar';
import { useAuth } from '../context/AuthContext';
import Header from '../layout/header';
import { navigation } from '../navigator';

const AttendanceClockScreen = ({ navigation, route }) => {

    const photoData = route.params?.base64Data || null;
    const { email, password, userStatus } = useAuth();
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [displayedData, setDisplayedData] = useState([]);

    const [showAll, setShowAll] = useState(false);
    const [submit, setSubmit] = useState(null)
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
                InImage: photoData,
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
                if (data.Status === "Succcess") {
                    setSubmit("Updated Successfully")
                }
                else {

                }
                // Inside the map function
                const processedData = data.attentence.map(entry => ({
                    ...entry,
                    Date: entry.Date,
                    Day: entry.Day,
                    ClockIn: entry.ClockIn,
                    ClockOut: entry.ClockOut,
                    InImage: entry.InImage,
                }));

                setDisplayedData(processedData);

                // Handle the response data as needed
            } else {
                console.error("API request failed with status:", response.status);
            }
        } catch (error) {
            console.error("Error occurred during API request:", error);
        }
    };

    const attendanceList = async () => {
        try {
            const requestBody = {
                Branch: userStatus,
                EmployeeId: email,
                InDate: "2024-02-01",
                Type: "Inv"

            };


            const response = await fetch("http://118.189.74.190:1016//api/attendancelistapi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const data = await response.json();

                // Inside the map function
                const processedData = data.attentence.map(entry => ({
                    ...entry,
                    Date: entry.Date,
                    Day: entry.Day,
                    ClockIn: entry.ClockIn,
                    ClockOut: entry.ClockOut,
                    InImage: entry.InImage,
                }));

                setDisplayedData(processedData);

                // Handle the response data as needed
            } else {
                console.error("API request failed with status:", response.status);
            }
        } catch (error) {
            console.error("Error occurred during API request:", error);
        }
    };

    useEffect(() => {
        attendanceList();
    }, [])

    useEffect(() => {
        // Check if there is at least one entry with a ClockIn for today
        const hasClockInForToday = displayedData.some(
          entry => entry.ClockIn && isToday(entry.DateIn)
        );
      
        // Log the result of isToday function for all entries
        displayedData.forEach(entry => {
          console.log('Entry Date:', entry.Date); // Log the date of the entry
          console.log('Is today:', isToday(entry.Date));
        });
      
        // Log ClockIn and DateIn values for all entries
        displayedData.forEach(entry => {
          console.log('ClockIn:', entry.ClockIn);
          console.log('DateIn:', entry.Date);
        });
      
        // Log the final button label based on the condition for at least one entry
        console.log('Button Label:', hasClockInForToday ? 'Clock Out' : 'Clock In');
      }, [displayedData]); // Make sure to include the dependencies if used inside useEffect
      
      
      
      

      const isToday = (dateString) => {
        if (!dateString) {
            return false; // Handle undefined date string
        }
    
        const today = new Date();
        const dateParts = dateString.split('/');
        const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
        
        return (
            today.getDate() === date.getDate() &&
            today.getMonth() === date.getMonth() &&
            today.getFullYear() === date.getFullYear()
        );
    };
    
    
    
 
    const initialRowCount = 3;





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

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingContainer}
            >
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContainer}>

                    <Sidebar isVisible={isDrawerVisible} onCloseDrawer={onCloseDrawer} navigation={navigation} />
                    <View>

                        <Header toggleDrawer={toggleDrawer} />

                    </View>
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
                                {photoData ? (
                                    <></>

                                ) :  <Button
                                style={styles.checkIn}
                                onPress={() => navigation.navigate('CameraScreen')}
                              >
                                <Text style={styles.checkInTxt}>
                                  {displayedData.some(entry => entry.ClockIn && isToday(entry.Date))
                                    ? 'Clock Out'
                                    : 'Clock In'}
                                </Text>
                              </Button>
                                }
                            </View>

                        </View>


                        <LocationScreen navigation={navigation} />



                        {photoData ? (
                            <Button mt={3} onPress={timeUpdate}>Submit</Button>
                        ) : null}


                        <Text style={{ color: 'green', alignItems: 'center', justifyContent: 'center', fontWeight: "bold" }}>
                            {submit}
                        </Text>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontWeight: "bold", marginLeft: 5 }}>Clock In / Clock Out Status</Text>
                            <View >
                                <View style={styles.header}>
                                    <Text style={styles.headerText}>Date</Text>
                                    <Text style={styles.headerText}>Day</Text>
                                    <Text style={styles.headerText}>Clock In</Text>
                                    <Text style={styles.headerText}>Clock Out</Text>
                                </View>
                                {displayedData.slice(0, showAll ? data.length : initialRowCount).map((entry, index) => (
                                    <View style={styles.row} key={index}>
                                        <View style={styles.dateContainer}>
                                            <Text style={styles.date}>{entry.Date}</Text>
                                            <Text style={styles.timeBelow}>{entry.ClockIn}</Text>
                                        </View>
                                        <Text style={styles.cell}>{entry.Day}</Text>
                                        <Text style={[styles.cell, styles.clockIn]}>{entry.ClockIn}</Text>
                                        <Text style={[styles.cell, styles.clockOut]}>{entry.ClockOut}</Text>
                                        {/* <Image
                                            style={styles.image}
                                            source={{ uri: `data:image/jpeg;base64,${entry.InImage}` }}
                                        /> */}
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
        color: "#000"

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
        gap: 2,


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
    image: {
        width: 100, // Set your desired width
        height: 100, // Set your desired height
    },
});

export default AttendanceClockScreen;













const LocationScreen = ({ navigation }) => {
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const requestLocationPermission = async () => {
            try {
                const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
                if (result === 'granted') {
                    console.log('Location permission granted');
                    return true;
                } else {
                    console.log('Location permission denied');
                    throw new Error('Location permission denied.');
                }
            } catch (err) {
                console.log('Request Location Permission Error:', err);
                return false;
            }
        };

        const fetchAddress = async (latitude, longitude) => {
            try {
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
                    latitude
                )}&lon=${encodeURIComponent(longitude)}`;

                const response = await fetch(url);
                const result = await response.json();

                if (result.display_name) {
                    setAddress(result.display_name);
                } else {
                    setAddress('Address not found');
                }
            } catch (err) {
                console.log('Reverse Geocoding Error:', err);
                setAddress('Error fetching address');
            }
        };

        const handleLocationError = err => {
            setError('Error fetching location: ' + err.message);

            if (err.code === 2) {
                // No location provider available
                Alert.alert(
                    'Location Services Unavailable',
                    'Please make sure your device has location services enabled.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                console.log('OK Pressed');
                                // Navigate back to the home page
                                navigation.navigate('Home'); // Replace 'Home' with your actual home page route
                            },
                        },
                        // {
                        //     text: 'Enable Location',
                        //     onPress: () => openDeviceLocationSettings(),
                        // },
                    ]
                );
            }
        };

        const checkAndFetchLocation = async () => {
            try {
                const hasPermission = await requestLocationPermission();
                if (hasPermission) {
                    Geolocation.getCurrentPosition(
                        position => {
                            console.log('Location Success:', position);
                            setLocation(position.coords);
                            fetchAddress(position.coords.latitude, position.coords.longitude);
                            setLoading(false);
                        },
                        err => {
                            console.log('Location Error:', err);
                            handleLocationError(err);
                            setLoading(false);
                        },
                        { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
                    );
                } else {
                    throw new Error('Location permission not granted.');
                }
            } catch (err) {
                console.log('Check and Fetch Location Error:', err);
                setError('Error checking or fetching location: ' + err.message);
                setLoading(false);
            }
        };

        checkAndFetchLocation();
    }, []);

    const openDeviceLocationSettings = () => {
        Linking.openURL('content://com.android.settings/settings/location');
    };



    return (
        <View style={{ marginTop: 5, alignItems: 'center' }}>
            {error ? (
                <Text>{error}</Text>
            ) : location ? (
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

                        <Text>{address}</Text>

                    </View>
                </View>
            ) : (
                <Text>Loading location...</Text>
            )}
            {/* Rest of your component JSX */}
        </View>
    );
};




























