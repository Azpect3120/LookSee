import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigate, useLocation } from 'react-router-native';

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (route) => {
        navigate(route);
    };

    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={() => handleNavigate("/")}>
                <Text style={[styles.tab, location.pathname === "/" && styles.selected]}>👀</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleNavigate("/following")}>
                <Text style={[styles.tab, location.pathname === "/following" && styles.selected]}>🧑‍🤝‍🧑</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.plus]} onPress={() => handleNavigate("/create")}>
                <View style={[styles.circle, location.pathname === "/create" && styles.selectedCircle]}>
                    <Text style={[styles.tab, location.pathname === "/create" && styles.selected]}>➕</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleNavigate("/inbox")}>
                <Text style={[styles.tab,  location.pathname === "/inbox" && styles.selected]}>ℹ️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleNavigate("/profile")}>
                <Text style={[styles.tab, location.pathname === "/profile" && styles.selected]}>👤</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: "8%",
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 20,
        position: 'absolute',
        left: 0,             
        right: 0,            
        bottom: 0,           
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    plus: {
        marginBottom: 35,
    },
    circle: {
        width: 75,
        height: 75,
        borderRadius: 37.5,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    selectedCircle: {
        backgroundColor: '#007BFF', 
    },
    tab: {
        fontSize: 24,
    },
    selected: {
        color: 'white', 
    },
});

export default NavBar;
