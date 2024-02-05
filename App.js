import { StyleSheet, View } from "react-native";
import { NativeRouter, Route, Routes } from "react-router-native";
import { Signin } from "./pages/signin";
import WelcomePage from "./pages/welcomepage";

export default function App() {
  return (
    <View style={styles.container}>
      <NativeRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/welcome" element={<WelcomePage/>}/>
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
  Header: {
    color: "red",
    fontSize: 24,
  }
});
