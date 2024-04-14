import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ChatDiseaseQuery = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');

  const handleSend = () => {
    if (query.trim()) {
      const newMessage = { id: Date.now(), text: query, sender: 'Dermatologist' };
      setMessages([...messages, newMessage]);
      setQuery('');
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: 'Hello! How can I help you today?', sender: 'ChatGPT' }]);
      }, 1000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        
      <Ionicons name="star" size={24} color="gold" onPress={() => console.log('Back')} />
      <Ionicons name="star" size={24} color="gold" onPress={() => console.log('Back')} />
      <Ionicons name="star" size={24} color="gold" onPress={() => console.log('Back')} />

        <Text style={styles.navTitle}>Welcome to the Chat Screen</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === 'Dermatologist' ? styles.userMessage : styles.systemMessage]}>
            <Text style={styles.senderName}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <Ionicons name="" size={24} color="#007bff" style={{ marginRight: 5 }} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Type your query..."
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1C2A3A',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  message: {
    padding: 10,
    borderRadius: 19,
    marginVertical: 5,
    maxWidth: '75%',
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  systemMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#34eb77',
  },
  senderName: {
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 3,  // Add a small space between the sender name and the message text
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#1C2A3A',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#e9e9eb',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#1C2A3A',
    borderRadius: 20,
  },
});

export default ChatDiseaseQuery;