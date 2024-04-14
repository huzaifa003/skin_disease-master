import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@firebase/auth';
import axios from 'axios';
import React, { useEffect } from 'react';
import { View, FlatList, SafeAreaView, StyleSheet } from 'react-native'
import { Text, Input, Button } from 'react-native-elements';
import { auth } from '../Components/DB';



const Home = ({ navigation }) => {

    const [data, setData] = React.useState('');

    const [error, setError] = React.useState('');
    const [displayError, setDisplayError] = React.useState('None')

    useEffect(() => {
        async function fetchData() {
            const response = await axios.get("https://retoolapi.dev/1XNPz7/namedata")

            setData(response.data)
        }
        fetchData();

    }, [])

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigation.reset({ index: 0, routes: [{ name: "SignUp" }] })
        }).catch((error)=>{
            console.log(error);
        })
    }

    return (

        <View style={{}}>
            <SafeAreaView style={{height: "100%"}}>
                <Text> Hello {auth.currentUser.email} </Text>
                <Button title="Add Data" onPress={()=>navigation.navigate("PostData")} />
                <Text> </Text>
                <Button title="Logout" onPress={handleLogout} />
                <FlatList
                    data={data}
                    renderItem={({ item }) => <Text style={{ fontSize: 24, fontWeight: '600' }}> {item.firstname} {item.lastname} {"\n"} </Text>}
                    keyExtractor={item => item.id}
                />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


export default Home;
