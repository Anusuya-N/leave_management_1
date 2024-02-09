import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions, KeyboardAvoidingView, Platform, Button } from 'react-native';
import Sidebar from '../layout/SideBar';
import { Box, Input, Select } from 'native-base';
import Header from '../layout/header';






const AttendanceDetails = ({ navigation, route }) => {

    const { selectedDate, displayedData } = route.params;
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const toggleDrawer = () => {
        setIsDrawerVisible(!isDrawerVisible);
    };

    const onCloseDrawer = () => {
        setIsDrawerVisible(false);
    };

    const dataForSelectedDate = displayedData.filter(entry => entry.Date === selectedDate);
    return (
        <View style={styles.container}>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <Sidebar isVisible={isDrawerVisible} onCloseDrawer={onCloseDrawer} navigation={navigation} />
                    <View>

                        <Header toggleDrawer={toggleDrawer} />

                    </View>
                    <Text style={styles.moduleHea}>Attendance Details</Text>


                    <View>
                        <Text style={styles.moduleHea}>  {selectedDate}</Text>
                        {dataForSelectedDate.map((entry, index) => (
                            <View key={index}>
                                <View>
                                    <Text style={styles.label}>Date</Text>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputText}>{entry.Date}</Text>
                                    </View>
                                    <Text style={styles.label}>Day</Text>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputText}>{entry.Day}</Text>
                                    </View>
                                    <Text style={styles.label}>In Time</Text>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputText}>{entry.ClockIn}</Text>
                                    </View>
                                    <Text style={styles.label}>In Image</Text>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: `data:image/jpeg;base64,${entry.InImage}` }}
                                    />
                                    <Text style={styles.label}>Out Time</Text>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputText}>{entry.ClockOut}</Text>
                                    </View>
                                    <Text style={styles.label}>Out Image</Text>
                                    <Image
                                        style={styles.image}
                                        source={{ uri: `data:image/jpeg;base64,${entry.OutImage}` }}
                                    />
                                </View>



                            </View>
                        ))}
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
    menuImg: {
        marginTop: 60,
        marginLeft: 20,
        height: 25,
        width: 35,
    },
    borderLine: {
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
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
    image: {
        width: 100, // Set your desired width
        height: 100, // Set your desired height
        alignSelf: "center",
        marginTop: 20
    },
    label: {
        color: 'gray',
        marginLeft: 13,
        marginTop: 10,
        fontSize: 15,
        fontWeight: "bold"
    },
    inputContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingVertical: 10,
        marginLeft: 13,
    },
    inputText: {
        fontSize: 14,
    },

});
export default AttendanceDetails;
