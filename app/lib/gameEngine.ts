import {
  BOARD_SIZE,
  SHIP_TYPES,
  CellState,
  ShipInstance,
  GameMove,
  GameState,
  GameStatus,
  AIDifficulty,
  GameMode,
} from '@/app/types/game';

export class GameEngine {
  static createEmptyBoard(): CellState[][] {
    const board: CellState[][] = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      const row: CellState[] = [];
      for (let x = 0; x < BOARD_SIZE; x++) {
        row.push({ x, y, hasShip: false, isHit: false, isMiss: false });
      }
      board.push(row);
    }
    return board;
  }

  static createGameState(): GameState {
    return {
      humanBoard: this.createEmptyBoard(),
      aiBoard: this.createEmptyBoard(),
      humanShips: [],
      aiShips: [],
      status: 'idle',
      turn: 'human',
      difficulty: 'medium',
      mode: 'classic',
      moveHistory: [],
      humanStats: { wins: 0, losses: 0 },
      aiStats: { wins: 0, losses: 0 },
    };
  }

  static isValidPlacement(
    board: CellState[][],
    x: number,
    y: number,
    length: number,
    orientation: 'horizontal' | 'vertical'
  ): boolean {
    for (let i = 0; i < length; i++) {
      const cx = orientation === 'horizontal' ? x + i : x;
      const cy = orientation === 'vertical' ? y + i : y;

      if (cx >= BOARD_SIZE || cy >= BOARD_SIZE || cx < 0 || cy < 0) return false;
      if (board[cy][cx].hasShip) return false;

    }
    return true;
  }

  static autoPlaceShips(board: CellState[][], ships: ShipInstance[]) {
    // Clear current ships
    board.forEach(row => row.forEach(cell => { cell.hasShip = false; cell.shipId = undefined; }));
    ships.length = 0;

    SHIP_TYPES.forEach(type => {
      let placed = false;
      while (!placed) {
        const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const x = Math.floor(Math.random() * BOARD_SIZE);
        const y = Math.floor(Math.random() * BOARD_SIZE);

        if (this.isValidPlacement(board, x, y, type.length, orientation)) {
          const shipId = `ship_${type.id}_${Math.random().toString(36).substr(2, 9)}`;
          for (let i = 0; i < type.length; i++) {
            const cx = orientation === 'horizontal' ? x + i : x;
            const cy = orientation === 'vertical' ? y + i : y;
            board[cy][cx].hasShip = true;
            board[cy][cx].shipId = shipId;
          }
          ships.push({
            id: shipId,
            typeId: type.id,
            x,
            y,
            orientation,
            hits: 0,
            sunk: false,
          });
          placed = true;
        }
      }
    });
  }

  static processShot(board: CellState[][], ships: ShipInstance[], x: number, y: number): { hit: boolean; sunk?: string } {
    const cell = board[y][x];
    if (cell.isHit || cell.isMiss) return { hit: false };

    if (cell.hasShip) {
      cell.isHit = true;
      const ship = ships.find(s => s.id === cell.shipId);
      if (ship) {
        ship.hits++;
        if (ship.hits === SHIP_TYPES.find(t => t.id === ship.typeId)!.length) {
          ship.sunk = true;
          return { hit: true, sunk: ship.id };
        }
      }
      return { hit: true };
    } else {
      cell.isMiss = true;
      return { hit: false };
    }
  }

  static allShipsSunk(ships: ShipInstance[]): boolean {
    return ships.length > 0 && ships.every(s => s.sunk);
  }
}
