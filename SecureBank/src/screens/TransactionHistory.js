import React,{Component} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
    FlatList,
    Dimensions,
    LogBox,
  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import TransactionItem from '../components/TransactionItem';
// import { Dropdown } from 'react-native-material-dropdown';
// import Spinner from "react-native-loading-spinner-overlay";
// import secureBankService from ".././service/SecureBankService";

  const initialState = {
    token:'',
    sign_off_document: '',
    
    errors: {},          
    fileInfo: {},
    isAuthorized: false, 
    isLoading: false,    
    singleVisibilty: true,
    generatorList : [],
    media_type: "application/pdf",
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
      {
      title : "Memunat Doe",
      amount: "37",
      num: "Level 3",
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
      {
      title : "John Doe",
      amount: "67",
      num: "Level 1",
      },
    ],
  mediaTypeList: [
    { value: 0, label: "Select Document Type" },
    { value: "application/pdf", label: "PDF" },
    { value: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", label: "Microsoft Word" },
    { value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", label: "Microsoft Excel" },
  ]
  };
  const { width } = Dimensions.get("window");
  const WINDOW_HEIGHT = Dimensions.get("window").height;
                   
  
  class DocumentUpload extends Component {
    state = initialState

    _pickDocument = async () => {
      if(this.state.media_type != ""){
      let result = await DocumentPicker.getDocumentAsync({type: "application/pdf", copyToCacheDirectory: false});
      alert('You selected '+result.name);
      console.log(result);
      this.setState({fileInfo: result})
      }else{
      alert('Please select Invoice Type...');
      }
      }
    
      handleMediaType = (media_type) => {
        this.setState({ media_type });
      };

    uploading = () => {
        this.setState({isLoading: true})
        // setClientToken(this.state.token);
        
        const {fileInfo} = this.state;
        const file_name = fileInfo.name;
        const description = fileInfo.type;
        const type = fileInfo.type;
        const file = fileInfo.uri;
        const size = fileInfo.size;
        const id = this.props.navigation.state.params.id;
        
        
          
            if (file_name == null && description == null && type == null && file == null && size == null){
              this.setState({ isLoading: false });
            Alert.alert("Info: ", "Please Click on the button above to select a file...", [
                { text: "Ok" },
              ]);
            }else{ 
              // if (size != null) {
              if(size < 2097152){
              if(this.state.media_type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
                let options = { encoding: FileSystem.EncodingType.Base64 };
                FileSystem.readAsStringAsync(file, options).then(data => {
                  const sign_off_document = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + data;

                const payload = {sign_off_document};
                console.log(payload);
            
              const onSuccess = ({data}) => {
              this.setState({isLoading: false, isAuthorized: true});
              console.log(data);
              Alert.alert('Info: ','Uploaded Document successfully', 
                [
                  {
                    text: 'Ok', 
                    onPress:() => {
                      this.props.navigation.replace('GenServicingStatusFO')
                    }
                  }
                ] 
              )
              };
        
                const onFailure = error => {
                console.log(error && error.response);
                this.setState({ isLoading: false });
                if(error.response == null){
                  this.setState({ isLoading: false });
                  Alert.alert('Info: ','Network Error')
                }
                
                if(error.response.status == 400){
                  Alert.alert('Info: ','Ensure you enter the details required')
                } else if(error.response.status == 500){
                  Alert.alert('Info: ','Ensure your Network is Stable')
                } else if(error.response.status == 401){
                  Alert.alert('Info: ','UnAunthorized')
                } else if(error.response.status == 404){
                  Alert.alert('Info: ','Not Found')
                }
                console.log("Heyyyyyyy!!!",error.response.status);  
                  
                this.setState({errors: error.response.data, isLoading: false});
              };

              this.setState({isLoading: true});

            //   secureBankService
            //     .put(`/generator/servicing_status/${id}/upload`, payload)
            //     .then(onSuccess)
            //     .catch(onFailure);
                
                  }).catch(err => {
                      console.log("​getFile -> err", err);
                  });
          
                }else if(this.state.media_type == "application/pdf"){
                  let options = { encoding: FileSystem.EncodingType.Base64 };
                  FileSystem.readAsStringAsync(file, options).then(data => {
                    const sign_off_document = 'data:application/pdf;base64,' + data;
                    const payload = {sign_off_document};
                  console.log(payload);
                  
                  const onSuccess = ({data}) => {
                    this.setState({isLoading: false, isAuthorized: true});
                    console.log(data);
                    Alert.alert('Info: ','Uploaded Document successfully', [
                      {
                        text: 'Ok', 
                        onPress:() => {
                          this.props.navigation.replace('GenServicingStatusFO')
                        }
                      }
                    ])
                  };    
          
                  const onFailure = error => {
                  console.log(error && error.response);
                  this.setState({ isLoading: false });
                  if(error.response == null){
                    this.setState({ isLoading: false });
                    Alert.alert('Info: ','Network Error')
                  }
                  
                  if(error.response.status == 400){
                    Alert.alert('Info: ','Ensure you enter the details required')
                  } else if(error.response.status == 500){
                    Alert.alert('Info: ','Ensure your Network is Stable')
                  } else if(error.response.status == 401){
                    Alert.alert('Info: ','UnAunthorized')
                  } else if(error.response.status == 404){
                    Alert.alert('Info: ','Not Found')
                  }
                  console.log("Heyyyyyyy!!!",error.response.status);  
                  
                  this.setState({errors: error.response.data, isLoading: false});
                  
                };
            
                this.setState({isLoading: true});
            
                // secureBankService
                //   .put(`/generator/servicing_status/${id}/upload`, payload)
                //   .then(onSuccess)
                //   .catch(onFailure);
                    }).catch(err => {
                        console.log("​getFile -> err", err);
                    });
        
            }else if(this.state.media_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
              let options = { encoding: FileSystem.EncodingType.Base64 };
              FileSystem.readAsStringAsync(file, options).then(data => {
                    const sign_off_document = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,' + data;
                    const payload = {sign_off_document};
                console.log(payload);
                
              const onSuccess = ({data}) => {
                  this.setState({isLoading: false, isAuthorized: true});
                  console.log(data);
                  Alert.alert('Info: ','Uploaded Document successfully', 
                    [
                      {
                        text: 'Ok', 
                        onPress:() => {
                          this.props.navigation.replace('GenServicingStatusFO')
                        }
                      }
                    ] 
                  )
                };
            
                const onFailure = error => {
                console.log(error && error.response);
                this.setState({ isLoading: false });
                if(error.response == null){
                  this.setState({ isLoading: false });
                  Alert.alert('Info: ','Network Error')
                }
                
                if(error.response.status == 400){
                  Alert.alert('Info: ','Ensure you enter the details required')
                } else if(error.response.status == 500){
                  Alert.alert('Info: ','Ensure your Network is Stable')
                } else if(error.response.status == 401){
                  Alert.alert('Info: ','UnAunthorized')
                } else if(error.response.status == 404){
                  Alert.alert('Info: ','Not Found')
                }
                console.log("Heyyyyyyy!!!",error.response.status);  
                
                this.setState({errors: error.response.data, isLoading: false});
                
              };
          
              this.setState({isLoading: true});
          
            //   secureBankService
            //     .put(`/generator/servicing_status/${id}/upload`, payload)
            //     .then(onSuccess)
            //     .catch(onFailure);
                }).catch(err => {
                    console.log("​getFile -> err", err);
                });
              }   
            // }
        }else{
          this.setState({ isLoading: false });
          Alert.alert(null,'The file you selected is over 2MB\n* Please select less than 2MB file...')
            }
        
      
    }
   
  }
  
  _retrieveData () {
    console.log("This method is called...")
    AsyncStorage.getItem('userDetails').then(res => {
        const response = JSON.parse(res)
        if (res !== null) {
        this.setState({driver: response.id, upline: response.upline_id, token: response.token})
        console.log("I want to make request o",response);
      }else{
          console.log("There is no token...")
      }
      
    });
  };
  
    componentWillMount() {
      console.log("I don mount o")
      this._retrieveData()
    }   
  
    render(){
      const {fileInfo} = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        {/* <Spinner
            visible={this.state.isLoading}
            textContent={"Loading..."}
            textStyle={styles.spinnerTextStyle}
        /> */}
        <View style={styles.container}>
        {/* <Text style={styles.textStyle_}>Document Type :</Text>
        <Dropdown 
                underlineColorAndroid = "transparent"
                autoCapitalize = "none"
                labelTextStyle = "#9a73ef"
                value={0}
                data={this.state.mediaTypeList}
                width={304}
                height= {50}
                borderRadius= {18}
                textAlign="left"
                onChangeText={(value => this.handleMediaType(value))}/> */}

        <FlatList
            data={this.state.list}
            style={{ backgroundColor: "#FFF" }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item,index }) => ( 
              <TouchableOpacity 
                onPress={()=> this.props.navigation.navigate("ChildjhgfDashboard",{
                  data: item
                })}>
              <TransactionItem
                  item={item}
                  />   
            </TouchableOpacity>
              )}
            />
        </View>
      </SafeAreaView>
    );
          }
  };
  
  export default  DocumentUpload;
  
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
    listText:{
      fontSize: 15,
      fontWeight:'bold',
      alignSelf:'center',
      color: "#4848FF",
      marginEnd: 5,
      marginTop:5
  },
  loginButtonText:{
      color: 'white',
      textAlign:'center',
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
      marginVertical:10,
      opacity: 1,
      alignSelf: "center"
   },
  });



// GraphQL endpoint: https://ld5oa7ohmbbsdeljytn6afrk2y.appsync-api.us-east-1.amazonaws.com/graphql
// GraphQL API KEY: da2-52fvpcwsl5hxnp5jbgle64lr6m

// GraphQL transformer version: 2