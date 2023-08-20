import React from "react";
import { 
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  useFonts
} from '@expo-google-fonts/nunito';
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as StoreProvider } from "react-redux";
import store from "./src/store";
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
        headerTintColor: "#3B82A0",
        headerTransparent: true
         }}
    />
  </Stack.Navigator>
);

const WelcomeStack = () => (
  <Stack.Navigator initialRouteName="Welcome">
    <Stack.Screen
      name="Welcome"
      component={Welcome}
      options={{ 
        title: "",
        headerShown: false,
        headerTransparent: true
         }}
    />
    <Stack.Screen
      name="SignIn"
      component={SignIn}
      options={{ 
        title: "",
        headerShown: false,
        headerTransparent: true
         }}
    />
    <Stack.Screen
      name="SignUp"
      component={SignUp}
      options={{ 
        title: "",
        headerShown: false,
        headerTransparent: true
         }}
    />
    <Stack.Screen
      name="ConfirmEmail"
      component={ConfirmEmail}
      options={{ 
        title: "",
        headerShown: false,
        headerTransparent: true
         }}
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      options={{ 
        title: "",
        headerShown: true,
        headerTintColor: "#3B82A0",
        headerTransparent: true
         }}
    />
     <Stack.Screen
      name="ResetPassword"
      component={ResetPassword}
      options={{ 
        title: "",
        headerShown: true,
        headerTintColor: "#3B82A0",
        headerTransparent: true
         }}
    />
    <Stack.Screen
      name="Dashboard"
      component={MyTabs}
      options={{ 
        title: "",
        headerShown: false,
        headerTintColor: "#3B82A0",
        headerTransparent: true
         }}
    />
  </Stack.Navigator>
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
      <StoreProvider store={store}>
      <NavigationContainer>
      <AppContainer/>
      </NavigationContainer>
      </StoreProvider>
      );
    } else{
      return (
        <StoreProvider store={store}>
        <NavigationContainer>
        <AppContainer/>
        </NavigationContainer>
        </StoreProvider>
        );
    }
  }

const Navigator = createStackNavigator(
  {
    WelcomeStack: {
        screen: WelcomeStack,
        navigationOptions: {
          headerShown: false,
          headerTransparent: true,
        },
      }
  },
  {
    initialRouteName: "WelcomeStack",
    defaultNavigationOptions: {
      headerShown: false,
      headerStyle: {
        backgroundColor: "#FFF",
        opacity: 0.90
      },
      headerTintColor: "#3B82A0",
      headerTitleStyle: {
        fontFamily: "Nunito_600SemiBold",
        fontSize: 17
      },
    },
  }
);

const AppContainer = createAppContainer(Navigator);