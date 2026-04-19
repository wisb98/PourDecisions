import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Category } from '../types';
import { usePurchases } from '../hooks/usePurchases';
import { isCategoryOwned, categoryProductId, PAID_CATEGORIES } from '../store/purchases';

const ALL_CATEGORIES: Category[] = ['Classic', 'Spicy', 'Couples', 'Challenges', 'Rules'];

const CATEGORY_DESCRIPTIONS: Record<Exclude<Category, 'Classic'>, string> = {
  Spicy: 'Dares, embarrassing questions & wild cards',
  Couples: 'Perfect for pairs — sweet & spicy',
  Challenges: 'Physical challenges & head-to-heads',
  Rules: 'Make rules the whole group must follow',
};

interface Props {
  onStart: (players: string[], enabledCategories: Category[]) => void;
}

export default function SetupScreen({ onStart }: Props) {
  const [players, setPlayers] = useState<string[]>(['Player 1', 'Player 2']);
  const [enabledCategories, setEnabledCategories] = useState<Set<Category>>(
    new Set(['Classic']),
  );
  const [buyingCategory, setBuyingCategory] = useState<Exclude<Category, 'Classic'> | null>(null);

  const { ownedProductIds, purchase, purchaseState, resetState, priceFor } = usePurchases();

  // Auto-enable newly purchased categories
  useEffect(() => {
    if (purchaseState === 'success' && buyingCategory) {
      setEnabledCategories((prev) => new Set([...prev, buyingCategory]));
      setBuyingCategory(null);
      resetState();
    }
    if (purchaseState === 'error') {
      setBuyingCategory(null);
      resetState();
    }
  }, [purchaseState, buyingCategory, resetState]);

  const addPlayer = () => {
    if (players.length < 8) {
      setPlayers([...players, `Player ${players.length + 1}`]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index: number, name: string) => {
    const updated = [...players];
    updated[index] = name;
    setPlayers(updated);
  };

  const handleCategoryPress = (cat: Category) => {
    if (cat === 'Classic') return; // always on

    const owned = isCategoryOwned(cat, ownedProductIds);
    if (!owned) {
      setBuyingCategory(cat as Exclude<Category, 'Classic'>);
      return;
    }

    const next = new Set(enabledCategories);
    if (next.has(cat)) {
      next.delete(cat);
    } else {
      next.add(cat);
    }
    setEnabledCategories(next);
  };

  const handleConfirmPurchase = async () => {
    if (!buyingCategory) return;
    const productId = categoryProductId(buyingCategory)!;
    await purchase(productId);
  };

  const canStart = players.every((p) => p.trim().length > 0) && enabledCategories.size > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Pour Decisions</Text>
        <Text style={styles.subtitle}>A Drinking Card Game</Text>

        <Text style={styles.sectionLabel}>PLAYERS</Text>
        {players.map((name, index) => (
          <View key={index} style={styles.playerRow}>
            <TextInput
              style={styles.playerInput}
              value={name}
              onChangeText={(text) => updatePlayer(index, text)}
              placeholder="Player name"
              placeholderTextColor="#666"
              maxLength={20}
            />
            <TouchableOpacity
              style={[styles.removeBtn, players.length <= 2 && styles.disabled]}
              onPress={() => removePlayer(index)}
              disabled={players.length <= 2}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={[styles.addBtn, players.length >= 8 && styles.disabled]}
          onPress={addPlayer}
          disabled={players.length >= 8}
        >
          <Text style={styles.addBtnText}>+ Add Player</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>CARD PACKS</Text>
        {ALL_CATEGORIES.map((cat) => {
          const owned = isCategoryOwned(cat, ownedProductIds);
          const active = enabledCategories.has(cat);
          const isFree = cat === 'Classic';
          const productId = categoryProductId(cat);
          const price = productId ? priceFor(productId) : null;

          return (
            <TouchableOpacity
              key={cat}
              style={[styles.packRow, active && styles.packRowActive]}
              onPress={() => handleCategoryPress(cat)}
              activeOpacity={0.7}
            >
              <View style={styles.packInfo}>
                <View style={styles.packTitleRow}>
                  <Text style={[styles.packName, active && styles.packNameActive]}>{cat}</Text>
                  {isFree && (
                    <View style={styles.freeBadge}>
                      <Text style={styles.freeBadgeText}>FREE</Text>
                    </View>
                  )}
                </View>
                {!isFree && (
                  <Text style={styles.packDescription}>
                    {CATEGORY_DESCRIPTIONS[cat as Exclude<Category, 'Classic'>]}
                  </Text>
                )}
              </View>
              <View style={styles.packRight}>
                {isFree ? (
                  <View style={[styles.checkCircle, styles.checkCircleActive]}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                ) : owned ? (
                  <View style={[styles.checkCircle, active && styles.checkCircleActive]}>
                    <Text style={[styles.checkMark, !active && styles.checkMarkInactive]}>✓</Text>
                  </View>
                ) : (
                  <View style={styles.lockBadge}>
                    <Text style={styles.lockIcon}>🔒</Text>
                    <Text style={styles.lockPrice}>{price}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.startBtn, !canStart && styles.disabled]}
          onPress={() => canStart && onStart(players, Array.from(enabledCategories))}
          disabled={!canStart}
        >
          <Text style={styles.startBtnText}>Start Game</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Purchase modal */}
      <Modal
        visible={buyingCategory !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (purchaseState !== 'loading') setBuyingCategory(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {purchaseState === 'loading' ? (
              <>
                <ActivityIndicator size="large" color="#e94560" />
                <Text style={styles.modalLoadingText}>Processing purchase…</Text>
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>
                  {buyingCategory} Pack
                </Text>
                {buyingCategory && (
                  <Text style={styles.modalDesc}>
                    {CATEGORY_DESCRIPTIONS[buyingCategory]}
                  </Text>
                )}
                <Text style={styles.modalPrice}>
                  {buyingCategory && categoryProductId(buyingCategory)
                    ? priceFor(categoryProductId(buyingCategory)!)
                    : '£0.99'}
                </Text>
                <TouchableOpacity style={styles.buyBtn} onPress={handleConfirmPurchase}>
                  <Text style={styles.buyBtnText}>Buy Now</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setBuyingCategory(null)}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 36,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#e94560',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  playerInput: {
    flex: 1,
    backgroundColor: '#16213e',
    color: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  removeBtn: {
    marginLeft: 10,
    backgroundColor: '#e94560',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addBtn: {
    borderWidth: 1.5,
    borderColor: '#e94560',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 32,
  },
  addBtnText: {
    color: '#e94560',
    fontSize: 15,
    fontWeight: '600',
  },
  packRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  packRowActive: {
    borderColor: '#e94560',
  },
  packInfo: {
    flex: 1,
  },
  packTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  packName: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '700',
  },
  packNameActive: {
    color: '#fff',
  },
  freeBadge: {
    backgroundColor: '#2a9d2a',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  freeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  packDescription: {
    color: '#666',
    fontSize: 13,
    lineHeight: 18,
  },
  packRight: {
    marginLeft: 12,
    alignItems: 'center',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleActive: {
    backgroundColor: '#e94560',
    borderColor: '#e94560',
  },
  checkMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkMarkInactive: {
    color: '#888',
  },
  lockBadge: {
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 18,
  },
  lockPrice: {
    color: '#e94560',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  startBtn: {
    backgroundColor: '#e94560',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  startBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.35,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDesc: {
    color: '#aaa',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalPrice: {
    color: '#e94560',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  modalLoadingText: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 16,
  },
  buyBtn: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  buyBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  cancelBtn: {
    paddingVertical: 12,
  },
  cancelBtnText: {
    color: '#666',
    fontSize: 15,
  },
});
