import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TextInput, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import Checkbox from 'expo-checkbox';
import * as FileSystem from 'expo-file-system'; // Import Expo FileSystem

const ReportScreen = ({ route }) => {
  const { imageUrl, classifiedDisease } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [progress, setProgress] = useState(0); // Progress for the upload
  const [returnedImageUrl, setReturnedImageUrl] = useState(null); // State to hold the returned image URI
  const [classificationResults, setClassificationResults] = useState(null); // State to hold classification results

  const uploadImage = async () => {
    setIsLoading(true); // Start loading
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1; // Increment progress
      });
    }, 3000); // Update progress every 3 seconds

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
        setReturnedImageUrl(`${filePath}?time=${timestamp}`);
        setIsLoading(false); // Stop loading
        setProgress(0); // Reset progress
      };
      blobData.onerror = (e) => {
        console.error('FileReader error', e);
        setIsLoading(false); // Stop loading on error
        setProgress(0); // Reset progress
      };
      blobData.readAsDataURL(content);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Upload failed', error.toString());
      setIsLoading(false); // Stop loading on error
      setProgress(0); // Reset progress
    }
  };

  const generateClassification = async () => {
    setIsClassifying(true); // Start classifying
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
      setIsClassifying(false); // Stop classifying
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Upload failed', error.toString());
      setIsClassifying(false); // Stop classifying on error
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
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading... {progress}%</Text>
          </View>
        )}
        {isClassifying && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
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
    shadowOffset: { width: 0, height : 2},
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
  loadingContainer: {
    alignItems: 'center',
  },
});

export default ReportScreen;
