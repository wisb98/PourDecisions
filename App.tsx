import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GameConfig, Category } from './src/types';
import SetupScreen from './src/screens/SetupScreen';
import GameScreen from './src/screens/GameScreen';

type Screen = 'setup' | 'game';

export default function App() {
  const [screen, setScreen] = useState<Screen>('setup');
  const [config, setConfig] = useState<GameConfig | null>(null);

  const handleStart = (players: string[], enabledCategories: Category[]) => {
    setConfig({ players, enabledCategories });
    setScreen('game');
  };

  const handleBack = () => {
    setScreen('setup');
  };

  return (
    <>
      <StatusBar style="light" />
      {screen === 'game' && config ? (
        <GameScreen
          players={config.players}
          enabledCategories={config.enabledCategories}
          onBack={handleBack}
        />
      ) : (
        <SetupScreen onStart={handleStart} />
      )}
    </>
  );
}
