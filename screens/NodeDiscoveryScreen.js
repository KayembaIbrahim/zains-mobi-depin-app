import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { listNodes } from '../services/nodes';

const NSIMBI_TO_UGX = 2;

export default function NodeDiscoveryScreen({ navigation }) {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    (async () => {
      const list = await listNodes();
      setNodes(list);
    })();
  }, []);

  const renderItem = ({ item }) => {
    const ugx = (item.priceNsimbiPer24h || 0) * NSIMBI_TO_UGX;
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BuyAccess', { node: item })}>
        <Text style={styles.title}>{item.ssid} • {item.type.toUpperCase()}</Text>
        <Text style={styles.price}>{item.priceNsimbiPer24h} Nsimbi / 24h</Text>
        <Text style={styles.sub}>≈ UGX {ugx.toFixed(0)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nearby Nodes</Text>
      <FlatList data={nodes} keyExtractor={(i) => i.id} renderItem={renderItem} ListEmptyComponent={<Text style={styles.empty}>No nodes yet. Try "Become Node"</Text>} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.BG },
  header: { color: COLORS.TEXT, fontSize: 18, marginBottom: 12, fontFamily: 'simsun' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 12 },
  title: { color: COLORS.TEXT, fontFamily: 'simsun', fontSize: 16 },
  price: { color: COLORS.ORANGE, fontFamily: 'simsun', marginTop: 6 },
  sub: { color: COLORS.GREENBLUE, fontFamily: 'simsun', marginTop: 2 },
  empty: { color: COLORS.LIGHT_GRAY, fontFamily: 'simsun' },
});
