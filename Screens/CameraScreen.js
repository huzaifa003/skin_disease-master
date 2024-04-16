import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { set, ref as dbRef } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { firebase_app, auth, db } from "../Components/DB"; // Ensure these imports correctly reference your Firebase configuration

export default function CameraScreen({ navigation }) {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [loading, setLoading] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [userUID, setUserUID] = useState(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserUID(user.uid);
            } else {
                navigation.navigate('SignIn');
            }
        });
        return unsubscribe;
    }, []);

    // Handle not having camera permissions
    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    async function takePicture() {
        if (cameraRef.current) {
            setLoading(true);
            const photo = await cameraRef.current.takePictureAsync();
            setLoading(false);
            setCapturedImage(photo.uri);
            setShowPreview(true);
        }
    }

    async function handleSendData() {
        if (userUID && capturedImage) {
            const curren = Date.now();
            const path = `images/${userUID}/${curren}`;
            const imageStorageRef = storageRef(getStorage(firebase_app), path);
            console.log(imageStorageRef);
            try {
                const response = await fetch(capturedImage);


                const blob = await response.blob();
                console.log(blob);
                setLoading(true);
                await uploadBytes(imageStorageRef, blob);
                console.log("Image uploaded successfully!");
                getDownloadURL(imageStorageRef).then((url) => {
                    console.log(url);
                    set(dbRef(db, `/patients/${userUID}/${curren}`), {
                        user: userUID,
                        image: url,
                        status: "pending",
                        description: "No description provided",
                    })
                    .then(() => {
                        console.log("Successfully updated");
                    
                    }
                    )
                    .catch((error) => {
                        console.log(error);
                    });
                }
                );
                // setCapturedImage(null);
            } catch (error) {
                console.error("Error during the upload or save process: ", error);
                Alert.alert('Upload Failed', 'An error occurred during the upload. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            console.error("Missing user or image data.");
            alert('Missing Data', 'Please ensure you are logged in and an image has been captured.');
        }
    }

    return (
        <View style={styles.container}>
            {showPreview ? (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: capturedImage }} style={styles.previewImage} />
                    <Button title="Approve" onPress={handleSendData} />
                    <Button title="Retake" onPress={() => setShowPreview(false)} />
                </View>
            ) : (
                <Camera style={styles.camera} type={type} ref={cameraRef}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)}>
                            <Text style={styles.text}>Flip Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={takePicture}>
                            {loading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <MaterialCommunityIcons name="camera-iris" size={24} color="white" />
                            )}
                        </TouchableOpacity>
                    </View>
                </Camera>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 20,
    },
    button: {
        flex: 0.33,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    permissionText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        marginBottom: 20,
    },
    previewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    previewImage: {
        width: 300,
        height: 400,
        marginBottom: 20,
    },
});
