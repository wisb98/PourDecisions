import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Card, Category } from '../types';
import { cards as allCards } from '../data/cards';
import { drawCard, resolvePlaceholders } from '../utils/cardUtils';

interface Props {
  players: string[];
  enabledCategories: Category[];
  onBack: () => void;
}

const CATEGORY_COLORS: Record<Category, string> = {
  Classic: '#4a9eff',
  Spicy: '#ff6b35',
  Couples: '#ff4d94',
  Challenges: '#f5c518',
  Rules: '#7c4dff',
};

const INTENSITY_LABELS = ['', '🔥', '🔥🔥', '🔥🔥🔥'];

function resolveFirst(players: string[], enabledCategories: Category[]) {
  const card = drawCard(allCards, enabledCategories);
  if (!card) return { card: null, text: '', sips: null };
  const text = resolvePlaceholders(card.text, players[0], players);
  const sipMatch = text.match(/\b(\d+) sips?\b/);
  return { card, text, sips: sipMatch ? parseInt(sipMatch[1], 10) : null };
}

export default function GameScreen({ players, enabledCategories, onBack }: Props) {
  const first = resolveFirst(players, enabledCategories);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(first.card ? 1 % players.length : 0);
  const [currentCard, setCurrentCard] = useState<Card | null>(first.card);
  const [resolvedText, setResolvedText] = useState<string>(first.text);
  const [resolvedSips, setResolvedSips] = useState<number | null>(first.sips);

  const currentPlayer = players[currentPlayerIndex];

  const handleDraw = () => {
    const card = drawCard(allCards, enabledCategories);
    if (!card) return;
    const text = resolvePlaceholders(card.text, currentPlayer, players);
    // Extract resolved sip count from text for badge display
    const sipMatch = text.match(/\b(\d+) sips?\b/);
    setResolvedSips(sipMatch ? parseInt(sipMatch[1], 10) : null);
    setCurrentCard(card);
    setResolvedText(text);
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  const poolEmpty =
    allCards.filter((c) => enabledCategories.includes(c.category)).length === 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>← Setup</Text>
          </TouchableOpacity>
          <Text style={styles.turnLabel}>{currentPlayer}'s turn</Text>
          <View style={styles.backBtnPlaceholder} />
        </View>

        {/* Card area */}
        <View style={styles.cardArea}>
          {poolEmpty || !currentCard ? (
            <Text style={styles.emptyText}>No cards in selected categories.</Text>
          ) : (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.categoryBadge,
                    { backgroundColor: CATEGORY_COLORS[currentCard.category] },
                  ]}
                >
                  <Text style={styles.categoryBadgeText}>{currentCard.category}</Text>
                </View>
                <Text style={styles.intensityText}>
                  {INTENSITY_LABELS[currentCard.intensity]}
                </Text>
              </View>
              <Text style={styles.cardText}>{resolvedText}</Text>
              {resolvedSips !== null && (
                <View style={styles.sipsBadge}>
                  <Text style={styles.sipsBadgeText}>{resolvedSips} sips</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Draw button */}
        <TouchableOpacity
          style={[styles.drawBtn, poolEmpty && styles.disabled]}
          onPress={handleDraw}
          disabled={poolEmpty}
        >
          <Text style={styles.drawBtnText}>Draw Card</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backBtnText: {
    color: '#e94560',
    fontSize: 15,
    fontWeight: '600',
  },
  backBtnPlaceholder: {
    width: 70,
  },
  turnLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  intensityText: {
    fontSize: 16,
  },
  cardText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
  },
  sipsBadge: {
    backgroundColor: '#e94560',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  sipsBadgeText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  drawBtn: {
    backgroundColor: '#e94560',
    borderRadius: 14,
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 24,
  },
  drawBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.35,
  },
});
