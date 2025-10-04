import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { validateToken } from '../services/tokens';

export default function AccessTokenScreen({ route }) {
  const [token, setToken] = useState(route.params?.prefill || '');
  const [result, setResult] = useState(null);

  async function onValidate() {
    const res = await validateToken(token);
    setResult(res);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter Access Token</Text>
      <TextInput placeholder="8-char token" autoCapitalize="characters" value={token} onChangeText={setToken} style={styles.input} placeholderTextColor="#9AA0A6" />
      <TouchableOpacity style={styles.button} onPress={onValidate}><Text style={styles.buttonText}>Validate</Text></TouchableOpacity>

      {result && (
        result.valid ? (
          <View style={styles.card}>
            <Text style={styles.valid}>Token valid</Text>
            <Text style={styles.instructions}>Connect to SSID: {result.token.ssid}
{`Then open your browser. If a captive portal appears, enter this token: ${token}. If not, share the token with the node owner. Access ends at: ${new Date(result.token.validUntil).toLocaleString()}`}</Text>
          </View>
        ) : (
          <Text style={styles.error}>Invalid: {result.reason}</Text>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.BG },
  header: { color: COLORS.TEXT, fontSize: 18, marginBottom: 12, fontFamily: 'simsun' },
  input: { borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10, fontFamily: 'simsun', color: COLORS.TEXT },
  button: { backgroundColor: COLORS.GREENBLUE, padding: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontFamily: 'simsun' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginTop: 16 },
  valid: { color: COLORS.SUCCESS, fontFamily: 'simsun', marginBottom: 8 },
  instructions: { color: COLORS.TEXT, fontFamily: 'simsun' },
  error: { color: COLORS.DANGER, fontFamily: 'simsun' },
});
