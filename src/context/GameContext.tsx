import React, { createContext, useContext, useState } from 'react';
import type { Game, Player, BallTrackingSettings } from '../types';

const initialPlayers: Player[] = [
  { id: '1', name: 'Player 1', position: 'attack', team: 'red' },
  { id: '2', name: 'Player 2', position: 'defense', team: 'red' },
  { id: '3', name: 'Player 3', position: 'attack', team: 'blue' },
  { id: '4', name: 'Player 4', position: 'defense', team: 'blue' },
];

const initialGame: Game = {
  id: '1',
  startTime: new Date(),
  redScore: 0,
  blueScore: 0,
  players: initialPlayers,
  status: 'paused',
};

const initialTrackingSettings: BallTrackingSettings = {
  yellowMin: { h: 40, s: 50, l: 40 },
  yellowMax: { h: 70, s: 100, l: 60 },
  minBallSize: 5,
  motionSensitivity: 50,
};

interface GameContextType {
  game: Game;
  trackingSettings: BallTrackingSettings;
  updateScore: (team: 'red' | 'blue', change: number) => void;
  controlGame: (action: 'start' | 'pause' | 'reset') => void;
  assignPlayer: (playerId: string, position: 'attack' | 'defense', team: 'red' | 'blue') => void;
  updatePlayerName: (playerId: string, newName: string) => void;
  updateTrackingSettings: (settings: Partial<BallTrackingSettings>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGame] = useState<Game>(initialGame);
  const [trackingSettings, setTrackingSettings] = useState<BallTrackingSettings>(initialTrackingSettings);

  const updateScore = (team: 'red' | 'blue', change: number) => {
    setGame((prev) => ({
      ...prev,
      [team === 'red' ? 'redScore' : 'blueScore']: Math.max(
        0,
        prev[team === 'red' ? 'redScore' : 'blueScore'] + change
      ),
    }));
  };

  const controlGame = (action: 'start' | 'pause' | 'reset') => {
    if (action === 'reset') {
      setGame({
        ...initialGame,
        id: String(Date.now()),
        startTime: new Date(),
      });
    } else {
      setGame((prev) => ({
        ...prev,
        status: action === 'start' ? 'active' : 'paused',
      }));
    }
  };

  const assignPlayer = (playerId: string, position: 'attack' | 'defense', team: 'red' | 'blue') => {
    setGame((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === playerId ? { ...p, position, team } : p
      ),
    }));
  };

  const updatePlayerName = (playerId: string, newName: string) => {
    setGame((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === playerId ? { ...p, name: newName } : p
      ),
    }));
  };

  const updateTrackingSettings = (settings: Partial<BallTrackingSettings>) => {
    setTrackingSettings(prev => ({
      ...prev,
      ...settings,
    }));
  };

  return (
    <GameContext.Provider
      value={{
        game,
        trackingSettings,
        updateScore,
        controlGame,
        assignPlayer,
        updatePlayerName,
        updateTrackingSettings,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}