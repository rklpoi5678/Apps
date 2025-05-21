import { useEffect } from 'react';
import InterstitialSplashScreen from '../src/components/InterstitialAd';
import { View, Text, StyleSheet } from 'react-native';

export default function SplashScreen() {
  useEffect(() => {
    console.log("✅ Splash 화면 렌더링됨");
  }, []);
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>로딩 중...</Text>
      <InterstitialSplashScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
