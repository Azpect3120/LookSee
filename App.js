import { StyleSheet, View } from "react-native";
import { NativeRouter, Route, Routes } from "react-router-native";
import { Signin } from "./pages/signin";
import { Home } from "./pages/home"
import { useFonts } from 'expo-font';
import { Explore } from './pages/explore';
import NavBar from "./pages/components/NavBar";

export default function App() {

  const [fontsLoaded] = useFonts({
      'Arvo Bold': require("./assets/fonts/Arvo-Bold.ttf"),
  });

  return (
    <View style={styles.container}>
      <NativeRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
        </Routes>
      </NativeRouter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
