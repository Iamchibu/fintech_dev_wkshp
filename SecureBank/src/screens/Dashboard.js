import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Modal,
  TouchableOpacity,
  ScrollView,
  LogBox,
  Image,
  StatusBar,
  Alert
} from "react-native";
import Sun from "../../assets/svgs/sun";
import Moon from "../../assets/svgs/moon";
import Coffee from "../../assets/svgs/coffee";
import MasterCard from "../../assets/svgs/mastercard";
import ArrowRight from "../../assets/svgs/arrowright";
import AsyncStorage from '@react-native-async-storage/async-storage';
import TransactionItem from '../components/TransactionItem';

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

const initialState = {
  faqList: [], 
  up: false,
  down: true,
  password: "",
  token: "",
  isFetching: false,
  errors: {}, 
  isAuthorized: false, 
  secureTextEntry: false,
  isLoading: false,
  visible: false,
  showSecond: "no",
  email: "",
  customerID: "",
  firstname: "",
  name: "",
  lastname: "",
  id: "",
  phone: "",
  tier: "",
  transactionPIN: "",
  accountNumber: "",
  bvn: "",
  list : [
    {
    title : "John Doe",
    amount: "67",
    num: "Level 1",
    },
    {
    title : "Amaka Doe",
    amount: "40",
    num: "Level 2",
    },
    {
    title : "Ajayi Doe",
    amount: "70",
    num: "Level 1",
    },
  ],
  
};
class Dashboard extends Component {
 state = initialState;

  componentWillMount = ()=> {
    this._retrieveData();
  }
  
  _retrieveData() {    
    AsyncStorage.getItem("userDetails").then((res) => {
      const response = JSON.parse(res);
      if (res !== null) {
        this.setState({
          token: response.token,
          userId: response.id,
          accessToken: response.accessToken,
          email: response.email,
          customerID: response.customerID,
          name: response.name,
          address: response.address,
          id: response.id,
          phone_number: response.phone_number,
          email_verified: response.email_verified
        });

        console.log("There is no role dey...", response);
        // console.log("I role to make role o", this.state.role);
      } else {
        console.log("There is no role dey...", response);
      }
    });
  }
  
  greetingMessage(ndate) {
    var greeting = "";
    // var ndate = new Date();
    var hr = ndate.getHours();
      // var h = hr % 12;
    
    if (hr < 12){
          greeting = 'Good Morning';
    } else if (hr >= 12 && hr <= 16){
          greeting = 'Good Afternoon';
    } else if (hr >= 16 && hr <= 24)
          greeting = 'Good Evening';
      return greeting;
  }

  render() {
    LogBox.ignoreAllLogs(true);
    const { name } = this.state;

    return (
    <View backgroundColor="#FFFFFF" height={height}>
    <ScrollView
      style={styles.scrollView}
      backgroundColor="#FFFFFF"
      marginTop={20}
      paddingBottom={10}>
    <StatusBar backgroundColor="#FFF" barStyle="dark-content"/>
        <View style={{ marginStart: 17, marginTop: 5, marginBottom: 24 }}>
        <View style={{ marginTop: 20, flexDirection: "row",  }}>
            <Text style={{ color: "#002A14", fontSize: 12, fontWeight: "400", lineHeight: 21, marginEnd: 5 }}>
            {this.greetingMessage(new Date())}</Text>
            
            {this.greetingMessage(new Date()) == "Good Morning" ? <View style={{ top: 2}}><Coffee/></View> : 
            this.greetingMessage(new Date()) == "Good Afternoon" ? 
            <View style={{ top: 6}}><Sun/></View> : <View style={{ top: 1}}><Moon/></View>}
        </View>
        <Text style={{ color: "#002A14", fontSize: 16, fontWeight: "500", lineHeight: 27 }}>
        {name}</Text>
        </View>

        <View style={styles.cardDesign}>
        <Text style={{ color: "#000", fontSize: 16, fontWeight: "400", lineHeight: 21 }}>
            Total Balance</Text>
        <Text style={{ color: "#000", fontSize: 24, fontWeight: "500", lineHeight: 38, marginTop: 3 }}>
            $6,000</Text>
        </View>

        <Text style={{ textAlign: "left", fontSize: 16, color: "#0A1017", marginStart: 20, fontWeight: "500", lineHeight: 24, marginBottom: 14, marginTop: 24 }}>
              Cards
        </Text>
        <TouchableOpacity style={styles.banksStyle}>
            <View style={{ padding: 4 }}>
            <MasterCard/>
            </View>
            <Text style={styles.depositStyle_}>5567 124 9007 9***</Text>
            <View style={{ padding: 4 }}>
            <ArrowRight/>
            </View>
        </TouchableOpacity>  

        <Text style={{ textAlign: "left", fontSize: 16, color: "#0A1017", marginStart: 20, fontWeight: "500", lineHeight: 24, marginBottom: 14 }}>
          Transactions
        </Text>     

        {/* <Text style={{ color: "#808080", fontSize: 16, fontWeight: "400", marginTop: 30, lineHeight: 21, width: 250, textAlign: "center", alignSelf: "center" }}>
            Sorry no available transaction at the moment...</Text> */}
          <FlatList
            data={this.state.list}
            style={{ backgroundColor: "#FFF", alignSelf: "center" }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item,index }) => ( 
              <TransactionItem
                  item={item}
                  />   
              )}
            />
      </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    width: width,
    backgroundColor: "#FFF",
    marginTop: 0,
  },
  scrollView: {
    marginBottom: 50
  },
  completeTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
    textAlign: "center",
    paddingVertical: 12,
  },
  completeBtn:{
    backgroundColor: "#00A3CF", 
    width: width * 0.8,
    alignSelf: "center",
    borderRadius: 8,
    marginVertical: 10
  },
  textEStyle: {
    fontSize: 12,
    color: "#828890",
    fontWeight: "400",
    lineHeight: 21,
    marginTop: 5,
    textAlign: "left",
    width: width * 0.6
  },
  bankStyle: {
    borderWidth: 0.5,
    borderColor: "#C8CED7",
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.8
  },
  cardDesign: { 
  alignSelf: "center", 
  backgroundColor: "#D8E4EC", 
  width: width * 0.88, 
  elevation: 2, 
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.2,
  alignItems: "center",
  borderRadius: 8,
  padding: 15
  },
  banksStyle: {
    borderWidth: 0.5,
    borderColor: "#C8CED7",
    borderRadius: 8,
    padding: 10,
    alignSelf: "center",
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.89,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2
  },
  estimateBox: {
    backgroundColor: "#E0F4F8",
    width: width * 0.9,
    alignSelf: "center",
    marginBottom: 25, 
    borderRadius: 5
  },
  estimateStyle:{
    fontSize: 20,
    color: "#2B3037",
    fontWeight: "700",
    lineHeight: 27,
    textAlign: "center"
  },
  banksBStyle: {
    borderWidth: 0.5,
    borderColor: "#C8CED7",
    borderRadius: 8,
    padding: 10,
    alignSelf: "center",
    marginBottom: 10,
    flexDirection: "row",
    width: width * 0.8
  },
  threeDotsBtn:{
    backgroundColor: "#E0F4f8", 
    width: 40,
    height: 31,
    alignSelf: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  loginBtn:{
    backgroundColor: "#E0F4f8", 
    // width: 98,
    height: 34,
    alignSelf: "center",
    borderRadius: 8,
    paddingHorizontal: 5,
    marginHorizontal: 5,
    flexDirection: "row"
  },
  modalBackground:{
    flex:1,
    alignItems:'center',
    flexDirection:'column',
    justifyContent:'space-around',
    backgroundColor:'#00000040'
  },
  modalForeground:{
    backgroundColor:'#ffffff',
    height: height * 0.92,
    width: width * 0.9,
    borderRadius:10,
    // alignItems:'center', 
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
    textAlign: "center",
    paddingVertical: 12,
  },
  confirmBtn:{
    backgroundColor: "#00A3CF", 
    width: width * 0.8,
    alignSelf: "center",
    borderRadius: 8, 
    marginBottom: 20,
    marginTop: 5
  },
  loginTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#494E55",
    textAlign: "center",
    padding: 5.5,
  },
  loginTitle_: {
    fontSize: 16,
    fontWeight: "800",
    color: "#494E55",
    textAlign: "center",
    padding: 1,
    justifyContent: "center"
  },
  imageStyle: {
    width: 250,
    top: 10,
    height: 200,
    marginBottom: 10,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 8
  },
  depositStyle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#494E55",
    textAlign: "left",
    lineHeight: 21,
    padding: 16,
    left: -13
  },
  depositStyle_: {
    fontSize: 16,
    fontWeight: "500",
    color: "#494E55",
    textAlign: "left",
    lineHeight: 16,
    padding: 10,
    left: -30
  },
  accNumStyle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0A1017",
    textAlign: "left",
    lineHeight: 21,
  },
  accNameStyle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#A3A9B1",
    textAlign: "left",
    lineHeight: 21,
  },
  pageContainer: {
    alignSelf: "center",
    width: width * 0.9,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    opacity: 1,
  },
  quickInvest: {
    borderColor: "#53BDDB",
    borderWidth: 1,
    width: width * 0.31,
    height: 34,
    borderRadius: 5,
    flexDirection: "row",
    padding: 6,
    justifyContent: "space-around"
  },
  headerTextContainer: {},
  circlarIconContainer: {
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#F6F6F6",
    flex: 1,
  },
  imageBgd: {
    flex: 1,
    alignSelf: "center",
    borderRadius: 15, 
    margin: 10,
  },
  cardStyle: {
    width: 250,//width * 0.45,
    height: 150,
    padding: 10,
    color: "#ffffff",
    opacity: 1,
    margin:15,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    elevation: 10,
  },
  firstCardStyle: {
    width: 250,//width * 0.45,
    height: 150,
    padding: 10,
    color: "#ffffff",
    opacity: 1,
    margin:15,
    borderRadius: 10,
    backgroundColor: "#1e5228",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    elevation: 10,
  },
  secondCardStyle: {
    width: 250,//width * 0.45,
    height: 150,
    padding: 10,
    color: "#ffffff",
    opacity: 1,
    margin:15,
    borderRadius: 10,
    backgroundColor: "#556B2F",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    elevation: 10,
  },
  thirdCardStyle: {
    width: 250,//width * 0.45,
    height: 150,
    padding: 10,
    color: "#ffffff",
    opacity: 1,
    margin:15,
    borderRadius: 10,
    backgroundColor: "#808000",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    elevation: 10,
  },
  fourthCardStyle: {
    width: 250,//width * 0.45,
    height: 150,
    padding: 10,
    color: "#ffffff",
    opacity: 1,
    margin:15,
    borderRadius: 10,
    backgroundColor: "#3CB371",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    elevation: 10,
  },
  fifthCardStyle: {
    width: 250,//width * 0.45,
    height: 150,
    padding: 10,
    color: "#ffffff",
    opacity: 1,
    margin:15,
    borderRadius: 10,
    backgroundColor: "#045F5F",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    elevation: 10,
  },
  listHeadingText: {
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "center",
    color: "#4848FF",
    marginEnd: 5,
    marginTop: 5,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },  
  helloHaderText: {
    textAlign: "left",
    color: "grey",
    fontSize: 22,
    padding: 0,
    marginBottom: -7,
    marginTop: 50,
    fontFamily: "Nunito_700Bold",
    width: width * 0.65,
    letterSpacing: 0.05,
  }, 
  descriptionText: {
    fontSize: 18,
    textAlign: "left",
    color: "#FFF",
    alignSelf: "center",
    fontFamily: "Nunito_700Bold",
  },
  iconViewStyle: {
    alignSelf: "center",
  },
  descriptionText_: {
    fontSize: 18,
    textAlign: "left",
    color: "#042504",
    fontFamily: "Nunito_700Bold",
    alignSelf: "center",
  },
  headerText: {
    textAlign: "left",
    color: "#fff",
    fontSize: 22,
    padding: 0,
    marginBottom: -7,    
    fontFamily: "Nunito_700Bold",
    width: width * 0.65,
    letterSpacing: 0.05,
  },
  card: {
    width: width * 0.9,
    borderRadius: 5,
    marginBottom: 30,
    padding: 20,
    paddingTop: 15,
    paddingBottom: 30,
    borderLeftWidth: 10,
    backgroundColor: "#ffffff",
    alignSelf: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    elevation: 10,
  },
  cardHeaderText: {
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 10,
  },
  cardHeader: {
    justifyContent: "space-between",
  },
  approvedLabel: {
    paddingTop: 5,
    borderRadius: 3,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
  },
  cardStyleLong: {
    marginTop: 20,
    marginBottom: 40,
    alignSelf: "center",
    width: width * 0.94,
    height: 70,
    padding: 15,
    paddingBottom: 20,
    paddingTop: 20,
    color: "#ffffff",
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    elevation: 5
  },
  cardApprovedLabelText: {
    fontSize: 10,
    flex: 1,
    color: "#fff",
    flexWrap: "wrap",
    alignSelf: "center",
    fontWeight: "bold",
  },
  cardMultipleData: {
    paddingLeft: 30,
    alignContent: "center",
    alignItems: "center",
  },
  cardDescription: {
    fontSize: 13,
    paddingTop: 5,
    paddingBottom: 5,
  },
  cardListLabel: {
    fontSize: 10,
    color: "#323C47",
  },
  cardListData: {
    fontSize: 10,
    textAlign: "left",
    flexWrap: "wrap",
    width: 250,
    marginEnd: 5,
  },
  singleCardListData: {
    fontSize: 10,
    textAlign: "left",
    flexWrap: "wrap",
    width: 200,
    marginEnd: 5,
  },
  cardRequestDate: {
    fontSize: 10,
    position: "absolute",
    color: "#414D5B",
    textAlign: "right",
    left: width * 0.64,
    marginEnd: 5,
  },
  headerTextStyle: {
    textAlign: "left",
    color: "#414D5B",
    opacity: 1,
    letterSpacing: 0.54,
  },
  icons: {
    marginRight: 5,
  },
  noListText: {
        fontSize: 13,
        fontWeight: "bold",
        alignSelf: "center",
        color: "grey",
        backgroundColor: "#DDDDDD",
        padding: 20,
        margin: 15,
        marginTop:50
    },
});
export default Dashboard;