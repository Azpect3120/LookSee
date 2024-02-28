import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigate, useLocation } from 'react-router-native';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [, setRefreshKey] = useState(0);

    const handleNavigate = (route) => {
        setRefreshKey(prevKey => prevKey + 1);
        navigate(route, { state: { key: new Date().getTime() } });
    };

    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={() => handleNavigate("/")}>
                <FontAwesome style={styles.tab} name="home" color={(location.pathname === "/") ? "#007BFF" : "black"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleNavigate("/following")}>
                <MaterialIcons style={styles.tab} name="explore" color={(location.pathname === "/following") ? "#007BFF" : "black"} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.plus]} onPress={() => handleNavigate("/create")}>
                <View style={[styles.circle, location.pathname === "/create" && styles.selectedCircle]}>
                    <Entypo style={[styles.tab, location.pathname === "/create" && styles.selected]} name="plus" size={24} color="black" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleNavigate("/inbox")}>
                <FontAwesome style={styles.tab} name="inbox" color={(location.pathname === "/inbox") ? "#007BFF" : "black"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleNavigate("/profile")}>
                <MaterialCommunityIcons style={styles.tab} name="account" color={(location.pathname === "/profile") ? "#007BFF" : "black"} />
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
        fontSize: 28,
    }
});

export default NavBar;
