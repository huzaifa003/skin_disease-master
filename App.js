
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import Home from './Screens/Home';
import PostData from './Screens/PostData';
import CameraScreen from './Screens/CameraScreen';
import BookAppointment from './Screens/BookAppointment';
import ShowAppointments from './Screens/ShowAppointments';
import ChatDiseaseQuery from './Screens/ChatDiseaseQuery';
import Report from './Screens/Report';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ShowDetails from './Screens/ShowDetails';
import MapScreen from './Screens/MapScreen';
import DermatologistHome from './Screens/DermatologistHome';
import GiveFeedback from './Screens/GiveFeedback';

import { Context } from './Global/Context';

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Alert } from 'react-native';


// Import Firebase functions
import { signOut } from "firebase/auth";
import { auth } from './Components/DB';


export default function App() {
  const [background, setBackground] = React.useState("#FAF9F6");


  const Tab = createMaterialBottomTabNavigator();
  const Stack = createNativeStackNavigator();



  const TabNavigator = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'ShowAppointments') {
              iconName = 'calendar';
            } else if (route.name === 'MapScreen') {
              iconName = 'map';
            } else if (route.name === 'Logout') {
              iconName = 'logout';
            }
            return <MaterialCommunityIcons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="ShowAppointments"
          component={ShowAppointments}
          options={{ title: 'Dashboard' }}
        />
        <Tab.Screen name="MapScreen" component={MapScreen} />
        <Tab.Screen
          name="Logout"
          component={() => null} // No need to render anything
          options={{ title: 'Logout' }}
          listeners={({ navigation }) => ({
            tabPress: e => {
              e.preventDefault(); // Prevent default action
              Alert.alert(
                'Log Out',
                'Are you sure you want to log out?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'OK', onPress: () => handleLogout(navigation) },
                ],
                { cancelable: false },
              );
            }
          })}
        />
      </Tab.Navigator>
    );
  };

  const handleLogout = (navigation) => {
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log('User logged out successfully');
      navigation.reset({ index: 0, routes: [{ name: "SignIn" }] }); // Assuming 'SignIn' is your login screen
    }).catch((error) => {
      // An error happened.
      console.error('Logout failed', error);
      Alert.alert('Logout Error', 'Failed to log out. Please try again.');
    });
  };





  const stackNavigator = () => {
    return (

      <Stack.Navigator>



        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ title: "Sign Up Page" }}
        />

        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ title: "Sign In Page" }}
        />

        <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />



        <Stack.Screen
          name='ShowAppointments'
          component={ShowAppointments}
          options={{ title: 'Show Appointments' }}
        />



        <Stack.Screen
          name="BookAppointment"
          component={BookAppointment}
          options={{ title: "Book Appointment Page" }}
        />

        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{ title: "Camera Page" }}
        />


        <Stack.Screen
          name='ShowDetails'
          component={ShowDetails}
          options={{ title: 'Show Details' }}
        />

        <Stack.Screen
          name='MapScreen'
          component={MapScreen}
          options={{ title: 'Map Screen' }}
        />

        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Home-Page" }}
        />


        <Stack.Screen
          name='GiveFeedback'
          component={GiveFeedback}
          options={{ title: 'Give Feedback' }}
        />
        <Stack.Screen
          name="DermatologistHome"
          component={DermatologistHome}
          options={{ title: 'Dermatologist Home' }}
        />



        <Stack.Screen
          name="PostData"
          component={PostData}
          options={{ title: "Add Data" }}
        />

        <Stack.Screen
          name='ChatDiseaseQuery'
          component={ChatDiseaseQuery}
          options={{ title: 'ChatDiseaseQuery' }}
        />

        <Stack.Screen
          name='Report'
          component={Report}
          options={{ title: 'Report' }}
        />




      </Stack.Navigator>

    )

  }
  return (

    <NavigationContainer>

      <Context.Provider value={{ background, setBackground }}>
        <StatusBar style="auto" />
        {stackNavigator()}
      </Context.Provider>
    </NavigationContainer>
  );


}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
