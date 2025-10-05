import { Storage, KEYS } from './storage';
import { logTransaction } from './transactions';

export async function listNodes() {
  const nodes = (await Storage.get(KEYS.NODES, [])) || [];
  return nodes;
}

export async function becomeNode({ userId, type = 'phone', ssid, priceNsimbiPer24h }) {
  const nodes = (await Storage.get(KEYS.NODES, [])) || [];
  const existing = nodes.find((n) => n.ownerUserId === userId);
  const node = existing || {
    id: `${Date.now()}`,
    ownerUserId: userId,
    type,
    ssid: ssid || 'Hotspot',
    priceNsimbiPer24h: Number(priceNsimbiPer24h || 0),
    earningsNsimbi: 0,
    createdAt: Date.now(),
  };
  node.priceNsimbiPer24h = Number(priceNsimbiPer24h || node.priceNsimbiPer24h || 0);
  node.ssid = ssid || node.ssid || 'Hotspot';
  const next = existing ? nodes.map((n) => (n.id === node.id ? node : n)) : [node, ...nodes];
  await Storage.set(KEYS.NODES, next);
  return node;
}

export async function addRouter({ adminUserId, ssid, priceNsimbiPer24h, notes }) {
  const routers = (await Storage.get(KEYS.ROUTERS, [])) || [];
  const router = {
    id: `${Date.now()}`,
    ssid,
    priceNsimbiPer24h: Number(priceNsimbiPer24h || 0),
    notes: notes || '',
    createdBy: adminUserId,
    createdAt: Date.now(),
  };
  await Storage.set(KEYS.ROUTERS, [router, ...routers]);
  return router;
}

export async function listRouters() {
  return (await Storage.get(KEYS.ROUTERS, [])) || [];
}

export async function removeRouter(routerId) {
  const routers = (await Storage.get(KEYS.ROUTERS, [])) || [];
  const next = routers.filter((r) => r.id !== routerId);
  await Storage.set(KEYS.ROUTERS, next);
  return true;
}

export async function recordEarning(nodeId, amountNsimbi, buyerUserId) {
  const nodes = (await Storage.get(KEYS.NODES, [])) || [];
  const idx = nodes.findIndex((n) => n.id === nodeId);
  if (idx === -1) return null;
  nodes[idx].earningsNsimbi += Number(amountNsimbi || 0);
  await Storage.set(KEYS.NODES, nodes);
  await logTransaction({
    type: 'earning',
    status: 'approved',
    amountNsimbi: Number(amountNsimbi),
    userId: nodes[idx].ownerUserId,
    counterpartyUserId: buyerUserId,
    createdAt: Date.now(),
    meta: { nodeId },
  });
  return nodes[idx];
}
