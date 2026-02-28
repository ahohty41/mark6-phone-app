import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
  data: T;
  cachedAt: number; // timestamp ms
}

/**
 * 判斷快取是否過期：每天晚上 10 點（HKT, UTC+8）後需要刷新一次。
 * 如果快取時間在今天 22:00 之前，且現在已過 22:00，則過期。
 * 如果快取時間在昨天 22:00 之前，也過期。
 */
const isStale = (cachedAt: number): boolean => {
  const now = new Date();
  // 用 UTC+8 計算今天的 22:00
  const hkt = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const todayRefresh = new Date(hkt);
  todayRefresh.setUTCHours(22, 0, 0, 0); // HKT 22:00 = set UTC hours on the shifted date
  // Convert back to real UTC timestamp
  const refreshTs = todayRefresh.getTime() - 8 * 60 * 60 * 1000;

  if (now.getTime() >= refreshTs) {
    // 現在已過今天 22:00 HKT，快取必須在今天 22:00 之後才算有效
    return cachedAt < refreshTs;
  }
  // 現在還沒到今天 22:00，快取必須在昨天 22:00 之後才算有效
  const yesterdayRefreshTs = refreshTs - 24 * 60 * 60 * 1000;
  return cachedAt < yesterdayRefreshTs;
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (isStale(entry.cachedAt)) return null;
    return entry.data;
  } catch {
    return null;
  }
};

export const setCache = async <T>(key: string, data: T): Promise<void> => {
  try {
    const entry: CacheEntry<T> = { data, cachedAt: Date.now() };
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Silently fail
  }
};
