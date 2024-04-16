import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Image, Switch, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { onAuthStateChanged, signInWithEmailAndPassword } from '@firebase/auth';
import { auth } from '../Components/DB';
import { Context } from '../Global/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SignIn = ({ navigation }) => {
  const { background, setBackground } = useContext(Context);
  const [isDermatologist, setIsDermatologist] = useState(false);
  const [idVerified, setIdVerified] = useState(false);
  const [dermatologistID, setDermatologistID] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [displayError, setDisplayError] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Depending on verification and type, navigate appropriately
        if (isDermatologist && idVerified) {
          AsyncStorage.setItem('userType', 'dermatologist').then(() => {
            console.log('User Type:', 'dermatologist');
            navigation.reset({ index: 0, routes: [{ name: 'TabNavigatorDerm' }] });
          }
          );


        } else {
          AsyncStorage.setItem('userType', 'patient').then(() => {
            navigation.reset({ index: 0, routes: [{ name: 'TabNavigatorPatient' }] });
          });

        }
      }
    });
    return unsubscribe;
  }, [navigation, isDermatologist, idVerified]);

  const verifyDermatologistID = (id) => {
    // Dummy verification logic
    setIdVerified(id === "DERM");
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (isDermatologist && !idVerified) {
        setError('Please verify your Dermatologist ID.');
        setDisplayError(true);
      } else {
        setDisplayError(false);
        setError('');
        if (isDermatologist && idVerified) {
          navigation.reset({ index: 0, routes: [{ name: 'TabNavigatorDerm' }] });
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'TabNavigatorPatient' }] });
        }
      }
    } catch (error) {
      setError('Sign In failed: ' + error.message);
      setDisplayError(true);
    }
  };

  const styles = getStyles(background);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image
        source={require('../assets/Vector.png')}
        style={styles.logo}
      />
      <Text h3 style={styles.title}>DermaCare</Text>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>I am a Dermatologist</Text>
        <Switch
          value={isDermatologist}
          onValueChange={(value) => {
            setIsDermatologist(value);
            setIdVerified(false); // Reset verification when switching roles
          }}
        />
      </View>

      {isDermatologist && (
        <Input
          placeholder="Enter Dermatologist ID"
          value={dermatologistID}
          onChangeText={(id) => {
            setDermatologistID(id);
            verifyDermatologistID(id);
          }}
          errorMessage={idVerified ? '' : 'Verify with "DERM"'}
        />
      )}

      {!isDermatologist || idVerified ? (
        <>
          {displayError && <Text style={styles.errorText}>{error}</Text>}
          <Input
            placeholder="Your Email"
            value={email}
            onChangeText={setEmail}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            leftIcon={<Icon name="envelope" size={20} color="#1C2A3A" />}
          />
          <Input
            placeholder="Your Password"
            value={password}
            onChangeText={setPassword}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
            secureTextEntry
            leftIcon={<Icon name="lock" size={24} color="#1C2A3A" />}
          />
          <Button
            title="Sign In"
            onPress={handleSignIn}
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
          />
        </>
      ) : null}
    </KeyboardAvoidingView>
  );
};

const getStyles = (background) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: background,
    padding: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#1C2A3A',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    marginRight: 10,
    fontSize: 16,
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
    marginBottom: 10,
    color: '#FF0000',
    backgroundColor: '#F8D7DA',
    borderColor: '#F5C6CB',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1C2A3A',
    borderRadius: 20,
    paddingVertical: 15,
    width: '100%',
  },
  buttonTitle: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default SignIn;
