import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions, Image, Pressable, Platform, TouchableOpacity, PermissionsAndroid, Alert, Linking, TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import { Button, HStack, VStack } from "native-base";
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Home from "../screen/home";


import Sidebar from '../layout/SideBar';
import { useAuth } from '../context/AuthContext';
import Header from '../layout/header';
import { decode } from 'base-64';
import { navigation } from '../navigator';

const AttendanceClockScreen = ({ navigation, route }) => {

    const photoData = route.params?.base64Data || null;
    // console.log('photoData: ', photoData);
    const { email, password, userStatus } = useAuth();

    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [displayedData, setDisplayedData] = useState([]);
    const [submit, setSubmit] = useState(null);
    const [sub, setSub] = useState(null);
    const [inLatitude, setInLatitude] = useState(null);
    // console.log('inLatitude: ', inLatitude);

    const [inLocation, setInLocation] = useState('');
    // console.log('inLocation: ', inLocation);


    // Callback function to receive location data from LocationScreen
    const handleLocationData = (inLat, inLoc) => {
        setInLatitude(inLat);

        setInLocation(inLoc);

    };

    const [imageData, setImageData] = useState(null);
    console.log('imageData: ', imageData);





    const [showAll, setShowAll] = useState(false);

    const currentDate = new Date();
    const timeUpdate = async () => {
        const isClockIn = !displayedData.some(entry => entry.ClockIn && isToday(entry.Date));
        const formattedDate = currentDate.toISOString().split('T')[0];
        const formattedTime = currentDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        try {

            setSub("Please wait while submitting....")
            const requestBody = {
                Branch: userStatus,
                EmployeeID: email,
                InDate: formattedDate,
                InTime: isClockIn ? formattedTime : "",
                OutTime: isClockIn ? "" : formattedTime,
                outImage: isClockIn ? "" : photoData,
                InImage: isClockIn ? photoData : "",
                outlatitude: isClockIn ? "" : inLatitude,
                inlatitude: isClockIn ? inLatitude : "",
                inlocation: isClockIn ? inLocation : "",
                outlocation: isClockIn ? "" : inLocation,

            };
            console.log('requestBody: ', requestBody);


            const response = await fetch("http://118.189.74.190:1016/api/emptimeupdate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                setSubmit("Updated Successfully")
                // setTimeout(() => {
                //     navigation.navigate('Home'); // Replace 'Home' with your actual home page route
                // }, 2000);
                const data = await response.json();
                // console.log('data: ', data);
                if (data.Status === "Succcess") {

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
        finally {
            setSub("")
        }
    };
    // const handleSuccessAndNavigation = () => {
    //     // Update the submit state to show the success message
    //     setSubmit("Updated Successfully");

    //     // Navigate to the home page after a delay (adjust the delay as needed)
    //     setTimeout(() => {
    //         navigation.navigate('Home'); // Replace 'Home' with your actual home page route
    //     }, 3000); // 2000 milliseconds (2 seconds) delay as an example
    // };

    const attendanceList = async () => {
        try {
            const requestBody = {
                Branch: userStatus,
                EmployeeId: email,
                InDate: "2024-02-01",
                Type: "Inv"
            };

            const response = await fetch("http://118.189.74.190:1016/api/attendancelistapi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.attentence && data.attentence.length > 0) {
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
                }
                // Check if data.attendance is defined before mapping
                // Handle the response data as needed
            } else {
                console.error("API request failed with attendance:", response.status);
            }
        } catch (error) {
            console.error("Error occurred during API request:", error);
        }
        finally {
            // Set loading to false once the request is completed (whether successful or not)
            setLoading(false);
        }
    };

    useEffect(() => {
        attendanceList();
    }, []);


    const handleRowPress = (selectedDate) => {
        navigation.navigate("AttendanceDetails", { selectedDate, displayedData });
    };





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




    const initialRowCount = 7;
    const toggleShowAll = () => {
        setShowAll(!showAll);
    };
    const renderViewButton = () => {
        if (displayedData.length > 7) {
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
        } else {
            return null; // Hide the button if there are 7 or fewer items
        }
    };

    const todayEntry = displayedData.find(
        entry => entry.ClockIn && isToday(entry.Date)
    );

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
                                {photoData || (todayEntry && todayEntry.ClockOut !== todayEntry.ClockIn) || !inLocation || !inLatitude ? (
                                    <></>

                                ) : <Button
                                    style={[
                                        styles.checkIn,
                                        {
                                            backgroundColor: displayedData.some(
                                                entry => entry.ClockIn && isToday(entry.Date)
                                            ) || displayedData.some(
                                                entry => entry.ClockIn && isToday(entry.Date) && entry.ClockIn !== entry.ClockOut
                                            )
                                                ? 'red'
                                                : 'green',
                                        },
                                    ]}
                                    onPress={() => {


                                        if (todayEntry && todayEntry.ClockOut !== todayEntry.ClockIn) {
                                            // If ClockIn and ClockOut have different times, do nothing (button not pressable)
                                            return;
                                        }

                                        navigation.navigate('CameraScreen');
                                    }}
                                    disabled={displayedData.some(
                                        entry => entry.ClockIn && isToday(entry.Date) && entry.ClockIn !== entry.ClockOut
                                    )}
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


                        {imageData && (
                            <Image
                                source={{ uri: imageData }}
                                style={{ width: 200, height: 200 }}
                            />
                        )}


                        <LocationScreen navigation={navigation} onLocationData={handleLocationData} />
                        {/* <Image source={{ uri: `data:image/jpeg;base64,${photoData}` }} style={styles.previewImage} /> */}
                        {photoData ? (
                            <Button mt={3} onPress={
                                timeUpdate}>
                                Submit
                            </Button>
                        ) : null}
                        <Text style={styles.succMsg}>{sub}</Text>
                        {submit && <Text style={styles.succMsg}>
                            {submit}</Text>}


                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontWeight: "bold", marginLeft: 5 }}>Clock In / Clock Out Status</Text>
                            <View >
                                <View style={styles.header}>
                                    <Text style={styles.headerText}>Date</Text>
                                    <Text style={styles.headerText}>Day</Text>
                                    <Text style={styles.headerText}>Clock In</Text>
                                    <Text style={styles.headerText}>Clock Out</Text>
                                </View>
                                {loading && <Text style={{ alignSelf: "center", fontWeight: "bold" }}>Loading...</Text>}
                                {!loading && displayedData.length === 0 && <Text style={{ alignSelf: "center", fontWeight: "bold", color: "red" }}>No data found</Text>}
                                {!loading && displayedData.length > 0 && (
                                    <View>
                                        {displayedData.slice(0, showAll ? displayedData.length : initialRowCount).map((entry, index) => (
                                            <TouchableWithoutFeedback key={index} onPress={() => handleRowPress(entry.Date)}>
                                                <View style={styles.row} key={index}>
                                                    <View style={styles.dateContainer}>
                                                        <Text style={styles.date}>{entry.Date}</Text>
                                                        <Text style={styles.timeBelow}>{entry.ClockIn}</Text>
                                                    </View>
                                                    <Text style={styles.cell}>{entry.Day}</Text>
                                                    <Text style={[styles.cell, styles.clockIn]}>{entry.ClockIn}</Text>
                                                    <Text style={[styles.cell, styles.clockOut]}>{entry.ClockOut}</Text>
                                                    {/* Uncomment the Image component when ready to display images */}
                                                    {/* <Image
                                style={styles.image}
                                source={{ uri: `data:image/jpeg;base64,${entry.InImage}` }}
                            /> */}
                                                </View>
                                            </TouchableWithoutFeedback>
                                        ))}
                                    </View>
                                )}
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
        color: 'gray',

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
        color: 'gray',
    },
    timeBelow: {
        color: 'gray',
    },
    cell: {
        flex: 1,
        color: 'gray',
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
    succMsg: {
        color: "green",
        justifyContent: "center",
        alignSelf: "center",
        fontWeight: "bold",
        marginTop: 2,
    },
    loader: {
        position: 'relative',
        width: 240,
        height: 130,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#d3d3d3',
        padding: 15,
        backgroundColor: '#e3e3e3',
        overflow: 'hidden',
      },
      gradient: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        borderBottomColor: 'rgba(255, 255, 255, 0.5)',
        borderBottomWidth: 130, // Height of the loader
      },
      wrapper: {
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: 2,
       
      },
      element: {
        backgroundColor: '#cacaca',
      },
      circle: {
        width: 25,
        height: 25,
        borderRadius: 25,
        marginBottom: 10,
      },
      line: {
        height: 7,
        backgroundColor: '#cacaca',
        position: 'absolute',
      },
      line1: {
        top: 11,
        left: 40,
        width: 100,
      },
      line2: {
        top: 45,
        left: 40,
        width: 140,
      },
      line3: {
        top: 80,
        left: 40,
        width: 170,
      },
});

export default AttendanceClockScreen;


const LocationScreen = ({ navigation, onLocationData }) => {
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);


    const translateX = useRef(new Animated.Value(-240)).current; // Initial value adjusted to move the shine from left to right

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: 240, // Adjusted to the width of the loader
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => {
      animation.stop();
    };
  }, []);


    useEffect(() => {
        const options = {
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 10000,
        };

        const requestLocationPermission = async () => {
            try {
                const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
                if (result === 'granted') {
                    return true;
                } else {
                    throw new Error('Location permission denied.');
                }
            } catch (err) {
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
                    onLocationData(latitude, result.display_name);
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

                Alert.alert(
                    'Location Services Unavailable',
                    'Please make sure your device has location services enabled.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                console.log('OK Pressed');

                                navigation.navigate('Home');
                            },
                        },
                        //   {
                        //       text: 'Enable Location',
                        //       onPress: () => openDeviceLocationSettings(),
                        //   },
                    ]
                );
            }
        };


        const watchLocation = async () => {
            try {
                const hasPermission = await requestLocationPermission();
                if (hasPermission) {
                    const watchId = Geolocation.watchPosition(
                        position => {
                            // console.log('Location Success:', position);
                            setLocation(position.coords);
                            fetchAddress(position.coords.latitude, position.coords.longitude);
                            onLocationData(position.coords.latitude, address);
                        },
                        err => {
                            console.log('Location Error:', err);
                            handleLocationError(err);
                        },
                        options
                    );

                    // Return the watchId so it can be cleared later
                    return watchId;
                } else {
                    throw new Error('Location permission not granted.');
                }
            } catch (err) {
                console.log('Error watching location:', err);
                setError('Error watching location: ' + err.message);
                return null; // Return null in case of an error
            }
        };

        // Start watching location
        const watchIdPromise = watchLocation();

        // Cleanup function
        return () => {
            watchIdPromise.then(watchId => {
                if (watchId !== null) {
                    Geolocation.clearWatch(watchId); // Clear the watch when the component unmounts
                }
            });
        };
    }, []); // Empty dependency array means this effect runs once when the component mounts


    return (
        <View style={{ marginTop: 5, alignItems: 'center' }}>
            {error ? (
                <Text>{error}</Text>
            ) : location ? (
                <View style={styles.location}>
                    <View style={styles.hStack}>
                        <Image source={require('../../assets/Attendance/lat.png')} />
                        <Text style={{color:"gray"}}>Latitude: {location.latitude}</Text>
                    </View>
                    <View style={styles.hStack}>
                        <Image source={require('../../assets/Attendance/lon.png')} />
                        <Text style={{color:"gray"}}>Longitude: {location.longitude}</Text>
                    </View>
                    <View style={styles.hStack}>
                        <Image source={require('../../assets/Attendance/location.png')} />
                        <Text style={{color:"gray"}}>Address: {address}</Text>
                    </View>
                   
                </View>
            ) : (
                // <Text>Loading location...</Text>
                <>
                    <View style={styles.loader}>
                        <Animated.View
                            style={[
                                styles.gradient,
                                {
                                    transform: [{ translateX: translateX }],
                                },
                            ]}
                        />
                        <View style={styles.wrapper}>
                            <View style={[styles.circle, styles.element]} />
                            <View style={[styles.line, styles.line1]} />
                            <View style={[styles.circle, styles.element]} />
                            <View style={[styles.line, styles.line2]} />
                            <View style={[styles.circle, styles.element]} />
                            <View style={[styles.line, styles.line3]} />
                        </View>
                    </View>
                </>
            )}
            {/* Rest of your component JSX */}
        </View>

    );
};



























