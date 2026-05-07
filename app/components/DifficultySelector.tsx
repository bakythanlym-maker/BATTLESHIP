import React, { useState } from 'react';
import { AIDifficulty, GameMode } from '../types/game';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';

interface DifficultySelectorProps {
  onSelect: (difficulty: AIDifficulty, mode: GameMode) => void;
  onOpenLeaderboard: () => void;
  onOpenMultiplayer: () => void;
  onOpenPro: () => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelect, onOpenLeaderboard, onOpenMultiplayer, onOpenPro }) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');
  const { playerName, setPlayerName, playerCity, setPlayerCity } = useGame();
  const { playBtn, playHover } = useSound();

  const difficulties: { id: AIDifficulty; label: string; desc: string; icon: string }[] = [
    { id: 'easy', label: 'Recruit', desc: 'Enemy fleet is scattered and predictable.', icon: '⚓' },
    { id: 'medium', label: 'Captain', desc: 'A tactical challenge with strategic firing.', icon: '⚔️' },
    { id: 'hard', label: 'Admiral', desc: 'Predicts your moves. Near-perfect efficiency.', icon: '🏆' },
  ];

  const modes: { id: GameMode; label: string; desc: string }[] = [
    { id: 'classic', label: 'Classic Battle', desc: 'Standard rules. Sink all ships.' },
    { id: 'quick', label: 'Quick Strike', desc: '3 minutes. Most health wins.' },
  ];

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center lg:justify-center pt-20 lg:pt-0 pb-12 px-6 lg:px-12 overflow-y-auto overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-cyan-500/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-gold/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl w-full relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 lg:mb-32 slide-up">
          <div className="inline-block relative">
            <h1 className="font-orbitron text-3xl md:text-7xl lg:text-9xl font-black text-neon-cyan mb-2 lg:mb-8 tracking-tighter relative z-10">
              BATTLESHIP
            </h1>
            <div className="absolute -inset-4 bg-cyan-500/5 blur-3xl rounded-full z-0" />
          </div>
          <p className="text-gray-400 font-inter tracking-[0.8em] uppercase text-[10px] opacity-60">
            Strategic Naval Command • v3.0 Premium
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-12 lg:gap-24 items-start">
          {/* Left Sidebar: Command & Control */}
          <div className="flex flex-col gap-12 slide-up" style={{ animationDelay: '0.1s' }}>
            {/* Admiral Identity Card */}
            <div className="glass-card p-10 group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <div className="w-12 h-12 border-t-2 border-r-2 border-neon-cyan rounded-tr-lg" />
              </div>

              <h3 className="font-orbitron text-[10px] font-bold text-neon-cyan uppercase tracking-[0.3em] border-b border-navy-700 pb-6 mb-10 flex items-center justify-between">
                Identification <span>ID: 749-X</span>
              </h3>

              <div className="flex flex-col gap-8">
                <div className="relative">
                  <label className="text-[9px] text-gray-500 uppercase block mb-3 font-bold tracking-widest">Admiral Callsign</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full bg-navy-950/50 border border-navy-700 rounded-lg p-4 text-sm text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all font-orbitron tracking-wider"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-gray-500 uppercase block mb-3 font-bold tracking-widest">Command Base</label>
                  <input
                    type="text"
                    value={playerCity}
                    onChange={(e) => setPlayerCity(e.target.value)}
                    className="w-full bg-navy-950/50 border border-navy-700 rounded-lg p-4 text-sm text-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 outline-none transition-all font-orbitron tracking-wider"
                  />
                </div>
              </div>
            </div>

            {/* Mission Protocol Card */}
            <div className="glass-card p-10 relative overflow-hidden">
              <h3 className="font-orbitron text-[10px] font-bold text-neon-cyan uppercase tracking-[0.3em] border-b border-navy-700 pb-6 mb-10">
                Mission Protocol
              </h3>
              <div className="flex flex-col gap-4">
                {modes.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedMode(m.id); playBtn(); }}
                    onMouseEnter={playHover}
                    className={`w-full text-left p-6 rounded-lg border-2 transition-all relative overflow-hidden group ${selectedMode === m.id
                        ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-[0_0_30px_rgba(0,212,255,0.15)]'
                        : 'bg-navy-950/40 border-navy-800 text-gray-500 hover:border-navy-600'
                      }`}
                  >
                    <div className="relative z-10">
                      <div className="text-sm font-bold mb-1 group-hover:text-white transition-colors">{m.label}</div>
                      <div className="text-[10px] opacity-60 leading-relaxed font-inter">{m.desc}</div>
                    </div>
                    {selectedMode === m.id && (
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-cyan-500" />
                    )}
                  </button>
                ))}

                <div className="flex items-center gap-4 my-6">
                  <div className="h-px flex-grow bg-navy-800" />
                  <span className="text-[8px] text-navy-600 font-bold uppercase tracking-widest">Network</span>
                  <div className="h-px flex-grow bg-navy-800" />
                </div>

                <button
                  onClick={() => { onOpenMultiplayer(); playBtn(); }}
                  onMouseEnter={playHover}
                  className="w-full text-left p-6 rounded-lg border-2 border-gold/30 bg-gold/5 text-gold hover:bg-gold/10 transition-all group"
                >
                  <div className="text-sm font-bold mb-1">Multiplayer PvP</div>
                  <div className="text-[10px] opacity-60 leading-relaxed font-inter">Global real-time combat engagement.</div>
                </button>
              </div>
            </div>

            <button
              onClick={onOpenLeaderboard}
              className="w-full py-6 glass-card border-navy-700 text-gray-400 font-orbitron text-[10px] uppercase tracking-[0.4em] hover:text-neon-cyan hover:border-cyan-500/50 transition-all flex items-center justify-center gap-4 group"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
              Global Hall of Fame
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">◀</span>
            </button>
          </div>

          {/* Right Section: Tactical Deployment */}
          <div className="flex flex-col gap-8 lg:gap-16 slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Difficulty Selection */}
            <div className="grid md:grid-cols-3 gap-8">
              {difficulties.map((diff, i) => (
                <div
                  key={diff.id}
                  onClick={() => { onSelect(diff.id, selectedMode); playBtn(); }}
                  onMouseEnter={playHover}
                  className={`diff-card ${diff.id} group flex flex-col items-center justify-center min-h-[180px] lg:min-h-[360px] relative p-6`}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="text-4xl lg:text-6xl mb-4 lg:mb-10 group-hover:scale-110 lg:group-hover:scale-125 group-hover:-translate-y-1 lg:group-hover:-translate-y-2 transition-all duration-500 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">{diff.icon}</div>
                  <h3 className="font-orbitron text-2xl text-white mb-4 tracking-tight">{diff.label}</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed text-center px-4 max-w-[200px]">
                    {diff.desc}
                  </p>
                  <div className="mt-4 lg:mt-12 w-8 lg:w-12 h-[2px] bg-white/10 group-hover:w-16 lg:group-hover:w-24 group-hover:bg-neon-cyan transition-all duration-500" />

                  <div className="absolute bottom-10 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span className="text-[9px] font-orbitron text-neon-cyan uppercase tracking-[0.3em]">Engage Target →</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Call to Action: The Ultimate Hook */}
            <div className="glass-card border-beam upgrade-hook float-anim p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 relative overflow-hidden bg-gradient-to-r from-navy-900/80 to-gold/5 border-gold/20 shadow-[0_0_50px_rgba(240,180,41,0.1)] group">
              <div className="scanning-line !opacity-20 !bg-gold" />
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gold blur-[30px] opacity-20 animate-pulse" />
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gold blur-[40px] opacity-20 animate-pulse" />

              <div className="absolute -top-4 right-12 bg-gradient-to-r from-[#f0b429] via-[#f7d070] to-[#c4922a] text-navy-950 font-black text-[10px] px-6 py-2 rounded-full uppercase tracking-widest z-30 shadow-[0_10px_20px_rgba(240,180,41,0.3)] border border-white/20">
                ★ Legendary Admiral Edition ★
              </div>

              <div className="text-center lg:text-left relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-4 justify-center lg:justify-start">
                  <div className="w-16 h-1 bg-gold rounded-full" />
                  <span className="text-gold font-orbitron text-[10px] uppercase tracking-[0.5em]">Exclusive Upgrade</span>
                </div>
                <h4 className="font-orbitron text-white text-xl md:text-2xl font-black tracking-tight leading-none uppercase">
                  FLASH SALE: <span className="text-neon-gold drop-shadow-[0_0_15px_rgba(240,180,41,0.5)]">70% DISCOUNT</span>
                </h4>
                <p className="text-gray-400 text-[10px] leading-relaxed max-w-md font-medium">
                  ONLY TODAY: Get the <span className="text-white">Legendary Admiral Edition</span> for 70% off. Unlock the AI Prediction Engine and exclusive Golden skins.
                </p>
              </div>

              <div className="relative z-10">
                <button
                  onClick={() => { onOpenPro(); playBtn(); }}
                  onMouseEnter={playHover}
                  className="btn-gold btn-shine whitespace-nowrap px-10 py-4 text-sm rounded-full shadow-[0_0_40px_rgba(240,180,41,0.3)] hover:shadow-[0_0_60px_rgba(240,180,41,0.5)] transition-all animate-pulse-slow font-black"
                >
                  ⚡ ASCEND NOW
                </button>
                <div className="mt-4 text-center">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Secure Tactical License</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifficultySelector;
