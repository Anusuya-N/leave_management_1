import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions, KeyboardAvoidingView, Platform, Button } from 'react-native';
import Sidebar from '../layout/SideBar';
import { Box, Select } from 'native-base';
import Header from '../layout/header';






const PayslipScreen = ({ navigation }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState("2023");
  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  const onCloseDrawer = () => {
    setIsDrawerVisible(false);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, index) => (currentYear - index).toString());

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
  };

  // Sample data for earnings and deductions
  const earnings = [
    { label: 'Basic Pay', amount: 2000 },
    { label: 'Standard Overtime: Rate & Hrs', amount: 300 },
    { label: 'Public Holiday Overtime: Rate & Hrs', amount: 100 },
    { label: 'Bonus', amount: 500 },
    { label: 'Back Pay / Leave Pay', amount: 200 },
    { label: 'Others (Attendance/Safety/Reimbursement)', amount: 50 },
    { label: 'Total Gross', amount: 50 },

  ];

  const deductions = [
    { label: 'No Pay Leave ', amount: 150 },
    { label: 'Others', amount: 50 },
    { label: 'CDAC/MBMF/SINDA', amount: 50 },
    { label: 'Employee CPF', amount: 50 },

    // Add more deduction items
  ];

  // Calculate total earnings and total deductions
  // const totalEarnings = earnings.reduce((total, item) => total + item.amount, 0);
  // const totalDeductions = deductions.reduce((total, item) => total + item.amount, 0);

  // const netSalary = totalEarnings - totalDeductions;



  return (
    <View style={styles.container}>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Sidebar isVisible={isDrawerVisible} onCloseDrawer={onCloseDrawer} navigation={navigation} />
          <View>

            <Header toggleDrawer={toggleDrawer} />

          </View>
          <Text style={styles.moduleHea}>Pay Slip</Text>
          <View style={styles.dropdownContainer}>
            <Box flex={1} marginRight={10}>
              <Select
                selectedValue={selectedMonth}
                onValueChange={handleMonthChange}
                minWidth={200}
              >
                {months.map((month, index) => (
                  <Select.Item key={index} label={month} value={month} />
                ))}
              </Select>
            </Box>
            <Box flex={1}>
              <Select
                selectedValue={selectedYear}
                onValueChange={handleYearChange}
                minWidth={100}
              >
                {years.map((year, index) => (
                  <Select.Item key={index} label={year} value={year} />
                ))}
              </Select>
            </Box>
          </View>


          <View style={styles.table}>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.labelText}>Name:</Text>
                <Text style={styles.valueText}>John Carles</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.labelText}>Position:</Text>
                <Text style={styles.valueText}>Application Developer</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.labelText}>Pay Period:</Text>
                <Text style={styles.valueText}>01 June - 30 June</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.labelText}>NRIC / FIN:</Text>
                <Text style={styles.valueText}>NRIC166447</Text>
              </View>
            </View>
            <Text style={styles.subHeaderText}>Earnings</Text>
            {earnings.map((earning, index) => (
              <View key={index} style={[styles.itemContainer, index >= earnings.length - 3 ? styles.boldRow : null]}>

                <Text style={index >= earnings.length - 1 ? styles.boldLabel : null}>{earning.label}</Text>

                <Text>${earning.amount}</Text>
              </View>
            ))}


            <Text style={styles.subHeaderText}>Deductions</Text>
            {deductions.map((deduction, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text>{deduction.label}</Text>
                <Text>${deduction.amount}</Text>
              </View>
            ))}
            {/* <View style={styles.totalContainer}>
            <Text>Total Earnings:</Text>
            <Text>${totalEarnings}</Text>
          </View> */}
            <View style={styles.totalContainer}>
              <Text style={styles.boldLabel}>Total Deductions:</Text>
              <Text>200</Text>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.boldLabel}>Total Net Pay:</Text>
              <Text>200</Text>
            </View>
            <View style={styles.totalContainer}>
              <Text style={styles.boldLabel}>Paid On:</Text>
              <Text>03 July</Text>
            </View>
            <View style={styles.lastContainer}>
              <Text>Credited to Bank A/C:</Text>
              <Text>xxx-yyy-zzzz</Text>
            </View>
            <View style={styles.lastContainer}>
              <Text>Employer CPF:</Text>
              <Text>45</Text>
            </View>
          </View>
          <Text style={styles.slip}> This is Computer Generated Payslip,No Signature Required</Text>
          <Text style={styles.slip}> Any query please Call : +65 868778767 </Text>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  menuImg: {
    marginTop: 60,
    marginLeft: 20,
    height: 25,
    width: 35,
  },
  borderLine: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: screenWidth,
  },
  moduleHea: {
    fontWeight: 'bold',
    color: '#054582',
    fontSize: 18,
    alignSelf: 'center',
    marginTop: 15,
    textTransform: 'uppercase',
  },
  infoContainer: {
    marginTop: 12,
    marginBottom: 12,
    alignSelf: 'center',

  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  labelText: {
    fontWeight: 'bold',
    width: 100,
  },
  valueText: {},
  contentContainer: {
    paddingBottom: 40,
  },
  subHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,


  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 5,
  },
  lastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,

  },
  boldRow: {
    borderTopWidth: 1,
    borderTopColor: '#000',
  },
  boldLabel: {
    fontWeight: "bold",
  },
  verticalLine: {
    width: 1,
    height: '100%',
    backgroundColor: '#000',
    marginHorizontal: 10,
  },
  line: {
    fontSize: 16,
    paddingHorizontal: 5,
  },
  table: {

    borderWidth: 1,
    borderColor: "#000",
    marginTop: 15,
  },
  slip: {
    color: "red",
    marginTop: 10,
    alignSelf: "center"
  }
  ,
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,

  },
});
export default PayslipScreen;
