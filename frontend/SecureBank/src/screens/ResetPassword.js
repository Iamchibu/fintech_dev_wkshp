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
import { Auth, Amplify } from 'aws-amplify';
import awsExports from '../../src/aws-exports';
Amplify.configure(awsExports);
const { width, height } = Dimensions.get("window");

const ResetPassword = ({ route, navigation }) => {
  const { email } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [na, setNa] = useState("");
  const [us, setUs] = useState("");
  const [password, setPassword] = useState("");
  const [pa, setPa] = useState("");
  const [correct, setCorrect] = useState(false);
  const [correctPassword, setcorrectPassword] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const codeInput = useRef();
  const passwordSignUpInput = useRef();

  const handleUsername = (username) => {
    if(username != ""){
        setUsername(username);
        setEmbu("");
        setUs("");
        validate(username);
      }else{
        setUsername(username);
        setEmbu("empty");
        setUs("empty");
      }
  };

  const handlePassword = (password) => {  
    if(password != ""){
        setPassword(password);
        setPa("");
        validatePassword(password);
    }else {
        setPassword(password);
        setPa("empty");
    } 
  };

  const handleCode = (code) => {  
    if(code != ""){
        setCode(code);
        setNa("");
    }else {
        setCode(code);
        setNa("empty");
    } 
  };

  const validatePassword = (password) => {
    var regularExpression = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if(regularExpression.test(password) === false){
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

  const onPressResetPassword = async () => {
    setIsLoading(true);
    const username = email
    if(password == ""){
        setIsLoading(false);
        setPa("empty");
    }else if(password != "" && pa == "empty" && !correctPassword){
        setIsLoading(false);
        setPa("empty");
    }else if(code == ""){
      setIsLoading(false);
      setNa("empty");
    }else{
    
    setIsLoading(false);
    try{
      await Auth.forgotPasswordSubmit(username, code, password)
      success();
      navigation.navigate("SignIn");
      }
      catch(e){
        Alert.alert(e.message);
      }
    }
  } 

  const success = () => {
    Toast.show('Password changed Successfully!',{
      position: Toast.position.center,
      containerStyle:{ backgroundColor:"#3B82A0", borderRadius: 10, padding: 10, margin: 10 },
      duration: 1000,
      delay: 0,
      textStyle: {color: "#FFF", fontSize: 13, fontWeight: "400", },
      imgStyle: {},
      mask: true,
      maskStyle:{},
    })
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

    const updateSecureTextEntry = () => {
        setSecureTextEntry(!secureTextEntry)
    } 

    LogBox.ignoreAllLogs(true);
    return (
      <ImageBackground
        source={require("./../../assets/landing.png")}
        style={styles.image}>
            
          <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
          {/* <Loader loading={isLoading} /> */}
          <Image 
            source={require("./../../assets/small.png")}
            resizeMode={'cover'} 
            marginTop={height * 0.06} 
            alignSelf={"center"}/>

          <View style={styles.viewBottomSheetStyle}>
          <Text style={styles.displayTextStyle}>Create An Account</Text>
          
          <ScrollView style={{ height: height * 0.6 }}>
          <View style={styles.emailTextStyleView}>
          <Text style={styles.emailTextStyle}>Email Address</Text>
              <TextInput
                style={styles.textInputStyle}
                borderColor={us == "empty" ? 'red' : "#3B82A030"}
                underlineColorAndroid="transparent"
                backgroundColor={"#DDD"}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder={"Enter you Email"}
                placeholderTextColor={"#DAD3D3"}
                autoFocus={true}
                returnKeyType="next"
                editable={false}
                onSubmitEditing={() => passwordSignUpInput.current.focus()}
                blurOnSubmit={false}
                value={email}
                onChangeText={handleUsername}
              /> 
              {us == "empty" && username == "" && <Text style={styles.invalidEmailTextStyle}>E-mail is empty</Text>}
              {!correct && username != "" && <Text style={styles.invalidEmailTextStyle}>E-mail is not correct</Text>}
            </View>
            
            <View style={styles.passwordTextStyleView}>
              <Text style={styles.passwordTextStyle}>Password</Text>
              <View style={{flexDirection: "row", marginHorizontal: 24 }}>
              <TextInput
                borderColor={pa == "empty" ? 'red' : "#3B82A030"}
                style={styles.textInputStyle}
                placeholder={"***********"}
                placeholderTextColor={"#DAD3D3"}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                returnKeyType="next"
                ref={passwordSignUpInput}
                onSubmitEditing={() => codeInput.current.focus()}
                blurOnSubmit={false}
                value={password}
                secureTextEntry={secureTextEntry?true:false}
                onChangeText={handlePassword}
              />

              {password ? 
              <TouchableOpacity 
                onPress={updateSecureTextEntry}>
                {secureTextEntry ?
                <View
                style={{alignSelf: "flex-end", right: 20, marginTop: 15, position: "absolute" }}>
                  <FontAwesome
                    name="eye"
                    color={"#3B82A0"}
                    size={16}/>
                </View>
                 :
                 <View
                 style={{alignSelf: "flex-end", right: 20, marginTop: 15, position: "absolute" }}>
                  <FontAwesome
                    name="eye-slash"
                    color={"#3B82A0"}
                    size={16}/>
                 </View>
                }
                
              </TouchableOpacity> : null} 
              </View>
              {!correctPassword && pa == "empty" && password != "" && <Text style={styles.invalidPasswordTextStyle}>Password is not strong</Text>}
              {pa == "empty" && password == "" && <Text style={styles.invalidPasswordTextStyle}>Password is empty</Text>}
              </View>

              <View style={styles.otherTextStyleView}>
              <Text style={styles.otherTextStyle}>OTP Code</Text>
                <TextInput
                  style={styles.textInputStyle}
                  borderColor={na == "empty" ? 'red' : "#3B82A030"}
                  underlineColorAndroid="transparent"
                  placeholder={"Enter your code"}
                  placeholderTextColor={"#DAD3D3"}
                  returnKeyType="next"
                  ref={codeInput}
                  blurOnSubmit={false}
                //   onSubmitEditing={() => phoneNumberInput.current.focus()}
                  value={code}
                  onChangeText={handleCode}
                /> 
                {na == "empty" && code == "" && <Text style={styles.invalidEmailTextStyle}>Code field is empty</Text>}
              </View>
            
            <TouchableOpacity
                onPress={()=> onPressResetPassword()}
                style={styles.buttonView}>
                <Text style={styles.loginButtonText}>Submit</Text>
            </TouchableOpacity>
            </ScrollView>
            </View>
      </ImageBackground>
  );
}

export default ResetPassword ;

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
    height:  Platform.OS === "ios" ? height : height
  },
  customStyles: {
    container: {
      justifyContent: "center",
      alignItems: "center",
      borderTopStartRadius: 20,
      borderTopEndRadius: 20, 
      backgroundColor: "#3B82A033"
    },
    wrapper: {backgroundColor: "transparent"}
  },
  viewBottomSheetStyle: {
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
    width : width * 0.9,
    height : 48,
    textAlign : "left",
    paddingVertical: 8,
    alignSelf: "center",
    paddingStart : 10,
    paddingEnd : 22,
    opacity : 1,
    fontSize : 16
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
    marginTop: 54,  
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