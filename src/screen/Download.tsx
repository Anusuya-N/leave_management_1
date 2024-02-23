import React from 'react';
import { View, Button, Share } from 'react-native';
import RNFS from 'react-native-fs';
import paySlip from "./paySlip";

const downloadAndSharePayslipPage = async () => {
  const payslipPageContent = `<paySlip/>`;
  const filePath = `${RNFS.DocumentDirectoryPath}/paySlip.tsx`;

  try {
    await RNFS.writeFile(filePath, payslipPageContent, 'utf8');
    console.log('Payslip page downloaded successfully:', filePath);
    
    // Share the downloaded payslip file
    const shareOptions = {
      title: 'Share Payslip',
      url: `file://${filePath}`,
      type: 'text/plain',
    };
    await Share.share(shareOptions);
  } catch (error) {
    console.error('Error downloading or sharing payslip page:', error);
  }
};

const App = () => {
  return (
    <View>
      <Button title="Download and Share Payslip" onPress={downloadAndSharePayslipPage} />
    </View>
  );
};

export default App;
