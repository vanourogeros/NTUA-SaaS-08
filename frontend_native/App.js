import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';


const Stack = createNativeStackNavigator();

export default function App() {

  const MyStack = () => {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
          />






          {/* <Stack.Screen
            name="Upload"
            component={Upload} /> */}



        </Stack.Navigator>
      </NavigationContainer>
    );
  };




  return (
    <MyStack
    />
  );
};