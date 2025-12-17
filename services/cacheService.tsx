// src/services/cacheService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setCache(key: string, data: any, ttl: number) {
  const item = {
    data,
    timestamp: Date.now(),
    ttl,
  };
  try {
    await AsyncStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.log(error);
  }
}

export async function getCache(key: string): Promise<any | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;

  try {
    const item = JSON.parse(raw);
    const expired = Date.now() - item.timestamp > item.ttl;
    if (expired) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    return item.data;
  } catch {
    await AsyncStorage.removeItem(key);
    return null;
  }
}

export async function clearCache(key: string) {
  await AsyncStorage.removeItem(key);
}
