import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Text, TouchableOpacity } from 'react-native';
import { useLocation, useNavigate } from 'react-router-native';
import NavBar from './components/NavBar'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Profile = () => {
    
    const navigate = useNavigate();
    const location = useLocation();

    const [accountInfo, setAccountInfo] = useState({});

    useEffect(() => {
        const getStorage = async () => {
            const storage = await AsyncStorage.getItem("SessionAccount");
            if (storage !== null) {
                const parsedInfo = JSON.parse(storage);
                setAccountInfo(parsedInfo);
            } else {
                setAccountInfo({ id: null })
            }
        }
        getStorage();
    }, []);

    const handlePress = url => {
        navigate(url);
    }

    return (
        <>
            <StatusBar barStyle='dark-content' />
            <View style={styles.container}>
                <View style={styles.profileInfo}>
                    <Text style={styles.accountName}>{(accountInfo.id != null) ? accountInfo.username : "Account"}</Text>
                    <View style={styles.profilePicture}>{/* change to Image component later */}</View>
                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.text}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => handlePress('/login')}>
                            <Text style={styles.text}>{(accountInfo.id != null) ? "Log Out" : "Log In"}</Text>
                        </TouchableOpacity>
                    </View>
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
        backgroundColor: '#ddd',
    },
    profileInfo: {
        backgroundColor: "#fff",
        width: "100%",
        height: "40%",
        position: "absolute",
        top: 0,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    accountName: {
        color: "#000",
        fontSize: 20,
    },
    profilePicture: {
        width: 120,
        height: 120,
        backgroundColor: "#ddd",
        borderRadius: 100,
        overflow: "hidden",
        margin: "4%",
    },
    buttons: {
        flexDirection: "row",
    },
    button: {
        backgroundColor: "#007BFF",
        borderRadius: 10,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        width: "30%",
        marginLeft: 5,
        marginRight: 5,
    },
    text: {
        color: "#fff",
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: "center",
    }
})
