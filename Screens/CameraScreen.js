import { Camera, CameraType } from 'expo-camera';
import { useState, useRef } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CameraScreen({ route, navigation }) {
    const { chooseImage } = route.params;  // Getting the chooseImage function from navigation parameters
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef(null);

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

            if (typeof chooseImage === 'function') {
                chooseImage(photo);
                navigation.goBack();
            } else {
                console.error('chooseImage is not a function, received:', chooseImage);
            }
        }
    }

    return (
        <View style={styles.container}>
            {type && (
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
            {!type && (
                <View style={styles.container}>
                    <Text style={styles.permissionText}>Camera turned off</Text>
                    <Button onPress={() => setType(CameraType.back)} title="Turn On Camera" />
                </View>
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
});