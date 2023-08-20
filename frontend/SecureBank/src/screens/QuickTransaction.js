import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  TextInput,
  Dimensions,
  LogBox,
} from 'react-native';
import { Entypo, AntDesign } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Device from 'expo-device';
import MarqueeText from 'react-native-marquee';
import { Dropdown } from 'react-native-material-dropdown-v2-fixed';

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const WINDOW_HEIGHT = Dimensions.get("window").height;
const apiURL = 'https://ipgeolocation.abstractapi.com/v1/'
const apiKey = '9065ec7c1dcb4f6886cfc6f92275e936';

class QuickTransaction extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product_cat: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Prefer Not to Say", value: "neutral" },
      ],
      transaction_amt: 0,
      email_address: "",
      ip_address: "",
      transaction_currency: "USD",
      event_id: "",
      entity_id: "",
      event_time: "",
      billing_longitude: "",
      billing_state: "",
      user_agent: "",
      billing_street: "",
      billing_city: "",
      card_bin: "",
      customer_name: "",
      product_category: "",
      customer_job: "",
      phone: "",
      billing_latitude: "",
      billing_zip: "",
      product_cat: [{ label: "Misc Pos", value: "misc_pos" },
      { label: "Grocery", value: "grocery" },
      { label: "Rent", value: "rent" }],
      loading: false,
      legitimate: false,
      fradulent: false,
    };
  }

  componentDidMount = () => {
    var that = this;
    var day = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();
    var millsecs = new Date().getMilliseconds();

    that.setState({
      event_time:
        year + '-' + month + '-' + day + 'T' + hours + ':' + min + ':' + sec + '.' + millsecs
    });
    console.log("Current Time: ", year + '-' + month + '-' + day + 'T' + hours + ':' + min + ':' + sec + '.' + millsecs)

    let deviceName = Device.deviceName;
    this.setState({ user_agent: deviceName + " " + Device.modelId + " " + Device.osName });
    console.log("this ooooo", deviceName, Device.modelId, Device.osName)
  }

  componentWillMount() {
    console.log("I don mount o")
    this._retrieveData()
  }

  _retrieveData() {
    console.log("This method is called...")
    AsyncStorage.getItem('userDetails').then(res => {
      const response = JSON.parse(res)
      if (res !== null) {
        this.setState({
          name: response.name,
          event_id: response.sub,
          email_address: response.email,
          customerID: response.customerID,
          phone: response.phone_number,
        });

        console.log("I want to make request o", response);
      } else {
        console.log("There is no token...")
      }

    });
  };

  getUserLocation = async () => {
    const fullURL = "https://ipgeolocation.abstractapi.com/v1/?api_key=9065ec7c1dcb4f6886cfc6f92275e936" //apiURL + "?api_key=" + apiKey;
    try {
      const response = await axios.get(fullURL);
      console.log("infoooooo", response.data)
      this.setState({
        ip_address: response.data.ip_address,
        billing_city: response.data.city,
        billing_state: response.data.region_iso_code,
        billing_longitude: response.data.longitude,
        billing_latitude: response.data.latitude,
        customerID: response.customerID,
        customer_name: response.name,
        billing_zip: response.postal_code,
        phone: response.phone,
        tier: response.tier,
        bvn: response.bvn,
        accountNumber: response.accountNumber
      });
    } catch (error) {
      console.error(error)
    }
  }
  // https://ipgeolocation.abstractapi.com/v1/?api_key=9065ec7c1dcb4f6886cfc6f92275e936

  // {
  //   "transaction_amt": 7,
  //   "email_address": "synthetic@example.com",
  //   "ip_address": "27.67.182.10",
  //   "transaction_currency": "USD",
  //?   "event_id": "09a62617-a4af-40f3-926b-a0808c92015c",
  //?   "entity_id": "269-37-3393",
  //   "event_time": "2021-11-09T22:56:43.62265",
  //   "billing_longitude": "-80.771",
  //   "billing_state": "VA",
  //   "user_agent": "Opera/8.70.(Windows NT 6.0; mk-MK)",
  //   "billing_street": "370 Synthetic Courts",
  //   "billing_city": "Pulaski",
  //   "card_bin": "423768",
  //?   "customer_name": "Synthetic Zamzam",
  //?   "product_category": "misc_pos",
  //?   "customer_job": "Synthetic Creator",
  //   "phone": "412-515-4616-28430",
  //   "billing_latitude": "37.0567",
  //   "billing_zip": "24301"
  //   }

  // {"ip_address":"76.127.200.97","city":"Allston","city_geoname_id":4928934,"region":"Massachusetts","region_iso_code":"MA","region_geoname_id":6254926,"postal_code":"02134","country":"United States","country_code":"US","country_geoname_id":6252001,"country_is_eu":false,"continent":"North America","continent_code":"NA","continent_geoname_id":6255149,"longitude":-71.137,"latitude":42.3513,"security":{"is_vpn":false},"timezone":{"name":"America/New_York","abbreviation":"EDT","gmt_offset":-4,"current_time":"23:20:20","is_dst":true},"flag":{"emoji":"🇺🇸","unicode":"U+1F1FA U+1F1F8","png":"https://static.abstractapi.com/country-flags/US_flag.png","svg":"https://static.abstractapi.com/country-flags/US_flag.svg"},"currency":{"currency_name":"USD","currency_code":"USD"},"connection":{"autonomous_system_number":7922,"autonomous_system_organization":"COMCAST-7922","connection_type":"Cable/DSL","isp_name":"Comcast Cable Communications, LLC","organization_name":"Comcast Cable Communications, LLC"}}

  uploading = () => {
    this.setState({ isLoading: true })
    // setClientToken(this.state.token);

    const {
      transaction_amt,
      transaction_currency,
      product_category,
      event_id,
      entity_id,
      event_time,
      billing_street,
      billing_city,
      customer_job,
      billing_state,
      billing_zip,
      billing_longitude,
      billing_latitude,
      email_address,
      phone,
      customer_name,
      ip_address,
      user_agent,
      card_bin
    } = this.state;

    if (product_category == "") {
      // setIsLoading(false);
      // setUs("empty");
    } else if (transaction_amt == 0) {
      // setIsLoading(false);
      // setEmbu("empty");
    } else if (billing_street == "") {
      // setIsLoading(false);
      // setPa("empty");
    } else if (customer_job == "") {
      // setIsLoading(false);
      // setNa("empty");
    } else {
      const onSuccess = ({ data }) => {
        this.setState({ isLoading: false, isAuthorized: true });
        console.log(data);
        Alert.alert('Info: ', 'Uploaded Document successfully',
          [
            {
              text: 'Ok',
              onPress: () => {
                this.props.navigation.replace('hcfgdfd')
              }
            }
          ]
        )
      };

      const onFailure = error => {
        console.log(error && error.response);
        this.setState({ isLoading: false });
        if (error.response == null) {
          this.setState({ isLoading: false });
          Alert.alert('Info: ', 'Network Error')
        }

        if (error.response.status == 400) {
          Alert.alert('Info: ', 'Ensure you enter the details required')
        } else if (error.response.status == 500) {
          Alert.alert('Info: ', 'Ensure your Network is Stable')
        } else if (error.response.status == 401) {
          Alert.alert('Info: ', 'UnAunthorized')
        } else if (error.response.status == 404) {
          Alert.alert('Info: ', 'Not Found')
        }
        console.log("Heyyyyyyy!!!", error.response.status);

        this.setState({ errors: error.response.data, isLoading: false });
      };

      this.setState({ isLoading: true });

      // secureBankService
      //   .post(`/transactions`, payload)
      //   .then(onSuccess)
      //   .catch(onFailure);
    }
  }
  render() {

    const { billing_city, billing_state, legitimate, fradulent } = this.state;
    
    LogBox.ignoreAllLogs(true);
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <View style={{ alignSelf: "center" }}>
          <View style={{ alignSelf: "center", flexDirection: "row", borderRadius: 1, borderWidth: 0.5, borderColor: "white", backgroundColor: "#3B82A0", paddingHorizontal: 10, width: width, shadowColor: "#000000", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, elevation: 5, alignSelf: "baseline" }}>
            <Entypo
              name={"info-with-circle"}
              size={18}
              style={{ marginEnd: 5, color: "#FFF", paddingVertical: 12 }} />
            <MarqueeText
              style={styles.importantInfoStyle}
              speed={0.2}
              marqueeOnStart={true}
              loop={true}
              delay={1000}>
              Important Information: Note, Only one transaction is allowed in Secure Bank Application...
            </MarqueeText>
          </View>

          <View style={styles.emailTextStyleView}>
            <Text style={styles.textStylePosition}>Product Category</Text>
            <View style={{
              width: width * 0.9,
              height: 63,
              padding: 1,
              borderRadius: 10
            }}>

              <View style={styles.dropdownGender}>
                <Dropdown
                  value={"Select Product Category"}
                  data={this.state.product_cat}
                  baseColor={"transparent"}
                  textColor={"#3B82A0"}
                  fontSize={15}
                  selectedItemColor={"#3B82A0"}
                  disabledItemColor={"#959595"}
                  underlineColor={'transparent'}
                  fontFamily={"Nunito_400Regular"}
                  style={{ fontFamily: "Nunito_400Regular", backgroundColor: "transparent", top: -4 }}
                  itemPadding={8}
                  pickerStyle={{ backgroundColor: "#FFFFFF", }}
                  itemTextStyle={{ marginLeft: 5, fontFamily: "Nunito_400Regular", height: 52, padding: 8, }}
                  dropdownMargins={{ min: 8, max: 6 }}
                  overlayStyle={{ alignSelf: "center", backgroundColor: "#00000030", }}
                  dropdownOffset={{ top: 55, left: 6 }}
                  containerStyle={{
                    borderColor: "#DBE1EA",
                    backgroundColor: "#FFF",
                    borderWidth: 1,
                    borderRadius: 10,
                    marginHorizontal: 10,
                    paddingHorizontal: 0,
                    height: 52,
                    alignSelf: "center",
                    width: width * 0.9,
                    fontFamily: "Nunito_400Regular",
                  }}
                // onChangeText={(value) => this.handleCategory(value)}
                />
                <AntDesign
                  name="down"
                  color="#959595"
                  style={{ alignSelf: "flex-end", right: 20, bottom: 32, opacity: 1 }}
                  size={13} />
              </View>

            </View>
            {this.state.phone == "chibu@yahoo.com" && this.state.us == "good" && <Text style={styles.invalidPasswordTextStyle}>This phone number does not exist</Text>}
            {this.state.us == "empty" && this.state.phone == "" && <Text style={styles.invalidPasswordTextStyle}>This phone number does not exist</Text>}
          </View>

          <View style={styles.passwordTextStyleView}>
            <Text style={styles.textStylePosition}>Amount</Text>

            <View style={{
              width: width * 0.9,
              height: 63,
              padding: 1,
              borderRadius: 10
            }}>
              <View style={{ flexDirection: "row", }}>
                <TextInput
                  backgroundColor="#FFF"
                  borderWidth={1}
                  fontSize={16}
                  color={"#2B3037"}
                  borderColor={this.state.pa == "empty" ? 'red' : "#DBE1EA"}
                  width={width * 0.9}
                  height={52}
                  borderRadius={10}
                  textAlign="left"
                  paddingVertical={8}
                  paddingHorizontal={16}
                  opacity={1}
                  maxLength={11}
                  alignSelf={"center"}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  keyboardType="number-pad"
                  returnKeyType="next"
                  numberOfLines={22}
                  placeholder={"Enter Amount"}
                // ref={(input) => { this.secondTextInput = input; }}
                // value={"Lily Bello"}
                />
              </View>
            </View>

            {/* <View style={styles.passwordTextStyleView}>
              <Text style={styles.textStylePosition}>Receiver's Name</Text>

              <View style={{
                width: width * 0.9,
                height: 63,
                padding: 1,
                borderRadius: 10
              }}>
              <TextInput
                backgroundColor= "#FFF"
                borderWidth = {1}
                fontSize={16}
                color={"#2B3037"}
                borderColor={this.state.pa == "empty" ? 'red' : "#DBE1EA"}
                width= {width * 0.9}
                height= {52}
                borderRadius = {10}
                textAlign = "left"
                paddingVertical ={8}
                paddingHorizontal ={16}
                opacity= {1}
                maxLength={11}
                alignSelf={"center"}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                returnKeyType="next"
                numberOfLines={22}
                placeholder={"Enter Receiver's Full name Address"}
                // ref={(input) => { this.secondTextInput = input; }}
                // value={"Lily Bello"}
              />
              </View>
            </View>
             */}
            <View style={styles.passwordTextStyleView}>
              <Text style={styles.textStylePosition}>Address (Street)</Text>

              <View style={{
                width: width * 0.9,
                height: 63,
                padding: 1,
                borderRadius: 10
              }}>
                <TextInput
                  backgroundColor="#FFF"
                  borderWidth={1}
                  fontSize={16}
                  color={"#2B3037"}
                  borderColor={this.state.pa == "empty" ? 'red' : "#DBE1EA"}
                  width={width * 0.9}
                  height={52}
                  borderRadius={10}
                  textAlign="left"
                  paddingVertical={8}
                  paddingHorizontal={16}
                  opacity={1}
                  maxLength={11}
                  alignSelf={"center"}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  returnKeyType="next"
                  numberOfLines={22}
                  placeholder={"Enter your Address"}
                // ref={(input) => { this.secondTextInput = input; }}
                // value={"Lily Bello"}
                />
              </View>
            </View>

            <View style={styles.passwordTextStyleView}>
              <Text style={styles.textStylePosition}>City</Text>

              <View style={{
                width: width * 0.9,
                height: 63,
                padding: 1,
                borderRadius: 10
              }}>
                <TextInput
                  backgroundColor="#FFF"
                  borderWidth={1}
                  fontSize={16}
                  color={"#2B3037"}
                  borderColor={this.state.pa == "empty" ? 'red' : "#DBE1EA"}
                  width={width * 0.9}
                  height={52}
                  borderRadius={10}
                  textAlign="left"
                  paddingVertical={8}
                  paddingHorizontal={16}
                  opacity={1}
                  maxLength={11}
                  alignSelf={"center"}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  returnKeyType="next"
                  numberOfLines={22}
                  placeholder={billing_city}
                // ref={(input) => { this.secondTextInput = input; }}
                // value={"Lily Bello"}
                />
              </View>
            </View>

            <View style={styles.passwordTextStyleView}>
              <Text style={styles.textStylePosition}>State</Text>

              <View style={{
                width: width * 0.9,
                height: 63,
                padding: 1,
                borderRadius: 10
              }}>
                <TextInput
                  backgroundColor="#FFF"
                  borderWidth={1}
                  fontSize={16}
                  color={"#2B3037"}
                  borderColor={this.state.pa == "empty" ? 'red' : "#DBE1EA"}
                  width={width * 0.9}
                  height={52}
                  borderRadius={10}
                  textAlign="left"
                  paddingVertical={8}
                  paddingHorizontal={16}
                  opacity={1}
                  maxLength={11}
                  alignSelf={"center"}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  returnKeyType="next"
                  numberOfLines={22}
                  placeholder={billing_state}
                // ref={(input) => { this.secondTextInput = input; }}
                // value={"Lily Bello"}
                />
              </View>
            </View>

            <View style={styles.passwordTextStyleView}>
              <Text style={styles.textStylePosition}>Description (Compulsory)</Text>

              <View style={{
                width: width * 0.9,
                height: 63,
                padding: 1,
                borderRadius: 10
              }}>
                <TextInput
                  backgroundColor="#FFF"
                  borderWidth={1}
                  fontSize={16}
                  color={"#2B3037"}
                  borderColor={this.state.pa == "empty" ? 'red' : "#DBE1EA"}
                  width={width * 0.9}
                  height={100}
                  borderRadius={10}
                  textAlign="left"
                  paddingVertical={16}
                  paddingHorizontal={16}
                  marginBottom={26}
                  opacity={1}
                  maxLength={11}
                  alignSelf={"center"}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  returnKeyType="next"
                  numberOfLines={12}
                  multiline={true}
                  style={{ textAlignVertical: 'top' }}
                // ref={(input) => { this.secondTextInput = input; }}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={this.uploading}>
              <Text style={styles.loginButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
};

export default QuickTransaction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  importantInfoStyle: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
    opacity: 1,
    fontFamily: "Nunito_400Regular",
    alignSelf: "center",
    margin: 10
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  placeholderStyles: {
    color: "grey",
  },
  dropdownGender: {
    // width: "100%",
    // marginBottom: 15,
  },
  dropdown: {
    borderColor: "#B7B7B7",
    height: 50,
  },
  emailTextStyleView: {
    marginTop: 24,
    alignSelf: "center",
  },
  textStylePosition: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: "left",
    opacity: 1,
    fontWeight: "400",
    color: "#959595",
  },
  passwordTextStyleView: {
    marginTop: 15,
    alignSelf: "center",
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 16,
    color: 'black',
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#DDDDDD',
    padding: 5,
  },
  queStyle: {
    fontSize: 14,
    color: "#5C6168",
    fontWeight: "600",
    lineHeight: 21,
    marginStart: 2,
  },
  radioButtons: {
    height: 37,
    padding: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3B82A0", //"#D0D5DD",
    alignSelf: "flex-start",
    marginBottom: 20,
    marginEnd: 16
  },
  imageIconStyle: {
    height: 20,
    width: 20,
    resizeMode: 'stretch',
  },
  listText: {
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: "#4848FF",
    marginEnd: 5,
    marginTop: 5
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 20,
    padding: 5
  },
  submitButton: {
    width: width * 0.89,
    borderColor: "#3B82A0",
    borderWidth: 1,
    borderRadius: 15,
    alignSelf: "center",
    height: 44,
    backgroundColor: "#3B82A0",
    marginBottom: 8,
    marginTop: 70,
    opacity: 1,
  },
});



// GraphQL endpoint: https://ld5oa7ohmbbsdeljytn6afrk2y.appsync-api.us-east-1.amazonaws.com/graphql
// GraphQL API KEY: da2-52fvpcwsl5hxnp5jbgle64lr6m

// GraphQL transformer version: 2