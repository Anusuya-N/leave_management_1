import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { KeyboardAvoidingView, ScrollView, Box, FormControl, Input, Button, Image, Icon } from "native-base";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleResetPassword = () => {
        // Handle password reset logic here
        // You can send a password reset email to the entered email address
        console.log(`Password reset requested for email: ${email}`);
    };

    return (
        <ScrollView style={{ backgroundColor: "white" }}>
            <KeyboardAvoidingView>
                <Box alignSelf={"center"} mt={300}>
                    <View style={{ alignItems: "center" }}>
                        <Text style={styles.title}> Forgot password ?</Text>
                        <Text style={{ marginTop: 10 }}>Don't worry it happens.Please enter the mail </Text>
                        <Text>associated with your account</Text>
                    </View>

                    <Input variant={"underlined"} mt={7} width={300} color={"white"} placeholder="Enter Mail" />
                    <Button style={{ backgroundColor: "#054582" }} alignSelf={"center"} width={150} mt={10}>
                        <Text style={{ color: "white" }}>RESET</Text>
                    </Button>
                </Box>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({

    title: {
        fontSize: 20,
        color: "#054582",
        fontWeight: "bold",
        textTransform: "uppercase"


    },

});

export default ForgotPassword;
