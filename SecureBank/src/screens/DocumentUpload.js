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
  Dimensions,
  LogBox,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import Loader from "../components/Loader";
import { Amplify, Storage } from 'aws-amplify';
import awsconfig from '../aws-exports';

const { width } = Dimensions.get("window");
const WINDOW_HEIGHT = Dimensions.get("window").height;
Amplify.configure(awsconfig);

export default function DocumentUpload({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [media_type, setMediaType] = useState("application/pdf");
  const [fileInfo, setFileInfo] = useState("");

  const S3_BUCKET = 'S3 BUCKET name';
  const REGION = 'us-east-1';
  const ACCESS_KEY = 'Your Access key';
  const SECRET_ACCESS_KEY = 'us-east-1:abcdefghijklmnopqrstuvwxyz1234567890-Your secure access key';

  const config = {
    bucketName: S3_BUCKET,
    region: REGION,
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  }

  const fetchImageUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  }

  const _pickDocument = async () => {
      let result = await DocumentPicker.getDocumentAsync({ type: "application/pdf", copyToCacheDirectory: false });
      // uploadFile(result)
      alert('You selected ' + result.name);
      console.log(result);
      setFileInfo(result)
  }

  const uploadFile = async () => {
    setIsLoading(true)
    const file = fileInfo
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
  }

  const uploading = () => {
    setIsLoading(true)
    // setClientToken(token);

    const file_name = fileInfo.name;
    const description = fileInfo.type;
    const type = fileInfo.type;
    const file = fileInfo.uri;
    const size = fileInfo.size;
    // const id = navigation.state.params.id;

    if (file_name == null && description == null && type == null && file == null && size == null) {
      setIsLoading(false);
      Alert.alert("Info: ", "Please Click on the button above to select a file...", [
        { text: "Ok" },
      ]);
    } else {
      // if (size != null) {
      if (size < 2097152) {
        if (media_type == "application/pdf") {
          let options = { encoding: FileSystem.EncodingType.Base64 };
          FileSystem.readAsStringAsync(file, options).then(data => {
            const sign_off_document = 'data:application/pdf;base64,' + data;
            const payload = { sign_off_document };
            console.log(payload);

            const onSuccess = ({ data }) => {
              setIsLoading(false);
              console.log(data);
              Alert.alert('Info: ', 'Uploaded Document successfully', [
                {
                  text: 'Ok',
                  onPress: () => {
                    // navigation.replace('GenServicingStatusFO')
                  }
                }
              ])
            };

            const onFailure = error => {
              console.log(error && error.response);
              setIsLoading(false);
              if (error.response == null) {
                setIsLoading(false);
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

              setIsLoading(false);

            };

            setIsLoading(true);

            // secureBankService
            //   .put(`/generator/servicing_status/${id}/upload`, payload)
            //   .then(onSuccess)
            //   .catch(onFailure);
          }).catch(err => {
            console.log("​getFile -> err", err);
          });

        } else {
          Alert.alert(null, 'Only pdf file is required...')
        }
        // }
      } else {
        setIsLoading(false);
        Alert.alert(null, 'The file you selected is over 2MB\n* Please select less than 2MB file...')
      }
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
      {/* <Spinner
            visible={isLoading}
            textContent={"Loading..."}
            textStyle={styles.spinnerTextStyle}
        /> */}
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



// GraphQL endpoint: https://ld5oa7ohmbbsdeljytn6afrk2y.appsync-api.us-east-1.amazonaws.com/graphql
// GraphQL API KEY: da2-52fvpcwsl5hxnp5jbgle64lr6m

// GraphQL transformer version: 2