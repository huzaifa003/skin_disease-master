import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Image } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Components/DB";
import { ref, push, onValue, serverTimestamp } from "firebase/database";
import moment from "moment";

const GroupChatScreen = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const flatListRef = useRef();
    const [isAtBottom, setIsAtBottom] = useState(true);

    useEffect(() => {
        const messagesRef = ref(db, 'chats');
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val() ? Object.keys(snapshot.val()).map(key => ({
                ...snapshot.val()[key],
                id: key
            })).sort((a, b) => a.timestamp - b.timestamp) : [];
            setMessages(data);
            if (isAtBottom) {
                flatListRef.current?.scrollToEnd({ animated: true });
            }
        });

        return () => unsubscribe();
    }, [isAtBottom]);

    const sendMessage = () => {
        if (message.trim() === "") return;

        const messagesRef = ref(db, 'chats');
        push(messagesRef, {
            text: message,
            timestamp: serverTimestamp(),
            userId: auth.currentUser.uid,
            userName: auth.currentUser.email.split('@')[0]
        });
        setMessage("");
        setIsAtBottom(true);
    };

    const renderMessageItem = ({ item }) => {
        const isMyMessage = item.userId === auth.currentUser.uid;

        return (
            <View style={[
                styles.messageContainer,
                isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
            ]}>
                {!isMyMessage && (
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{item.userName[0]}</Text>
                    </View>
                )}
                <View style={styles.messageContent}>
                    <View style={[
                        styles.messageBubble,
                        isMyMessage ? styles.myMessage : styles.otherMessage
                    ]}>
                        <Text style={styles.messageText}>{item.text}</Text>
                        <Text style={styles.messageTime}>{item.timestamp ? moment(item.timestamp).format('LT') : ''}</Text>
                    </View>
                </View>
                {isMyMessage && (
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{item.userName[0]}</Text>
                    </View>
                )}
            </View>
        );
    };


    const onScroll = (event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        const maximumOffset = event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height;

        // Check if the user has scrolled to the bottom of the list
        setIsAtBottom(currentOffset >= maximumOffset - 10);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Group Chat</Text>
            </View>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessageItem}
                    keyExtractor={item => item.id}
                    onScroll={onScroll}
                    ListEmptyComponent={<Text style={styles.emptyMessage}>No messages yet. Start the conversation!</Text>}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Type a message"
                        returnKeyType="send"
                        onSubmitEditing={sendMessage}
                    />
                    <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export { GroupChatScreen };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4'
    },
    header: {
        padding: 10,
        backgroundColor: '#007aff',
        alignItems: 'center'
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    
    messageContainer: {
        flexDirection: 'row',
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
    },
    otherMessageContainer: {
        justifyContent: 'flex-start',
    },
    messageContent: {
        maxWidth: '80%'
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007aff',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    userName: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
        fontWeight: 'bold'
    },
    messageBubble: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
    },
    myMessage: {
        backgroundColor: '#dcf8c6',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: '#333'
    },
    messageTime: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        alignSelf: 'flex-end'
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#cccccc'
    },
    input: {
        flex: 1,
        minHeight: 40,
        borderWidth: 1,
        borderColor: '#cccccc',
        padding: 10,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#fff'
    },
    sendButton: {
        padding: 10,
        backgroundColor: '#007aff',
        borderRadius: 20
    },
    sendButtonText: {
        color: '#fff'
    },
    emptyMessage: {
        padding: 10,
        textAlign: 'center',
        color: '#ccc'
    }
});
