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
                <Text style={(location.pathname == "/home") ? [footerTabStyle, selected] : footerTabStyle}>H</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate("/explore")}>
                <Text style={(location.pathname == "/explore") ? [footerTabStyle, selected] : footerTabStyle}>E</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate("/search")}>
                <Text style={(location.pathname == "/search") ? [footerTabStyle, selected] : footerTabStyle}>S</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigate("/account")}>
                <Text style={(location.pathname == "/account") ? [footerTabStyle, selected] : footerTabStyle}>A</Text>
            </TouchableOpacity>
        </View>
    )
}

export default NavBar;