import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TextInput, StyleSheet, Button, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import * as FileSystem from 'expo-file-system'; // Import Expo FileSystem

const ReportScreen = ({ route }) => {
  const { imageUrl, classifiedDisease } = route.params;
  const [isValid, setIsValid] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [returnedImageUrl, setReturnedImageUrl] = useState(null); // State to hold the returned image URI

  function handleSubmitFeedback() {
    console.log('Feedback submitted:', feedback);
  }

  const uploadImage = async () => {
    const uri = imageUrl;
    const fileType = uri.split('.').pop();
    const formData = new FormData();
    formData.append('file', {
      uri: imageUrl,
      name: `photo.${fileType}`,
      type: `image/${fileType}`
    });

    try {
      const response = await fetch('https://tidy-octopus-diverse.ngrok-free.app/segment', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning':true,
        },
      });

      

      const content = await response.blob();
      const timestamp = new Date().getTime();
      const filePath = `${FileSystem.cacheDirectory}responseImage_${timestamp}.${fileType}`;

      const blobData = new FileReader();
      blobData.onload = async () => {
        await FileSystem.writeAsStringAsync(filePath, blobData.result.split(',')[1], {
          encoding: FileSystem.EncodingType.Base64,
        });
        // Use the timestamp to bust the cache
        setReturnedImageUrl(`${filePath}?time=${timestamp}`);
      };
      blobData.onerror = (e) => {
        console.error('FileReader error', e);
      };
      blobData.readAsDataURL(content);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Upload failed', error.toString());
    }
  };

  const generateClassification = async () => {
    const uri = imageUrl;
    const fileType = uri.split('.').pop();
    const formData = new FormData();
    formData.append('file', {
      uri: imageUrl,
      name: `photo.${fileType}`,
      type: `image/${fileType}`
    });

    try {
      const response = await fetch('https://kitten-tight-optionally.ngrok-free.app/classify', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning':true,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const content = await response.json();
      console.log(content);
      
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Upload failed', error.toString());
    }
  }


  return (

    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Disease Classification Report</Text>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        {returnedImageUrl && (
          <View>
            <Text style={styles.label}>Returned Image:</Text>
            <Image source={{ uri: returnedImageUrl }} style={styles.image} />
          </View>
        )}
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
            <Button
              title="Generate Classifications"
              onPress={generateClassification}
              color="#4CAF50"
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f8',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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

  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
});

export default ReportScreen;
