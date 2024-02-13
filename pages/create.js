import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigate } from 'react-router-native';
import NavBar from './components/NavBar';

export const Create = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    file: null,
    type: '',
  });

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      videoMaxDuration: 60,
    });

    if (!result.canceled) {
      const fileInfo = await FileSystem.getInfoAsync(result.uri);
      if (fileInfo.size <= 52428800) { 
        setFormData({ ...formData, file: result.uri, type: result.type });
      } else {
        alert("File size exceeds 50MB. Please select a smaller file.");
      }
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const backendURL = 'backend-link';
    let localUri = formData.file;
    let filename = localUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `${formData.type}/${match[1]}` : formData.type;

    let formDataBackend = new FormData();
    formDataBackend.append('title', formData.title);
    formDataBackend.append('description', formData.description);
    formDataBackend.append('location', formData.location);
    formDataBackend.append('file', { uri: localUri, name: filename, type });

    try {
      let response = await fetch(backendURL, {
        method: 'POST',
        body: formDataBackend,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.ok) {
        console.log('Form submitted successfully');
        navigate('/success');
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.content}>
          <TouchableOpacity onPress={pickMedia} style={styles.button}>
            <Text style={styles.buttonText}>Pick a Video</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            onChangeText={(text) => handleInputChange('title', text)}
            value={formData.title}
            placeholder="Enter a Title"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => handleInputChange('description', text)}
            value={formData.description}
            placeholder="Description"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => handleInputChange('location', text)}
            value={formData.location}
            placeholder="Enter A Location"
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
        <NavBar
          footerStyle={styles.footer}
          footerTabStyle={styles.footerTab}
          selected={styles.selected}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    margin: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  footer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    height: "10%",
    backgroundColor: "#000",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  footerTab: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Arvo",
    padding: 10,
    marginBottom: 20,
    borderRadius: 15,
  },
});
