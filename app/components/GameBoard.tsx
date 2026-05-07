import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import BoardDisplay from './BoardDisplay';
import GameTimer from './GameTimer';
import AICoach from './AICoach';
import { useSound } from '../context/SoundContext';
import { SHIP_TYPES } from '../types/game';

interface GameBoardProps {
  onAbort: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ onAbort }) => {
  const { gameState, makeShot, analysis, playerName } = useGame();
  const { playBtn, playHover, playFire, playHit, playMiss, playSunk } = useSound();
  const [isShaking, setIsShaking] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }

    const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
    if (lastMove) {
      if (lastMove.hit) {
        if (lastMove.sunkShipId) {
          playSunk();
        }
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
    }
  }, [gameState.moveHistory]);

  const humanMoves = gameState.moveHistory.filter(m => m.player === 'human');
  const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];

  const humanHits = humanMoves.filter(m => m.hit).length;
  const humanAccuracy = humanMoves.length > 0 ? Math.round((humanHits / humanMoves.length) * 100) : 0;

  return (
    <div className={`relative min-h-screen p-4 md:p-8 flex flex-col transition-transform ${isShaking ? 'shake' : ''}`}>
      <div className="ocean-bg" />
      <div className="ocean-bg grid-lines" style={{ opacity: 0.2 }} />

      {/* Top HUD */}
      <header className="relative z-20 flex flex-col md:flex-row justify-between items-center gap-10 mb-20 slide-up">
        <div className="flex items-center gap-6">
          <div className="hud-stat">
            <div className="hud-stat-label">Admiral</div>
            <div className="hud-stat-value text-neon-cyan uppercase">{playerName}</div>
          </div>
          <div className="hud-stat">
            <div className="hud-stat-label">Accuracy</div>
            <div className="hud-stat-value">{humanAccuracy}%</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center font-orbitron px-8">
            <div className={`text-xl font-black tracking-widest ${gameState.turn === 'human' ? 'text-neon-cyan animate-pulse' : 'text-gray-600'}`}>
              {gameState.status === 'finished' ? 'MISSION COMPLETE' : (gameState.turn === 'human' ? 'YOUR TURN' : 'ENEMY FIRING')}
            </div>
            <div className="text-[10px] text-gray-500 uppercase mt-1 tracking-[0.4em]">Combat Phase</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {gameState.mode === 'quick' && gameState.timeLeft !== undefined && (
            <GameTimer timeLeft={gameState.timeLeft} />
          )}
          <div className="hud-stat">
            <div className="hud-stat-label">Enemy Sunk</div>
            <div className="hud-stat-value text-red-fire">
              {gameState.aiShips.filter(s => s.sunk).length} / {SHIP_TYPES.length}
            </div>
          </div>
        </div>
      </header>

      {/* Main Combat Area */}
      <main className="relative z-10 flex-grow grid grid-cols-1 lg:grid-cols-[1fr_400px_1fr] gap-12 lg:gap-16 items-start lg:items-center">
        {/* Player Board */}
        <div className="flex flex-col items-center order-3 lg:order-1">
          <div className="w-full overflow-x-auto pb-4 lg:overflow-visible">
            <div className="min-w-[320px] md:min-w-0">
              <BoardDisplay 
                board={gameState.humanBoard} 
                title="Your Fleet"
                isTurn={gameState.turn !== 'human'}
              />
            </div>
          </div>
          {/* Ship status indicators */}
          <div className="flex gap-2 mt-6">
            {gameState.humanShips.map(s => (
              <div key={s.id} className={`ship-block ${s.sunk ? 'sunk' : ''}`} title={s.id}></div>
            ))}
          </div>
        </div>

        {/* Center: Combat Log & Intel */}
        <div className="flex flex-col gap-6 h-full max-h-[400px] lg:max-h-[600px] order-2 relative">
          <button
            onClick={() => { onAbort(); playBtn(); }}
            onMouseEnter={() => playHover()}
            className={`absolute -top-16 left-0 z-[100] px-4 py-2 border rounded-lg text-[10px] font-orbitron uppercase tracking-[0.3em] transition-all flex items-center gap-3 backdrop-blur-sm group ${
              gameState.status === 'finished' 
                ? 'bg-navy-900/80 border-cyan-500/40 text-cyan-400 hover:text-white hover:border-cyan-400' 
                : 'bg-navy-900/60 border-red-500/20 text-gray-400 hover:text-red-400 hover:border-red-500/50'
            }`}
          >
            <span className="text-sm group-hover:-translate-x-1 transition-transform">←</span> 
            {gameState.status === 'finished' ? 'Return to HQ' : 'Abort Mission'}
          </button>
          <div className="glass-card p-6 flex-grow flex flex-col border-navy-700 bg-navy-900/40">
            <h4 className="font-orbitron text-[10px] text-gray-500 uppercase mb-4 tracking-widest border-b border-navy-700 pb-2">Combat Log</h4>
            <div ref={logRef} className="flex-grow overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {gameState.moveHistory.length === 0 && (
                <div className="text-xs text-gray-600 italic">No activity reported...</div>
              )}
              {gameState.moveHistory.map((move, i) => (
                <div key={i} className={`text-[11px] font-inter animate-fadeIn ${move.player === 'human' ? 'text-cyan-400' : 'text-red-400'}`}>
                  <span className="opacity-40 mr-2">[{i + 1}]</span>
                  <span className="font-bold">{move.player === 'human' ? 'ADM' : 'ENY'}</span>
                  <span className="mx-2">TARGET {String.fromCharCode(65 + move.y)}{move.x + 1}</span>
                  <span className={move.hit ? (move.sunkShipId ? 'text-red-500 font-bold' : 'text-yellow-400') : 'text-gray-500'}>
                    {move.hit ? (move.sunkShipId ? '» SUNK!' : '» HIT') : '» MISS'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5 border-cyan-500/20 bg-cyan-500/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
              <h4 className="font-orbitron text-[10px] text-cyan-400 uppercase tracking-widest">Tactical Intel</h4>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed italic">
              {lastMove 
                ? (lastMove.hit ? "Direct hit confirmed. Maintain barrage on current sector." : "Target missed. Recalculating enemy position based on parity search.")
                : "Awaiting first strike orders. Admiral, you have the conn."
              }
            </p>
          </div>
        </div>

        {/* Enemy Board */}
        <div className="flex flex-col items-center order-1 lg:order-3">
          <div className="w-full overflow-x-auto pb-4 lg:overflow-visible">
            <div className="min-w-[320px] md:min-w-0">
              <BoardDisplay 
                board={gameState.aiBoard} 
                onCellClick={(x, y) => {
                  playBtn();
                  makeShot(x, y);
                }}
                showShips={false}
                title="Enemy Sector"
                isTurn={gameState.turn === 'human'}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            {gameState.aiShips.map(s => (
              <div key={s.id} className={`ship-block ${s.sunk ? 'sunk' : ''}`} style={{ background: s.sunk ? undefined : 'rgba(0,212,255,0.1)' }}></div>
            ))}
          </div>
        </div>
      </main>

      {/* AI Coach Analysis (Post-game) */}
      {gameState.status === 'finished' && analysis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-navy-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="max-w-md w-full my-auto">
            <AICoach analysis={analysis} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
