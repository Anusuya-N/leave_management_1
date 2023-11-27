import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { HStack } from 'native-base';

const CameraScreen = ({ route, navigation }) => {
  const { onPictureTaken } = route.params;

  const cameraRef = useRef(null);
  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');

  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const toggleCameraType = () => {
    setCameraType(cameraType === 'back' ? 'front' : 'back');
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true, // Set base64 to true to get the image data in base64 format
      });
  
      setCapturedPhoto(`${photo.base64}`);
      console.log('Captured Image in Base64:', capturedPhoto);
    }
  };
  
  useEffect(() => {
    console.log('Captured Image in Base64:', capturedPhoto);
  }, [capturedPhoto]);
  

  const retakePhoto = () => {
    setCapturedPhoto(null); // Clear the captured photo
  };

  const submitPhoto = () => {
    if (capturedPhoto) {
      onPictureTaken(capturedPhoto); // Send the captured image URI back
      navigation.goBack(); // Go back to AttendanceClockScreen
    }
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
        <View style={styles.cameraView}>
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraType}>
            {/* <Text style={styles.flipText}>Flip</Text> */}
            <Image source={require ("../../assets/Attendance/Clock/flip.png")} />
          </TouchableOpacity>
          {!capturedPhoto ? (
            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
              <Image source={require ("../../assets/Attendance/Clock/click.png")} />
            </TouchableOpacity>
          ) : (
            <View style={styles.capturedPhotoView}>
             <Image source={{ uri: `data:image/jpeg;base64,${capturedPhoto}` }} style={styles.capturedPhoto} />

              <HStack space={2}>
                <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
                  <Text style={styles.buttonText}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={submitPhoto}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </HStack>
            </View>
          )}
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraView: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  flipButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  flipText: {
    fontSize: 18,
    color: 'white',
  },
  captureButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  captureText: {
    
    color: 'white',
  },
  capturedPhotoView: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  capturedPhoto: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  retakeButton: {
    backgroundColor: 'red',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default CameraScreen;
