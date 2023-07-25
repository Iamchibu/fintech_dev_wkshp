import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  StatusBar,
  Alert,
  Dimensions,
  LogBox
} from "react-native";
const { width, height } = Dimensions.get("window");

const Welcome = ({ navigation }) => {
    LogBox.ignoreAllLogs(true);
    
    return (
      <ImageBackground
        source={require("./../../assets/landing.png")}
        style={styles.image}>
        <View
          style={styles.scrollView}
          keyboardShouldPersistTaps="always">
          <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content"/>

          <Image 
            source={require("./../../assets/middle.png")}
            resizeMode={'cover'} 
            marginTop={height * 0.25} 
            alignSelf={"center"}/>
          
          {/* <Loader loading={isLoading} /> */}
           
          <View style={styles.viewBottomSheetStyle}>
            <View style={styles.buttons}>
            <TouchableOpacity
                onPress={()=> navigation.navigate("SignIn")}
                style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Log in</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                onPress={()=> navigation.navigate("SignUp")}
                style={styles.signUpButton}>
                <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
            </View>
            <Text style={styles.licenseStyle}>Licensed by Secure Bank</Text>
        </View>
        </View>
      </ImageBackground>
  );
}

export default Welcome ;

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#FFF"
  },
  container: {
    flex: 1,
    alignItems: "center"
  },
  image: {
    flex: 1,
    backgroundColor: "#FFF",
    height: height
  },
  buttons: {
    position: "absolute",
    top: 30
  },
  licenseStyle: {
    fontSize: 12,
    color: "#00405B",
    fontWeight: "600",
    opacity: 1,
    alignSelf: "center",
    position: "absolute",
    bottom: 30,
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
    height: height * 0.455
  },
  buttonView: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 8,
    alignSelf: "center",
    flexDirection: "row",
    marginBottom: 5,
    height: 40,
    width: width * 0.81,
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
  signUpButton: {
    width: width * 0.89,
    borderColor: "#3B82A0",
    borderWidth: 1,
    borderRadius: 15,
    alignSelf: "center", 
    height: 44, 
    backgroundColor: "#3B82A0", 
    marginBottom: 8, 
    opacity: 1, 
  },
  loginButtonText: {
    color: "#3B82A0",
    textAlign: "center",
    padding: 6,
    fontWeight: "400",
    fontSize: 20,
  },
  signUpButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    padding: 6,
    fontWeight: "400",
    fontSize: 20,
  },
  scrollView: {
    flex: 1, 
    // backgroundColor: "#FFFFFF"
  },
});