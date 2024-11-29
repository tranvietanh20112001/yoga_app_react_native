import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ClassDetailScreen from './screens/ClassDetailScreen';
import MyCartScreen from './screens/MyCartScreen';
import { Provider as PaperProvider } from 'react-native-paper';
const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ClassDetail" component={ClassDetailScreen} />
        <Stack.Screen name="MyCart" component={MyCartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  );
}