export type AIDifficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'idle' | 'placing' | 'playing' | 'finished';
export type PlayerType = 'human' | 'ai' | 'opponent';
export type GameMode = 'classic' | 'quick' | 'multiplayer';

export interface ShipType {
  id: string;
  name: string;
  length: number;
  color?: string;
}

export interface ShipInstance {
  id: string;
  typeId: string;
  x: number;
  y: number;
  orientation: 'horizontal' | 'vertical';
  hits: number;
  sunk: boolean;
}

export interface CellState {
  x: number;
  y: number;
  hasShip: boolean;
  isHit: boolean;
  isMiss: boolean;
  shipId?: string;
}

export interface GameMove {
  player: PlayerType;
  x: number;
  y: number;
  hit: boolean;
  sunkShipId?: string;
}

export interface GameState {
  humanBoard: CellState[][];
  aiBoard: CellState[][];
  humanShips: ShipInstance[];
  aiShips: ShipInstance[];
  status: GameStatus;
  turn: PlayerType;
  difficulty: AIDifficulty;
  mode: GameMode;
  moveHistory: GameMove[];
  winner?: PlayerType;
  timeLeft?: number; // For Quick Mode
  roomCode?: string; // For Multiplayer
  humanStats: { wins: number; losses: number };
  aiStats: { wins: number; losses: number };
}

export const SHIP_TYPES: ShipType[] = [
  { id: 'carrier', name: 'Carrier', length: 5 },
  { id: 'battleship', name: 'Battleship', length: 4 },
  { id: 'destroyer', name: 'Destroyer', length: 3 },
  { id: 'submarine', name: 'Submarine', length: 3 },
  { id: 'patrol', name: 'Patrol Boat', length: 2 },
];

export const BOARD_SIZE = 10;
