import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native';
import Sidebar from '../layout/SideBar';
import { Box, FormControl, Input, Select, Button, HStack } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';




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
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Permission to access media library is required!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
        if (status !== 'granted') {
          alert('Permission to access the media library is required!');
          return;
        }
      
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          aspect: [1, 1],
          quality: 1,
        });
      
        if (!result.cancelled) {
          const imageUri = result.uri;
      
          // Read and encode the image to base64 using Expo FileSystem
          FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 })
            .then((base64Data) => {
              console.log('base64Data: ', base64Data);
      
              // Use the base64 data as needed (e.g., send it to an API or display it in your app)
              console.log('Base64 image data:', base64Data);
      
              // Store the image URI and base64 data in state
              setImageUri(imageUri);
              setImageBase64(base64Data);
      
              // Now, you can work with imageBase64 safely
              console.log('imageBase64: ', imageBase64);
      
              // Get the image name from the URI
              const uriParts = imageUri.split('/');
              const name = uriParts[uriParts.length - 1];
      
              // Store the image name in a state variable
              setImageName(name);
            })
            .catch((error) => {
              console.error('Error converting image to base64:', error);
            });
        }
      };
      
      
    const toggleExpandedPreview = () => {
        setExpandedPreview(!expandedPreview);
    };
    return (
        <View style={styles.container}>
            <LeaveHeader toggleDrawer={toggleDrawer} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <Sidebar isVisible={isDrawerVisible} onCloseDrawer={onCloseDrawer} navigation={navigation} />
                    <Text style={styles.moduleHea}>Claim</Text>
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


                        {imageUri && (
                            <><Text style={{ marginTop: 5, alignSelf: "center"}}>{imageName}</Text>
                            
                            <TouchableOpacity>
                                <Text onPress={toggleExpandedPreview} style={{ marginTop: 5, alignSelf: "center", textDecorationLine: 'underline',color:"green" }}>Preview</Text>
                            </TouchableOpacity></>
                        )}

                        {expandedPreview && (
                            <View>
                                <Image source={{ uri: imageUri }} style={{ width: 200, height: 300, borderWidth: 1, borderColor: "gray", borderRadius: 8, marginTop: 5, alignSelf: "center" }} />
                               
                            </View>
                        )}
                        <HStack  space={3} mt={4}>
                            <Button style={{ backgroundColor: "#054582" }} alignSelf={"center"} width={150} onPress={pickImage} >
                                <Text style={{ color: "white" }}>UPLOAD PHOTO</Text>
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

});
export default ClaimPage;
