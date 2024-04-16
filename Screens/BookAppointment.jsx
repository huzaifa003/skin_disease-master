import { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Icon } from "react-native-elements";
import { uploadBytes, ref as refStorage } from "firebase/storage";
import { set, ref } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth, storage, db } from "../Components/DB";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';



export default function BookAppointment( {route }) {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser.uid);
            } else {
                navigation.navigate("SignIn");
            }
        });


        
        const routeImageUri = route.params?.imageUri; // Use optional chaining to safely access the imageUri
        if (routeImageUri) {
            convertToJpg(routeImageUri).then((jpgUri) => {
                if (jpgUri) {
                    setImage({ uri: jpgUri });
                    console.log('Image converted and selected:', jpgUri);
                } else {
                    Alert.alert('Error', 'Failed to convert image to JPG format.');
                }
            }
            );

        }
    }, [route.params]);

    async function handleImageUpload() {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
        });

        if (pickerResult.canceled) {
            console.log('User cancelled image picker');
        } else if (pickerResult.assets && pickerResult.assets.length > 0) {
            const selectedImage = pickerResult.assets[0];
            const jpgUri = await convertToJpg(selectedImage.uri);
            if (jpgUri) {
                setImage({ uri: jpgUri });
                console.log('Image converted and selected:', jpgUri);
            } else {
                alert('Failed to convert image to JPG format.');
            }
        }
    }

    async function convertToJpg(originalUri) {
        try {
            // Manipulate the image: This can include resizing if you want
            const result = await ImageManipulator.manipulateAsync(
                originalUri,
                // Actions array can include other manipulations, e.g., resize, rotate
                [], // No actions like resize or rotate, just convert format here
                // Options for output format and compression
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );
            return result.uri;
        } catch (error) {
            console.log('Failed to convert image to JPG:', error);
            return null;
        }
    }

    async function handleSendData() {
        if (user && image) {
            const path = `${Date.now()}${Math.random()}`.replace(/[.#$[\]/]/g, "");
            const imageStorageRef = refStorage(storage, `images/${user}/${path}`);
            try {
                const response = await fetch(image.uri);
                const blob = await response.blob();
                setUploading(true);
                await uploadBytes(imageStorageRef, blob);
                await set(ref(db, `/patients/${user}/${path}`), {
                    user: user,
                    image: image.uri,
                    status: "pending",
                    path: path,
                });
                console.log("Data sent successfully!");
                setImage(null);
            } catch (error) {
                console.error("Error during the upload or save process: ", error);
                Alert.alert('Upload Failed', 'An error occurred during the upload. Please try again.');
            } finally {
                setUploading(false);
            }
        } else {
            console.error("Missing user or image data.");
            Alert.alert('Missing Data', 'Please ensure you have selected an image and are logged in.');
        }
    }

    function handleGenerateReport() {
        if (image && image.uri) {
            navigation.navigate("Report", {
                imageUrl: image.uri,
                classifiedDisease: "Example Disease Name" // Replace with actual data
            });
        } else {
            Alert.alert("No Image", "Please upload and send an image first.");
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.logoAndTitle}>
                    <Image source={require("../assets/Vector.png")} style={styles.logo} />
                    <Text style={styles.logoText}>DermCare</Text>
                </View>
                <Text style={styles.title}>Diagnose Skin Disease</Text>
                {image && <Image source={{ uri: image.uri }} style={styles.imagePreview} />}
                <View style={styles.buttonContainer}>
                    <Button
                        title="Upload Image"
                        onPress={handleImageUpload}
                        buttonStyle={styles.button}
                        icon={<Icon name="camera" type="font-awesome" color="#ffffff" />}
                        iconContainerStyle={styles.iconStyle}
                    />
                    <Button
                        title="Send Data"
                        onPress={handleSendData}
                        buttonStyle={styles.button}
                        loading={uploading}
                        icon={<Icon name="send" type="material-icons" color="#ffffff" />}
                        iconContainerStyle={styles.iconStyle}
                    />
                    <Button
                        title="Generate Report"
                        onPress={handleGenerateReport}
                        buttonStyle={styles.button}
                        icon={<Icon name="file-text" type="font-awesome" color="#ffffff" />}
                        iconContainerStyle={styles.iconStyle}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// Styles remain unchanged


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f8",
        justifyContent: 'center'
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16
    },
    logoAndTitle: {
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: 'hidden'
    },
    logoText: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
        color: '#2A2D34'
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1C2A3A",
        marginBottom: 20
    },
    imagePreview: {
        width: "90%",
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
    },
    buttonContainer: {
        width: "90%",
        alignItems: 'center'
    },
    button: {
        backgroundColor: "#1C2A3A",
        borderRadius: 10,
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    iconStyle: {
        marginRight: 10
    }
});