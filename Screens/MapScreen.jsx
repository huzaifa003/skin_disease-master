import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [uvData, setUvData] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            console.log(location);
            // Assume fetchUVData is a function that fetches UV data from the API
            const uvData = await fetchUVData(location.coords.latitude, location.coords.longitude);
            setUvData(uvData);
        })();
    }, []);

    const fetchUVData = async (latitude, longitude) => {
        const myHeaders = new Headers();
        myHeaders.append("x-access-token", "openuv-1xtcbw5rlv2nojwy-io");
        myHeaders.append("Content-Type", "application/json");
    
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
    
        try {
            const response = await fetch(`https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}&alt=100&dt=`, requestOptions);
            const result = await response.json(); // Parse JSON response
            console.log(result); // Log the full response
            return {
                uv: result.result.uv, // Accessing 'result' key inside your JSON response
                uv_max: result.result.uv_max,
                sunrise: result.result.sun_info.sun_times.sunrise,
                sunset: result.result.sun_info.sun_times.sunset,
            };
        } catch (error) {
            console.error('error', error);
            return null; // Handle error, return null or default data structure
        }
    };

    return (
        <View style={styles.container}>
            {errorMsg ? (
                <Text style={styles.overlayText}>{errorMsg}</Text>
            ) : location ? (
                <MapView
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    style={styles.map}
                >
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="Current Location"
                        description="Here I am!"
                    />
                    {uvData && (
                        <View style={styles.uvOverlay}>
                            <Text style={styles.uvText}>UV Index: {uvData.uv}</Text>
                            <Text style={styles.uvText}>Max UV Today: {uvData.uv_max}</Text>
                            <Text style={styles.uvText}>Sunrise: {uvData.sunrise}</Text>
                            <Text style={styles.uvText}>Sunset: {uvData.sunset}</Text>
                        </View>
                    )}
                </MapView>
            ) : (
                <Text style={styles.overlayText}>Loading...</Text>
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
    map: {
        width: '100%',
        height: '100%',
    },
    overlayText: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    uvOverlay: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        borderRadius: 5,
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
    },
    uvText: {
        color: 'white',
        fontSize: 14,
    },
});
