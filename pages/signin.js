// Assuming this is in Signin.js
import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { useNavigate } from 'react-router-native';

export const Signin = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/welcome', { state: { name } });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>LookSee</Text>
      <TouchableOpacity style={[styles.button, styles.googleButton]}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.facebookButton]}>
        <Text style={styles.buttonText}>Sign in with Facebook</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Continue with name"
        onChangeText={setName}
        value={name}
      />
      <TouchableOpacity style={[styles.buttonlil, styles.continueButton]} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    color: 'red',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 60,
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonlil: {
    width: '80%',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  facebookButton: {
    backgroundColor: '#3B5998',
  },
  continueButton: {
    backgroundColor: '#4CAF50', 
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  input: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    fontSize: 16,
  },
});
