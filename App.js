import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import SplashScreen from './screens/SplashScreen';
import AuthScreen from './screens/AuthScreen';
import WalletScreen from './screens/WalletScreen';
import NodeDiscoveryScreen from './screens/NodeDiscoveryScreen';
import BecomeNodeScreen from './screens/BecomeNodeScreen';
import BuyAccessScreen from './screens/BuyAccessScreen';
import AccessTokenScreen from './screens/AccessTokenScreen';
import RouterListScreen from './screens/RouterListScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import { COLORS } from './constants/colors';
import { getCurrentUser } from './services/auth';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs({ user }) {
  const isAdmin = user?.role === 'admin';
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.DARK_GRAY },
        headerTintColor: '#fff',
        tabBarActiveTintColor: COLORS.ORANGE,
      }}
    >
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Nodes" component={NodeDiscoveryScreen} />
      <Tab.Screen name="BecomeNode" component={BecomeNodeScreen} options={{ title: 'Become Node' }} />
      <Tab.Screen name="AccessToken" component={AccessTokenScreen} options={{ title: 'Access Token' }} />
      <Tab.Screen name="History" component={TransactionHistoryScreen} />
      {isAdmin && <Tab.Screen name="Routers" component={RouterListScreen} />}
      {isAdmin && <Tab.Screen name="Admin" component={AdminDashboardScreen} />}
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => { (async () => { setUser(await getCurrentUser()); })(); }, []);

  const navTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, primary: COLORS.ORANGE, background: '#fff', card: COLORS.DARK_GRAY, text: '#000' },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Main">
          {(props) => <MainTabs {...props} user={user} />}
        </Stack.Screen>
        <Stack.Screen name="BuyAccess" component={BuyAccessScreen} options={{ headerShown: true, title: 'Buy Access' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
