import React from 'react';
import { Trophy, Users } from 'lucide-react';
import { useGame } from '../context/GameContext';

export function ScoreBoard() {
  const { game } = useGame();
  const { redScore, blueScore, players } = game;

  const redPlayers = players.filter(p => p.team === 'red');
  const bluePlayers = players.filter(p => p.team === 'blue');

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <div className="text-8xl font-bold text-red-500 mb-4">{redScore}</div>
            <div className="text-2xl text-red-400">Red Team</div>
          </div>
          <Trophy className="w-20 h-20 text-yellow-400 mx-12" />
          <div className="text-center flex-1">
            <div className="text-8xl font-bold text-blue-500 mb-4">{blueScore}</div>
            <div className="text-2xl text-blue-400">Blue Team</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center text-red-400 mb-2">
              <Users className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Red Team Players</h3>
            </div>
            {redPlayers.map((player) => (
              <div
                key={player.id}
                className="bg-red-900/30 p-4 rounded-lg border border-red-800/50"
              >
                <div className="font-semibold text-white text-lg">{player.name}</div>
                <div className="text-red-300 capitalize">{player.position}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-blue-400 mb-2">
              <Users className="w-5 h-5 mr-2" />
              <h3 className="text-lg font-semibold">Blue Team Players</h3>
            </div>
            {bluePlayers.map((player) => (
              <div
                key={player.id}
                className="bg-blue-900/30 p-4 rounded-lg border border-blue-800/50"
              >
                <div className="font-semibold text-white text-lg">{player.name}</div>
                <div className="text-blue-300 capitalize">{player.position}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between text-gray-400">
          <div>Game Status: <span className="text-white capitalize">{game.status}</span></div>
          <div>Game Time: <span className="text-white">
            {new Date(game.startTime).toLocaleTimeString()}
          </span></div>
        </div>
      </div>
    </div>
  );
}