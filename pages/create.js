import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useNavigate } from "react-router-native";
import NavBar from "./components/NavBar";

export const Create = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    file: null,
    type: "",
  });

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need media library permissions to make this work!');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      videoMaxDuration: 60,
    }); 
    if (!result.canceled && result.assets[0].uri) {
      try {
        console.log(`Fetching info for URI: ${result.assets[0].uri}`);
        const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
        if (fileInfo.size <= 52428800) { 
          setFormData({ ...formData, file: result.assets[0].uri, type: "video" });
        } else {
          Alert.alert("File size exceeds 50MB. Please select a smaller file.");
        }
      } catch (error) {
        console.error(`Error getting file info: ${error}`);
        Alert.alert("Error", "Failed to get file information.");
      }
    } else {
      Alert.alert("Error", "No video was selected or the video URI is unavailable.");
    }    
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const backendURL = "https://www.looksee.gophernest.net/posts";
    let localUri = formData.file;
    let filename = localUri.split("/").pop();
    let type = `video/${filename.split('.').pop()}`;

    let formDataBackend = new FormData();
    formDataBackend.append("title", formData.title);
    formDataBackend.append("text_content", `${formData.location} ${formData.description}`);
    formDataBackend.append("video_upload", { uri: localUri, name: filename, type });

    try {
      let response = await fetch(backendURL, {
        method: "POST",
        body: formDataBackend,
      });
      if (response.ok) {
        Alert.alert("Form submitted successfully");
        navigate("/success");
      } else {
        Alert.alert("Form submission failed", `Status Code: ${response.status}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Submission error", error.message);
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
            onChangeText={(text) => handleInputChange("title", text)}
            value={formData.title}
            placeholder="Enter a Title"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => handleInputChange("description", text)}
            value={formData.description}
            placeholder="Description"
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => handleInputChange("location", text)}
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
