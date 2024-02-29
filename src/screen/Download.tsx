import React, { useEffect, useRef, useState } from 'react';
import { View, Alert, Text, Platform, Modal, StyleSheet } from 'react-native';
import { Button } from 'native-base'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useAuth } from '../context/AuthContext';
import RNFS from 'react-native-fs';
import PushNotification from 'react-native-push-notification';
import RNFetchBlob from 'rn-fetch-blob';

const PDFGenerator = ({ route }) => {
  const { selectedMonth, selectedYear } = route.params;
  const [modalVisible, setModalVisible] = useState(false);


  const pdfUri = useRef(null);
  const [salarySlip, setSalarySlip] = useState(null);

  const formatDate = (date) => {
    // Pad single digit numbers with leading zero
    return (date.getDate() < 10 ? '0' : '') + date.getDate() + '-' +
           (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1) + '-' +
           date.getFullYear();
  }

  const getMonthEndDate = (month, year) => {
    // To get the end date of the month, set the date to 0th day of the next month
    return new Date(year, month, 0);
  }

  const getMonthStartDate = (month, year) => {
    // To get the start date of the month, set the date to 1st day of the month
    return new Date(year, month - 1, 1);
  }
const startDate = getMonthStartDate(selectedMonth, selectedYear);
  const endDate = getMonthEndDate(selectedMonth, selectedYear);

  const formattedStartDate = formatDate(startDate);
  console.log('formattedStartDate: ', formattedStartDate);
  const formattedEndDate = formatDate(endDate);
  console.log('formattedEndDate: ', formattedEndDate);

  const { email } = useAuth()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://118.189.74.190:1016/api/payslipapi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            NricId: email,
            Month: selectedMonth,
            Year: selectedYear
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data.payslip[0]);
          setSalarySlip(data.payslip[0]);
        } else {
          console.error('Error fetching user status');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [email]);

  function generateFileName(baseName) {
    const timestamp = new Date().toISOString().replace(/:/g, '-'); // Generating a timestamp
    const randomString = Math.random().toString(36).substring(2,6); // Generating a random string
    return `${baseName}_${timestamp}_${randomString}.pdf`; // Combining base name, timestamp, and random string
}
  const fileName = generateFileName("payslip");

  const moveFileToDownloads = async (filePath) => {
    try {
     

      const downloadsDir = Platform.OS === 'android' ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath;
      const destinationPath = `${downloadsDir}/${fileName}`; 
      await RNFS.moveFile(filePath, destinationPath);
      console.log('File moved to Downloads directory:', destinationPath);
      return destinationPath;
    } catch (error) {
      console.error('Error moving file:', error);
      return null;
    }
  };

  const generatePDF = async () => {
    try {
      setModalVisible(true);
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Salary Slip</title>
            <style>
                .containers {
                    padding: 15px;
        
                }
        
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
        
                th,
                td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
        
                .section {
                    margin: 10px;
                    display: flex;
                    justify-content: space-between;
                }
        
                .subHeaderText {
                    font-size: 18px;
                    font-weight: bold;
                    margin-top: 10px;
                    margin-bottom: 10px;
                    text-decoration-line: underline;
                    color: green;
                }
        
                .boldRow {
                    border-top-width: 1px;
                }
        
                .boldLabel {
                    font-weight: bold;
                }
        
                .horizontalLine {
                    border-bottom-width: 2px;
                    border-bottom-color: #000;
                    width: 100%;
                    margin-bottom: 10px;
                    margin-top: 10px;
                }
        
        
                .dataCell {
                    padding-top: 10px;
                    padding-bottom: 10px;
                }
        
                .earndedhea {
                    text-align: center;
                }
        
                .moduleHea {
                  font-weight: bold;
                  color: #054582;
                  font-size: 18;
                  align-self: center;
                  margin-top: 15;
                  text-transform: uppercase;
                  text-align: center;
              }
                .hrr {
                  border-bottom-width: 2px;
                  border-bottom-color: #000;
                  width: 100%;
                  margin-bottom: 10px;
                  margin-top: 10px;
              }
        
                @media only screen and (max-width: 600px) {
        
                    .earnded,
                    .deductions {
                        width: 100%;
        
        
        
                    }
                    .moduleHea {
                      font-weight: bold;
                      color: #054582;
                      font-size: 18;
                      align-self: center;
                      margin-top: 15;
                      text-transform: uppercase;
                      text-align: center;
                  }
        
        
        
                }
            </style>
        </head>
        
        <body>
            <div class="containers">
                <div class="moduleHea">Pay Slip</div>
                <hr class="hrr">
                <table>
        
        
        
        
        
        
                    <tr>
                        <th>NRIC/FIN:</th>
                        <th>Pay Period:</th>
                        <th>Name</th>
                        <th>Role:</th>
                    </tr>
                    <tr>
                        <td>${salarySlip.NricId}</td>
                        <td>${formattedStartDate} to ${formattedEndDate}</td>
                        <td>${salarySlip.EmployeeName}</td>
                        <td>${salarySlip.DesgLevel}</td>
                    </tr>
                    <tr>
                        <th colspan="4" class="horizontalLine"></th>
                    </tr>
                    <tr>
                        <th class="earndedhea" colspan="2">Earnings</th>
                        <th class="earndedhea" colspan="2">Deductions</th>
                    </tr>
                    <tr>
                        <td class="earnded">
                            Basic Pay<br>
                            Allowances<br>
                            Standard Overtime<br>
                            Public Holiday OT<br>
                            Bonus<br>
                            Back Pay<br>
                            Others
                        </td>
                        <td class="earnded">
                        ${salarySlip.Basic}<br>
                        ${salarySlip.Allowences}<br>
                        ${salarySlip["Standard OT"]}<br>
                        ${salarySlip["PH OT"]}<br>
                        ${salarySlip.Bonus}<br>
                        ${salarySlip.BackPay}<br>
                        ${salarySlip.Others}
                        </td>
                        <td class="deductions">
                            No Pay Leave<br>
                            Advance Repay<br>
                            Others<br>
                            CDAC/MBMF/SINDA<br>
                            Employee CPF
                        </td>
        
                        <td class="deductions">
                        ${salarySlip["No Pay"]}<br>
                        ${salarySlip.Advance}<br>
                        ${salarySlip.Others}<br>
                        ${salarySlip.CDACFund}<br>
                        ${salarySlip["Employee CPF"]}
                        </td>
                    </tr>
        
                    <tr>
                        <td style="text-align: right;" colspan="2">Total Gross Pay:   ${salarySlip.TotalGross}</td>
                        <td style="text-align: right;" colspan="2">Total Deductions:   ${salarySlip.TotalDeduction}</td>
                    </tr>
        
                    <tr>
                        <th colspan="4" class="horizontalLine"></th>
                    </tr>
        
                    <tr>
                        <th colspan="2">Total Net Pay:</th>
                        <th colspan="2">Bank A/C No:</th>
                    </tr>
                    <tr>
                        <td colspan="2">${salarySlip.NetPay}</td>
                        <td colspan="2">${salarySlip.BankAc}</td>
                    </tr>
        
                    <tr>
                        <th colspan="2">Paid On:</th>
                        <th colspan="2">Employer CPF:</th>
                    </tr>
                    <tr>
                        <td colspan="2">${salarySlip.PaidOn.split(' ')[0]}</td>
                        <td colspan="2">${salarySlip.EmployerCPF}</td>
                    </tr>
                </table>
        
                <p style="text-align: center;" class="slip">This is Computer Generated Payslip, No Signature Required</p>
                <p style="text-align: center;" class="slip">Any query please Call : +65 868778767</p>
        
        
            </div>
        </body>
        
        </html>
      `;
    
    const options = {
        html: htmlContent,
        fileName: fileName,
        directory: 'Documents',
      };
   
      
      
      const pdf = await RNHTMLtoPDF.convert(options);
      console.log('PDF generated:', pdf.filePath);

      PushNotification.localNotification({
        title: 'Download Completed',
        message: 'Your PDF has been downloaded successfully!',
      });
    
      // Move the file to Downloads directory
      const downloadedFilePath = await moveFileToDownloads(pdf.filePath);
      return downloadedFilePath;
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please check logs for details.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>PDF Downloaded Successfully!</Text>
          <Button  onPress={() => setModalVisible(false)} >
          <Text>Close</Text>
        </Button>
        </View>
      </View>
    </Modal>
      <Text style={{ marginBottom: 20 }}> Click the below button to download your payslip </Text>
      <Button style={{ backgroundColor: "#054582" }} alignSelf={"center"} onPress={generatePDF}
      >
        <Text style={{ color: "#FFF" }}  >DOWNLOAD</Text>
      </Button>
    </View>
  );
};


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  }
});


export default PDFGenerator;
