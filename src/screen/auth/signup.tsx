import { KeyboardAvoidingView, ScrollView, Box, FormControl, Input, Button, Image, Icon } from "native-base";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { navigation } from "../../navigator";
import { useNavigation } from "@react-navigation/native";
import showEyeIcon from "../../../assets/Images/showEyeIcon.png"; // Adjust the path to your showEyeIcon image
// import hideEyeIcon from "../../../assets/Images/hideEyeIcon.png"; // Adjust the path to your hideEyeIcon image




const Signup = () => {
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return (
        <>
            <ScrollView style={{ backgroundColor: "white" }}>
                <KeyboardAvoidingView>
                    <Box alignSelf={"center"} mt={200}>
                        <View style={{ alignItems: "center" }} >
                            <Image alt="login" width={100} height={100} source={require("../../../assets/Images/signup.png")} />

                        </View>
                        {/* <View style={styles.signupcontainer}>
                            <Text style={styles.signuptext} >SIGNUP</Text>
                        </View> */}
                        <FormControl mt={7}>
                            <Input type="text" variant={"underlined"} width={300}
                                placeholder="Username"
                            />
                        </FormControl>
                        <FormControl mt={5}>
                            <Input
                                type={showPassword ? "text" : "password"}
                                variant={"underlined"}
                                width={300}
                                placeholder=" Password"
                            />
                        </FormControl>
                        <FormControl mt={5}>
                            <Input
                                type={showPassword ? "text" : "password"}
                                variant={"underlined"}
                                width={300}
                                placeholder=" Confirm Password"
                            />
                            <View style={styles.iconContainer}>
                                <TouchableOpacity onPress={togglePasswordVisibility}>
                                    <Image
                                        source={showEyeIcon}

                                        alt={showPassword ? "Hide Password" : "Show Password"}
                                        style={[
                                            styles.icon,
                                            showPassword && styles.iconRotated,

                                        ]}
                                    />
                                </TouchableOpacity>
                            </View>
                        </FormControl>

                        <Button style={{ backgroundColor: "#054582" }} alignSelf={"center"} width={150} mt={8}>
                            <Text style={{ color: "white" }}> SIGN UP</Text>
                        </Button>
                        <View style={styles.logincontainer}>
                            <Text >Already a user <Text onPress={() => navigation.navigate("Login")} style={styles.logintext}>Log In</Text></Text>
                        </View>
                    </Box>
                </KeyboardAvoidingView>
            </ScrollView>
        </>
    )
}
const styles = StyleSheet.create({
    signuptext: {
        alignItems: "center",
        fontSize: 20,
        fontWeight: "bold",
        color: "#054582",
        justifyContent: "center"

    },
    signupcontainer: {
        alignItems: "center",


    },
    logincontainer: {
        alignItems: "center",
        marginTop: 15,
    },
    logintext: {
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
})
export default Signup;
