import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { useLocation, useNavigate } from 'react-router-native';
import { useFonts } from 'expo-font'

export const Home = () => {

    const [fontsLoaded] = useFonts({
        'Arvo Bold': require("../assets/fonts/Arvo-Bold.ttf"),
    });
    
    const location = useLocation();
    const { name } = location.state;
    const navigate = useNavigate();

    const handleSignIn = () => {
        navigate('/');
    }

    return(
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={handleSignIn}>
                    <Text style={styles.header}>LookSee!</Text>
                </TouchableOpacity>
                <View style={styles.content}>

                </View>
                <View style={styles.footer}>
                    <Text style={[styles.footerTab, styles.selected]}>H</Text>
                    <Text style={styles.footerTab}>E</Text>
                    <Text style={styles.footerTab}>S</Text>
                    <Text style={styles.footerTab}>A</Text>
                </View>
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
    content: {
        height: '75%',
    },
    footer: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'space-around',
        flexDirection: 'row',
        height: 10,
        backgroundColor: '#000',
    },
    footerTab: {
        fontSize: 25,
        color: '#fff',
        fontFamily: 'Arvo Bold',
    },
    selected: {
        backgroundColor: 'red',
    }
})