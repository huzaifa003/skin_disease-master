import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Components/DB"; // Ensure firebase_app is used if needed elsewhere in your code
import { get, ref } from "firebase/database";

const PatientHome = () => {
    const navigation = useNavigation();
    const [patientData, setPatientData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        // Subscribe to authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchPatientData(user.uid);
            } else {
                // If no user is logged in, navigate to the Login screen
                navigation.reset({ index: 0, routes: [{ name: "SignIn" }] });
            }
        });

        return unsubscribe; // Clean up the listener on component unmount
    }, []);

    const fetchPatientData = (uid) => {
        const patientRef = ref(db, `patients/${uid}`);
        get(patientRef).then((snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val());
                setPatientData(snapshot.val());
            } else {
                console.log("No patient data available");
                setPatientData(null);
            }
        }).catch((error) => {
            console.error(error);
        });
    };

    const onRefresh = () => {
        setRefreshing(true);
        onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchPatientData(user.uid);
            }
        });
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Patient Home</Text>

            <ScrollView
                style={styles.cardContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {patientData && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Patient ID: {auth.currentUser.uid}</Text>
                        {Object.keys(patientData).map((reportKey, index) => (
                            <View key={reportKey} style={styles.reportCard}>
                                <Text style={styles.reportTitle}>Report ID: {reportKey}</Text>
                                <Text style={styles.reportLabel}>Description:</Text>
                                <Text style={styles.reportDescription}>
                                    {patientData[reportKey].description}
                                </Text>
                                <Text style={styles.reportLabel}>Status:</Text>
                                <Text
                                    style={[
                                        styles.reportStatus,
                                        patientData[reportKey].status === "pending"
                                            ? { color: "red" }
                                            : null,
                                    ]}
                                >
                                    {patientData[reportKey].status}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            <Button title="Logout" onPress={() => auth.signOut()} />
        </View>
    );
};

export { PatientHome };

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
    reportCard: {
        backgroundColor: "#f2f2f2",
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    reportLabel: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 2,
    },
    reportDescription: {
        fontSize: 14,
        marginBottom: 4,
    },
    reportStatus: {
        fontSize: 14,
        color: "gray",
    },
});
