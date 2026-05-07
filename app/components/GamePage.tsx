'use client';

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';
import DifficultySelector from './DifficultySelector';
import ShipPlacement from './ShipPlacement';
import GameBoard from './GameBoard';
import Leaderboard from './Leaderboard';
import MultiplayerLobby from './MultiplayerLobby';
import ProUpgradeModal from './ProUpgradeModal';
import OrientationPrompt from './OrientationPrompt';
import { GameProvider } from '../context/GameContext';
import { AIDifficulty, GameMode, SHIP_TYPES } from '../types/game';

type Phase = 'difficulty' | 'placement' | 'playing' | 'leaderboard' | 'multiplayer_lobby';

const GamePage: React.FC = () => {
  const { gameState, setDifficulty, setMode, resetGame, startGame, autoPlaceShips } = useGame();
  const { playBtn, playHover } = useSound();
  const [phase, setPhase] = useState<Phase>('difficulty');
  const [isProModalOpen, setIsProModalOpen] = useState(false);

  const handleDifficultySelect = (difficulty: AIDifficulty, mode: GameMode) => {
    setDifficulty(difficulty);
    setMode(mode);
    setPhase('placement');
  };

  const handlePlacementComplete = () => {
    // For AI setup, we do it instantly or with a small delay
    autoPlaceShips(false);
    startGame();
    setPhase('playing');
  };

  const handlePlayAgain = () => {
    resetGame();
    setPhase('difficulty');
  };

  const humanWon = gameState.winner === 'human';

  return (
    <div className="min-h-screen relative bg-[#0a1628]">
      {/* Global Background (Ocean) */}
      <div className="ocean-bg" />
      <div className="ocean-bg grid-lines" style={{ opacity: 0.3 }} />

      {/* Main Content */}
      <div className="relative z-10">
        {phase === 'difficulty' && (
          <DifficultySelector
            onSelect={handleDifficultySelect}
            onOpenLeaderboard={() => setPhase('leaderboard')}
            onOpenMultiplayer={() => setPhase('multiplayer_lobby')}
            onOpenPro={() => setIsProModalOpen(true)}
          />
        )}

        {phase === 'placement' && (
          <ShipPlacement
            onComplete={handlePlacementComplete}
            onBack={() => setPhase('difficulty')}
          />
        )}

        {phase === 'playing' && (
          <div className="relative">
            <GameBoard onAbort={() => { resetGame(); setPhase('difficulty'); }} />
          </div>
        )}

        {phase === 'leaderboard' && (
          <div className="min-h-screen flex items-center justify-center p-6 bg-navy-950/40">
            <div className="w-full max-w-4xl">
              <div className="relative">
                <button
                  onClick={() => setPhase('difficulty')}
                  className="absolute -top-14 left-0 px-4 py-2 bg-navy-900/40 border border-cyan-500/20 rounded-lg text-[10px] font-orbitron text-cyan-400 hover:text-white hover:border-cyan-400 uppercase tracking-[0.3em] transition-all flex items-center gap-3 backdrop-blur-sm"
                >
                  ← Return to Headquarters
                </button>
                <Leaderboard />
              </div>
            </div>
          </div>
        )}

        {phase === 'multiplayer_lobby' && (
          <div className="min-h-screen flex items-center justify-center p-6">
            <MultiplayerLobby onBack={() => setPhase('difficulty')} />
          </div>
        )}
      </div>

      {/* Post-Game Modal */}
      {gameState.status === 'finished' && (
        <>
          {/* Emergency Top Return Button */}
          <div className="fixed top-70 left-1/2 -translate-x-1/2 z-[10000] animate-bounce">
            <button
              onClick={() => { resetGame(); setPhase('difficulty'); playBtn(); }}
              onMouseEnter={() => playHover()}
              className="bg-cyan-500 text-navy-950 font-orbitron px-8 py-3 rounded-full shadow-[0_0_30px_rgba(0,255,242,0.5)] hover:scale-105 transition-all uppercase tracking-[0.2em] text-xs font-bold flex items-center gap-3 border-2 border-white/20"
            >
              <span className="text-lg">🏠</span> Return to Headquarters
            </button>
          </div>

          <div className="victory-overlay">
            <div className="glass-card-strong p-10 text-center max-w-md w-full slide-up">
              <div className="text-6xl mb-4">{humanWon ? '🏆' : '💀'}</div>
              <h2 className={`font-orbitron text-4xl mb-2 ${humanWon ? 'text-neon-gold' : 'text-red-fire'}`}>
                {humanWon ? 'VICTORY' : 'DEFEATED'}
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                {humanWon
                  ? 'The enemy fleet has been neutralized. Admiral, your strategy was flawless.'
                  : 'Your fleet has been annihilated. The enemy claims dominance over these waters.'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="hud-stat">
                  <div className="hud-stat-label">Ships Sunk</div>
                  <div className="hud-stat-value">
                    {humanWon ? SHIP_TYPES.length : gameState.aiShips.filter(s => s.sunk).length}
                  </div>
                </div>
                <div className="hud-stat">
                  <div className="hud-stat-label">Rank</div>
                  <div className="hud-stat-value text-xs uppercase pt-2">
                    {humanWon ? 'Grand Admiral' : 'Seaman Recruit'}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button onClick={handlePlayAgain} className="btn-gold w-full py-4">New Mission</button>
                <button
                  onClick={() => { setPhase('difficulty'); resetGame(); playBtn(); }}
                  onMouseEnter={() => playHover()}
                  className="btn-secondary w-full"
                >
                  Return to HQ
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Orientation Guide for Mobile */}
      <OrientationPrompt />

      {/* Pro Modal */}
      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
      />

      {/* Pro Trigger Floating Button */}
      <button
        onClick={() => setIsProModalOpen(true)}
        className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-50 btn-gold !rounded-full w-16 h-16 !p-0 flex items-center justify-center shadow-[0_0_30px_rgba(240,180,41,0.4)] hover:scale-110 transition-transform active:scale-95"
      >
        <span className="text-3xl">⚡</span>
      </button>
    </div>
  );
};

export default GamePage;
