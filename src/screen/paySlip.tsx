import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions, KeyboardAvoidingView, Platform, Button, PermissionsAndroid, Alert } from 'react-native';
import Sidebar from '../layout/SideBar';
import { Box, Select } from 'native-base';
import Header from '../layout/header';
import { useAuth } from '../context/AuthContext';


const PayslipScreen = ({ navigation }) => {
  const { email } = useAuth()
  console.log('email: ', email);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [salarySlip, setSalarySlip] = useState(null);
  const [error, setError] = useState("");
  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  const onCloseDrawer = () => {
    setIsDrawerVisible(false);
  };

  const months = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
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
  // const earnings = [
  //   { label: 'Basic Pay', amount: 2000 },
  //   { label: 'Standard Overtime: Rate & Hrs', amount: 300 },
  //   { label: 'Public Holiday Overtime: Rate & Hrs', amount: 100 },
  //   { label: 'Bonus', amount: 500 },
  //   { label: 'Back Pay / Leave Pay', amount: 200 },
  //   { label: 'Others (Attendance/Safety/Reimbursement)', amount: 50 },
  //   { label: 'Total Gross', amount: 50 },

  // ];

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

  const paySlip = async () => {




    const requestBody = {
      NricId: email,
      Month: selectedMonth,
      Year: selectedYear
    };



    const response = await fetch("http://118.189.74.190:1016/api/payslipapi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      try {
        const data = await response.json();
        console.log(data.payslip[0]);
        setSalarySlip(data.payslip[0]);
        setError("")
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        setSalarySlip(null);
        setError("No Data Found");
      }
    } else {
      setSalarySlip(null);
      setError("No Data Found");
      console.error("API request failed with status:", response.status);
    }

  }


  const selectedMonthObject = months.find(month => month.value === selectedMonth);
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
            <Box>
              <Select
                selectedValue={selectedMonth}
                onValueChange={handleMonthChange}
                minWidth={200}
              >
                {months.map((month) => (
                  <Select.Item key={month.value} label={month.label} value={month.value} />
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
          <Pressable
            onPress={paySlip}
            style={[styles.button, { backgroundColor: "#054582" }]} // Apply background color
          >
            <Text style={styles.buttonText}>SUBMIT</Text>
          </Pressable>
          {error !== "" ? (
            <Text style={styles.err}>**{error}**</Text>
          ) : null}

          {salarySlip !== null && (
            <>
              <View style={styles.containers}>
                <View style={styles.tableContainer}>

                  <View>

                    <View style={styles.final}>

                      <View style={{ flexDirection: "row" }} >
                        <Text style={styles.labels}>Pay Period:</Text>
                        <Text style={styles.values}>{salarySlip.PaidMonth}</Text>
                      </View>
                      <View style={styles.cell} />
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.labels}>Role:</Text>
                        <Text style={styles.values}>{salarySlip.DesgLevel}</Text>
                      </View>
                    </View>



                    <View style={styles.horizontalLines} />
                    <View style={styles.final}>

                      <View style={{ flexDirection: "row" }} >
                        <Text style={styles.labels}>NRIC/FIN:</Text>
                        <Text style={styles.values}>{salarySlip.NricId}</Text>
                      </View>
                      <View style={styles.cell} />

                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.labels}>Name:</Text>
                        <Text style={styles.values}>{salarySlip.EmployeeName}</Text>
                      </View>
                    </View>
                    <View style={styles.horizontalLines} />
                  </View>



                  {/* <View style={styles.imageContainer}>
                  <Image source={require('../../assets/Logo/pay.png')} />
                </View> */}

                  <View style={styles.earndedhea}>
                    <Text style={styles.subHeaderText}>Earnings</Text>
                    <Text style={styles.subHeaderText}>Deductions</Text>
                  </View>
                  <View style={styles.horizontalLine} />
                  <View style={styles.earnded}>
                    {/* Earnings */}
                    <View style={[styles.column, styles.leftColumn]}>

                      <View style={styles.item}>
                        <Text style={styles.labelearnded}>Basic Pay</Text>
                        <Text style={styles.labelearnded}>{salarySlip.Basic}</Text>
                      </View>
                      <View style={styles.item}>
                        <Text style={styles.labelearnded}>Allowances</Text>
                        <Text style={styles.labelearnded}>{salarySlip.Allowences}</Text>
                      </View>
                      <View style={styles.item}>
                        <Text style={styles.labelearnded}>Standard Overtime</Text>
                        <Text style={styles.labelearnded}>{salarySlip["Standard OT"]}</Text>
                      </View>
                      <View style={styles.item}>
                        <Text style={styles.labelearnded}>Public Holiday Overtime</Text>
                        <Text style={styles.labelearnded}>{salarySlip["PH OT"]}</Text>
                      </View>
                      <View style={styles.item}>
                        <Text style={styles.labelearnded}>Bonus</Text>
                        <Text style={styles.labelearnded}>{salarySlip.Bonus}</Text>
                      </View>
                      <View style={styles.item}>
                        <Text style={styles.labelearnded}>Back Pay</Text>
                        <Text style={styles.labelearnded}>{salarySlip.BackPay}</Text>
                      </View>
                      {/* <View style={styles.item}>
                      <Text style={styles.labelearnded}>Leave Pay</Text>
                      <Text style={styles.labelearnded}>ui</Text>
                    </View> */}
                      <View style={styles.item}>
                        <Text style={styles.labelearnded}> Others</Text>
                        <Text style={styles.labelearnded}>{salarySlip.Others}</Text>
                      </View>

                    </View>

                    {/* <View style={styles.divider} /> */}

                    {/* Deductions */}
                    <View style={[styles.column, styles.rightColumn]}>


                      <View style={styles.item}>
                        <Text style={styles.labelearnded}>No Pay Leave</Text>
                        <Text style={styles.labelearnded}>{salarySlip["No Pay"]}</Text>
                      </View>
                      {/* <View style={styles.item}>
                      <Text style={styles.labelearnded}>Housing/Transport/Others</Text>
                      <Text style={styles.labelearnded}>hjkl</Text>
                    </View> */}
                      <View style={styles.item}>
                        <Text style={styles.labelearnded}>Advance Repay</Text>
                        <Text style={styles.labelearnded}>{salarySlip.Advance}</Text>
                      </View>
                      <View style={styles.item}>
                        <Text style={styles.labelearnded}>Others</Text>
                        <Text style={styles.labelearnded}>{salarySlip.Others}</Text>
                      </View>
                      <View style={styles.item}>
                        <Text style={styles.labelearnded}>CDAC/MBMF/SINDA</Text>
                        <Text style={styles.labelearnded}>{salarySlip.CDACFund}</Text>
                      </View>
                      <View style={styles.item}>
                        <Text style={styles.labelearnded}>Employee CPF</Text>
                        <Text style={styles.labelearnded}>{salarySlip["Employee CPF"]}</Text>
                      </View>

                    </View>
                  </View>

                  <View style={styles.horizontalLines} />

                  <View>
                    <View style={styles.final}>

                      <View style={{ flexDirection: "row" }} >
                        <Text style={styles.labels}>Total Gross:</Text>
                        <Text style={styles.values}>{salarySlip.TotalGross}</Text>
                      </View>

                      <View style={styles.cell} />

                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.labels}>Total Deduction:</Text>
                        <Text style={styles.values}>{salarySlip.TotalDeduction}</Text>
                      </View>
                    </View>

                    <View style={styles.horizontalLines} />
                    <View style={styles.final}>

                      <View style={{ flexDirection: "row" }} >
                        <Text style={styles.labels}>Total Net Pay:</Text>
                        <Text style={styles.values}>{salarySlip.NetPay}</Text>
                      </View>

                      <View style={styles.cell} />
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.labels}>Bank A/C No:</Text>
                        <Text style={styles.values}>{salarySlip.BankAc}</Text>
                      </View>
                    </View>
                    <View style={styles.horizontalLines} />
                    <View style={styles.final}>

                      <View style={{ flexDirection: "row" }} >
                        <Text style={styles.labels}>Paid On:</Text>
                        <Text style={styles.values}>{salarySlip.PaidOn.split(' ')[0]}</Text>
                      </View>
                      <View style={styles.cell} />

                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.labels}>Employer CPF:</Text>
                        <Text style={styles.values}>{salarySlip.EmployerCPF}</Text>
                      </View>
                    </View>


                  </View>
                </View>




              </View>
              <Text style={styles.slip}> This is Computer Generated Payslip,No Signature Required</Text>
              <Text style={styles.slip}> Any query please Call : +65 868778767 </Text>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Pressable onPress={() => navigation.navigate("Download", { selectedMonth, selectedYear })}>
                  <Text style={{color:"#000"}}>Download PaySlip</Text>
                </Pressable>

              </View>

            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </View >
  );
};

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containers: {
    padding: 15
  },
  tableContainer: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',

    // padding: 10,
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
  section: {
    margin: 10,

    flexDirection: "row",
    justifyContent: "space-between"
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,


  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,


  },
  borderLine: {
    marginTop: 10,
    borderBottomWidth: 1,

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
    marginTop: 50,
    marginBottom: 12,
    alignSelf: "center"


  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 3,


  },
  labelText: {
    fontWeight: 'bold',

  },
  labelearnded: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'gray',
    // width:100
  },
  valueText: {

  },
  labels: {
    fontWeight: 'bold',
    width: 100,
    padding: 2,
    fontSize: 12,
    color: '#000',
  },
  values: {
    fontWeight: 'bold',
    width: 100,
    padding: 4,
    fontSize: 12,
    color: 'gray',
  },

  contentContainer: {
    paddingBottom: 40,
  },
  subHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    textDecorationLine: "underline",
    color: "green",


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
    paddingTop: 5,
  },
  lastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,

  },
  boldRow: {
    borderTopWidth: 1,

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

  table: {

    borderWidth: 1,

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
    justifyContent: 'space-around',
    // paddingHorizontal: 20,
    marginTop: 20,

  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000',

  },

  button: {
    alignSelf: "center",
    width: 150,
    paddingVertical: 10, // Add padding vertically
    borderRadius: 5, // Add border radius for rounded corners
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  line: {
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },

  imageContainer: {
    position: 'absolute',
    top: 1,
    right: 3,

  },
  horizontalLine: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    width: '100%', // Ensure the line spans the entire width of the table
    marginBottom: 10, // Adjust spacing between sections
    marginTop: 10, // Adjust spacing between sections
  },
  horizontalLines: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: '100%', // Ensure the line spans the entire width of the table

  },
  earnded: {
    flexDirection: 'row',

  },
  column: {
    flex: 1,
  },
  leftColumn: {
    marginRight: 30,
    // marginLeft: 15,
  },
  rightColumn: {
    marginLeft: 8,
    // marginRight:15,
  },
  item: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",

  },
  final: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  divider: {
    width: 1,
    backgroundColor: '#000',
    alignSelf: 'stretch',
    height: '100%',
  },
  earndedhea: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  err: {
    fontWeight: "bold",
    alignSelf: "center",
    color: "red",
    marginTop: 5,

  }

});
export default PayslipScreen;
