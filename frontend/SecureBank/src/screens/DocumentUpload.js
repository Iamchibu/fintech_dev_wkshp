import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  LogBox,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import Loader from "../components/Loader";
import { Amplify, Storage } from 'aws-amplify';
import awsconfig from '../aws-exports';
Amplify.configure(awsconfig);

export default function DocumentUpload({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState({});

  const fetchImageUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  }

  const _pickDocument = async () => {
      let result = await DocumentPicker.getDocumentAsync({ type: "application/pdf", copyToCacheDirectory: false });
      alert('You selected ' + result.name);
      console.log(result);
      setFileInfo(result)
  }

  const uploadFile = async () => {
    setIsLoading(true);
    const file = fileInfo
    if(Object.keys(file).length != 0){
    const pdf = await fetchImageUri(file.uri);
    return Storage.put(`${file.name}${new Date()}.pdf`,pdf, {
      level:'public',
      contentType:file.type,
      progressCallback(uploadProgress){
        console.log('PROGRESS--', uploadProgress.loaded + '/' + uploadProgress.total);
      }
    })
    .then((res) => {
      Storage.get(res.key)
      .then((result) => {
        console.log('RESULT --- ', result);
        let awsImageUri = result.substring(0,result.indexOf('?'))
        console.log('RESULT AFTER REMOVED URI --', awsImageUri)
        Alert.alert(null,"Document was uploaded successfully", [{
          text: 'Ok', onPress: () => navigation.navigate("ProfileScreen")
        }])
        setIsLoading(false)
      })
      .catch(e => {
        console.log(e);
      })
    }).catch(e => {
      console.log(e);
    })
  }else{
    setIsLoading(false);
    Alert.alert(null,"Please click here to pick a Document button..");
  }
  }

  const _retrieveData = () => {
    console.log("This method is called...")
    AsyncStorage.getItem('userDetails').then(res => {
      const response = JSON.parse(res)
      if (res !== null) {

        console.log("I want to make request o", response);
      } else {
        console.log("There is no token...")
      }

    });
  };

  useEffect(() => {
    _retrieveData()
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loader loading={isLoading} />
      <Text style={styles.titleText}>
        Document Upload
      </Text>
      <View style={styles.container}>

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={_pickDocument}>
          {/*Single file selection button*/}
          <Text style={{ marginRight: 10, fontSize: 19 }}>
            Click here to pick a Document
          </Text>
          <Image
            source={{
              uri: 'https://img.icons8.com/offices/40/000000/attach.png',
            }}
            style={styles.imageIconStyle}
          />
        </TouchableOpacity>
        {/*Showing the data of selected Single file*/}
        <Text style={styles.textStyle}>
          File Name: {fileInfo.name}
          {'\n'}
          File Description: {fileInfo.type}
          {'\n'}
          File Type: {fileInfo.type}
          {'\n'}
          File Content: {fileInfo.name}
          {'\n'}
          File Size: {fileInfo.size}B
          {'\n'}
          URI: {fileInfo.uri}
          {'\n'}
        </Text>
        <View
          style={{
            backgroundColor: 'grey',
            height: 2,
            margin: 10
          }} />
        <ScrollView>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={uploadFile}>
              <Text style={styles.loginButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
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
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#3B82A0',
    borderColor: '#FFFFFF',
    padding: 12,
    height: 48,
    width: 312,
    height: 44,
    borderRadius: 24,
    marginVertical: 10,
    opacity: 1,
    alignSelf: "center"
  },
});