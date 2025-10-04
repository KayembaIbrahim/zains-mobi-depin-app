import React, { useEffect } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const t = setTimeout(() => {
      navigation.replace('Auth');
    }, 1200);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image resizeMode="contain" style={styles.logo} source={require('../assets/logo.png')} />
      <Text style={styles.title}>ZAIN MOBI</Text>
      <Text style={styles.subtitle}>DePIN for Internet Sharing & Data Resale</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.DARK_GRAY },
  logo: { width: 180, height: 180, marginBottom: 16 },
  title: { color: COLORS.ORANGE, fontSize: 28, fontFamily: 'simsun', letterSpacing: 2 },
  subtitle: { color: '#D1D5DB', fontSize: 14, marginTop: 6, fontFamily: 'simsun' },
});
