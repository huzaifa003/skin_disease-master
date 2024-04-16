//main menu 
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Context } from '../Global/Context';
import ChatDiseaseQuery from './ChatDiseaseQuery';


const ShowAppointments = () => {
  const navigation = useNavigation();
  const { background, setBackground } = useContext(Context);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    const newBackground = isDarkMode ? '#F0F0F0' : '#334155';
    setIsDarkMode(!isDarkMode);
    setBackground(newBackground);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1C2A3A',
      textAlign: 'center',
    },
    logo: {
      height: 100,
      width: 100,
      alignSelf: 'center',
      marginTop: 10,
    },
    welcomeCard: {
      padding: 20,
      borderRadius: 12,
      backgroundColor: isDarkMode ? '#475569' : '#FFFFFF',
      marginVertical: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
      alignItems: 'center',
    },
    quoteText: {
      fontSize: 16,
      color: '#1C2A3A',
      textAlign: 'center',
    },
    menuCard: {
      backgroundColor: isDarkMode ? '#475569' : '#FFFFFF',
      borderRadius: 15,
      borderColor: '#1C2A3A',
      padding: 50,
      marginBottom: 15,
      alignItems: 'center',
      shadowColor: '#1C2A3A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    menuText: {
      fontSize: 18,
      color: '#1C2A3A',
      marginTop: 10,
    },
    toggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    toggleLabel: {
      marginLeft: 10,
      fontSize: 16,
      color: isDarkMode ? '#FFFFFF' : '#000000',
    },
  });

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is logged in
      } else {
        navigation.navigate('SignIn');
      }
    });
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'SignUp' }],
      });
    }).catch((error) => {
      console.log(error);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Home Page</Text>
        <Button title=" Logout " onPress={handleLogout} buttonStyle={{ backgroundColor: '#1C2A3A' }} />
      </View>
      <Image
        style={styles.logo}
        source={require('../assets/Vector.png')} // Make sure the path to your logo is correct
      />
      <Text style={styles.heading}>DermCare</Text>
      <View style={styles.welcomeCard}>
        <Text style={styles.quoteText}>
          "Welcome to DermCare! Embrace your skin with confidence."
        </Text>
      </View>
      <ScrollView>
      <TouchableOpacity style={styles.menuCard} onPress={() => navigation.navigate('BookAppointment')}>
          <Ionicons name="medical-outline" size={40} color={isDarkMode ? '#FFFFFF' : '#000000'} />
          <Text style={styles.menuText}>Diagnose Disease</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard} onPress={() => navigation.navigate('ChatDiseaseQuery')}>
          <Ionicons name="chatbubble-ellipses-outline" size={40} color={isDarkMode ? '#FFFFFF' : '#000000'} />
          <Text style={styles.menuText}>Chat Disease Query</Text>
        </TouchableOpacity>
       
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShowAppointments;
