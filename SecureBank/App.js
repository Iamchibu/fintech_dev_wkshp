import React from "react";
import {
  Dimensions,
} from "react-native";
import { 
  Nunito_200ExtraLight,
  Nunito_200ExtraLight_Italic,
  Nunito_300Light,
  Nunito_300Light_Italic,
  Nunito_400Regular,
  Nunito_400Regular_Italic,
  Nunito_600SemiBold,
  Nunito_600SemiBold_Italic,
  Nunito_700Bold,
  Nunito_700Bold_Italic,
  Nunito_800ExtraBold,
  Nunito_800ExtraBold_Italic,
  Nunito_900Black,
  Nunito_900Black_Italic,
  useFonts
} from '@expo-google-fonts/nunito';
import AppLoading from 'expo-app-loading';
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "./assets/svgs/home";
import Profile from "./assets/svgs/profile";
import Wallet from "./assets/svgs/wallet";
import SignIn from "./src/screens/SignIn";
import SignUp from "./src/screens/SignUp";
import Welcome from "./src/screens/Welcome";
import Dashboard from "./src/screens/Dashboard";
import ConfirmEmail from "./src/screens/ConfirmEmail";
import DocumentUpload from "./src/screens/DocumentUpload";
import ForgotPassword from "./src/screens/ForgotPassword";
import ResetPassword from "./src/screens/ResetPassword";
import TransactionTabs from "./src/components/TransactionTabs";
import ProfileScreen from "./src/screens/Profile";

const BottomTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

function MyTabs() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#3B82A0",
        tabBarInactiveTintColor: "#959595",
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: "", 
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIconStyle: { padding: 2 },
          tabBarLabelStyle: { top: -6, fontWeight: 600 },
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Transactions"
        component={TransactionTabs}
        options={{
          headerShown: true,
          // title: "Transactions",
          tabBarLabel: 'Transactions',
          tabBarIconStyle: { padding: 2 },
          tabBarLabelStyle: { top: -6, fontWeight: 600,  },
          tabBarIcon: ({ color, size }) => (  
            <Wallet color={color} size={size} />
          ),
          headerTitleStyle: {
            fontFamily: "Nunito_600SemiBold",
            fontSize: 17,
            // right: width * 0.32
          },
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIconStyle: { padding: 2 },
          tabBarLabelStyle: { top: -6, fontWeight: 600 },
          tabBarIcon: ({ color, size }) => (
            <Profile color={color} size={size} />
          ),
          // tabBarBadge: 1,
        }}
      />
    </BottomTab.Navigator>
  );
}

const HomeStack = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={Dashboard}
      options={{ 
        title: "",
        headerShown: false,
        headerTransparent: true
         }}
    />
  </Stack.Navigator>
);

const TransactionsStack = () => (
    <Stack.Navigator initialRouteName="Transaction">
      <Stack.Screen
        name="Transaction"
        component={TransactionTabs}
        options={{ 
          title: "",
          headerShown: false,
          headerTransparent: true
           }}
      />
    </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator initialRouteName="ProfileScreen">
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{ 
        title: "",
        headerShown: false,
        headerTransparent: true
         }}
    />
    <Stack.Screen
      name="DocumentUpload"
      component={DocumentUpload}
      options={{ 
        title: "",
        headerShown: true,
        headerTintColor: "#0A1017",
        headerTransparent: true,
        // headerLeft: ()=> <ArrowLeftIcon/>
         }}
    />
  </Stack.Navigator>
);


const AuthStack = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={Login}
        options={{ title: "", headerShown: false, headerBackTitle: "", }}
      />
      <Stack.Screen
        name="Dashboard"
        component={MyTabs}
        options={{ title: "", headerShown: false, headerBackTitle: "", }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ 
          title: "",
          headerShown: true,
          headerTintColor: "#0A1017",
          headerTransparent: true,
          headerBackTitle: "",
           }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{ 
          title: "",
          headerShown: true,
          headerTintColor: "#0A1017",
          headerTransparent: true
           }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default function App() {
    let [fontsLoaded, error] = useFonts({
      Nunito_400Regular,
      Nunito_700Bold,
      Nunito_600SemiBold,
      Nunito_300Light,
    })
  
      if (!fontsLoaded) {
      return (
      <NavigationContainer>
      <AppContainer/>
      </NavigationContainer>
      );
    } else{
      return (
        <NavigationContainer>
        <AppContainer/>
        </NavigationContainer>
        );
    }
  }

const Navigator = createStackNavigator(
  {
    SignIn: {
        screen: SignIn,
        navigationOptions: {
          headerShown: false,
          headerTransparent: true,
          title: "",
          headerTintColor: "#3B82A0",
        },
      },
      Welcome: {
        screen: Welcome,
        navigationOptions: {
          headerShown: false,
          headerTransparent: true,
        },
      },
       ConfirmEmail: {
        screen: ConfirmEmail,
        navigationOptions: {
          headerShown: false,
          headerTransparent: true,
          title: "",
          headerTintColor: "#3B82A0",
        },
      },
      SignUp: {
        screen: SignUp,
        navigationOptions: {
          headerShown: false,
          headerTransparent: true,
          title: "",
          headerTintColor: "#3B82A0",
        },
      },
      DocumentUpload: {
        screen: DocumentUpload,
        navigationOptions: {
          headerShown: true,
          headerTransparent: true,
          title: "",
          headerTintColor: "#3B82A0",
        },
      },
      ForgotPassword: {
        screen: ForgotPassword,
        navigationOptions: {
          headerShown: true,
          headerTransparent: true,
          title: "",
          headerTintColor: "#3B82A0",
        },
      },
      ResetPassword: {
        screen: ResetPassword,
        navigationOptions: {
          headerShown: true,
          headerTransparent: true,
          title: "",
          headerTintColor: "#3B82A0",
        },
      },
      Dashboard: {
        screen: MyTabs,
        navigationOptions: {
          headerShown: false,
          // headerTransparent: true,
          title: "",
          headerTintColor: "#3B82A0",
          headerStyle: {
            backgroundColor: "#FFF"
          }
        },
      },
  },
  {
    initialRouteName: "Welcome",
    defaultNavigationOptions: {
      // title: "",
      headerStyle: {
        backgroundColor: "#E5E5E5",//"#1e5228", 
        opacity: 0.90
      },
      headerTintColor: "#000",
      headerTitleStyle: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: 17
      },
    },
  }
);

const AppContainer = createAppContainer(Navigator);


// "arne jacobsen, national bank, copenhagen, 1961-1978." by seier+seier is licensed under CC BY 2.0.