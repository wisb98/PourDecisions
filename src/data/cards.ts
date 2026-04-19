import { Card } from '../types';

export const cards: Card[] = [
  // Classic
  {
    id: 1,
    text: 'Everyone drinks {n} sips.',
    category: 'Classic',
    sips: null,
    intensity: 1,
  },
  {
    id: 2,
    text: '{p1} takes {n} sips.',
    category: 'Classic',
    sips: null,
    intensity: 1,
  },
  {
    id: 3,
    text: 'The last person to touch their nose drinks {n} sips.',
    category: 'Classic',
    sips: null,
    intensity: 1,
  },
  {
    id: 4,
    text: '{p1} picks someone to drink {n} sips with them.',
    category: 'Classic',
    sips: null,
    intensity: 2,
  },
  {
    id: 5,
    text: 'Waterfall! {p1} starts drinking and everyone follows. You can only stop when the person before you stops.',
    category: 'Classic',
    sips: null,
    intensity: 2,
  },

  // Spicy
  {
    id: 6,
    text: '{p1} must answer a personal question from {p2} or drink {n} sips.',
    category: 'Spicy',
    sips: null,
    intensity: 2,
  },
  {
    id: 7,
    text: '{p1} and {p2} do a dare chosen by the group or each drink {n} sips.',
    category: 'Spicy',
    sips: null,
    intensity: 3,
  },
  {
    id: 8,
    text: '{p1} reveals an embarrassing story or drinks {n} sips.',
    category: 'Spicy',
    sips: null,
    intensity: 2,
  },
  {
    id: 9,
    text: '{p1} texts the last person in their contacts something {p2} makes up, or drinks {n} sips.',
    category: 'Spicy',
    sips: null,
    intensity: 3,
  },

  // Couples
  {
    id: 10,
    text: '{p1} and {p2} share {n} sips.',
    category: 'Couples',
    sips: null,
    intensity: 1,
  },
  {
    id: 11,
    text: '{p1} gives {p2} a compliment. If the group thinks it\'s genuine, {p2} drinks {n} sips. If not, {p1} drinks.',
    category: 'Couples',
    sips: null,
    intensity: 2,
  },
  {
    id: 12,
    text: '{p1} and {p2} must agree on something before anyone else can drink. Take {n} sips for every minute you argue.',
    category: 'Couples',
    sips: null,
    intensity: 2,
  },
  {
    id: 13,
    text: '{p1} and {p2} take turns saying something they like about each other. First to hesitate drinks {n} sips.',
    category: 'Couples',
    sips: null,
    intensity: 1,
  },

  // Challenges
  {
    id: 14,
    text: '{p1} must do {n} push-ups or drink {n} sips.',
    category: 'Challenges',
    sips: null,
    intensity: 2,
  },
  {
    id: 15,
    text: '{p1} must hold a plank for 30 seconds or drink {n} sips.',
    category: 'Challenges',
    sips: null,
    intensity: 2,
  },
  {
    id: 16,
    text: '{p1} challenges {p2} to a thumb war. Loser drinks {n} sips.',
    category: 'Challenges',
    sips: null,
    intensity: 1,
  },
  {
    id: 17,
    text: '{p1} must balance a full drink on their head for 10 seconds or drink {n} sips.',
    category: 'Challenges',
    sips: null,
    intensity: 2,
  },

  // Rules
  {
    id: 18,
    text: '{p1} makes a rule. Everyone must follow it for the rest of the game or drink {n} sips.',
    category: 'Rules',
    sips: null,
    intensity: 2,
  },
  {
    id: 19,
    text: '{p1} bans a word. Anyone who says it drinks {n} sips.',
    category: 'Rules',
    sips: null,
    intensity: 2,
  },
  {
    id: 20,
    text: '{p1} makes a hand signal. Whenever {p1} does it, everyone must mirror it. Last one to do so drinks {n} sips.',
    category: 'Rules',
    sips: null,
    intensity: 1,
  },
  {
    id: 21,
    text: '{p1} declares a topic. Everyone must speak only in questions about that topic. First to mess up drinks {n} sips.',
    category: 'Rules',
    sips: null,
    intensity: 3,
  },
];
