import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import { firebase_app, db } from "../Components/DB";
import { update, ref } from "firebase/database";

export default function GiveFeedback({ route, navigation }) {
    const { uri, description, status, user, report } = route.params;
    console.log(route.params)
    const storage = getStorage(firebase_app);
    const imageRef = storageRef(storage, uri);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editedStatus, setEditedStatus] = useState(status);
    const [editedDescription, setEditedDescription] = useState(description);

    useEffect(() => {
        getDownloadURL(imageRef)
            .then((url) => {
                setImage(url);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const handleSave = () => {
        // Save the edited status and description
        const reportRef = ref(db, `patients/${user}/${report}`);
        update(reportRef, {
            status: editedStatus,
            description: editedDescription,
        })
            .then(() => {
                console.log("Successfully updated");
                navigation.goBack();
            })
            .catch((error) => {
                console.log(error);
            }
            );

    };

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.innerContainer}>
                    <Text style={styles.title}>Give Feedback</Text>
                    
                    <TouchableOpacity onPress={() => navigation.navigate('BookAppointment', { imageUri: image })}>
                        <Image source={{ uri: image }} style={styles.image} />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.input}
                        value={editedStatus}
                        onChangeText={setEditedStatus}
                        placeholder="Status"
                    />
                    <TextInput
                        style={styles.input}
                        value={editedDescription}
                        onChangeText={setEditedDescription}
                        placeholder="Description"
                        multiline
                    />
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    input: {
        width: "80%",
        height: 40,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: "blue",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
