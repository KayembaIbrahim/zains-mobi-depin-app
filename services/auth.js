import { Storage, KEYS } from './storage';

export async function getCurrentUser() {
  return Storage.get(KEYS.USER, null);
}

export async function registerOrLogin({ phone, email, name }) {
  const existing = await Storage.get(KEYS.USER, null);
  const id = existing?.id ?? `${Date.now()}`;
  const user = {
    id,
    name: name || 'Zain User',
    phone: phone || null,
    email: email || null,
    role: inferRoleFromIdentity({ phone, email }),
  };
  await Storage.set(KEYS.USER, user);
  // Initialize wallet if empty
  const wallet = await Storage.get(KEYS.WALLET, null);
  if (!wallet) {
    await Storage.set(KEYS.WALLET, { balanceNsimbi: 0, lastUpdated: Date.now() });
  }
  // Bootstrap transactions array
  const txs = await Storage.get(KEYS.TRANSACTIONS, null);
  if (!txs) await Storage.set(KEYS.TRANSACTIONS, []);
  // Bootstrap nodes and routers and tokens
  if (!(await Storage.get(KEYS.NODES))) await Storage.set(KEYS.NODES, []);
  if (!(await Storage.get(KEYS.ROUTERS))) await Storage.set(KEYS.ROUTERS, []);
  if (!(await Storage.get(KEYS.TOKENS))) await Storage.set(KEYS.TOKENS, []);
  return user;
}

export async function updateProfile(updates) {
  const user = await getCurrentUser();
  const next = { ...(user || {}), ...updates };
  await Storage.set(KEYS.USER, next);
  return next;
}

export async function logout() {
  await Storage.remove(KEYS.USER);
}

function inferRoleFromIdentity({ phone, email }) {
  // Simple rule: if email contains 'admin' or phone ends with '0000', grant admin
  if (email && /admin/i.test(email)) return 'admin';
  if (phone && /0000$/.test(String(phone))) return 'admin';
  return 'user';
}
