import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';



const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>지도를 로딩 중입니다...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    marginTop: 20,
    color: '#000',
  },
});

export default LoadingScreen;