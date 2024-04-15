import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Image, TouchableOpacity, Alert } from 'react-native';
import { Text, Input, Button, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createUserWithEmailAndPassword, onAuthStateChanged } from '@firebase/auth';
import { auth } from '../Components/DB';
import { Context } from '../Global/Context';

const SignUp = ({ navigation }) => {
    const { background, setBackground } = useContext(Context);
    const [isDermatologist, setIsDermatologist] = useState(false);
    const [idVerified, setIdVerified] = useState(false);
    const [dermatologistID, setDermatologistID] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [displayError, setDisplayError] = useState(false);

    const verifyDermatologistID = (id) => {
        if (id === "DERM") {
            setIdVerified(true);
            setError('');
        } else {
            setIdVerified(false);
            setError('Invalid Dermatologist ID');
        }
    };

    const handleSignUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigation.navigate('SignIn');
        } catch (error) {
            setError('Sign up failed: ' + error.message);
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
            <CheckBox
                title="Sign up as Dermatologist"
                checked={isDermatologist}
                onPress={() => setIsDermatologist(!isDermatologist)}
                containerStyle={styles.checkbox}
            />

            {isDermatologist && (
                <Input
                    placeholder="Dermatologist ID"
                    value={dermatologistID}
                    onChangeText={(id) => {
                        setDermatologistID(id);
                        verifyDermatologistID(id);
                    }}
                    containerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    leftIcon={<Icon name="id-badge" size={20} color="#1C2A3A" />}
                    errorMessage={idVerified ? '' : 'Enter "DERM" to verify'}
                />
            )}

            {idVerified && (
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
                        title="Sign Up"
                        onPress={handleSignUp}
                        buttonStyle={styles.button}
                        titleStyle={styles.buttonTitle}
                    />
                </>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.text}>Already have an account? Sign In</Text>
            </TouchableOpacity>
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
        width: 120,
        height: 120,
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
    checkbox: {
        alignSelf: 'center',
        marginBottom: 20,
        backgroundColor: 'transparent',
        borderWidth: 0,
    },
});

export default SignUp;
