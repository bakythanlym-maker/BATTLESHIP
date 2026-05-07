import React from 'react';
import { CellState, BOARD_SIZE } from '../types/game';

interface BoardDisplayProps {
  board: CellState[][];
  onCellClick?: (x: number, y: number) => void;
  showShips?: boolean;
  title: string;
  isTurn?: boolean;
}

const BoardDisplay: React.FC<BoardDisplayProps> = ({ 
  board, 
  onCellClick, 
  showShips = true, 
  title, 
  isTurn 
}) => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  return (
    <div className={`flex flex-col items-center fade-in transition-all duration-500 ${isTurn ? 'scale-105' : 'opacity-80'}`}>
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px w-8 bg-navy-700" />
        <h3 className={`font-orbitron text-xs uppercase tracking-[0.4em] ${isTurn ? 'text-neon-cyan' : 'text-gray-500'}`}>
          {title}
        </h3>
        <div className="h-px w-8 bg-navy-700" />
        {isTurn && <div className="pulse-ring w-2 h-2 rounded-full bg-cyan-400 ml-2"></div>}
      </div>

      <div className="relative p-4 rounded-xl bg-navy-900/60 border border-navy-700 shadow-[0_0_50px_rgba(0,0,0,0.6)] backdrop-blur-md">
        {/* HUD Corners */}
        <div className="hud-corner hud-corner-tl" />
        <div className="hud-corner hud-corner-tr" />
        <div className="hud-corner hud-corner-bl" />
        <div className="hud-corner hud-corner-br" />

        {/* Scanning Line */}
        <div className="scanning-line" />

        {/* Top Coordinates */}
        <div className="flex ml-8">
          {Array.from({ length: BOARD_SIZE }).map((_, i) => (
            <div key={i} className="coord-label top">{i + 1}</div>
          ))}
        </div>

        <div className="flex">
          {/* Side Coordinates */}
          <div className="flex flex-col">
            {letters.map(l => (
              <div key={l} className="coord-label side">{l}</div>
            ))}
          </div>

          {/* Grid */}
          <div 
            className="grid gap-[1px] bg-navy-800/20 relative"
            style={{ 
              gridTemplateColumns: `repeat(${BOARD_SIZE}, 40px)`,
              gridTemplateRows: `repeat(${BOARD_SIZE}, 40px)`
            }}
          >
            {board.map((row, y) => 
              row.map((cell, x) => (
                <button
                  key={`${x}-${y}`}
                  onClick={() => onCellClick?.(x, y)}
                  disabled={!onCellClick || cell.isHit || cell.isMiss}
                  className={`
                    board-cell relative overflow-hidden
                    ${showShips && cell.hasShip ? 'has-ship' : ''} 
                    ${cell.isHit ? 'is-hit' : ''} 
                    ${cell.isMiss ? 'is-miss' : ''}
                  `}
                >
                  {cell.isMiss && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/40"></div>
                    </div>
                  )}
                  {/* Ripple effect on hit */}
                  {cell.isHit && <div className="splash-ripple"></div>}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="mt-4 flex justify-between items-center px-1">
          <span className="tactical-label">SYSTEM_SCAN: ACTIVE</span>
          <span className="tactical-label">COORD_LOCK: {isTurn ? 'READY' : 'WAITING'}</span>
        </div>
      </div>
    </div>
  );
};

export default BoardDisplay;
