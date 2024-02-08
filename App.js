import { StyleSheet, View } from "react-native";
import { NativeRouter, Route, Routes } from "react-router-native";
import { Signin } from "./pages/signin";
import { Home } from "./pages/home"
import { useFonts } from 'expo-font';
import { Following } from './pages/following';
import { Create } from './pages/create';
import { Inbox } from './pages/inbox';
import { Profile } from './pages/profile';

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
          <Route path="/following" element={<Following />} />
          <Route path="/create" element={<Create />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/profile" element={<Profile />} />
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
