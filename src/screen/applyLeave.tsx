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
import { Calendar } from 'react-native-calendars';
import { useAuth } from '../context/AuthContext';
import { launchImageLibrary } from 'react-native-image-picker';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Header from '../layout/header';






const AddLeave = ({ navigation }) => {
  const { email, userStatus } = useAuth()
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dayCounts, setDayCounts] = useState(0);
  const [leaveType, setLeaveType] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState('');
  const [selectedRadioValue, setSelectedRadioValue] = useState('');
  const [startDateSelection, setStartDateSelection] = useState(null); // Can be "AM", "PM", or null
  console.log('startDateSelection: ', startDateSelection);

  const [endDateSelection, setEndDateSelection] = useState(null); // Can be "AM", "PM", or null
  console.log('endDateSelection: ', endDateSelection);
  console.log('selectedRadioValue: ', selectedRadioValue);
  const [singleRadioValue, setSingleRadioValue] = useState('');
  console.log('singleRadioValue: ', singleRadioValue);
  const [noonType, setNoonType] = useState('');
  console.log('noonType: ', noonType);
  const [expandedPreview, setExpandedPreview] = useState(false);
  const [imageBase64, setImageBase64] = useState(null);
  console.log('imageBase64: ', imageBase64);
  const [imageUri, setImageUri] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [formStatus, setFormStatus] = useState(null);
  // const [selectedDocumentName, setSelectedDocumentName] = useState(null);
  // console.log('selectedDocumentName: ', selectedDocumentName);
  // const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  // console.log('selectedDocumentType: ', selectedDocumentType);


  // const pickDocument = async () => {

  //   const result = await DocumentPicker.getDocumentAsync();
  //   if (result.type === 'success') {
  //     // Set the selected document name and type
  //     setSelectedDocumentName(result.name);
  //     setSelectedDocumentType(result.type);
  //     console.log('Document selected:', result.uri);
  //   } else if (result.type === 'cancelled') {
  //     // Handle if the user cancelled the document picker
  //     console.log('Document selection cancelled');
  //   }
  // };


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

  const handleDayPress = (day) => {
    const dateString = day.dateString;

    const isWeekend = (date) => {
      const dayOfWeek = new Date(date).getDay();
      return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
    };

    if (startDate && !endDate) {
      // Completing the range selection
      setEndDate(dateString);

      const datesInRange = getDatesInRange(startDate, dateString);
      const newRange = { ...selectedRange };

      datesInRange.forEach((date) => {
        if (!isWeekend(date)) {
          newRange[date] = {
            selected: true,
            color: '#054582',
            startingDay: date === startDate,
            endingDay: date === dateString,
          };
        } else {
          newRange[date] = {
            selected: true,
            color: 'gray',



            startingDay: date === startDate,
            endingDay: date === dateString,
          };
        }
      });


      setSelectedRange(newRange);

      // Log the selected range
      console.log('Selected Range:', newRange);
    } else {
      // Start of a new selection
      setStartDate(dateString);
      setEndDate(null);

      const newRange = {
        [dateString]: {
          selected: true,
          color: '#054582',
          startingDay: true,
          endingDay: true,
        },
      };

      setSelectedRange(newRange);

      // Log the selected range
      console.log('Selected Range:', newRange);
    }
  };


  const getDatesInRange = (start, end) => {
    const dates = [];
    const currentDate = new Date(start);

    while (currentDate <= new Date(end)) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };




  useEffect(() => {
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        // Calculate the number of days between start and end
        const timeDiff = Math.abs((end as any) - (start as any));
        const dayCount = Math.ceil(timeDiff / (24 * 60 * 60 * 1000)) + 1;

        // Calculate the number of weekend days between start and end
        const weekendCount = Array.from({ length: dayCount }, (_, index) => {
          const currentDate = new Date(start);
          currentDate.setDate(currentDate.getDate() + index);
          return currentDate.getDay();
        }).filter((day) => day === 0 || day === 6).length;

        // Subtract the weekend days from dayCount
        const businessDays = dayCount - weekendCount;

        setDayCounts(businessDays);
        console.log('businessDays: ', businessDays);
      } else if (start || end) {
        if (start && (start.getDay() === 0 || start.getDay() === 6)) {
          alert('The selected date is a weekend. Please choose a different date.');
          setDayCounts(0);
        } else {
          setDayCounts(1);
          console.log('businessDays: 1');
        }
      } else {
        // No dates are selected
        setDayCounts(0);
        console.log('businessDays: 0');
      }
    } else {
      setDayCounts(0);
    }
  }, [startDate, endDate]);

  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  const onCloseDrawer = () => {
    setIsDrawerVisible(false);
  };
  const getSelectedDaysCount = () => {
    return dayCounts;
  };



  function formatDate(dateString) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}-${month}-${year}`;
    }
    return dateString; // Return the original dateString if it doesn't match the expected format
  }


  const leaveUpdate = async () => {
    try {

      let lType;
      let nDays = dayCounts;


      if ((startDateSelection === 'AM' || startDateSelection === 'PM' && selectedRadioValue === "halfDay") && (endDateSelection === 'AM' || endDateSelection === 'PM' && selectedRadioValue === "halfDay")) {
        lType = 'BO'; // Both have 'AM' or 'PM'
        nDays -= 1;
      } else if (startDateSelection === 'AM' || startDateSelection === 'PM' && selectedRadioValue === "halfDay") {
        lType = 'PF'; // Only startDateSelection has 'AM' or 'PM'
        nDays -= 0.5;
      } else if (endDateSelection === 'AM' || endDateSelection === 'PM' && selectedRadioValue === "halfDay") {
        lType = 'SF'; // Only endDateSelection has 'AM' or 'PM'
        nDays -= 0.5;
      } else if (startDate && !endDate) {
        lType = singleRadioValue === "half-Day" ? noonType : ""; // Additional condition
        nDays = singleRadioValue === "half-Day" ? dayCounts - 0.5 : dayCounts; // Additional condition

      } else {
        lType = ''; // Neither has 'AM' or 'PM', and not the additional condition
        nDays = dayCounts
      }


      const requestBody = {

        NricID: email,
        LeaveCode: selectedLeave,
        DateFrom: formatDate(startDate),
        DateTo: endDate ? formatDate(endDate) : formatDate(startDate),
        nDays: nDays,
        Status: "pending",
        UserID: email,
        Ltype: lType,
        attachment: imageBase64

      };

      if (startDate && !endDate) {
        requestBody.Ltype = singleRadioValue === "half-Day" ? noonType : "";
      }



      console.log('requestBody: ', requestBody);

      const response = await fetch("http://118.189.74.190:1016/api/empleaveupdate", {
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
        // Handle the response data as needed
      } else {
        console.error("API request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error occurred during API request:", error);
    }
  };
  useEffect(() => {
    const leaveTypeList = async () => {
      try {
        const requestBody = {
          BranchCode: userStatus,
        };

        const response = await fetch("http://118.189.74.190:1016/api/leavelistapi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const data = await response.json();
          const list = data.Leavelist;
          setLeaveType(list);
        } else {
          console.error("API request failed with status:", response.status);
        }
      } catch (error) {
        console.error("Error occurred during API request:", error);
      }
    };

    // Call the API request function when the component mounts
    leaveTypeList();
  }, [userStatus]);

  const handleSelectChange = (itemValue) => {
    setSelectedLeave(itemValue);
  };

  const handleRadioChange = (value) => {
    setSelectedRadioValue(value);
    setSingleRadioValue("")
  }

  const singleLeaveRadio = (single) => {
    setSingleRadioValue(single)
    setSelectedRadioValue("")
  }

  const typeOfNoon = (type) => {
    setNoonType(type)
  }



  // Handle button presses for the start date
  const handleStartDateSelection = (period) => {

    setStartDateSelection(period);


  };

  // Handle button presses for the end date
  const handleEndDateSelection = (period) => {
    setEndDateSelection(period);
  };

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
          <Text style={styles.moduleHea}>add leave</Text>
          {/* <Text>Selected : {selectedDocumentName}</Text>
          <Text>Type : {selectedDocumentType}</Text>

          <Button  onPress={pickDocument} >
            <Text>Upload Document</Text>
          </Button> */}

          <View style={styles.content}>
            <Text style={styles.label}>Approver Manager</Text>
            <Select variant="underlined">
              <Select.Item label="aaa" value="aaa" />
              <Select.Item label="bbb" value="bbb" />
            </Select>
            <Text style={styles.label}>Leave Type</Text>
            <Select
              variant="underlined"
              selectedValue={selectedLeave}
              onValueChange={handleSelectChange}
            >
              {leaveType.map(leaveOption => (
                <Select.Item key={leaveOption.name} label={leaveOption.name} value={leaveOption.code} />
              ))}
            </Select>

            <Calendar
              style={styles.calendar}
              current={'2023-08-01'}
              onDayPress={handleDayPress}
              markingType="period"
              markedDates={selectedRange}
            />

            <View>
              {startDate && endDate ? (
                <>
                  <Text style={styles.label}>Date</Text>
                  <Input variant="underlined" value={`${startDate} to ${endDate}`} />
                </>
              ) : startDate ? (
                <>
                  <Text style={styles.label}>Date</Text>
                  <Input variant="underlined" value={`${startDate} to ${startDate}`} />
                </>
              ) : null}
            </View>
            {startDate && endDate && (
              <View style={styles.radioGroup}>
                <Radio.Group name="" value={selectedRadioValue} onChange={handleRadioChange}>
                  <HStack space={4}>
                    <VStack>
                      <Radio value="halfDay" colorScheme="red" />
                      <Text>Half-day</Text>
                    </VStack>
                    <VStack>
                      <Radio value="fullDay" colorScheme="red" />
                      <Text>Full-day</Text>
                    </VStack>
                  </HStack>
                </Radio.Group>

              </View>
            )}

            {startDate && !endDate && (
              <View style={styles.radioGroup}>
                <Radio.Group name="" value={singleRadioValue} onChange={singleLeaveRadio}>
                  <HStack space={4}>
                    <VStack>
                      <Radio value="half-Day" colorScheme="red" />
                      <Text>Half-day</Text>
                    </VStack>
                    <VStack>
                      <Radio value="full-Day" colorScheme="red" />
                      <Text>Full-day</Text>
                    </VStack>
                  </HStack>
                </Radio.Group>

              </View>
            )}

            {singleRadioValue === 'half-Day' && (
              <>
                <Text style={styles.label}>Noon Type</Text>
                <View style={styles.radioGroup} >

                  <Radio.Group name="" value={noonType} onChange={typeOfNoon}>
                    <HStack space={6}>
                      <VStack>
                        <Radio value="AM" colorScheme="blue" />
                        <Text>AM</Text>
                      </VStack>
                      <VStack>
                        <Radio value="PM" colorScheme="blue" />
                        <Text>PM</Text>
                      </VStack>
                    </HStack>
                  </Radio.Group>


                </View>
              </>
            )}
            {selectedRadioValue === 'halfDay' && (
              <View style={styles.radioGroup}>
                <View style={styles.dateSelection}>
                  <Text>Start Date:</Text>
                  <Text>{startDate}</Text>
                  <View style={styles.options}>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        startDateSelection === 'AM' && styles.selectedButton,

                      ]}
                      onPress={() => handleStartDateSelection('AM')}

                    >
                      <Text>FN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        startDateSelection === 'PM' && styles.selectedButton,

                      ]}
                      onPress={() => handleStartDateSelection('PM')}

                    >
                      <Text>AN</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.dateSelection}>
                  <Text>End Date:</Text>
                  <Text>{endDate}</Text>
                  <View style={styles.options}>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        endDateSelection === 'AM' && styles.selectedButton,
                      ]}
                      onPress={() => handleEndDateSelection('AM')}
                    >
                      <Text>FN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        endDateSelection === 'PM' && styles.selectedButton,
                      ]}
                      onPress={() => handleEndDateSelection('PM')}
                    >
                      <Text>AN</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            <View>
              <Text style={styles.label}>Number of Days</Text>
              {/* <TextInput value={`${getSelectedDaysCount()} days`} style={styles.textInput} keyboardType="numeric" /> */}
              {(startDateSelection === 'AM' || startDateSelection === 'PM') &&
                (endDateSelection === 'AM' || endDateSelection === 'PM') &&
                selectedRadioValue === 'halfDay' ? (
                <Text style={[styles.label, styles.textInput]}>{dayCounts - 1}</Text>
              ) : (
                (endDateSelection === 'AM' || endDateSelection === 'PM') &&
                  selectedRadioValue === 'halfDay' ? (
                  <Text style={[styles.label, styles.textInput]}>{dayCounts - 0.5}</Text>
                ) : (
                  (startDateSelection === 'AM' || startDateSelection === 'PM') &&
                    selectedRadioValue === 'halfDay' ? (
                    <Text style={[styles.label, styles.textInput]}>{dayCounts - 0.5}</Text>
                  ) : (
                    selectedRadioValue === 'fullDay' ? (
                      <Text style={[styles.label, styles.textInput]}>{dayCounts}</Text>
                    ) :
                      (
                        singleRadioValue === 'full-Day' ? (
                          <Text style={[styles.label, styles.textInput]}>{dayCounts}</Text>
                        ) : (
                          singleRadioValue === 'half-Day' ? (
                            <Text style={[styles.label, styles.textInput]}>{dayCounts - 0.5}</Text>
                          ) : <Text style={[styles.label, styles.textInput]}></Text>
                        )
                      )
                  )
                )
              )

              }
              {/* {singleRadioValue === "half-Day" ? (
                <Text>{dayCounts - 0.5}</Text>
              ) : dayCounts} */}


            </View>

            <View>
              <Text style={styles.label}>Description</Text>
              <Input variant="underlined" type="text" />
            </View>
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
            {formStatus === "Succcess" ? (
              <Text style={styles.succMsg}>Leave Applied Successfully</Text>
            ) : null}
            <View style={styles.finalBtn} >
              <Button onPress={openImagePicker} style={{ backgroundColor: "#054582" }} alignSelf={"center"}   >
                <Text style={{ color: "white" }}>UPLOAD PHOTO</Text>
              </Button>
              <Button onPress={leaveUpdate} style={{ backgroundColor: "#054582" }} alignSelf={"center"} >
                <Text style={{ color: "white" }}>SUBMIT</Text>
              </Button>
            </View>

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
  finalBtn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: "2%",

  },
  selectedImageContainer: {
    alignItems: 'center',
  },
  selectedImage: {
    width: 200,
    height: 200,
    marginTop: 20,
  }
});

export default AddLeave;


