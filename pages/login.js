import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, TextInput, Text, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { useLocation, useNavigate } from 'react-router-native';
import NavBar from './components/NavBar'

export const Login = () => {
    
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleKeyPress = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        const backendURL = "https://www.looksee.gophernest.net/login";
    
        let formDataBackend = new FormData();
        formDataBackend.append("username", formData.username);
        formDataBackend.append("password", formData.password);
    
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
            <StatusBar barStyle='dark-content' />
            <View style={styles.container}>
                {/* <KeyboardAvoidingView behavior='padding'> */}
                    <View style={styles.content}>
                        <Text style={styles.header}>Log In:</Text>
                        <TextInput style={styles.input} placeholder="Username..." maxLength={24} onChangeText={(text) => handleKeyPress("username", text)} />
                        <TextInput style={styles.input} placeholder="Password..." maxLength={40} secureTextEntry={true} onChangeText={(text) => handleKeyPress("password", text)} />
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Log In</Text>
                        </TouchableOpacity>
                    </View>
                {/* </KeyboardAvoidingView>  */}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: "center",
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
        width: "60%",
        marginLeft: "20%",
    },
    header: {
        fontSize: 40,
        textAlign: "center",
        margin: 10,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        margin: 12,
        alignItems: "center",
        width: "60%",
        marginLeft: "20%"
      },
      buttonText: {
        color: "#fff",
        fontWeight: "bold",
      },
})