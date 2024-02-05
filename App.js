import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';

export default function App() {

  const [fontsLoaded] = useFonts({
    'Red Hat Display': require("./assets/fonts/RedHatDisplay-VariableFont_wght.ttf"),
  });

  return (
    <View style={styles.container}>
      <Text style={styles.customText}>LookSee!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f54242',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customText: {
    fontFamily: 'Red Hat Display',
    fontSize: 40,
  }
});
