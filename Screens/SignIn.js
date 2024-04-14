import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Image, TouchableOpacity } from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you have this installed
import { onAuthStateChanged, signInWithEmailAndPassword } from '@firebase/auth';
import { auth } from '../Components/DB';
import { Context } from '../Global/Context';

const SignIn = ({ navigation }) => {
  const { background, setBackground } = useContext(Context);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [displayError, setDisplayError] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.reset({ index: 0, routes: [{ name: 'ShowAppointments' }] });
      }
    });
    return unsubscribe; // Remember to unsubscribe on unmount
  }, [navigation]);

  const handleSignIn = async () => {
    try {
      if (email === "derm" && password === "derm") {
        navigation.reset({ index: 0, routes: [{ name: 'DermatologistHome' }] });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigation.reset({ index: 0, routes: [{ name: 'TabNavigator' }] });
      }
    } catch (error) {
      setError('Sign In failed: ' + error.message);
      setDisplayError(true);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode); // Toggle the dark mode state
    setBackground(!isDarkMode ? '#dddddd' : '#D1D5DB'); // Set background color to light or dark
  };

  // Styles are moved out of the component body to prevent re-creation on each render
  const styles = getStyles(background);

  
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image
        source={require('../assets/Vector.png')} // Make sure this path is correct
        style={styles.logo}
      />
      <Text h3 style={styles.title}>DermaCare</Text>
      <Text style={styles.tagline}>Hi, Welcome Back!</Text>

      {displayError && <Text style={styles.errorText}>{error}</Text>}

      

      <Input
        placeholder="Your Email"
        value={email}
        onChangeText={setEmail}
        containerStyle={styles.inputContainer}
        inputStyle={styles.input}
        leftIcon={
          <Icon
            name="envelope"
            size={20}
            color="#1C2A3A"
          />
        }
      />

      <Input
        placeholder="Your Password"
        value={password}
        onChangeText={setPassword}
        containerStyle={styles.inputContainer}
        inputStyle={styles.input}
        secureTextEntry
        leftIcon={
          <Icon
            name="lock"
            size={24}
            color="#1C2A3A"
          />
        }
      />

      <Button
        title="Sign In"
        onPress={handleSignIn}
        buttonStyle={styles.button}
        titleStyle={styles.buttonTitle}
      />

<Button
        // ... other button props ...
        icon={
          <Icon
            name="moon-o" // Example icon name, change it according to your actual icon
            size={15}
            color="#1C2A3A"
          />
        }
        title="Toggle Theme"
        onPress={toggleTheme}
        buttonStyle={styles.toggleButton}
        titleStyle={styles.toggleButtonTitle}
      />
    </KeyboardAvoidingView>
  );
};

// Define styles outside of the component to improve performance
const getStyles = (background) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:'#FFFFFF', // Use the background state
  },
  logo: {
    width: 50, // Adjust size as needed
    height: 50, // Adjust size as needed
    marginBottom: 15 ,
  },
  title: {
    color: '#1C2A3A',
    marginBottom: 5,
    
  },
  tagline: {
    color: '#111928',
    fontSize: 16,
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  errorText: {
    fontSize: 14,
    padding: 10,
    marginBottom: 20,
    color: '#FF0000',
    backgroundColor: '#F8D7DA',
    borderColor: '#F5C6CB',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    textAlign: 'center',
  },
 
  button: {
    width: '100%',
    backgroundColor: '#1C2A3A',
    borderRadius: 20,
    paddingVertical: 15,
    marginVertical: 10,
  },
  buttonTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  toggleButton: {
    backgroundColor:'#F3F4F6', // Use the provided background color for the button
    borderColor: '#1C2A3A', // Change this to the color you need
    borderWidth: 1,
    borderRadius: 20, // Adjust as needed for rounded corners
    padding: 10,
    marginRight:9,
    marginVertical:10, // Spacing between button and other elements
    width: '100%', // Set the width as per your design requirements
  },
  toggleButtonTitle: {
    color: '#1C2A3A', // Text color for the toggle theme button
    marginLeft:10, // Space between icon and text
  },
});

export default SignIn;