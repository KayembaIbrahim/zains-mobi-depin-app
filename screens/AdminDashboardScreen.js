import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { getAllTransactions } from '../services/transactions';
import { adminApproveTransaction } from '../services/wallet';
import { listTokens, endSession } from '../services/tokens';

export default function AdminDashboardScreen() {
  const [pending, setPending] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);

  async function load() {
    const txs = await getAllTransactions();
    setPending(txs.filter((t) => t.status === 'pending'));
    const tokens = await listTokens();
    setActiveSessions(tokens.filter((t) => t.status === 'active' && Date.now() < t.validUntil));
  }

  useEffect(() => { load(); }, []);

  async function approve(id, yes) {
    await adminApproveTransaction(id, yes);
    load();
  }

  async function stopSession(id) {
    await endSession(id); load();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      <Text style={styles.section}>Pending Credits/Payouts</Text>
      <FlatList data={pending} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.text}>{item.type.toUpperCase()} • {item.amountNsimbi} N • {item.method}</Text>
          <View style={styles.rowBtns}>
            <TouchableOpacity style={styles.approve} onPress={() => approve(item.id, true)}><Text style={styles.btnText}>Approve</Text></TouchableOpacity>
            <TouchableOpacity style={styles.reject} onPress={() => approve(item.id, false)}><Text style={styles.btnText}>Reject</Text></TouchableOpacity>
          </View>
        </View>
      )} ListEmptyComponent={<Text style={styles.empty}>No pending items.</Text>} />

      <Text style={styles.section}>Active Sessions</Text>
      <FlatList data={activeSessions} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.text}>{item.token} • {item.ssid} • ends {new Date(item.validUntil).toLocaleTimeString()}</Text>
          <TouchableOpacity style={styles.reject} onPress={() => stopSession(item.id)}><Text style={styles.btnText}>End</Text></TouchableOpacity>
        </View>
      )} ListEmptyComponent={<Text style={styles.empty}>No active sessions.</Text>} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.BG },
  header: { color: COLORS.TEXT, fontSize: 18, marginBottom: 12, fontFamily: 'simsun' },
  section: { color: COLORS.GREENBLUE, fontFamily: 'simsun', marginTop: 12, marginBottom: 8 },
  row: { backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowBtns: { flexDirection: 'row' },
  approve: { backgroundColor: COLORS.GREENBLUE, padding: 10, borderRadius: 8, marginRight: 8 },
  reject: { backgroundColor: COLORS.DANGER, padding: 10, borderRadius: 8 },
  btnText: { color: '#fff', fontFamily: 'simsun' },
  text: { color: COLORS.TEXT, fontFamily: 'simsun' },
  empty: { color: COLORS.LIGHT_GRAY, fontFamily: 'simsun' },
});
