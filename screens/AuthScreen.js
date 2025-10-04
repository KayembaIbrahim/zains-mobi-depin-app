import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { registerOrLogin, getCurrentUser } from '../services/auth';

export default function AuthScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      if (u) navigation.replace('Main');
    })();
  }, [navigation]);

  async function onSubmit() {
    setLoading(true); setError('');
    try {
      await registerOrLogin({ phone: phone || undefined, email: email || undefined, name: name || undefined });
      navigation.replace('Main');
    } catch (e) {
      setError(String(e?.message || 'Failed'));
    } finally { setLoading(false); }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Zain Mobi</Text>
      <Text style={styles.sub}>Register or sign in with phone or email</Text>

      <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={styles.input} placeholderTextColor="#9AA0A6" />
      <TextInput placeholder="Phone (e.g., 2567...)" keyboardType="phone-pad" value={phone} onChangeText={setPhone} style={styles.input} placeholderTextColor="#9AA0A6" />
      <Text style={styles.or}>OR</Text>
      <TextInput placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} style={styles.input} placeholderTextColor="#9AA0A6" />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Please wait...' : 'Continue'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.BG },
  header: { fontSize: 24, color: COLORS.ORANGE, fontFamily: 'simsun', marginTop: 40, marginBottom: 6 },
  sub: { fontSize: 14, color: COLORS.TEXT, opacity: 0.8, marginBottom: 20, fontFamily: 'simsun' },
  input: { borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12, fontFamily: 'simsun', color: COLORS.TEXT },
  or: { alignSelf: 'center', color: COLORS.GREENBLUE, marginVertical: 8, fontFamily: 'simsun' },
  error: { color: COLORS.DANGER, marginBottom: 12, fontFamily: 'simsun' },
  button: { backgroundColor: COLORS.GREENBLUE, padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontFamily: 'simsun', fontSize: 16 },
});
