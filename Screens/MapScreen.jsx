import React from 'react';
import MapView, { Marker } from 'react-native-maps';

import { StyleSheet, View, Text } from 'react-native';
import { useState, useEffect } from "react";
import { Platform } from 'react-native';

import * as Location from 'expo-location';


export default function MapScreen() {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    const destination = {
        latitude: 31.469680360026764,
        longitude: 74.38800865924226,
    };
    return (
        <View style={styles.container}>
            {text !== "Waiting.." ? location && (
                <MapView
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    style={styles.map}
                >
                    {console.log(location)}

                    <Marker
                        zoomEnabled={true}
                        animationEnabled={true}
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="My Location"
                        description="I am currently Here"
                    />

                    <Marker
                        zoomEnabled={true}
                        pinColor='green'
                        animationEnabled={true}
                        coordinate={destination}
                        title="Dermatologist Location"
                        description="Visit here"
                    />

                </MapView>
            ) : <Text style={styles.overlayText}> {text} </Text>}


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
});