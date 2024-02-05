// WelcomePage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocation } from 'react-router-native';

const WelcomePage = () => {
  const location = useLocation();
  const { name } = location.state; 
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {name}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});

export default WelcomePage;
