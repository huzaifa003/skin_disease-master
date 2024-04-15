import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatDiseaseQuery = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (query.trim()) {
      setIsLoading(true);
      const newMessage = {
        id: Date.now(),
        text: query,
        sender: 'User',
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(10)
      };
      setMessages([...messages, newMessage]);
      setQuery('');

      try {
        const response = await fetch('http://bursting-allegedly-fawn.ngrok-free.app/derm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: query }),
        });

        const reply = await response.text();
        setMessages(prevMessages => [
          ...prevMessages, 
          { id: Date.now(), text: reply, sender: 'Derm Book LLM', opacity: new Animated.Value(0), translateY: new Animated.Value(10) }
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessages(prevMessages => [
          ...prevMessages, 
          { id: Date.now(), text: 'Failed to fetch data.', sender: 'Derm Book LLM' }
        ]);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messages.forEach((message) => {
      Animated.parallel([
        Animated.timing(message.opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(message.translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        })
      ]).start();
    });
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Chat with Derm Book</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Animated.View style={[styles.message, item.sender === 'User' ? styles.userMessage : styles.systemMessage, {
            opacity: item.opacity,
            transform: [{ translateY: item.translateY }]
          }]}>
            <Text style={styles.senderName}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </Animated.View>
        )}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
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
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  navTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  message: {
    padding: 10,
    borderRadius: 15,
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
    marginBottom: 3,
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
    borderTopColor: '#cccccc',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#e9e9eb',
    borderRadius: 25,
    marginRight: 10,
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#1C2A3A',
    borderRadius: 25,
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

export default ChatDiseaseQuery;
