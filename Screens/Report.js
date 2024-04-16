import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TextInput, StyleSheet, Button, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';
import * as FileSystem from 'expo-file-system'; // Import Expo FileSystem

const ReportScreen = ({ route }) => {
  const { imageUrl, classifiedDisease } = route.params;
  const [isValid, setIsValid] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [returnedImageUrl, setReturnedImageUrl] = useState(null); // State to hold the returned image URI
  const [classificationResults, setClassificationResults] = useState(null); // State to hold classification results

  // function handleSubmitFeedback() {
  //   console.log('Feedback submitted:', feedback);
  // }

  {/* <Text style={styles.label}>Classified Disease:</Text>
        <TextInput
          style={styles.input}
          editable={false}
          value={classifiedDisease}
        /> */}
        {/* <View style={styles.checkboxContainer}>
          <Checkbox
            value={isValid}
            onValueChange={setIsValid}
            color={isValid ? '#4630EB' : undefined}
          />
          <Text style={styles.label}>Is the classification correct?</Text>
        </View> */}

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
          'ngrok-skip-browser-warning': true,
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
          'ngrok-skip-browser-warning': true,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const content = await response.json();
      console.log('Classification results:', content);
      setClassificationResults(content); // Save the classification results
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Upload failed', error.toString());
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.header}>Disease Classification Report</Text>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        {returnedImageUrl && (
          <Image source={{ uri: returnedImageUrl }} style={styles.image} />
        )}
        <View style={styles.buttonContainer}>
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
        {classificationResults && (
          <View style={styles.resultsContainer}>
            <Text style={styles.label}>Results:</Text>
            {classificationResults.map((result, index) => {
              const diseaseName = Object.keys(result)[0];
              const confidence = result[diseaseName];
              return (
                <Text key={index} style={styles.resultText}>
                  {diseaseName}: {confidence.toFixed(2)}%
                </Text>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  resultsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ReportScreen;
