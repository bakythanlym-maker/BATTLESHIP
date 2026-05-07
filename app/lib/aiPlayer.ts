import { CellState, GameMove, BOARD_SIZE, AIDifficulty } from '@/app/types/game';

export class AIPlayer {
  private difficulty: AIDifficulty;

  constructor(difficulty: AIDifficulty) {
    this.difficulty = difficulty;
  }

  setDifficulty(difficulty: AIDifficulty) {
    this.difficulty = difficulty;
  }

  getNextMove(opponentBoard: CellState[][], moveHistory: GameMove[]): { x: number; y: number } {
    const aiMoves = moveHistory.filter(m => m.player === 'ai');
    
    // 1. Check for wounded ships to target (Tactical mode)
    const woundedShipMove = this.getTacticalMove(opponentBoard);
    if (woundedShipMove) return woundedShipMove;

    // 2. Strategic searching based on difficulty
    if (this.difficulty === 'hard') {
      return this.getStrategicMove(opponentBoard);
    } else if (this.difficulty === 'medium') {
      if (Math.random() > 0.3) return this.getStrategicMove(opponentBoard);
    }

    // 3. Random fallback
    return this.getRandomMove(opponentBoard);
  }

  private getTacticalMove(board: CellState[][]): { x: number; y: number } | null {
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (board[y][x].isHit) {
          // Check if this hit is part of a non-sunk ship
          const shipId = board[y][x].shipId;
          // In real game AI doesn't know if ship is sunk unless it's a rule. 
          // But for simplicity, we check adjacent cells.
          const neighbors = [
            { x: x + 1, y }, { x: x - 1, y },
            { x, y: y + 1 }, { x, y: y - 1 }
          ];
          for (const n of neighbors) {
            if (n.x >= 0 && n.x < BOARD_SIZE && n.y >= 0 && n.y < BOARD_SIZE) {
              if (!board[n.y][n.x].isHit && !board[n.y][n.x].isMiss) {
                return n;
              }
            }
          }
        }
      }
    }
    return null;
  }

  private getStrategicMove(board: CellState[][]): { x: number; y: number } {
    // Parity search (checkerboard pattern)
    const targets: { x: number; y: number }[] = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if ((x + y) % 2 === 0 && !board[y][x].isHit && !board[y][x].isMiss) {
          targets.push({ x, y });
        }
      }
    }
    if (targets.length > 0) {
      return targets[Math.floor(Math.random() * targets.length)];
    }
    return this.getRandomMove(board);
  }

  private getRandomMove(board: CellState[][]): { x: number; y: number } {
    const available: { x: number; y: number }[] = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (!board[y][x].isHit && !board[y][x].isMiss) {
          available.push({ x, y });
        }
      }
    }
    return available[Math.floor(Math.random() * available.length)];
  }
}
