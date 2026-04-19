import { Card, Category } from '../types';

export function drawCard(pool: Card[], enabledCategories: Category[]): Card | null {
  const filtered = pool.filter((c) => enabledCategories.includes(c.category));
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function resolvePlaceholders(
  text: string,
  p1: string,
  allPlayers: string[],
): string {
  const others = allPlayers.filter((p) => p !== p1);
  const p2 = others.length > 0 ? others[Math.floor(Math.random() * others.length)] : p1;
  const n = Math.floor(Math.random() * 5) + 2; // 2–6 sips
  return text.replace(/\{p1\}/g, p1).replace(/\{p2\}/g, p2).replace(/\{n\}/g, String(n));
}
