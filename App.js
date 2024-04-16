import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase functions
import { signOut } from "firebase/auth";
import { auth } from './Components/DB';

// Screens Imports
import SignIn from './Screens/SignIn';
import SignUp from './Screens/SignUp';
import { PatientHome } from './Screens/PatientHome';
import PostData from './Screens/PostData';
import CameraScreen from './Screens/CameraScreen';
import BookAppointment from './Screens/BookAppointment';
import ShowAppointments from './Screens/ShowAppointments';
import ChatDiseaseQuery from './Screens/ChatDiseaseQuery';
import Report from './Screens/Report';
import ShowDetails from './Screens/ShowDetails';
import MapScreen from './Screens/MapScreen';

import GiveFeedback from './Screens/GiveFeedback';


import { Context } from './Global/Context';
import { DermatologistHome } from './Screens/DermatologistHome';
import { GroupChatScreen } from './Screens/GroupChatScreen';
import QuestionsScreen from './Screens/QuestionsScreen';
import AskQuestion from './Screens/AskQuestion';
import QuestionDetailScreen from './Screens/QuestionDetailScreen';

export default function App() {
  const [background, setBackground] = React.useState("#FAF9F6");
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserType = async () => {
      const type = await AsyncStorage.getItem('userType');
      setUserType(type);
      console.log('User Type:', type);
    };

    fetchUserType();
  });

  const Tab = createMaterialBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  const handleLogout = (navigation) => {
    signOut(auth).then(() => {
      AsyncStorage.removeItem('userType');
      console.log('User logged out successfully');
      navigation.reset({ index: 0, routes: [{ name: "SignIn" }] });
    }).catch((error) => {
      console.error('Logout failed', error);
      Alert.alert('Logout Error', 'Failed to log out. Please try again.');
    });
  };


  const TabNavigatorDerm = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case 'DermatologistHome':
                iconName = 'calendar';
                break;
              case 'ShowAppointments':
                iconName = 'home';
                break;
              default:
                iconName = 'alert-circle';
            }
            return <MaterialCommunityIcons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="DermatologistHome" component={DermatologistHome} options={{ title: 'Home' }} />
        <Tab.Screen name="ShowAppointments" component={ShowAppointments} options={{ title: 'Appointments' }} />
        <Tab.Screen name="MapScreen" component={MapScreen} options={{ title: 'Map' }} />
        <Tab.Screen
          name="Logout"
          component={() => null} // No need to render anything
          options={{ title: 'Logout' }}
          listeners={({ navigation }) => ({
            tabPress: e => {
              e.preventDefault();
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

  const TabNavigatorPatient = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'CameraScreen':
                iconName = 'camera';
                break;
              default:
                iconName = 'alert-circle';
            }
            return <MaterialCommunityIcons name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={PatientHome} options={{ title: 'Home' }} />
        <Tab.Screen name="CameraScreen" component={CameraScreen} options={{ title: 'Camera' }} />
        <Tab.Screen name='GroupScreen' component={GroupChatScreen} options={{title: "Group Chat"}} />
        <Tab.Screen name='QuestionsScreen' component={QuestionsScreen} options={{title: "Questions"}} />
        <Tab.Screen name="MapScreen" component={MapScreen} options={{ title: 'Map' }} />
        <Tab.Screen
          name="Logout"
          component={() => null} // No need to render anything
          options={{ title: 'Logout' }}
          listeners={({ navigation }) => ({
            tabPress: e => {
              e.preventDefault();
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

  const TabNavigator = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case 'ShowAppointments':
                iconName = 'calendar';
                break;
              case 'MapScreen':
                iconName = 'map';
                break;
              case 'Logout':
                iconName = 'logout';
                break;
              case 'Home':
                iconName = 'home';
                break;
              case 'CameraScreen':
                iconName = 'camera';
                break;
              default:
                iconName = 'alert-circle';
            }
            return <MaterialCommunityIcons name={iconName} size={24} color={color} />;
          },
        })}
      >
        {userType === 'dermatologist' ? (
          <>
            <Tab.Screen name="DermatologistHome" component={ShowAppointments} options={{ title: 'Dermatologist Home' }} />
            <Tab.Screen name="ShowAppointments" component={DermatologistHome} options={{ title: 'Appointments' }} />
          </>
        ) : (
          <>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="CameraScreen" component={CameraScreen} />
            <Tab.Screen name='GroupScreen' component={GroupChatScreen} />
          </>
        )}
        <Tab.Screen name="MapScreen" component={MapScreen} />
        <Tab.Screen
          name="Logout"
          component={() => null} // No need to render anything
          options={{ title: 'Logout' }}
          listeners={({ navigation }) => ({
            tabPress: e => {
              e.preventDefault();
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

  const stackNavigator = () => (
    <Stack.Navigator>
      <Stack.Screen name="SignUp" component={SignUp} options={{ title: "Sign Up Page" }} />
      <Stack.Screen name="SignIn" component={SignIn} options={{ title: "Sign In Page" }} />
      <Stack.Screen name='GiveFeedback' component={GiveFeedback} options={{ title: 'Give Feedback' }} />
      <Stack.Screen name='BookAppointment' component={BookAppointment} options={{ title: 'Book Appointment' }} />
      <Stack.Screen name='ChatDiseaseQuery' component={ChatDiseaseQuery} options={{ title: 'Chat Disease Query' }} />
      <Stack.Screen name='Report' component={Report} options={{ title: 'Report' }} />
      <Stack.Screen name='ShowDetails' component={ShowDetails} options={{ title: 'Show Details' }} />
      <Stack.Screen name='AskQuestion' component={AskQuestion} options={{ title: 'Ask Question' }} />
      <Stack.Screen name='QuestionDetail' component={QuestionDetailScreen} options={{ title: 'Question Details' }} />
      <Stack.Screen name="TabNavigatorDerm" component={TabNavigatorDerm} options={{ headerShown: false }} />
      <Stack.Screen name="TabNavigatorPatient" component={TabNavigatorPatient} options={{ headerShown: false }} />

    </Stack.Navigator>
  );

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
