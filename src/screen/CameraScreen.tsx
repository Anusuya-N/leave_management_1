import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, PermissionsAndroid } from 'react-native';
import { Button } from 'native-base';
import { launchCamera } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'App needs access to your camera to take pictures.',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const App = ({ navigation }) => {
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [compressedBase64, setCompressedBase64] = useState(null);
  console.log('compressedBase64: ', compressedBase64);

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

          // Compress the image
          const compressedBase64Image = await compressImage(imageUri);
          setCompressedBase64(compressedBase64Image);
        }
      });
    };

    handleTakePhoto();
  }, []);

  const compressImage = async (uri) => {
    try {
      // Resize the image to reduce its dimensions
      const resizedImage = await ImageResizer.createResizedImage(uri, 300, 500, 'JPEG', 80);

      // Read the resized image and convert it to base64
      const base64 = await RNFetchBlob.fs.readFile(resizedImage.uri, 'base64');

      return base64;
    } catch (error) {
      console.error('Error compressing image:', error);
      return null;
    }
  };

  const handleConfirmation = () => {
    navigation.navigate('AttendanceClockScreen', { base64Data: compressedBase64 });
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
};

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
