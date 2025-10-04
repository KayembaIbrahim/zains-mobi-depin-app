import { Storage, KEYS } from './storage';

export async function logTransaction(tx) {
  const all = (await Storage.get(KEYS.TRANSACTIONS, [])) || [];
  const withId = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, ...tx };
  const next = [withId, ...all];
  await Storage.set(KEYS.TRANSACTIONS, next);
  return withId;
}

export async function getMyTransactions(userId) {
  const all = (await Storage.get(KEYS.TRANSACTIONS, [])) || [];
  return all.filter((t) => t.userId === userId || t.counterpartyUserId === userId);
}

export async function getAllTransactions() {
  return (await Storage.get(KEYS.TRANSACTIONS, [])) || [];
}
