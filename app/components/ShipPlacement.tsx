import React, { useState } from 'react';
import { SHIP_TYPES, ShipType } from '../types/game';
import { useGame } from '../context/GameContext';
import BoardDisplay from './BoardDisplay';

interface ShipPlacementProps {
  onComplete: () => void;
  onBack: () => void;
}

const ShipPlacement: React.FC<ShipPlacementProps> = ({ onComplete, onBack }) => {
  const { gameState, placeShip, autoPlaceShips, resetGame } = useGame();
  const [currentShipIndex, setCurrentShipIndex] = useState(0);
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');

  const currentShipType = SHIP_TYPES[currentShipIndex];
  const allPlaced = gameState.humanShips.length === SHIP_TYPES.length;

  const handleCellClick = (x: number, y: number) => {
    if (allPlaced) return;
    const success = placeShip(x, y, currentShipType.id, orientation);
    if (success && currentShipIndex < SHIP_TYPES.length - 1) {
      setCurrentShipIndex(prev => prev + 1);
    }
  };

  const handleAutoPlace = () => {
    autoPlaceShips(true);
    setCurrentShipIndex(SHIP_TYPES.length - 1);
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center p-6 bg-navy-950/20">
      <div className="ocean-bg" />
      <div className="ocean-bg grid-lines" style={{ opacity: 0.3 }} />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-start relative z-10">
        {/* Left Side: Controls */}
        <div className="glass-card p-10 slide-up">
          <div className="mb-12 relative">
            <button 
              onClick={onBack}
              className="absolute -top-14 left-0 px-4 py-2 bg-navy-900/40 border border-cyan-500/20 rounded-lg text-[10px] font-orbitron text-cyan-400 hover:text-white hover:border-cyan-400 uppercase tracking-[0.3em] transition-all flex items-center gap-3 group backdrop-blur-sm"
            >
              <span className="text-sm group-hover:-translate-x-1 transition-transform">←</span> Return to Menu
            </button>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-orbitron text-2xl text-neon-cyan mb-1">Fleet Deployment</h2>
                <p className="text-[8px] text-cyan-500/60 tracking-[0.3em] uppercase">Tactical Positioning Phase v2.4</p>
              </div>
              <div className="text-right">
                <div className="tactical-label">Sector: A-12</div>
                <div className="tactical-label">Status: CALIBRATING</div>
              </div>
            </div>
          </div>

          {!allPlaced ? (
            <div className="fade-in">
              <div className="mb-10 p-6 bg-navy-950/60 rounded-lg border border-navy-700/50 relative overflow-hidden group">
                <div className="hud-corner hud-corner-tl opacity-30" />
                <div className="hud-corner hud-corner-tr opacity-30" />
                
                <div className="text-[9px] text-cyan-500/40 uppercase mb-4 tracking-widest flex justify-between">
                  <span>Target Unit</span>
                  <span>Serial: {currentShipType.id.toUpperCase()}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="font-orbitron text-white text-xl tracking-tight">{currentShipType.name}</span>
                  <div className="px-3 py-1 bg-gold/10 border border-gold/20 rounded text-[10px] text-gold font-bold">
                    {currentShipType.length} UNITS
                  </div>
                </div>
                
                <div className="flex gap-1.5">
                  {Array.from({ length: currentShipType.length }).map((_, i) => (
                    <div key={i} className="w-8 h-2 bg-cyan-500/20 border border-cyan-500/40 rounded-sm"></div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-navy-800 flex justify-between items-center text-[8px] text-gray-500 font-mono">
                  <span>ARMOR: HEAVY</span>
                  <span>THRUST: MACH 2.4</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-[10px] text-gray-500 uppercase mb-3">Orientation</div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setOrientation('horizontal')}
                    className={`orient-btn flex-grow flex items-center justify-center gap-2 ${orientation === 'horizontal' ? 'active' : ''}`}
                  >
                    <span className="text-lg">↔️</span> Horizontal
                  </button>
                  <button 
                    onClick={() => setOrientation('vertical')}
                    className={`orient-btn flex-grow flex items-center justify-center gap-2 ${orientation === 'vertical' ? 'active' : ''}`}
                  >
                    <span className="text-lg">↕️</span> Vertical
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="fade-in bg-green-500/10 border border-green-500/30 p-6 rounded-xl mb-8">
              <div className="text-green-400 font-bold mb-1">Fleet Ready!</div>
              <p className="text-xs text-gray-400">All warships are in position. Prepare for engagement.</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {allPlaced ? (
              <button onClick={onComplete} className="btn-primary w-full py-5 text-lg btn-shine">
                Commence Mission
              </button>
            ) : (
              <button onClick={handleAutoPlace} className="btn-secondary w-full py-4 flex items-center justify-center gap-3">
                <span>🤖</span> Auto-Deploy Fleet
              </button>
            )}
            <button onClick={resetGame} className="btn-danger w-full mt-4 flex items-center justify-center gap-2">
              <span>🔄</span> Reset Fleet Positions
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-navy-700">
            <h4 className="text-[10px] text-gray-500 uppercase mb-4 tracking-widest">Fleet Status</h4>
            <div className="space-y-3">
              {SHIP_TYPES.map((type, i) => {
                const isPlaced = gameState.humanShips.some(s => s.typeId === type.id);
                return (
                  <div key={type.id} className={`flex items-center justify-between transition-opacity ${isPlaced ? 'opacity-100' : 'opacity-30'}`}>
                    <span className="text-[10px] text-white font-orbitron">{type.name}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: type.length }).map((_, j) => (
                        <div key={j} className="w-2 h-2 rounded-full bg-cyan-500/50"></div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Board */}
        <div className="slide-up w-full overflow-x-auto pb-4 lg:overflow-visible" style={{ animationDelay: '0.1s' }}>
          <div className="min-w-[420px] lg:min-w-0">
            <BoardDisplay 
              board={gameState.humanBoard} 
              onCellClick={handleCellClick}
              title="Strategic Map"
              isTurn={!allPlaced}
            />
          </div>
          <div className="mt-6 p-4 glass-card border-navy-700 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              Click map to place ship. Hover to see footprint.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipPlacement;
