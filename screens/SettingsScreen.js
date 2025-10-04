import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { getCurrentUser, updateProfile, logout } from '../services/auth';

export default function SettingsScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => { (async () => { const u = await getCurrentUser(); setUser(u); setName(u?.name || ''); })(); }, []);

  async function save() {
    await updateProfile({ name });
  }

  async function signOut() {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Phone</Text>
      <Text style={styles.value}>{user?.phone || '-'}</Text>
      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{user?.email || '-'}</Text>
      <Text style={styles.label}>Role</Text>
      <Text style={styles.value}>{user?.role}</Text>

      <TouchableOpacity style={styles.saveBtn} onPress={save}><Text style={styles.btnText}>Save</Text></TouchableOpacity>
      <TouchableOpacity style={styles.logoutBtn} onPress={signOut}><Text style={styles.btnText}>Logout</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: COLORS.BG },
  header: { color: COLORS.TEXT, fontSize: 18, marginBottom: 12, fontFamily: 'simsun' },
  label: { color: COLORS.LIGHT_GRAY, fontFamily: 'simsun', marginTop: 10 },
  value: { color: COLORS.TEXT, fontFamily: 'simsun' },
  input: { borderWidth: 1, borderColor: '#D0D5DD', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10, fontFamily: 'simsun', color: COLORS.TEXT },
  saveBtn: { backgroundColor: COLORS.GREENBLUE, padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  logoutBtn: { backgroundColor: COLORS.DANGER, padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontFamily: 'simsun' },
});
