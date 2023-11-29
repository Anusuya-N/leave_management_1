import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import Sidebar from '../layout/SideBar';
import { Box, FormControl, Input, Select, Button, HStack } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary } from 'react-native-image-picker';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Header from '../layout/header';







const ClaimPage = ({ navigation }) => {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [imageName, setImageName] = useState(null);

    const toggleDrawer = () => {
        setIsDrawerVisible(!isDrawerVisible);
    };

    const onCloseDrawer = () => {
        setIsDrawerVisible(false);
    };


    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [expandedPreview, setExpandedPreview] = useState(false);
    const [imageBase64, setImageBase64] = useState(null);



    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };





    const toggleExpandedPreview = () => {
        setExpandedPreview(!expandedPreview);
    };
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        checkCameraPermission();
    }, []);

    const checkCameraPermission = async () => {
        const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (result === RESULTS.DENIED) {
            requestCameraPermission();
        }
    };

    const requestCameraPermission = async () => {
        const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (result === RESULTS.GRANTED) {
            console.log('Photo library permission granted');
        } else {
            console.log('Photo library permission denied');
        }
    };

    const openImagePicker = () => {
        launchImageLibrary({ mediaType: 'mixed', includeBase64: true }, (response) => {
            if (response.didCancel) {
                console.log('Image picker was canceled');
            } else if (response.error) {
                console.error('Image picker error: ', response.error);
            } else {
                const uri = response.assets?.[0]?.uri || response.uri;
                const base64 = response.assets?.[0]?.base64 || response.base64;
                //   const uriParts = uri.split('/');
                //   const imageName = uriParts[uriParts.length - 1];

                //   setImageName( imageName );
                setImageBase64(base64)
                setSelectedImage(uri);

                // Now you can use the 'base64' variable for your purposes
                console.log('Base64 representation of the selected image:', base64);
            }
        });
    };
    return (
        <View style={styles.container}>
            =
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
                    <Text style={styles.moduleHea}>Claim page</Text>
                    <Box alignSelf={"center"}>
                        <FormControl mt={2}>
                            <View >
                                <Input
                                    variant="rounded"
                                    // value={userName}
                                    // onChangeText={setUserName}
                                    width="300px"
                                    placeholder="Username"
                                    type="text"

                                />
                            </View>

                        </FormControl>
                        <FormControl mt={2}>
                            <View >
                                <TouchableOpacity onPress={showDatepicker} style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Select Date"
                                        value={date.toDateString()}
                                        editable={false}
                                    />
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display="default"
                                        onChange={onDateChange}
                                    />
                                )}
                            </View>

                        </FormControl>
                        <FormControl mt={2}>
                            <View >
                                <Input
                                    variant="rounded"
                                    // value={userName}
                                    // onChangeText={setUserName}
                                    width="300px"
                                    placeholder="Supplier Name"
                                    type="text"

                                />
                            </View>

                        </FormControl>
                        <FormControl mt={2}>
                            <View >
                                <Input
                                    variant="rounded"
                                    // value={userName}
                                    // onChangeText={setUserName}
                                    width="300px"
                                    placeholder="Supplier Invoice No"
                                    type="text"
                                    keyboardType="numeric"

                                />
                            </View>

                        </FormControl>
                        <FormControl mt={2}>
                            <View >
                                <Input
                                    variant="rounded"
                                    // value={userName}
                                    // onChangeText={setUserName}
                                    width="300px"
                                    placeholder="Amount"
                                    keyboardType="numeric"
                                    type="text"

                                />
                            </View>

                        </FormControl>
                        {/* <FormControl mt={2}> */}

                        <Select mt={2} placeholder='Select Category' width="300px" variant="rounded">
                            <Select.Item label="aaa" value="aaa" />
                            <Select.Item label="bbb" value="bbb" />
                        </Select>
                        {/* </FormControl> */}
                        <FormControl mt={2}>
                            <View style={styles.inputContainer} >
                                <TextInput
                                    style={styles.inputDesc}
                                    multiline={true}
                                    placeholder="Description"



                                />
                            </View>

                        </FormControl>


                        {selectedImage && (
                            <><Text style={{ marginTop: 5, alignSelf: "center" }}>{imageName}</Text>

                                <TouchableOpacity>
                                    <Text onPress={toggleExpandedPreview} style={{ marginTop: 5, alignSelf: "center", textDecorationLine: 'underline', color: "green" }}>Preview</Text>
                                </TouchableOpacity></>
                        )}

                        {expandedPreview && (

                            <View style={styles.selectedImageContainer}>
                                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                            </View>

                        )}
                        <HStack space={3} mt={4}>
                            <Button onPress={openImagePicker} style={{ backgroundColor: "#054582" }} alignSelf={"center"} width={150} >UPLOAD
                            </Button>
                            <Button style={{ backgroundColor: "#054582" }} alignSelf={"center"} width={150} >
                                <Text style={{ color: "white" }}>SUBMIT</Text>
                            </Button>
                        </HStack>
                    </Box>
                </ScrollView>
            </KeyboardAvoidingView>
        </View >
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
    inputContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 100,
        paddingHorizontal: 10,
        width: 300,
    },
    input: {
        fontSize: 13,
        paddingVertical: 10,
        color: "#000"
    },
    inputDesc: {
        fontSize: 13,
        paddingVertical: 10,
        color: "#000",
        height: 70
    },
    selectedImageContainer: {
        alignItems: 'center',
    },
    selectedImage: {
        width: 200,
        height: 200,
        marginTop: 20,
    },

});
export default ClaimPage;
