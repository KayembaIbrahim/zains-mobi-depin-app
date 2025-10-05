import { Storage, KEYS } from './storage';
import { debitWallet } from './wallet';
import { recordEarning } from './nodes';
import { customAlphabet } from 'nanoid';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const nano = customAlphabet(alphabet, 8);

export async function listTokens() {
  return (await Storage.get(KEYS.TOKENS, [])) || [];
}

export async function buyAccess({ userId, node, durationHours = 24 }) {
  // Debit wallet by node.price
  await debitWallet(userId, Number(node.priceNsimbiPer24h || 0), { method: 'buy', nodeId: node.id });

  const token = nano();
  const tokenEntry = {
    id: `${Date.now()}`,
    token,
    nodeId: node.id,
    buyerUserId: userId,
    ssid: node.ssid,
    validFrom: Date.now(),
    validUntil: Date.now() + durationHours * 3600 * 1000,
    status: 'active',
  };
  const existing = (await Storage.get(KEYS.TOKENS, [])) || [];
  await Storage.set(KEYS.TOKENS, [tokenEntry, ...existing]);

  // Record earning for node owner
  await recordEarning(node.id, Number(node.priceNsimbiPer24h || 0), userId);

  return tokenEntry;
}

export async function validateToken(code) {
  const all = (await Storage.get(KEYS.TOKENS, [])) || [];
  const match = all.find((t) => t.token?.toUpperCase() === String(code || '').toUpperCase());
  if (!match) return { valid: false, reason: 'Token not found' };
  const now = Date.now();
  if (now > match.validUntil) return { valid: false, reason: 'Token expired' };
  if (match.status !== 'active') return { valid: false, reason: 'Token inactive' };
  return { valid: true, token: match };
}

export async function endSession(tokenId) {
  const all = (await Storage.get(KEYS.TOKENS, [])) || [];
  const idx = all.findIndex((t) => t.id === tokenId);
  if (idx === -1) return false;
  all[idx].status = 'ended';
  await Storage.set(KEYS.TOKENS, all);
  return true;
}
