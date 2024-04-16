import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity, Text } from 'react-native';
import { db } from '../Components/DB'; // Ensure this path is correct
import { ref, push, serverTimestamp } from 'firebase/database';

const AskQuestion = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [tagList, setTagList] = useState([]);

    const handlePostQuestion = () => {
        if (title.trim() === '' || description.trim() === '') {
            Alert.alert('Validation Error', 'Please fill in all fields.');
            return;
        }
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        console.log(tagsArray);
        const newQuestionRef = ref(db, 'forums/questions');
        const newQuestion = {
            title,
            description,
            tags: tagList,
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
        setTags('');
        setTagList([]);
    };

    const addTag = () => {
        if (tags.trim() !== '' && !tagList.includes(tags.trim())) {
            console.log("HEllo");
            setTagList([...tagList, tags.trim()]);
            setTags('');
        }
    };

    return (
        <ScrollView style={styles.container}>
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
            />
            <View style={styles.tagsInputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Add tags (comma separated)"
                    value={tags}
                    onChangeText={setTags}
                    onSubmitEditing={addTag}
                />
                <Button title="Add Tag" onPress={addTag} color="#007AFF" />
            </View>
            <View style={styles.tagListContainer}>
                {tagList.map((tag, index) => (
                    <TouchableOpacity key={index} style={styles.tag} onPress={() => setTagList(tagList.filter(t => t !== tag))}>
                        <Text style={styles.tagText}>{tag} ✕</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Button
                title="Post Question"
                onPress={handlePostQuestion}
                color="#007AFF"
            />
        </ScrollView>
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
    },
    tagsInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    tagListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    tag: {
        backgroundColor: '#E0E0E0',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 5,
        marginBottom: 5,
    },
    tagText: {
        color: '#333',
        fontSize: 14,
    }
});

export default AskQuestion;
