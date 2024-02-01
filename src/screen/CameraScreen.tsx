import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, PermissionsAndroid } from 'react-native';
import { Button } from 'native-base';
import { launchCamera } from 'react-native-image-picker';

async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'App needs access to your camera to take pictures.',
        // buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

function App({ navigation }) {
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [base, setBase] = useState(null);

  useEffect(() => {
    const handleTakePhoto = async () => {
      const hasCameraPermission = await requestCameraPermission();

      if (!hasCameraPermission) {
        console.log('Please enable camera permissions in app settings.');
        return;
      }

      const options = {
        storageOptions: {
          skipBackup: true,
          path: 'images',
          flash: 'off',
        },
      };

      launchCamera(options, async (response) => {
        if (response.didCancel) {
          // Handle cancelation
        } else if (response.error) {
          // Handle error
        } else {
          const imageUri = response.assets?.[0]?.uri;
          setCapturedPhoto(imageUri);

          // Convert the image to base64
          const base64 = await imageToBase64(imageUri);
          console.log('Base64 Image:', base64);
          setBase(base64);

          // Now you can use the base64 string as needed
        }
      });
    };

    handleTakePhoto();
  }, []);

  const imageToBase64 = async (imageUri) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  };

  const handleConfirmation = () => {
    navigation.navigate('AttendanceClockScreen', { base64Data: base });
  };

  return (
    <View style={styles.container}>
      {capturedPhoto && (
        <>
          <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
          <Button
            mt={5}
            onPress={handleConfirmation}
            style={{ backgroundColor: '#054582' }}
            alignSelf={'center'}>
            <Text style={{ color: 'white' }}>Confirm</Text>
          </Button>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: 300,
    height: 500,
    resizeMode: 'cover',
  },
});

export default App;
