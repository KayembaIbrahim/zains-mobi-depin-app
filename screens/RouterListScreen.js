import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { addRouter, listRouters, removeRouter } from '../services/nodes';
import { getCurrentUser } from '../services/auth';

export default function RouterListScreen() {
  const [ssid, setSsid] = useState('ZAIN-MIFI');
  const [price, setPrice] = useState('');
  const [routers, setRouters] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => { (async () => { setUser(await getCurrentUser()); load(); })(); }, []);

  async function load() { setRouters(await listRouters()); }

  async function add() {
    if (!ssid || !price) return;
    await addRouter({ adminUserId: user.id, ssid, priceNsimbiPer24h: Number(price) });
    setSsid('ZAIN-MIFI'); setPrice(''); load();
  }

  async function remove(id) { await removeRouter(id); load(); }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Router/MiFi List (Admin)</Text>
      <View style={styles.row}>
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="SSID" value={ssid} onChangeText={setSsid} placeholderTextColor="#9AA0A6" />
        <TextInput style={[styles.input, { width: 120, marginLeft: 8 }]} placeholder="Price 24h" keyboardType="numeric" value={price} onChangeText={setPrice} placeholderTextColor="#9AA0A6" />
        <TouchableOpacity style={styles.addBtn} onPress={add}><Text style={styles.addBtnText}>Add</Text></TouchableOpacity>
      </View>

      <FlatList data={routers} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.ssid}</Text>
          <Text style={styles.sub}>{item.priceNsimbiPer24h} Nsimbi / 24h</Text>
          <TouchableOpacity style={styles.removeBtn} onPress={() => remove(item.id)}><Text style={styles.removeBtnText}>Remove</Text></TouchableOpacity>
        </View>
      )} ListEmptyComponent={<Text style={styles.empty}>No routers yet.</Text>} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.BG },
  header: { color: COLORS.TEXT, fontSize: 18, marginBottom: 12, fontFamily: 'simsun' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontFamily: 'simsun', color: COLORS.TEXT },
  addBtn: { backgroundColor: COLORS.ORANGE, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginLeft: 8 },
  addBtnText: { color: '#fff', fontFamily: 'simsun' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12 },
  title: { color: COLORS.TEXT, fontFamily: 'simsun', fontSize: 16 },
  sub: { color: COLORS.GREENBLUE, fontFamily: 'simsun', marginTop: 6 },
  removeBtn: { marginTop: 8, backgroundColor: COLORS.DANGER, padding: 10, borderRadius: 8, alignSelf: 'flex-start' },
  removeBtnText: { color: '#fff', fontFamily: 'simsun' },
  empty: { color: COLORS.LIGHT_GRAY, fontFamily: 'simsun' },
});
