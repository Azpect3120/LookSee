import { StyleSheet, View } from "react-native";
import { NativeRouter, Route, Routes } from "react-router-native";
import { Signin } from "./pages/signin";
import { Home } from "./pages/home"
import { useFonts } from 'expo-font';
import WelcomePage from "./pages/welcomepage";

export default function App() {

  const [fontsLoaded] = useFonts({
    'Red Hat Display': require("./assets/fonts/RedHatDisplay-VariableFont_wght.ttf"),
  });

  return (
    <View style={styles.container}>
      <NativeRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
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
