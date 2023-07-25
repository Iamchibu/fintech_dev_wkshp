import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  StatusBar,
  Alert,
  Dimensions,
  LogBox,
  Platform
} from "react-native";
// import secureBankService from ".././service/SecureBankService";
import { FontAwesome } from "@expo/vector-icons";
// import  Loader  from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-tiny-toast';
import { Auth, Amplify } from 'aws-amplify';
import awsExports from '../../src/aws-exports';
Amplify.configure(awsExports);
const { width, height } = Dimensions.get("window");

const SignUp = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [na, setNa] = useState("");
  const [us, setUs] = useState("");
  const [password, setPassword] = useState("");
  const [pa, setPa] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [pn, setPn] = useState("");
  const [address, setAddress] = useState("");
  const [add, setAdd] = useState("");
  const [token, setToken] = useState("");
  const [embu, setEmbu] = useState("");
  const [correct, setCorrect] = useState(false);
  const [correctPassword, setcorrectPassword] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const nameInput = useRef();
  const passwordSignUpInput = useRef();
  const phoneNumberInput = useRef();
  const addresssInput = useRef();

  const handleUsername = (username) => {
    if (username != "") {
      setUsername(username);
      setEmbu("");
      setUs("");
      validate(username);
    } else {
      setUsername(username);
      setEmbu("empty");
      setUs("empty");
    }
  };

  const handlePassword = (password) => {
    if (password != "") {
      setPassword(password);
      setPa("");
      validatePassword(password);
    } else {
      setPassword(password);
      setPa("empty");
    }
  };

  const handlePhoneNo = (phoneNo) => {
    if (phoneNo != "") {
      setPhoneNo(phoneNo);
      setPn("");
    } else {
      setPhoneNo(phoneNo);
      setPn("empty");
    }
  };

  const handleName = (name) => {
    if (name != "") {
      setName(name);
      setNa("");
    } else {
      setName(name);
      setNa("empty");
    }
  };

  const handleAddress = (address) => {
    if (address != "") {
      setAddress(address);
      setAdd("");
    } else {
      setAddress(address);
      setAdd("empty");
    }
  };

  const validatePassword = (password) => {
    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (regularExpression.test(password) === false) {
      setPassword(password);
      setPa("empty");
      setcorrectPassword(false);
      console.log("Password is Not Correct");
      return false;
    } else {
      setPassword(password);
      setPa("");
      setcorrectPassword(true);
      console.log("Password is Correct");
      return true;
    }
  }

  const validate = (text) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      console.log("Email is Not Correct");
      setUsername(text);
      setCorrect(false);
      return false;
    }
    else {
      setUsername(text);
      setCorrect(true);
      console.log("Email is Correct");
    }
  }

  const onPressSignUp = async () => {
    setIsLoading(true);

    if (username == "") {
      setIsLoading(false);
      setUs("empty");
    } else if (username != "" && embu == "empty" && !correct) {
      setIsLoading(false);
      setEmbu("empty");
    } else if (password == "") {
      setIsLoading(false);
      setPa("empty");
    } else if (password != "" && pa == "empty" && !correctPassword) {
      setIsLoading(false);
      setPa("empty");
    } else if (name == "") {
      setIsLoading(false);
      setNa("empty");
    } else if (phoneNo == "") {
      setIsLoading(false);
      setPn("empty");
    } else if (address == "") {
      setIsLoading(false);
      setAdd("empty");
    } else {
      const email = username;
      const phone_number = phoneNo

      setIsLoading(false);
      try {
        await Auth.signUp({
          username,
          password,
          attributes: {
            email,
            name,
            phone_number,
            address
          },
        })
        success()
        navigation.navigate("ConfirmEmail", {
          email: username
        });
      }
      catch (e) {
        Alert.alert(e.message);
      }
    }
  }

  const removeItemValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (exception) {
      return false;
    }
  }

  const _storeData = async (value) => {
    await removeItemValue("userDetails");
    try {
      await AsyncStorage.setItem("userDetails", JSON.stringify(value));

    } catch (error) {
    }
    console.log("This is for storing data...", value);
  };

  const success = () => {
    Toast.show('User created successfully!', {
      position: Toast.position.center,
      containerStyle: { backgroundColor: "#3B82A0", borderRadius: 10, padding: 10, margin: 10 },
      duration: 1000,
      delay: 0,
      textStyle: { color: "#FFF", fontSize: 13, fontWeight: "400", },
      imgStyle: {},
      mask: true,
      maskStyle: {},
    })
  }

  const updateSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry)
  }

  LogBox.ignoreAllLogs(true);
  return (
    <ImageBackground
      source={require("./../../assets/landing.png")}
      style={styles.image}>

      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
      {/* <Loader loading={isLoading} /> */}
      <ScrollView style={{ height: Platform.OS === "ios" ? height : height * 0.6 }}>
        <Image
          source={require("./../../assets/small.png")}
          resizeMode={'cover'}
          marginTop={height * 0.06}
          alignSelf={"center"} />

        <View style={styles.viewBottomSheetStyle}>
          <Text style={styles.displayTextStyle}>Create An Account</Text>

          <ScrollView style={{ alignSelf: "center", flex: 1, width: width }}>
            <View style={styles.emailTextStyleView}>
              <Text style={styles.emailTextStyle}>Email Address</Text>
              <TextInput
                style={styles.textInputStyle}
                borderColor={us == "empty" ? 'red' : "#3B82A030"}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder={"Enter you Email"}
                placeholderTextColor={"#DAD3D3"}
                autoFocus={true}
                returnKeyType="next"
                onSubmitEditing={() => passwordSignUpInput.current.focus()}
                blurOnSubmit={false}
                value={username}
                onChangeText={handleUsername}
              />
              {us == "empty" && username == "" && <Text style={styles.invalidEmailTextStyle}>E-mail is empty</Text>}
              {!correct && username != "" && <Text style={styles.invalidEmailTextStyle}>E-mail is not correct</Text>}
            </View>

            <View style={styles.passwordTextStyleView}>
              <Text style={styles.passwordTextStyle}>Password</Text>
              <View style={{ flexDirection: "row", marginHorizontal: 24 }}>
                <TextInput
                  borderColor={pa == "empty" ? 'red' : "#3B82A030"}
                  style={styles.textInputStyle}
                  placeholder={"***********"}
                  placeholderTextColor={"#DAD3D3"}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  returnKeyType="next"
                  ref={passwordSignUpInput}
                  onSubmitEditing={() => nameInput.current.focus()}
                  blurOnSubmit={false}
                  value={password}
                  secureTextEntry={secureTextEntry ? true : false}
                  onChangeText={handlePassword}
                />

                {password ?
                  <TouchableOpacity
                    onPress={updateSecureTextEntry}>
                    {secureTextEntry ?
                      <View
                        style={{ alignSelf: "flex-end", right: 20, marginTop: 15, position: "absolute" }}>
                        <FontAwesome
                          name="eye"
                          color={"#3B82A0"}
                          size={16} />
                      </View>
                      :
                      <View
                        style={{ alignSelf: "flex-end", right: 20, marginTop: 15, position: "absolute" }}>
                        <FontAwesome
                          name="eye-slash"
                          color={"#3B82A0"}
                          size={16} />
                      </View>
                    }

                  </TouchableOpacity> : null}
              </View>
              {!correctPassword && pa == "empty" && password != "" && <Text style={styles.invalidPasswordTextStyle}>Password is not strong</Text>}
              {pa == "empty" && password == "" && <Text style={styles.invalidPasswordTextStyle}>Password is empty</Text>}
            </View>

            <View style={styles.otherTextStyleView}>
              <Text style={styles.otherTextStyle}>Full Name</Text>
              <TextInput
                style={styles.textInputStyle}
                borderColor={na == "empty" ? 'red' : "#3B82A030"}
                underlineColorAndroid="transparent"
                autoCapitalize="words"
                placeholder={"Enter you full name"}
                placeholderTextColor={"#DAD3D3"}
                returnKeyType="next"
                ref={nameInput}
                blurOnSubmit={false}
                onSubmitEditing={() => phoneNumberInput.current.focus()}
                value={name}
                onChangeText={handleName}
              />
              {na == "empty" && name == "" && <Text style={styles.invalidEmailTextStyle}>Full Name is empty</Text>}
            </View>

            <View style={styles.otherTextStyleView}>
              <Text style={styles.otherTextStyle}>Phone Number</Text>
              <TextInput
                style={styles.textInputStyle}
                borderColor={pn == "empty" ? 'red' : "#3B82A030"}
                underlineColorAndroid="transparent"
                keyboardType="numeric"
                placeholder={"+1 *** *** ****"}
                maxLength={12}
                placeholderTextColor={"#DAD3D3"}
                returnKeyType="next"
                ref={phoneNumberInput}
                blurOnSubmit={false}
                onSubmitEditing={() => addresssInput.current.focus()}
                value={phoneNo}
                onChangeText={handlePhoneNo}
              />
              {pn == "empty" && phoneNo == "" && <Text style={styles.invalidEmailTextStyle}>Phone Number is empty</Text>}
              {/* {!correct && phoneNo != "" && <Text style={styles.invalidEmailTextStyle}>Phone Number is not correct</Text>} */}
            </View>

            <View style={styles.otherTextStyleView}>
              <Text style={styles.otherTextStyle}>Address</Text>
              <TextInput
                style={styles.textInputStyle}
                borderColor={add == "empty" ? 'red' : "#3B82A030"}
                underlineColorAndroid="transparent"
                autoCapitalize="words"
                placeholder={"Enter your address"}
                placeholderTextColor={"#DAD3D3"}
                ref={addresssInput}
                // onSubmitEditing={() => phoneNumberInput.current.focus()}
                blurOnSubmit={false}
                value={address}
                onChangeText={handleAddress}
              />
              {add == "empty" && address == "" && <Text style={styles.invalidEmailTextStyle}>Address is empty</Text>}
            </View>

            <TouchableOpacity
              onPress={() => onPressSignUp()}
              style={styles.buttonView}>
              <Text style={styles.loginButtonText}>Submit</Text>
            </TouchableOpacity>

            <View flexDirection="row" alignSelf="flex-start" marginTop={16} marginBottom={30} marginHorizontal={24}>
              <Text style={styles.dontHaveAccountTextStyle}>Already own an account?{" "}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("SignIn")
                }>
                <Text style={styles.dontHaveAccountMintTextStyle}>Log In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

export default SignUp;

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    flex: 1,
    backgroundColor: "#FFF",
    height: Platform.OS === "ios" ? height : height
  },
  customStyles: {
    container: {
      justifyContent: "center",
      alignItems: "center",
      borderTopStartRadius: 20,
      borderTopEndRadius: 20,
      backgroundColor: "#3B82A033"
    },
    wrapper: { backgroundColor: "transparent" }
  },
  viewBottomSheetStyle: {
    // position: "absolute",
    bottom: 0,
    backgroundColor: "#3B82A033",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    alignItems: "center",
    width: width,
    height: height * 0.79,
    marginTop: Platform.OS === "ios" ? height * 0.11 : height * 0.15
  },
  emailTextStyleView: {
    marginTop: 24,
    alignSelf: "center"
  },
  emailTextStyle: {
    color: "#959595",
    fontSize: 16,
    lineHeight: 19.2,
    fontWeight: "700",
    marginBottom: 8
  },
  passwordTextStyleView: {
    marginTop: 16,
    alignSelf: "center"
  },
  passwordTextStyle: {
    color: "#959595",
    fontSize: 16,
    lineHeight: 19.2,
    fontWeight: "700",
    marginBottom: 8,
    marginStart: 24
  },
  textInputStyle: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#3B82A030",
    borderRadius: 15,
    width: width * 0.9,
    height: 48,
    textAlign: "left",
    paddingVertical: 8,
    alignSelf: "center",
    paddingStart: 10,
    paddingEnd: 22,
    opacity: 1,
    fontSize: 16
  },
  otherTextStyleView: {
    marginTop: 16,
    alignSelf: "center"
  },
  otherTextStyle: {
    color: "#959595",
    fontSize: 16,
    lineHeight: 19.2,
    fontWeight: "700",
    marginBottom: 8
  },
  displayTextStyle: {
    fontSize: 20,
    color: "#3B82A0",
    alignSelf: "flex-start",
    marginStart: 24,
    fontWeight: "700",
    marginTop: 31
  },
  forgetTextStyle: {
    fontSize: 16,
    color: "#3B82A0",
    marginTop: 5,
    bottom: 2,
    fontWeight: "700",
    lineHeight: 19.2,
    textDecorationLine: "underline"
  },
  invalidEmailTextStyle: {
    fontSize: 12,
    color: "#FF0000",
    backgroundColor: "pink",
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    textAlign: "left",
    opacity: 1,
    top: 5,
  },
  invalidPasswordTextStyle: {
    fontSize: 12,
    color: "#FF0000",
    backgroundColor: "pink",
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    marginStart: 24,
    textAlign: "left",
    opacity: 1,
    top: 5,
  },
  dontHaveAccountTextStyle: {
    fontSize: 16,
    color: "#959595",
    marginBottom: 1,
    opacity: 1,
    fontWeight: "400",
    alignSelf: "flex-start",
  },
  dontHaveAccountMintTextStyle: {
    fontSize: 16,
    color: "#3B82A0",
    marginBottom: 1,
    fontWeight: "700",
    opacity: 1,
    alignSelf: "center",
    lineHeight: 19.2,
    textDecorationLine: "underline"
  },
  buttonView: {
    borderRadius: 15,
    alignSelf: "center",
    height: 44,
    width: width * 0.9,
    backgroundColor: "#3B82A0",
    marginBottom: 5,
    marginTop: 24,
    marginHorizontal: 24
  },
  loginButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    padding: 10,
    fontWeight: "400",
    fontSize: 20,
    lineHeight: 20
  },
  scrollView: {
    flex: 1
  }
});