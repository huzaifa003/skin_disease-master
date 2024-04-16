import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../Components/DB'; // Ensure this path is correct
import { ref, push, serverTimestamp } from 'firebase/database';

const AskQuestion = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handlePostQuestion = () => {
        if (title.trim() === '' || description.trim() === '') {
            Alert.alert('Validation', 'Please fill in all fields.');
            return;
        }
        const newQuestionRef = ref(db, 'forums/questions');
        const newQuestion = {
            title,
            description,
            userId: "userId", // This should be replaced with the actual user ID from your auth
            timestamp: serverTimestamp()
        };

        push(newQuestionRef, newQuestion)
            .then(() => {
                Alert.alert('Success', 'Your question has been posted.');
                navigation.goBack();
            })
            .catch(error => {
                Alert.alert('Error', 'Could not post your question. Please try again.');
                console.error(error);
            });

        setTitle('');
        setDescription('');
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Title of your question"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description of your question"
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={4}
            />
            <Button
                title="Post Question"
                onPress={handlePostQuestion}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
    textArea: {
        height: 100,
    }
});

export default AskQuestion;
