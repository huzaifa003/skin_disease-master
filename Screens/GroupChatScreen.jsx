import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Components/DB";
import { ref, push, onValue, remove, serverTimestamp } from "firebase/database";

const GroupChatScreen = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const flatListRef = useRef();

    useEffect(() => {
        const messagesRef = ref(db, 'chats');
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val() ? Object.keys(snapshot.val()).map(key => ({
                ...snapshot.val()[key],
                id: key
            })) : [];
            setMessages(data);
        });

        return () => unsubscribe();
    }, []);

    const sendMessage = () => {
        if (message.trim() === "") return;

        const messagesRef = ref(db, 'chats');
        push(messagesRef, {
            text: message,
            timestamp: serverTimestamp(),
            userId: auth.currentUser.uid,
            userName: auth.currentUser.email.split('@')[0] // Use the part of the email as the user name
        });
        setMessage("");
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <Text style={styles.userName}>{item.userName}:</Text>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                keyExtractor={item => item.id}
                onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type a message"
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
};

export { GroupChatScreen };

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messageContainer: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        backgroundColor: '#fff'
    },
    userName: {
        fontWeight: 'bold',
        marginRight: 6
    },
    messageText: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 8
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 10,
        marginRight: 8
    }
});
