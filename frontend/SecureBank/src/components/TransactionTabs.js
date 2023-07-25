import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import QuickTransaction from '../screens/QuickTransaction';
import TransactionHistory from '../screens/TransactionHistory';


const TopTabs = createMaterialTopTabNavigator();

const TransactionTabs = () => {

  return (
        <TopTabs.Navigator
        screenOptions={{
            tabBarActiveTintColor:'#3B82A0',
            tabBarInactiveTintColor: "#000000",
            tabBarLabelStyle: { fontSize: 12 },
            tabBarStyle: { backgroundColor: '#fff', borderBottom: '1px solid #fff' }
        }}>
            <TopTabs.Screen
            name={'QuickTransaction'}
            title='Quick Transaction'
            component={QuickTransaction}
            options={{
                tabBarLabel: 'Quick Transaction',
                tabBarLabelStyle: { textTransform:'capitalize' },
            }}/>
            <TopTabs.Screen
            name={'TransactionHistory'}
            title='Transaction History'
            component={TransactionHistory}
            options={{
                tabBarLabel: 'Transaction History',
                tabBarLabelStyle: { textTransform:'capitalize' },
            }}/>
        </TopTabs.Navigator>
  )
}

export default TransactionTabs


{/* <View style={{flexDirection: 'column'}}>
        <View style={{backgroundColor:'white', padding: 20}}>
            <Text>Plans</Text>
        </View>
        <TopTabs.Navigator
        screenOptions={{
            tabBarActiveTintColor:'#e91e63',
            tabBarLabelStyle: { fontSize: 12 },
            tabBarStyle: { backgroundColor: '#fff', borderBottom: '1px solid #fff' }
        }}>
            <TopTabs.Screen
            name={'PlansTab'}
            title='PlansTab'
            component={PlansTab}
            options={{
                tabBarLabel: 'Plans'
            }}/>
            <TopTabs.Screen
            name={'Portfolio'}
            title='Portfolio'
            component={Portfolio}
            options={{
                tabBarLabel: 'Portfolio'
            }}/>
        </TopTabs.Navigator>
    </View> */}