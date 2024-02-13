
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeRouter, Route, Routes } from 'react-router-native';
import { Home } from './pages/home';
import { Following } from './pages/following';
import { Create } from './pages/create';
import { Inbox } from './pages/inbox';
import { Profile } from './pages/profile';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Arvo Bold': require('./assets/fonts/Arvo-Bold.ttf'),
    'Arvo': require('./assets/fonts/Arvo-Regular.ttf'),
  });

  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
        setIsAppReady(true);
      }
    };

    prepareApp();
  }, [fontsLoaded]);

  if (!isAppReady) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <NativeRouter>
        <Routes>
          <Route path="/" element={<Home />} />
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
    backgroundColor: '#fff',
    alignItems: "center",
    justifyContent: "center",
  },
});
