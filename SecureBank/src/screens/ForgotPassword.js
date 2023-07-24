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
import  Loader  from '../components/Loader';
import { Auth, Amplify } from 'aws-amplify';
import awsExports from '../../src/aws-exports';
Amplify.configure(awsExports);


const { width, height } = Dimensions.get("window");

const ForgotPassword = ({ route, navigation }) => {
    
//   const { email } = navigation.state.params;

  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setUsername] = useState("");
  const [embu, setEmbu] = useState("");
  const [us, setUs] = useState("");
  const [correct, setCorrect] = useState(false);
  
  const [ot, setOt] = useState("");
  
  useEffect(() => {
  },[]);

  const handleEmail = (email) => {
    if(email != ""){
        setUsername(email);
        setEmbu("");
        setUs("");
        validate(email);
      }else{
        setUsername(email);
        setEmbu("empty");
        setUs("empty");
      }
  };

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
  
  const onPressConfirm = async () => {
    setIsLoading(true);
    
    if(email == ""){
        setIsLoading(false);
        setUs("empty");
    } else if(email != "" && embu == "empty" && !correct){
    setIsLoading(false);
    setEmbu("empty");
    } else{
    const username = email
    setIsLoading(false);
    try{
    await Auth.forgotPassword(username)
    navigation.navigate("ResetPassword", {
        email: username
    })
    }
    catch(e){
      Alert.alert(e.message);
    }
    }
  }

    LogBox.ignoreAllLogs(true);
    return (
      <ImageBackground
        source={require("./../../assets/landing.png")}
        style={styles.image}>
            
          <StatusBar backgroundColor="#F4EFEF" barStyle="dark-content"/>
          <Loader loading={isLoading} />
          <Image 
            source={require("./../../assets/middle.png")}
            resizeMode={'cover'} 
            marginTop={height * 0.13} 
            alignSelf={"center"}/>

          <View style={styles.viewBottomSheetStyle}>
          <Text style={styles.displayTextStyle}>Forgot Password</Text>

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
            
            <TouchableOpacity
                onPress={()=> onPressConfirm()}
                style={styles.buttonView}>
                <Text style={styles.loginButtonText}>Submit</Text>
            </TouchableOpacity>
            </ScrollView>
            </View>
      </ImageBackground>
  );
}

export default ForgotPassword ;

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
    position: "absolute",
    bottom: 0,
    backgroundColor: "#3B82A033",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20, 
    alignItems: "center",
    width: width,
    height: height * 0.6
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
  usernameTextStyle: {
    backgroundColor: "#959595",
    color: "#FFF",
    fontSize: 13,
    lineHeight: 19.2,
    fontWeight: "700",
    marginBottom: 0,
    top: 3,
    marginStart: 24,
    alignSelf: "flex-start",
    paddingHorizontal: 3
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
  loginButtonText_: {
    color: "#3B82A0",
    textAlign: "center",
    padding: 6,
    fontWeight: "400",
    fontSize: 20,
  },
  loginButton: {
    width: width * 0.89,
    borderColor: "#3B82A0",
    borderWidth: 1,
    borderRadius: 15,
    alignSelf: "center", 
    height: 44, 
    backgroundColor: "#FFFFFF", 
    marginBottom: 8, 
    opacity: 1, 
  },
  scrollView: {
    flex: 1
  }
});