// File: MyComponent.js
import { KeyboardAvoidingView, ScrollView, Box, FormControl, Input, Button, Image, Modal, HStack,Text } from 'native-base';
import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { navigation } from '../../navigator';
import { useNavigation } from '@react-navigation/native';
import showEyeIcon from "../../../assets/Images/showEyeIcon.png";
import { useAuth } from '../../context/AuthContext';

const Login = () => {
const {email,setEmail,password,setPassword} = useAuth();
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [isLoginEnabled, setIsLoginEnabled] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [userName, setUserName] = useState("");

  const [urlError, setUrlError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  

  // const {email, password, setEmail, setPassword} = useAuth();

  // Import Axios at the top of your file

  const handleSubmit = async () => {
    setLoading(true);
    setShowAlert(false);

    try {
      const requestBody = {
        uniqueid: email,
        uniquestr: password
      };

      const response = await fetch("http://118.189.74.190:1016/api/uservalidation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.StatusResult === "success" || data.StatusResult === "approval") {
          navigation.navigate("Home");
          // navigation.reset({
          //   index: 0,
          //   routes: [{ name: "Home" }], // Replace 'Home' with your home screen route name
          // });
      } else {
          console.log("Login unsuccessful");
          setShowAlert(true);
      }
      
      } else {
        console.error("API request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
    }

    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowLoginPassword(!showLoginPassword);
  };



  const urlPattern = /^(https?:\/\/)?[\da-z.-]+\.[a-z.]{2,6}([\/\w .-]*)*\/?$/;
  const handleUrlSubmit = () => {
    if (urlPattern.test(baseUrl)) {
      setIsLoginEnabled(true);
      setIsModalVisible(false);
      setUrlError('');
    } else {
      setIsLoginEnabled(false);
        setUrlError('Please set a valid Base URL');
      }
  };


  return (
    <>
      <View style={{ flex: 1 }}>


        <ScrollView style={{ backgroundColor: "white" }}>
          <KeyboardAvoidingView>
         <View style={styles.url}>
          <Pressable  onPress={() => setIsModalVisible(true)}>
       <HStack space={1}>
          <Image alt="url" source={require("../../../assets/Images/url.png")}/>
      <Text style={styles.urlText}>Base url</Text>
      </HStack>

          </Pressable>
        
          </View>
         
            <Box mt={180} alignSelf={"center"}>

              <View style={{ alignItems: "center" }} >
                <Image alt="login" width={100} height={100} source={require("../../../assets/Images/login.png")} />

              </View>
              <FormControl mt={7}>
              <Input
                variant="underlined"
                value={baseUrl}
                onChangeText={setBaseUrl}
                width="300px"
                placeholder="Base URL"
                type="text"
                isReadOnly
              />
            </FormControl>
              <FormControl mt={7}>
                <View>
                  <Input
                    variant="underlined"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    width="300px"
                    placeholder="Username"
                    type="text"

                  />
                </View>
              </FormControl>

              <FormControl mt={5}>
                <Input

                  type={showLoginPassword ? "text" : "password"}
                  variant={"underlined"}
                  width={300}
                  value={password}
                  onChangeText={text => setPassword(text)}
                  placeholder=" Password"
                />
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={togglePasswordVisibility}>
                    <Image
                      source={showEyeIcon}

                      alt={showLoginPassword ? "Hide Password" : "Show Password"}
                      style={[
                        styles.icon,
                        showLoginPassword && styles.iconRotated,

                      ]}
                    />
                  </TouchableOpacity>
                </View>
              </FormControl>
              <View style={styles.forgotPasswordContainer}>
                <Text onPress={() => navigation.navigate("Forgotpassword")} style={styles.forgotPasswordText}>Forgot Password ?</Text>
              </View>
              {showAlert ? (
                    <Text fontWeight={'bold'} color={'red.400'}>
                      Invalid email or password
                    </Text>
                  ) : null}
              <Button
                // isDisabled={!isLoginEnabled}
               onPress={handleSubmit} style={{ backgroundColor: "#054582" }} alignSelf={"center"} width={150} mt={10}>
                <Text style={{ color: "white" }}>LOGIN</Text>
              </Button>


              <View style={styles.signupContainer}>
                <Text>Don't have a account <Text onPress={() => navigation.navigate("Signup")} style={styles.signUpText}>Sign Up!</Text></Text>
              </View>

              <Modal isOpen={isModalVisible}>
        <Modal.Content>
          <Modal.CloseButton onPress={() => {setIsModalVisible(false) ; setUrlError('')} } />
          <Modal.Header >Set Base URL</Modal.Header>
          <Modal.Body>
            <FormControl>
              <Input
                placeholder="Enter Base URL"
                value={baseUrl}
                onChangeText={setBaseUrl}
              />
            </FormControl>
            {urlError !== "" && <Text style={styles.errorText}>{urlError}</Text>}
          </Modal.Body>
          <Modal.Footer>
            <Button  style={{ backgroundColor: "#054582" }} alignSelf={"center"} width={100}  onPress={handleUrlSubmit}>Submit</Button>
           
          </Modal.Footer>
        </Modal.Content>
      </Modal>

            </Box>
          </KeyboardAvoidingView>
        </ScrollView>

      </View>
    </>
  );
};

const styles = StyleSheet.create({
  url:{
    marginTop:50,
    position: 'absolute',
    top: 0,
    right: 30,
    margin: 10,
   
  },
 
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  forgotPasswordText: {
    fontSize: 12,
    textDecorationLine: "underline",
    color: "#054582"


  },
  urlText :{
   
    color: "#054582",
  },
  signupContainer: {
    alignItems: "center",
    marginTop: 15,
  },
  signUpText: {
    color: "#054582",


  },
  iconContainer: {
    position: "absolute",
    top: 15,
    right: 10,
  },
  icon: {
    width: 18,
    height: 18,
  },
  iconRotated: {
    transform: [{ rotate: "180deg" }],
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
})

export default Login;
