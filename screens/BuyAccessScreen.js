import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { getCurrentUser } from '../services/auth';
import { buyAccess } from '../services/tokens';

export default function BuyAccessScreen({ route, navigation }) {
  const node = route.params?.node;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleBuy() {
    setLoading(true); setError('');
    try {
      const user = await getCurrentUser();
      const token = await buyAccess({ userId: user.id, node });
      navigation.replace('AccessToken', { prefill: token.token });
    } catch (e) {
      setError(String(e?.message || 'Failed'));
    } finally { setLoading(false); }
  }

  if (!node) {
    return (
      <View style={styles.container}><Text style={styles.text}>No node selected.</Text></View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Buy 24h Access</Text>
      <View style={styles.card}>
        <Text style={styles.title}>{node.ssid} • {node.type.toUpperCase()}</Text>
        <Text style={styles.price}>{node.priceNsimbiPer24h} Nsimbi</Text>
        <Text style={styles.note}>Your wallet will be charged. A secure token is issued—no router password exposed.</Text>
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.primaryBtn} onPress={handleBuy} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Processing...' : 'Pay & Get Token'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.BG },
  header: { color: COLORS.TEXT, fontSize: 18, marginBottom: 12, fontFamily: 'simsun' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 },
  title: { color: COLORS.TEXT, fontFamily: 'simsun', fontSize: 16 },
  price: { color: COLORS.ORANGE, fontFamily: 'simsun', marginTop: 6 },
  note: { color: COLORS.GREENBLUE, fontFamily: 'simsun', marginTop: 8 },
  primaryBtn: { backgroundColor: COLORS.ORANGE, padding: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: 'white', fontFamily: 'simsun' },
  error: { color: COLORS.DANGER, marginBottom: 10, fontFamily: 'simsun' },
});
