export interface Player {
  id: string;
  name: string;
  position: 'attack' | 'defense';
  team: 'red' | 'blue';
}

export interface Game {
  id: string;
  startTime: Date;
  endTime?: Date;
  redScore: number;
  blueScore: number;
  players: Player[];
  status: 'active' | 'paused' | 'completed';
}

export interface GameStats {
  totalGames: number;
  wins: number;
  goalsScored: number;
}

export type PlayerStats = Record<string, GameStats>;

export interface BallTrackingSettings {
  yellowMin: {
    h: number;
    s: number;
    l: number;
  };
  yellowMax: {
    h: number;
    s: number;
    l: number;
  };
  minBallSize: number;
  motionSensitivity: number;
}