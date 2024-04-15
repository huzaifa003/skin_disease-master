import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Button, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import axios from 'axios';

const ReportScreen = ({ route }) => {
  const { imageUrl, classifiedDisease } = route.params;
  const [isValid, setIsValid] = useState(false);
  const [feedback, setFeedback] = useState('');

  function handleSubmitFeedback() {
    console.log('Feedback submitted:', feedback);
    // Implement what happens when feedback is submitted, such as sending it to a server
  }

  const uploadImage = async () => {
    const uri = imageUrl; // assuming imageUrl is a direct path to the local file
    const fileType = uri.split('.').pop(); // get file extension
    const formData = new FormData();
    formData.append('file', {
      uri: imageUrl,
      name: `photo.${fileType}`,
      type: `image/${fileType}`
    });

    // try {
    //   fetch("https://tidy-octopus-diverse.ngrok-free.app", {
    //     method: "GET",

    //   })
    //     .then(response => response.text())
    //     .then(result => {
    //       console.log("Success:", result);
    //     })
    //     .catch(error => {
    //       console.error("Error:", error);
    //     });
    // }
    // catch (error) {
    //   console.error("Error:", error);
    // }




    try {
      const response = await fetch('https://tidy-octopus-diverse.ngrok-free.app/segment', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseImage = await response.blob();
      // You can display this image or handle however you need
      console.log('Upload successful', responseImage);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Upload failed', error.toString());
    }
    ;






  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Disease Classification Report</Text>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.label}>Classified Disease:</Text>
      <TextInput
        style={styles.input}
        editable={false}
        value={classifiedDisease}
      />
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={isValid}
          onValueChange={setIsValid}
          color={isValid ? '#4630EB' : undefined}
        />
        <Text style={styles.label}>Is the classification correct?</Text>
      </View>
      {!isValid && (
        <View>
          <Text style={styles.label}>Feedback:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter feedback here"
            value={feedback}
            onChangeText={setFeedback}
            multiline
          />
          <Button
            title="Submit Feedback"
            onPress={handleSubmitFeedback}
            color="#1C2A3A"
          />
          <Button
            title="Upload Image"
            onPress={uploadImage}
            color="#4CAF50"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f4f4f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
  },
});

export default ReportScreen;
