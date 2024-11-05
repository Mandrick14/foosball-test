import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import type { Game, Player } from '../types';

interface AdminPanelProps {
  game: Game;
  onScoreChange: (team: 'red' | 'blue', change: number) => void;
  onGameControl: (action: 'start' | 'pause' | 'reset') => void;
  onPlayerAssign: (playerId: string, position: 'attack' | 'defense', team: 'red' | 'blue') => void;
  onPlayerNameChange: (playerId: string, newName: string) => void;
}

export function AdminPanel({
  game,
  onScoreChange,
  onGameControl,
  onPlayerAssign,
  onPlayerNameChange,
}: AdminPanelProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);

  const handleNameSubmit = (playerId: string, currentName: string, newName: string) => {
    if (newName.trim() && newName.trim() !== currentName) {
      onPlayerNameChange(playerId, newName.trim());
    }
    setEditingName(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Game Controls</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Settings className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <h3 className="font-semibold text-red-600">Red Team</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onScoreChange('red', -1)}
              className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              -1
            </button>
            <span className="px-3 py-1 bg-gray-100 rounded">{game.redScore}</span>
            <button
              onClick={() => onScoreChange('red', 1)}
              className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
            >
              +1
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-blue-600">Blue Team</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => onScoreChange('blue', -1)}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              -1
            </button>
            <span className="px-3 py-1 bg-gray-100 rounded">{game.blueScore}</span>
            <button
              onClick={() => onScoreChange('blue', 1)}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
            >
              +1
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => onGameControl(game.status === 'active' ? 'pause' : 'start')}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          {game.status === 'active' ? (
            <>
              <Pause className="w-5 h-5 mr-2" /> Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" /> Start
            </>
          )}
        </button>
        <button
          onClick={() => onGameControl('reset')}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          <RotateCcw className="w-5 h-5 mr-2" /> Reset
        </button>
      </div>

      {showSettings && (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-4">Player Assignments</h3>
          {game.players.map((player) => (
            <div key={player.id} className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded">
              {editingName === player.id ? (
                <input
                  type="text"
                  defaultValue={player.name}
                  className="flex-1 mr-4 px-2 py-1 border rounded"
                  autoFocus
                  onBlur={(e) => handleNameSubmit(player.id, player.name, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleNameSubmit(player.id, player.name, e.currentTarget.value);
                    } else if (e.key === 'Escape') {
                      setEditingName(null);
                    }
                  }}
                />
              ) : (
                <span 
                  className="flex-1 mr-4 cursor-pointer hover:text-blue-600"
                  onClick={() => setEditingName(player.id)}
                >
                  {player.name}
                </span>
              )}
              <div className="flex space-x-2">
                <select
                  value={player.position}
                  onChange={(e) => 
                    onPlayerAssign(player.id, e.target.value as 'attack' | 'defense', player.team)
                  }
                  className="px-2 py-1 border rounded"
                >
                  <option value="attack">Attack</option>
                  <option value="defense">Defense</option>
                </select>
                <select
                  value={player.team}
                  onChange={(e) => 
                    onPlayerAssign(player.id, player.position, e.target.value as 'red' | 'blue')
                  }
                  className="px-2 py-1 border rounded"
                >
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}