import React, { Component } from 'react';
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
import TransactionItem from '../components/TransactionItem';
// import secureBankService from ".././service/SecureBankService";

const initialState = {
  token: '',
  sign_off_document: '',

  errors: {},
  fileInfo: {},
  isAuthorized: false,
  isLoading: false,
  singleVisibilty: true,
  generatorList: [],
  media_type: "application/pdf",
  list: [
    {
      title: "John Doe",
      amount: "67",
      num: "Level 1",
    },
    {
      title: "Ellen Doe",
      amount: "40",
      num: "Level 2",
    },
    {
      title: "Davis Doe",
      amount: "70",
      num: "Level 1",
    },
    {
      title: "James Doe",
      amount: "37",
      num: "Level 3",
    },
    {
      title: "Sandra Doe",
      amount: "40",
      num: "Level 2",
    },
    {
      title: "Davis Doe",
      amount: "70",
      num: "Level 1",
    },
    {
      title: "John Doe",
      amount: "67",
      num: "Level 1",
    },
  ]
};
const { width } = Dimensions.get("window");
const WINDOW_HEIGHT = Dimensions.get("window").height;

class TransactionHistory extends Component {
  state = initialState

  _retrieveData() {
    console.log("This method is called...")
    AsyncStorage.getItem('userDetails').then(res => {
      const response = JSON.parse(res)
      if (res !== null) {
        this.setState({ driver: response.id, upline: response.upline_id, token: response.token })
        console.log("I want to make request o", response);
      } else {
        console.log("There is no token...")
      }

    });
  };

  componentWillMount() {
    console.log("I don mount o")
    this._retrieveData()
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <FlatList
            data={this.state.list}
            style={{ backgroundColor: "#FFF" }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("ChildjhgfDashboard", {
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

export default TransactionHistory;

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