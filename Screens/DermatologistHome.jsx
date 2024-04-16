import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { firebase_app, auth, db } from "../Components/DB";
import { get, ref } from "firebase/database";
import { TouchableOpacity } from "react-native";

const DermatologistHome = () => {
    const navigation = useNavigation();
    const [data, setData] = useState(null);
    const [users, setUsers] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const handleLogout = () => {
        navigation.reset({ index: 0, routes: [{ name: "SignUp" }] });
    };

    const handleUserToggle = (user) => {
        if (user === selectedUser) {
            setSelectedUser(null);
            return;
        }
        setSelectedUser(user);
    };

    const onRefresh = () => {
        setRefreshing(true);
        // Fetch data again
        const userRef = ref(db, `patients/`);
        get(userRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    setData(snapshot.val());
                    setUsers(Object.keys(snapshot.val()));
                }
                setRefreshing(false);
            })
            .catch((error) => {
                console.log(error);
                setRefreshing(false);
            });
    };

    useEffect(() => {
        const userRef = ref(db, `patients/`);
        get(userRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    setData(snapshot.val());
                    setUsers(Object.keys(snapshot.val()));
                }
            })
            .catch((error) => {
                console.log(error);
            });

            onRefresh();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Dermatologist Home</Text>

            <ScrollView
                style={styles.cardContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {users &&
                    users.map((user) => (
                        <View key={user} style={styles.card}>
                            <Text style={styles.cardTitle}> Patient ID: {user}</Text>

                            <Button
                                title={selectedUser === user ? "Hide Reports" : "Show Reports"}
                                onPress={() => handleUserToggle(user)}
                            />

                            {selectedUser === user && (
                                <View style={styles.appointmentContainer}>
                                    {data[user] &&
                                        Object.keys(data[user]).map((appointment, index) => (
                                            <TouchableOpacity key={appointment} onPress={()=>navigation.navigate("GiveFeedback",{description: data[user][appointment].description, uri : `images/${user}/${appointment}`, status: data[user][appointment].status, user: user, report: appointment})}>
                                                <View style={styles.appointmentCard}>
                                                    <Text style={styles.appointmentTitle}>Report ID: {appointment}</Text>
                                                    <Text style={styles.appointmentLabel}>Description:</Text>
                                                    <Text style={styles.appointmentDescription}>
                                                        {data[user][appointment].description}
                                                    </Text>
                                                    <Text style={styles.appointmentLabel}>Status:</Text>
                                                    <Text
                                                        style={[
                                                            styles.appointmentStatus,
                                                            data[user][appointment].status === "pending"
                                                                ? { color: "red" }
                                                                : null,
                                                        ]}
                                                    >
                                                        {data[user][appointment].status}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                </View>
                            )}
                        </View>
                    ))}
            </ScrollView>

            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
};

export { DermatologistHome };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    cardContainer: {
        flex: 1,
        width: "100%",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    appointmentContainer: {
        marginTop: 8,
    },
    appointmentCard: {
        backgroundColor: "#f2f2f2",
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
    },
    appointmentTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    appointmentLabel: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 2,
    },
    appointmentDescription: {
        fontSize: 14,
        marginBottom: 4,
    },
    appointmentStatus: {
        fontSize: 14,
        color: "gray",
    },
});
