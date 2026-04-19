export type Category = 'Classic' | 'Spicy' | 'Couples' | 'Challenges' | 'Rules';

export interface Card {
  id: number;
  text: string;
  category: Category;
  sips: number | null;
  intensity: 1 | 2 | 3;
}

export interface GameConfig {
  players: string[];
  enabledCategories: Category[];
}
