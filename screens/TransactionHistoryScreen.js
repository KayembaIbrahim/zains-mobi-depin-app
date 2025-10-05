import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { getCurrentUser } from '../services/auth';
import { getMyTransactions } from '../services/transactions';

export default function TransactionHistoryScreen() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      const list = await getMyTransactions(u.id);
      setItems(list);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>
      <FlatList data={items} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.type}>{item.type.toUpperCase()}</Text>
          <Text style={styles.amount}>{item.amountNsimbi} N</Text>
          <Text style={styles.status}>{item.status}</Text>
          <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      )} ListEmptyComponent={<Text style={styles.empty}>No transactions yet.</Text>} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.BG },
  header: { color: COLORS.TEXT, fontSize: 18, marginBottom: 12, fontFamily: 'simsun' },
  row: { backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10 },
  type: { color: COLORS.TEXT, fontFamily: 'simsun' },
  amount: { color: COLORS.ORANGE, fontFamily: 'simsun' },
  status: { color: COLORS.GREENBLUE, fontFamily: 'simsun' },
  date: { color: COLORS.LIGHT_GRAY, fontFamily: 'simsun' },
  empty: { color: COLORS.LIGHT_GRAY, fontFamily: 'simsun' },
});
