import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  LogBox,
  Image,
  StatusBar,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  name: "",
  address: "",
  id: "",
  phone_number: "",
  email_verified: false,
  tier: "",
  transactionPIN: "",
  accountNumber: ""
};
class Profile extends Component {
  state = initialState;

  componentWillMount = () => {
    this._retrieveData();
  }
  // LOG  I want to make request o {"address": "Boston, MA", "email": "cejimuda@bu.edu", "email_verified": true, "name": "Chibu Ejimuda", "phone_number": "+16172242131", "phone_number_verified": false, "sub": "b1e6143c-37f4-4780-aa23-7d5d5c4a0f0c"}

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

  removeItemValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (exception) {
      return false;
    }
  }

  logOut = async () => {
    Alert.alert(
      'Logout? ',
      'Are you sure you want to logout?',
      [
        {
          text: 'Yes', onPress: () => {
            this.removeItemValue("userDetails");
            // this._retrieveData()
            this.props.navigation.navigate("SignIn")
            Alert.alert(null, "You just logged out now,\nSign in to do actions successfully!", [
              {
                text: 'Ok', onPress: () => {
                }
              }]);
          }
        },
        { text: 'No', onPress: () => console.log('NO Pressed') }
      ],
      { cancelable: false },
    );
  }

  render() {
    LogBox.ignoreAllLogs(true);
    const { name, email, phone_number, address, email_verified } = this.state;
    console.log("jhgfdsafghjkj", this.props.navigation.navigate("Welcome"));
    return (
      <View backgroundColor="#FFFFFF" height={height}>
        <ScrollView
          style={styles.scrollView}
          backgroundColor="#FFFFFF"
          marginTop={20}
          paddingBottom={10}>
          <StatusBar backgroundColor="#FFF" barStyle="dark-content" />

          <View style={{ flexDirection: "row", marginTop: 25, width: width, justifyContent: "space-between" }}>
            <Text style={{ color: "#002A14", fontSize: 24, fontWeight: "600", lineHeight: 36, marginStart: 18, marginBottom: 16 }}>
              Profile</Text>

          </View>
          <View style={{ flexDirection: "row", width: width, justifyContent: "space-between" }}>
            <View style={{ marginTop: 0, flexDirection: "row", }}>
              <View>
                <Image
                  source={require("../../assets/pro.png")}
                  style={{ alignSelf: "flex-start", marginStart: 17, height: 120, width: 120, borderRadius: 100, bottom: 10 }}
                />
              </View>
              <View style={{ marginStart: 17, marginTop: 16 }}>
                <Text style={{ color: "#002A14", fontSize: 18, fontWeight: "600", lineHeight: 24, marginBottom: 5 }}>
                  {name}</Text>
                <Text style={{ color: "#A3A9B1", fontSize: 14, fontWeight: "400", lineHeight: 18 }}>
                  {email}</Text>
                <View style={{ flexDirection: "row", alignSelf: "flex-start", marginTop: 0, marginStart: 0, width: width * 0.9 }}>
                  <View style={{ marginTop: 9, marginEnd: 33.8, marginStart: 0 }}>
                    <View
                      width={10}
                      height={10}
                      borderRadius={50}
                      left={0}
                      backgroundColor={email_verified ? "#3B82A0" : "#E10000"}
                    />
                  </View>
                  {email_verified ?
                    <Text style={styles.textEStyle}>Active</Text> :
                    <Text style={styles.textErrStyle}>InActive</Text>}
                  <View style={{ position: "absolute", right: 0, top: 10 }}>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("DocumentUpload")} style={styles.estimateBox}>
              <View style={{ flexDirection: "row", alignSelf: "flex-start", marginTop: 10, marginStart: 12 }}>
                <View style={{ marginEnd: 8, backgroundColor: "#3B82A0", borderRadius: 25, width: 40, height: 40, padding: 9 }}>
                  <Ionicons
                    name="document-attach-outline"
                    color={"#FFF"}
                    size={21} />
                </View>

                <View>
                  <Text style={styles.referTitleStyle}>Upload Document</Text>
                  <Text style={styles.referDescStyle}>Upload Document for Identification</Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={{ marginTop: 45 }}>

              <View style={{ flexDirection: "row", alignSelf: "flex-start", marginTop: 0, marginStart: 12, width: width * 0.9 }}>
                <View style={{ marginTop: 7, marginEnd: 33.8, marginStart: 16 }}>
                  <Feather
                    name="phone"
                    size={26}
                    color={"#3B82A0"} />
                </View>
                <Text style={styles.textEStylee_}>{phone_number}</Text>
                <View style={{ position: "absolute", right: 0, top: 10 }}>
                </View>
              </View>

              <View
                width={width * 0.9}
                height={1}
                marginVertical={10}
                alignSelf={"center"}
                backgroundColor={"#3B82A0"}
              />


              <View style={{ flexDirection: "row", alignSelf: "flex-start", marginTop: 12, marginStart: 12, width: width * 0.9 }}>
                <View style={{ marginTop: 9, marginEnd: 33.8, marginStart: 16 }}>
                  <Ionicons
                    name="location-outline"
                    size={31}
                    color={"#3B82A0"} />
                </View>
                <Text style={styles.textEStyle_}>{address}</Text>
                <View style={{ position: "absolute", right: 0, top: 10 }}>
                </View>
              </View>

              <View
                width={width * 0.9}
                height={1}
                marginVertical={10}
                alignSelf={"center"}
                backgroundColor={"#3B82A0"}
              />

              <TouchableOpacity onPress={() => this.logOut()} style={{ flexDirection: "row", alignSelf: "flex-start", marginTop: 12, marginStart: 12, width: width * 0.9 }}>
                <View style={{ marginTop: 9, marginEnd: 30.8, marginStart: 20 }}>
                  <Feather
                    name="log-out"
                    size={31}
                    color={"#E10000"} />
                </View>
                <Text style={styles.textEStyle_}>Log out</Text>
                <View style={{ position: "absolute", right: 0, top: 10 }}>
                </View>
              </TouchableOpacity>

            </View>
          </View>
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
  fab: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
    bottom: 60,
    backgroundColor: '#00A3CF',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#FFF",
    elevation: 8
  },
  fabIcon: {
    justifyContent: "center",
  },
  completeTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
    textAlign: "center",
    paddingVertical: 12,
  },
  completeBtn: {
    backgroundColor: "#00A3CF",
    width: width * 0.8,
    alignSelf: "center",
    borderRadius: 8,
    marginVertical: 10
  },
  textEStyle_: {
    fontSize: 18,
    color: "#0A1017",
    fontWeight: "500",
    lineHeight: 21,
    marginTop: 13,
    textAlign: "left",
    left: -20
  },
  textEStylee_: {
    fontSize: 18,
    color: "#0A1017",
    fontWeight: "500",
    lineHeight: 21,
    marginTop: 6,
    textAlign: "left",
    left: -20
  },
  textEStyle: {
    fontSize: 12,
    color: "#0A1017",
    fontWeight: "500",
    lineHeight: 21,
    marginTop: 3,
    textAlign: "left",
    left: -20
  },
  textErrStyle: {
    fontSize: 12,
    color: "#DDDDDD",
    fontWeight: "500",
    lineHeight: 21,
    marginTop: 3,
    textAlign: "left",
    left: -20
  },
  referTitleStyle: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "400",
    lineHeight: 21,
    textAlign: "left",
  },
  referDescStyle: {
    fontSize: 12,
    color: "#C8CED7",
    fontWeight: "400",
    lineHeight: 21,
    textAlign: "left",
    marginBottom: 10
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
  banksStyle: {
    borderWidth: 0.5,
    borderColor: "#C8CED7",
    borderRadius: 8,
    padding: 10,
    alignSelf: "center",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.8
  },
  estimateBox: {
    backgroundColor: "#959595",
    width: width * 0.9,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 8
  },
  estimateStyle: {
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
  threeDotsBtn: {
    backgroundColor: "#E0F4f8",
    width: 40,
    height: 31,
    alignSelf: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  loginBtn: {
    backgroundColor: "#E0F4f8",
    // width: 98,
    height: 34,
    alignSelf: "center",
    borderRadius: 8,
    paddingHorizontal: 5,
    marginHorizontal: 5,
    flexDirection: "row"
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  modalForeground: {
    backgroundColor: '#ffffff',
    height: height * 0.92,
    width: width * 0.9,
    borderRadius: 10,
    // alignItems:'center', 
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
    textAlign: "center",
    paddingVertical: 12,
  },
  confirmBtn: {
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
    fontSize: 14,
    fontWeight: "500",
    color: "#494E55",
    textAlign: "left",
    lineHeight: 21,
    padding: 16,
    left: -13
  },
  depositStyle_: {
    fontSize: 14,
    fontWeight: "500",
    color: "#494E55",
    textAlign: "left",
    lineHeight: 18,
    padding: 10,
    left: -13
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
  editProfileStyle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00A2CF",
    textAlign: "left",
    marginEnd: 16,
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
    margin: 15,
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
    margin: 15,
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
    margin: 15,
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
    margin: 15,
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
    margin: 15,
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
    margin: 15,
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
    marginTop: 50
  },
});
export default Profile;