import React from 'react';
import { Box, HStack, Pressable, Image, Spacer, VStack } from 'native-base'; // Adjust the import based on your library


const Header = ({ toggleDrawer }) => {
    return (
        <Box height={100} backgroundColor="#002D62">
            <HStack alignItems="center" p={3}>
                <Pressable onPress={toggleDrawer}>
                    <Image
                        alt="menu Image"
                        height={30}
                        width={30}
                        source={require("../../assets/Images/menu.png")}
                    />
                </Pressable>
                <Spacer />
                <VStack>
                    <Image
                        source={require("../../assets/Logo/new.png")}
                        alt="logo Image"
                    />
                    <Image
                        source={require("../../assets/Logo/white.png")}
                        alt="logo Image"
                    />
                </VStack>
                <Spacer />
            </HStack>
        </Box>
    );
};

export default Header;
