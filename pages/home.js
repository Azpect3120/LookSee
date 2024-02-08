import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { useLocation, useNavigate } from 'react-router-native';
import { useFonts } from 'expo-font'
import NavBar from './components/NavBar'

export const Home = () => {
    
    const navigate = useNavigate();
    const location = useLocation();
    
    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigate('/')}>
                    <Text style={styles.header}>LookSee!</Text>
                </TouchableOpacity>
                <View style={styles.content}>

                </View>
                <NavBar footerStyle={styles.footer} footerTabStyle={styles.footerTab} selected={styles.selected} />
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
        backgroundColor: '#000',
        paddingTop: 65,
        paddingLeft: 20,
        paddingBottom: 15,
        width: '100%',
        color: '#fff',
        textAlign: 'left',
        fontSize: 35,
        fontFamily: 'Arvo Bold',
    },

    footer: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'space-around',
        flexDirection: 'row',
        height: "12%",
        backgroundColor: '#000',
        position: 'absolute',
        bottom: 0,
        width: "100%",
    },
    footerTab: {
        fontSize: 25,
        color: '#fff',
        fontFamily: 'Arvo Bold',
        padding: 10,
        marginBottom: 20,
        borderRadius: 15,
    },
    selected: {
        backgroundColor: 'red',
    }
})