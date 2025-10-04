import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { getCurrentUser } from '../services/auth';
import { becomeNode } from '../services/nodes';

export default function BecomeNodeScreen() {
  const [price, setPrice] = useState('');
  const [ssid, setSsid] = useState('ZAIN-MOBI-HOTSPOT');
  const [type, setType] = useState('phone');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => { setUser(await getCurrentUser()); })();
  }, []);

  async function submit() {
    if (!user) return;
    await becomeNode({ userId: user.id, type, ssid, priceNsimbiPer24h: Number(price) });
    setMessage('You are now a node. Others can discover your hotspot.');
    setPrice('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Become a Node</Text>
      <TextInput placeholder="SSID/Name" value={ssid} onChangeText={setSsid} style={styles.input} placeholderTextColor="#9AA0A6" />
      <TextInput placeholder="Type: phone or router" value={type} onChangeText={setType} style={styles.input} placeholderTextColor="#9AA0A6" />
      <TextInput placeholder="Price per 24h (Nsimbi)" keyboardType="numeric" value={price} onChangeText={setPrice} style={styles.input} placeholderTextColor="#9AA0A6" />
      <TouchableOpacity style={styles.button} onPress={submit}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
      {!!message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.BG },
  header: { color: COLORS.TEXT, fontSize: 18, marginBottom: 12, fontFamily: 'simsun' },
  input: { borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10, fontFamily: 'simsun', color: COLORS.TEXT },
  button: { backgroundColor: COLORS.ORANGE, padding: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontFamily: 'simsun' },
  message: { color: COLORS.GREENBLUE, marginTop: 10, fontFamily: 'simsun' },
});
