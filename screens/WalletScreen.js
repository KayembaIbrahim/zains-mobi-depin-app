import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';
import { getCurrentUser } from '../services/auth';
import { getWallet, submitTopUpRequest, submitWithdrawRequest } from '../services/wallet';

const NSIMBI_TO_UGX = 2;

export default function WalletScreen() {
  const [wallet, setWallet] = useState({ balanceNsimbi: 0 });
  const [amount, setAmount] = useState('');
  const [txId, setTxId] = useState('');
  const [method, setMethod] = useState('Mobile Money');
  const [payoutHandle, setPayoutHandle] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const u = await getCurrentUser();
      setUser(u);
      const w = await getWallet();
      setWallet(w);
    })();
  }, []);

  async function requestTopUp() {
    if (!amount || !txId) return setMessage('Amount and TX ID required');
    await submitTopUpRequest(user.id, Number(amount), { txId, method });
    setMessage('Top-up submitted. Awaiting manual approval.');
    setAmount(''); setTxId('');
  }

  async function requestWithdraw() {
    if (!amount) return setMessage('Amount required');
    await submitWithdrawRequest(user.id, Number(amount), { method, payoutHandle });
    setMessage('Withdraw request submitted. Awaiting approval.');
    setAmount('');
  }

  const balanceUGX = wallet.balanceNsimbi * NSIMBI_TO_UGX;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet Balance</Text>
      <Text style={styles.balance}>{wallet.balanceNsimbi.toFixed(2)} Nsimbi</Text>
      <Text style={styles.subBalance}>≈ UGX {balanceUGX.toFixed(0)}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top-up (Manual Review)</Text>
        <TextInput placeholder="Amount in Nsimbi" keyboardType="numeric" value={amount} onChangeText={setAmount} style={styles.input} placeholderTextColor="#9AA0A6" />
        <TextInput placeholder="Payment TX ID (MoMo/USDT Polygon)" value={txId} onChangeText={setTxId} style={styles.input} placeholderTextColor="#9AA0A6" />
        <TextInput placeholder="Method (Mobile Money or USDT)" value={method} onChangeText={setMethod} style={styles.input} placeholderTextColor="#9AA0A6" />
        <TouchableOpacity style={styles.primaryBtn} onPress={requestTopUp}><Text style={styles.btnText}>Submit Top-up</Text></TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Withdraw (Manual Review)</Text>
        <TextInput placeholder="Amount in Nsimbi" keyboardType="numeric" value={amount} onChangeText={setAmount} style={styles.input} placeholderTextColor="#9AA0A6" />
        <TextInput placeholder="Payout Handle (MoMo number/USDT address)" value={payoutHandle} onChangeText={setPayoutHandle} style={styles.input} placeholderTextColor="#9AA0A6" />
        <TextInput placeholder="Method" value={method} onChangeText={setMethod} style={styles.input} placeholderTextColor="#9AA0A6" />
        <TouchableOpacity style={styles.secondaryBtn} onPress={requestWithdraw}><Text style={styles.btnText}>Request Withdraw</Text></TouchableOpacity>
      </View>

      {!!message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BG, padding: 16 },
  title: { fontSize: 18, color: COLORS.TEXT, marginBottom: 8, fontFamily: 'simsun' },
  balance: { fontSize: 28, color: COLORS.ORANGE, fontFamily: 'simsun' },
  subBalance: { fontSize: 14, color: COLORS.GREENBLUE, marginBottom: 16, fontFamily: 'simsun' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 16, borderColor: '#E5E7EB', borderWidth: 1 },
  cardTitle: { fontSize: 16, color: COLORS.TEXT, marginBottom: 8, fontFamily: 'simsun' },
  input: { borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10, fontFamily: 'simsun', color: COLORS.TEXT },
  primaryBtn: { backgroundColor: COLORS.ORANGE, padding: 12, borderRadius: 10, alignItems: 'center' },
  secondaryBtn: { backgroundColor: COLORS.GREENBLUE, padding: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: 'white', fontFamily: 'simsun' },
  message: { color: COLORS.GREENBLUE, fontFamily: 'simsun' },
});
