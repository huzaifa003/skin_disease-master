// ReportScreen.js
import React, { useState } from 'react';
import { View, Text, Image, TextInput, CheckBox, Button, StyleSheet } from 'react-native';

const ReportScreen = ({ route }) => {
  const { imageUrl, classifiedDisease } = route.params;
  const [isValid, setIsValid] = useState(false);
  const [feedback, setFeedback] = useState('');

  function handleSubmitFeedback() {
    console.log('Feedback submitted:', feedback);
    // Implement what happens when feedback is submitted, such as sending it to a server
  }

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
        <CheckBox
          value={isValid}
          onValueChange={setIsValid}
          style={styles.checkbox}
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