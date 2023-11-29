import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

const CameraScreen = () => {
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
  
        setSelectedImage(uri);
  
        // Now you can use the 'base64' variable for your purposes
        console.log('Base64 representation of the selected image:', base64);
      }
    });
  };
  
  

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openImagePicker} style={styles.pickImageButton}>
        <Text style={styles.pickImageButtonText}>Pick Image from Gallery</Text>
      </TouchableOpacity>

      {selectedImage && (
        <View style={styles.selectedImageContainer}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
        </View>
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
  pickImageButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  pickImageButtonText: {
    color: 'white',
    fontSize: 18,
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

export default CameraScreen;
