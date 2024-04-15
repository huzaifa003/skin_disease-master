import { onAuthStateChanged, signInWithEmailAndPassword } from '@firebase/auth';
// import axios from 'axios';
import React, { useEffect } from 'react';
import { View } from 'react-native'
import { Text, Input, Button } from 'react-native-elements';
import { auth } from '../Components/DB';


const PostData = ({ navigation }) => {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');

    const [error, setError] = React.useState('');
    const [displayError, setDisplayError] = React.useState(false)


    const addData = async () => {
        try {
            const response = await axios.post("https://retoolapi.dev/1XNPz7/namedata", { "firstname": firstName, "lastname": lastName })
            console.log(response);
            navigation.reset({ index: 0, routes: [{ name: "SignUp" }] })

        }
        catch {
            (error) => {
                console.log(error);
            }
        }
    };


    return (
        <View style={{}}>

            {displayError ? <Text style={{ backgroundColor: 'red' }}> {error} </Text> : ""}
            <Input
                label="firstname"
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
            />

            <Input
                label="lastName"
                value={lastName}
                onChangeText={(text) => setLastName(text)}
            />

            <Button title="Add Data" onPress={addData} />

        </View>
    );
};

export default PostData;
