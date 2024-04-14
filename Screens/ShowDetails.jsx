import { View, ActivityIndicator } from "react-native";
import { Text } from "react-native";
import { Image, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { getStorage, ref as storageRef, getDownloadURL } from "firebase/storage";
import { useEffect } from "react";
import { firebase_app } from "../Components/DB";
import { useState } from "react";

export default function ShowDetails({ route, navigation }) {
    const { uri, description, status } = route.params;
    console.log(description);
    const storage = getStorage(firebase_app);
    const imageRef = storageRef(storage, uri);

    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDownloadURL(imageRef)
            .then((url) => {
                console.log(url);
                setImage(url);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    const getStatusColor = () => {
        if (status === "pending") {
            return "#ff6f00"; // orange
        } else {
            return "#00cc00"; // green
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>ShowDetails</Text>
            <View style={styles.detailsContainer}>
                <Text style={[styles.status, { color: getStatusColor() }]}>
                    {status}
                </Text>
                <Text style={styles.description}>{description}</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Image source={{ uri: image }} style={styles.image} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333",
    },
    detailsContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
    },
    status: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        color: "#666",
    },
    image: {
        width: 400,
        height: 600,
        borderRadius: 8,
    },
});
