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
import { useNavigate } from "react-router-native";
import NavBar from "./components/NavBar";

export const Create = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    file: null,
    type: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

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
      setFormData({ ...formData, file: result.assets[0].uri, type: "video" });
      setCurrentStep(currentStep + 1);
    } else {
      Alert.alert("Error", "No video was selected.");
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    console.log(formData);
  };

  const renderUploadVideoStep = () => (
    <View style={styles.stepContainer}>
      <TouchableOpacity onPress={pickMedia} style={styles.button}>
        <Text style={styles.buttonText}>Pick a Video</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDetailsStep = () => (
    <View style={styles.stepContainer}>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("title", text)}
        value={formData.title}
        placeholder="Title"
      />
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("description", text)}
        value={formData.description}
        placeholder="Description"
      />
      <TouchableOpacity onPress={() => setCurrentStep(currentStep + 1)} style={styles.button}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLocationStep = () => (
    <View style={styles.stepContainer}>
      <TextInput
        style={styles.input}
        onChangeText={(text) => handleInputChange("location", text)}
        value={formData.location}
        placeholder="Location"
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );

  // Determine which step content to render
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderUploadVideoStep();
      case 2:
        return renderDetailsStep();
      case 3:
        return renderLocationStep();
      default:
        return <View />;
    }
  };

  return (
    <>
      <View style={styles.container}>
        {renderStepContent()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  stepContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: "100%",
    marginVertical: 12,
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
    marginVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
