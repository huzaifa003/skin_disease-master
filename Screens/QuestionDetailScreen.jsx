import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { db, auth } from '../Components/DB';
import { ref, push, serverTimestamp, onValue } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuestionDetailScreen = ({ route }) => {
    const { questionId } = route.params;
    const [question, setQuestion] = useState(null);
    const [newAnswer, setNewAnswer] = useState('');
    const [userType, setUserType] = useState('');

    useEffect(() => {
        const questionRef = ref(db, `forums/questions/${questionId}`);
        const unsubscribe = onValue(questionRef, (snapshot) => {
            const questionData = snapshot.val() || {};
            setQuestion({
                id: snapshot.key,
                title: questionData.title,
                description: questionData.description,
                answers: questionData.answers ? Object.keys(questionData.answers).map(key => ({
                    id: key,
                    ...questionData.answers[key]
                })) : []
            });
        });
        return () => unsubscribe();
    }, [questionId]);

    useEffect(() => {
        // Fetch user type from AsyncStorage
        const fetchUserType = async () => {
            const type = await AsyncStorage.getItem('userType');
            setUserType(type || '');
        };
        fetchUserType();
    }, []);

    const handleAddAnswer = async () => {
        if (newAnswer.trim() === '') {
            Alert.alert("Error", "Please enter an answer before submitting.");
            return;
        }

        const userId = auth.currentUser ? auth.currentUser.uid : null;
        if (!userId) {
            Alert.alert('Error', 'You are not logged in.');
            return;
        }

        const answersRef = ref(db, `forums/questions/${questionId}/answers`);
        const answerData = {
            text: newAnswer,
            userId: userId,
            userType: userType,
            timestamp: serverTimestamp(),
        };

        push(answersRef, answerData)
            .then(() => {
                Alert.alert("Success", "Your answer has been posted.");
                setNewAnswer('');
            })
            .catch(error => {
                Alert.alert("Error", "Failed to post your answer.");
                console.error(error);
            });
    };

    const renderAnswerItem = ({ item }) => (
        <View style={styles.answerItem}>
            <Text style={styles.answerText}>{item.text}</Text>
            {item.userType === 'dermatologist' && <Text style={styles.verifiedBadge}>Verified by Dermatologist</Text>}
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.questionContainer}>
                <Text style={styles.title}>{question?.title}</Text>
                <Text style={styles.description}>{question?.description}</Text>
            </View>
            <View style={styles.answersContainer}>
                <FlatList
                    data={question?.answers}
                    keyExtractor={item => item.id}
                    renderItem={renderAnswerItem}
                    ListHeaderComponent={<Text style={styles.answersTitle}>Answers</Text>}
                />
                <TextInput
                    value={newAnswer}
                    onChangeText={setNewAnswer}
                    placeholder="Write your answer here..."
                    style={styles.input}
                    multiline
                />
                <Button title="Submit Answer" onPress={handleAddAnswer} color="#007AFF" />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    questionContainer: {
        padding: 20,
        borderBottomWidth: 2,
        borderColor: '#E8E8E8',
        backgroundColor: '#F9F9F9'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
    },
    answersContainer: {
        padding: 20,
    },
    answersTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    answerItem: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#FFF',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    answerText: {
        fontSize: 16,
    },
    verifiedBadge: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4CAF50',
        textAlign: 'right',
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCC',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    }
});

export default QuestionDetailScreen;
