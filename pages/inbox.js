import React from 'react';
import { StyleSheet, View, StatusBar, Text } from 'react-native';
import { useLocation, useNavigate } from 'react-router-native';
import NavBar from './components/NavBar'

export const Inbox = () => {
    
    const navigate = useNavigate();
    const location = useLocation();
    
    return (
        <>
            <StatusBar barStyle='dark-content' />
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text>Inbox</Text>
                </View>
                <NavBar />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        
    }
})