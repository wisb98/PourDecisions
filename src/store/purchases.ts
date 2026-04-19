import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../types';

const STORAGE_KEY = 'purchased_packs';

export const PRODUCT_IDS: Record<Exclude<Category, 'Classic'>, string> = {
  Spicy: 'pack_spicy',
  Couples: 'pack_couples',
  Challenges: 'pack_challenges',
  Rules: 'pack_rules',
};

export const PAID_CATEGORIES = Object.keys(PRODUCT_IDS) as Exclude<Category, 'Classic'>[];

export async function loadPurchases(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const arr: string[] = raw ? JSON.parse(raw) : [];
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export async function savePurchase(productId: string): Promise<void> {
  const existing = await loadPurchases();
  existing.add(productId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(existing)));
}

export function categoryProductId(category: Category): string | null {
  return PRODUCT_IDS[category as Exclude<Category, 'Classic'>] ?? null;
}

export function isCategoryOwned(category: Category, ownedProductIds: Set<string>): boolean {
  if (category === 'Classic') return true;
  const productId = categoryProductId(category);
  return productId !== null && ownedProductIds.has(productId);
}
