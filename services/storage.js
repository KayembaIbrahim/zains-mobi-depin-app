import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  async get(key, defaultValue = null) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value != null ? JSON.parse(value) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  async set(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (_) {}
  },
};

export const KEYS = {
  USER: 'ZM_USER',
  WALLET: 'ZM_WALLET',
  NODES: 'ZM_NODES',
  ROUTERS: 'ZM_ROUTERS',
  TOKENS: 'ZM_TOKENS',
  TRANSACTIONS: 'ZM_TRANSACTIONS',
};
