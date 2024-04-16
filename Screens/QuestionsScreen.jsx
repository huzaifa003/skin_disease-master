import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { db } from '../Components/DB';
import { ref, onValue } from 'firebase/database';

const QuestionsScreen = ({ navigation }) => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const questionsRef = ref(db, 'forums/questions');
        const unsubscribe = onValue(questionsRef, (snapshot) => {
            const loadedQuestions = [];
            snapshot.forEach((childSnapshot) => {
                loadedQuestions.push({ id: childSnapshot.key, ...childSnapshot.val() });
            });
            setQuestions(loadedQuestions);
        });
        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={questions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('QuestionDetail', { questionId: item.id })}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text>{item.description}</Text>
                    </TouchableOpacity>
                )}
            />
            <Button title="Ask a Question" onPress={() => navigation.navigate('AskQuestion')} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
    }
});

export default QuestionsScreen;
