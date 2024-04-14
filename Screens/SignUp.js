import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Image, TouchableOpacity } from 'react-native';
import { Text, Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'; // Make sure you have this installed
import { createUserWithEmailAndPassword, onAuthStateChanged } from '@firebase/auth';
import { auth } from '../Components/DB';
import { Context } from '../Global/Context';

const SignUp = ({ navigation }) => {
    const { background, setBackground } = useContext(Context);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        setBackground(!isDarkMode ? '#dddddd' : '#ffffff');
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.reset({ index: 0, routes: [{ name: "ShowAppointments" }] });
            }
        });
        return unsubscribe; // Clean up the listener
    }, []);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [displayError, setDisplayError] = useState(false);
    
    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigation.navigate('SignIn');
        } catch (error) {
            setError('Sign up failed: ' + error.message);
            setDisplayError(true);
        }
    };

    // Styles are moved out of the component body
    const styles = getStyles(background);

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Image
                source={require('../assets/Vector.png')} // Replace with your logo image path
                style={styles.logo}
            />
            <Text h3 style={styles.title}>DermaCare</Text>

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
                title="Sign Up"
                onPress={handleSignUp}
                buttonStyle={styles.button}
                titleStyle={styles.buttonTitle}
            />

            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.text}>Already have an account? Sign In</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

// Define styles outside of the component
const getStyles = (background) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: background,
        padding: 20,
    },
    logo: {
        width: 120, // Adjust to your logo size
        height: 120, // Adjust to your logo size
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        color: '#1C2A3A',
        marginBottom: 30,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 15,
    },
    input: {
        fontSize: 16,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 10,
        backgroundColor: '#FFF',
        marginBottom: 10,
    },
    button: {
        width: '100%',
        backgroundColor: '#1C2A3A',
        borderRadius: 20,
        paddingVertical: 15,
        marginBottom: 10,
    },
    buttonTitle: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    text: {
        fontSize: 16,
        color: '#1C2A3A',
        marginBottom: 20,
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
});

export default SignUp;