import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { useLocation, useNavigate } from 'react-router-native';
import NavBar from './components/NavBar'

export const Following = () => {
    
    const navigate = useNavigate();
    const location = useLocation();
    
    return (
        <>
            <StatusBar barStyle='dark-content' />
            <View style={styles.container}>
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