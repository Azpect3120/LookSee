import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigate, useLocation } from 'react-router-native';

const NavBar = ({ footerStyle, footerTabStyle, selected }) => {

    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigate = (x) => {
        navigate(x);
    }

    return (
        <View style={footerStyle}>
            <TouchableOpacity onPress={() => handleNavigate("/home")}>
                <Text style={(location.pathname == "/home") ? [footerTabStyle, selected] : footerTabStyle}>👀</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate("/following")}>
                <Text style={(location.pathname == "/following") ? [footerTabStyle, selected] : footerTabStyle}>🧑‍🤝‍🧑</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate("/create")}>
                <Text style={(location.pathname == "/create") ? [footerTabStyle, selected] : footerTabStyle}>➕</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate("/inbox")}>
                <Text style={(location.pathname == "/inbox") ? [footerTabStyle, selected] : footerTabStyle}>ℹ️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate("/profile")}>
                <Text style={(location.pathname == "/profile") ? [footerTabStyle, selected] : footerTabStyle}>👤</Text>
            </TouchableOpacity>
        </View>
    )
}

export default NavBar;