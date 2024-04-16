import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, TouchableNativeFeedback, TextInput, Platform, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { db } from '../Components/DB';
import { ref, onValue } from 'firebase/database';

const QuestionsScreen = ({ navigation }) => {
    const [questions, setQuestions] = useState([]);
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDesc, setSortDesc] = useState(true);

    useEffect(() => {
        const questionsRef = ref(db, 'forums/questions');
        const unsubscribe = onValue(questionsRef, (snapshot) => {
            const loadedQuestions = [];
            snapshot.forEach((childSnapshot) => {
                loadedQuestions.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                    tags: childSnapshot.val().tags || [], // Ensure tags is always an array
                    date: new Date(childSnapshot.val().timestamp) // Convert timestamp to Date object
                });
            });
            // Sort questions by date here if you want the default sort to be by date
            loadedQuestions.sort((a, b) => sortDesc ? b.date - a.date : a.date - b.date); // Sort by date descending
            setQuestions(loadedQuestions);
            setFilteredQuestions(loadedQuestions);
        });
        return () => unsubscribe();
    }, [sortDesc]);

    useEffect(() => {
        const filtered = questions.filter(question =>
            question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            question.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredQuestions(filtered);
    }, [searchTerm, questions]);

    const toggleSortOrder = () => {
        setSortDesc(!sortDesc);
        setQuestions([...questions.reverse()]);
    };

    const renderQuestionItem = ({ item }) => {
        const Component = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;
        return (
            <Component onPress={() => navigation.navigate('QuestionDetail', { questionId: item.id })}>
                <View style={styles.itemContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.date}>{item.date.toLocaleDateString()}</Text>
                    <View style={styles.tagsContainer}>
                        {item.tags.map((tag, index) => (
                            <Text key={index} style={styles.tag}>{tag}</Text>
                        ))}
                    </View>
                </View>
            </Component>
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={styles.buttonContainer}>
                        <Button title="Ask a Question" onPress={() => navigation.navigate('AskQuestion')} color="#007AFF" />
                    </View>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search questions..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                    <Button
                        title={`Sort by Date: ${sortDesc ? 'Newest First' : 'Oldest First'}`}
                        onPress={toggleSortOrder}
                        color="#007AFF"
                    />
                    <FlatList
                        data={filteredQuestions}
                        keyExtractor={item => item.id}
                        renderItem={renderQuestionItem}
                        contentContainerStyle={styles.listContainer}
                    />

                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    searchInput: {
        fontSize: 16,
        padding: 10,
        margin: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    listContainer: {
        padding: 10,
    },
    itemContainer: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 10,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    date: {
        fontSize: 12,
        color: '#888',
        marginBottom: 5,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    tag: {
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        padding: 5,
        marginRight: 5,
        marginBottom: 5,
    },
    buttonContainer: {
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ccc',
    }
});

export default QuestionsScreen;
