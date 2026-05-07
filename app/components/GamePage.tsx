'use client';

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import DifficultySelector from './DifficultySelector';
import ShipPlacement from './ShipPlacement';
import GameBoard from './GameBoard';
import Leaderboard from './Leaderboard';
import MultiplayerLobby from './MultiplayerLobby';
import ProUpgradeModal from './ProUpgradeModal';
import { AIDifficulty, GameMode, SHIP_TYPES } from '../types/game';

type Phase = 'difficulty' | 'placement' | 'playing' | 'leaderboard' | 'multiplayer_lobby';

const GamePage: React.FC = () => {
  const { gameState, setDifficulty, setMode, resetGame, startGame, autoPlaceShips } = useGame();
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
            <button
              onClick={() => { resetGame(); setPhase('difficulty'); }}
              className="fixed top-8 left-8 z-[100] px-4 py-2 bg-navy-900/60 border border-red-500/20 rounded-lg text-[10px] font-orbitron text-gray-400 hover:text-red-400 hover:border-red-500/50 uppercase tracking-[0.3em] transition-all flex items-center gap-3 group backdrop-blur-sm"
            >
              <span className="text-sm group-hover:-translate-x-1 transition-transform">←</span> Abort Mission
            </button>
            <GameBoard />
          </div>
        )}

        {phase === 'leaderboard' && (
          <div className="min-h-screen flex items-center justify-center p-6 bg-navy-950/40">
            <div className="w-full max-w-4xl">
              <Leaderboard />
              <button
                onClick={() => setPhase('difficulty')}
                className="mt-8 mx-auto block text-xs font-orbitron text-gray-500 hover:text-neon-cyan uppercase tracking-widest transition-colors"
              >
                ← Return to Headquarters
              </button>
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
        <div className="victory-overlay z-[60]">
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
                onClick={() => setPhase('leaderboard')}
                className="btn-secondary w-full"
              >
                View Global Rankings
              </button>
            </div>
          </div>
        </div>
      )}

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
