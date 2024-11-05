import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Settings, Users, Camera } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { TrackingControls } from '../components/TrackingControls';

export function AdminPanel() {
  const { game, trackingSettings, updateScore, controlGame, assignPlayer, updatePlayerName, updateTrackingSettings } = useGame();
  const [showSettings, setShowSettings] = useState(false);
  const [showTrackingSettings, setShowTrackingSettings] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);

  const handleNameSubmit = (playerId: string, currentName: string, newName: string) => {
    if (newName.trim() && newName.trim() !== currentName) {
      updatePlayerName(playerId, newName.trim());
    }
    setEditingName(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Game Controls</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowTrackingSettings(!showTrackingSettings)}
              className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white"
              title="Ball Tracking Settings"
            >
              <Camera className="w-6 h-6" />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white"
              title="Player Settings"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-red-400">Red Team</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => updateScore('red', -1)}
                className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50"
              >
                -1
              </button>
              <span className="px-4 py-2 bg-gray-700 rounded-lg text-white min-w-[3rem] text-center">
                {game.redScore}
              </span>
              <button
                onClick={() => updateScore('red', 1)}
                className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50"
              >
                +1
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-blue-400">Blue Team</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => updateScore('blue', -1)}
                className="px-4 py-2 bg-blue-900/30 text-blue-400 rounded-lg hover:bg-blue-900/50"
              >
                -1
              </button>
              <span className="px-4 py-2 bg-gray-700 rounded-lg text-white min-w-[3rem] text-center">
                {game.blueScore}
              </span>
              <button
                onClick={() => updateScore('blue', 1)}
                className="px-4 py-2 bg-blue-900/30 text-blue-400 rounded-lg hover:bg-blue-900/50"
              >
                +1
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => controlGame(game.status === 'active' ? 'pause' : 'start')}
            className={`flex items-center px-6 py-3 rounded-lg ${
              game.status === 'active'
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {game.status === 'active' ? (
              <>
                <Pause className="w-5 h-5 mr-2" /> Pause Game
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" /> Start Game
              </>
            )}
          </button>
          <button
            onClick={() => controlGame('reset')}
            className="flex items-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" /> Reset Game
          </button>
        </div>
      </div>

      {showTrackingSettings && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Ball Tracking Settings</h3>
            <button
              onClick={() => setShowTrackingSettings(false)}
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <TrackingControls
            settings={trackingSettings}
            onUpdate={updateTrackingSettings}
          />
        </div>
      )}

      {showSettings && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center mb-6">
            <Users className="w-6 h-6 text-gray-400 mr-2" />
            <h3 className="text-xl font-semibold text-white">Player Management</h3>
          </div>
          
          <div className="space-y-4">
            {game.players.map((player) => (
              <div
                key={player.id}
                className={`p-4 rounded-lg ${
                  player.team === 'red' ? 'bg-red-900/30' : 'bg-blue-900/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  {editingName === player.id ? (
                    <input
                      type="text"
                      defaultValue={player.name}
                      className="flex-1 mr-4 px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white"
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
                      className="flex-1 mr-4 text-white cursor-pointer hover:text-gray-300"
                      onClick={() => setEditingName(player.id)}
                    >
                      {player.name}
                    </span>
                  )}
                  <div className="flex space-x-3">
                    <select
                      value={player.position}
                      onChange={(e) =>
                        assignPlayer(player.id, e.target.value as 'attack' | 'defense', player.team)
                      }
                      className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="attack">Attack</option>
                      <option value="defense">Defense</option>
                    </select>
                    <select
                      value={player.team}
                      onChange={(e) =>
                        assignPlayer(player.id, player.position, e.target.value as 'red' | 'blue')
                      }
                      className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                      <option value="red">Red Team</option>
                      <option value="blue">Blue Team</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}