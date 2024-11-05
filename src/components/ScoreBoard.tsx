import React from 'react';
import { Trophy } from 'lucide-react';

interface ScoreBoardProps {
  redScore: number;
  blueScore: number;
  players: Array<{
    name: string;
    team: 'red' | 'blue';
    position: 'attack' | 'defense';
  }>;
}

export function ScoreBoard({ redScore, blueScore, players }: ScoreBoardProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-8">
        <div className="text-center flex-1">
          <div className="text-6xl font-bold text-red-500">{redScore}</div>
          <div className="text-red-400 mt-2">Red Team</div>
        </div>
        <Trophy className="w-12 h-12 text-yellow-400 mx-8" />
        <div className="text-center flex-1">
          <div className="text-6xl font-bold text-blue-500">{blueScore}</div>
          <div className="text-blue-400 mt-2">Blue Team</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {players.map((player, index) => (
          <div
            key={index}
            className={`p-3 rounded ${
              player.team === 'red' ? 'bg-red-900/30' : 'bg-blue-900/30'
            }`}
          >
            <div className="font-semibold text-white">{player.name}</div>
            <div className={`text-sm ${
              player.team === 'red' ? 'text-red-300' : 'text-blue-300'
            }`}>
              {player.position}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}