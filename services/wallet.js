import { Storage, KEYS } from './storage';
import { logTransaction } from './transactions';

export async function getWallet() {
  const wallet = await Storage.get(KEYS.WALLET, { balanceNsimbi: 0, lastUpdated: Date.now() });
  return wallet;
}

export async function creditWallet(userId, amountNsimbi, meta = {}) {
  const wallet = await getWallet();
  wallet.balanceNsimbi += Number(amountNsimbi || 0);
  wallet.lastUpdated = Date.now();
  await Storage.set(KEYS.WALLET, wallet);
  await logTransaction({
    type: 'credit',
    method: meta.method || 'manual',
    status: 'approved',
    amountNsimbi,
    userId,
    createdAt: Date.now(),
    meta,
  });
  return wallet;
}

export async function debitWallet(userId, amountNsimbi, meta = {}) {
  const wallet = await getWallet();
  const amt = Number(amountNsimbi || 0);
  if (wallet.balanceNsimbi < amt) throw new Error('Insufficient balance');
  wallet.balanceNsimbi -= amt;
  wallet.lastUpdated = Date.now();
  await Storage.set(KEYS.WALLET, wallet);
  await logTransaction({
    type: 'debit',
    method: meta.method || 'purchase',
    status: 'approved',
    amountNsimbi: amt,
    userId,
    createdAt: Date.now(),
    meta,
  });
  return wallet;
}

export async function submitTopUpRequest(userId, amountNsimbi, { txId, method }) {
  // Log a pending top-up; admin can approve to credit later
  const tx = await logTransaction({
    type: 'topup',
    status: 'pending',
    method,
    amountNsimbi: Number(amountNsimbi),
    txId,
    userId,
    createdAt: Date.now(),
  });
  return tx;
}

export async function submitWithdrawRequest(userId, amountNsimbi, { method, payoutHandle }) {
  const tx = await logTransaction({
    type: 'withdraw',
    status: 'pending',
    method,
    amountNsimbi: Number(amountNsimbi),
    payoutHandle,
    userId,
    createdAt: Date.now(),
  });
  return tx;
}

export async function adminApproveTransaction(txId, approve = true) {
  const all = (await Storage.get(KEYS.TRANSACTIONS, [])) || [];
  const idx = all.findIndex((t) => t.id === txId);
  if (idx === -1) return null;
  const tx = all[idx];
  tx.status = approve ? 'approved' : 'rejected';
  all[idx] = tx;
  await Storage.set(KEYS.TRANSACTIONS, all);
  if (approve) {
    if (tx.type === 'topup') {
      // Credit wallet on approval
      const wallet = await getWallet();
      wallet.balanceNsimbi += Number(tx.amountNsimbi || 0);
      wallet.lastUpdated = Date.now();
      await Storage.set(KEYS.WALLET, wallet);
    }
    if (tx.type === 'withdraw') {
      const wallet = await getWallet();
      wallet.balanceNsimbi -= Number(tx.amountNsimbi || 0);
      wallet.lastUpdated = Date.now();
      await Storage.set(KEYS.WALLET, wallet);
    }
  }
  return tx;
}
