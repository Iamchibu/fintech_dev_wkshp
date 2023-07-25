import React, { useRef, useState } from "react";
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
import Toast from 'react-native-tiny-toast';
import { FontAwesome } from "@expo/vector-icons";
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Auth, Amplify } from 'aws-amplify';
import awsExports from '../../src/aws-exports';
Amplify.configure(awsExports);


const { width, height } = Dimensions.get("window");

const SignIn = ({ route, navigation }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [email, setUsername] = useState("");
  const [us, setUs] = useState("");
  const [password, setPassword] = useState("");
  const [pa, setPa] = useState("");
  const [embu, setEmbu] = useState("");
  const [correct, setCorrect] = useState(false);
  const [correctPassword, setcorrectPassword] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const emailInput = useRef();

  const handleEmail = (email) => {
    if (email != "") {
      setUsername(email);
      setEmbu("");
      setUs("");
      validate(email);
    } else {
      setUsername(email);
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

  const onPressLogin = async () => {
    setIsLoading(true);

    if (email == "") {
      setIsLoading(false);
      setUs("empty");
    }
    else if (email != "" && embu == "empty" && !correct) {
      setIsLoading(false);
      setEmbu("empty");
    }
    else if (password == "") {
      setIsLoading(false);
      setPa("empty");
    }
    else if (password != "" && pa == "empty" && !correctPassword) {
      setIsLoading(false);
      setPa("empty");
    }
    else {
      const payload = { email, password };
      setIsLoading(false);
      try {
        const res = await Auth.signIn(email, password);
        console.log(res);
        _storeData(res.attributes);
        navigation.navigate("Dashboard");
        
        success();
      }
      catch (e) {
        Alert.alert(e.message);
      }
    }
  }

  const _storeData = async (value) => {
    try {
      await AsyncStorage.setItem("userDetails", JSON.stringify(value));

    } catch (error) {
    }
    console.log("This is for storing data...", value);
  };

  const updateSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry)
  }

  const success = () => {
    Toast.show('Login Successfully!', {
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

  LogBox.ignoreAllLogs(true);
  return (
    <ImageBackground
      source={require("./../../assets/landing.png")}
      style={styles.image}>

      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <Loader loading={isLoading} />
      <ScrollView style={{height: height * 0.6}}>
        <Image
          source={require("./../../assets/middle.png")}
          resizeMode={'cover'}
          marginTop={height * 0.13}
          alignSelf={"center"} />

        <View style={styles.viewBottomSheetStyle}>
          <Text style={styles.displayTextStyle}>Sign In</Text>

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
                onSubmitEditing={() => emailInput.current.focus()}
                blurOnSubmit={false}
                value={email}
                onChangeText={handleEmail}
              />
              {us == "empty" && email == "" && <Text style={styles.invalidEmailTextStyle}>E-mail is empty</Text>}
              {!correct && email != "" && <Text style={styles.invalidEmailTextStyle}>E-mail is not correct</Text>}
            </View>

            <View style={styles.passwordTextStyleView}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginHorizontal: 24, }}>
                <Text style={styles.passwordTextStyle}>Password</Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ForgotPassword")
                  }>
                  <Text style={styles.forgetTextStyle}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", alignSelf: "center", marginHorizontal: 24 }}>
                <TextInput
                  borderColor={pa == "empty" ? 'red' : "#3B82A030"}
                  style={styles.textInputStyle}
                  placeholder={"***********"}
                  placeholderTextColor={"#DAD3D3"}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                  ref={emailInput}
                  value={password}
                  secureTextEntry={secureTextEntry ? true : false}
                  onChangeText={handlePassword}
                />

                {password ?
                  <TouchableOpacity
                    onPress={updateSecureTextEntry.bind(this)}>
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

            <TouchableOpacity
              onPress={() => onPressLogin()}
              style={styles.buttonView}>
              <Text style={styles.loginButtonText}>Submit</Text>
            </TouchableOpacity>

            <View flexDirection="row" alignSelf="flex-start" marginVertical={10} marginHorizontal={24}>
              <Text style={styles.dontHaveAccountTextStyle}>Don't have an account?{" "}</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("SignUp")
                }>
                <Text style={styles.dontHaveAccountMintTextStyle}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

export default SignIn;

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
    bottom: 0,
    backgroundColor: "#3B82A033",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    alignItems: "center",
    width: width,
    height: height * 0.6,
    marginTop: Platform.OS === "ios" ? height * 0.11 : height * 0.15
  },
  emailTextStyleView: {
    marginTop: 40,
    alignSelf: "center",
  },
  emailTextStyle: {
    color: "#959595",
    fontSize: 16,
    lineHeight: 19.2,
    fontWeight: "700",
    marginBottom: 8
  },
  passwordTextStyleView: {
    marginTop: 24,
    width: width
  },
  passwordTextStyle: {
    color: "#959595",
    fontSize: 16,
    lineHeight: 19.2,
    fontWeight: "700",
    marginBottom: 8,
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