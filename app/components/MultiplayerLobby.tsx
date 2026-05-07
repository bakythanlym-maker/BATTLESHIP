import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

interface MultiplayerLobbyProps {
  onBack: () => void;
}

const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ onBack }) => {
  const { createMultiplayerGame, joinMultiplayerGame, playerName, setPlayerName } = useGame();
  const [roomCode, setRoomCode] = useState('');
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  const handleCreate = () => {
    const code = createMultiplayerGame();
    setCreatedCode(code);
  };

  const handleJoin = () => {
    if (roomCode.length === 4) {
      joinMultiplayerGame(roomCode.toUpperCase());
    }
  };

  return (
    <div className="glass-card-strong p-10 max-w-md w-full mx-auto slide-up text-center">
      <h2 className="font-orbitron text-2xl text-neon-cyan mb-6">Naval Command Center</h2>
      
      <div className="mb-8">
        <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Admiral Callsign</label>
        <input 
          type="text" 
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="bg-navy-900/50 border border-cyan-500/30 rounded-lg p-3 w-full text-center font-orbitron text-white focus:border-cyan-500 outline-none transition-all"
        />
      </div>

      {!createdCode ? (
        <div className="space-y-6">
          <div>
            <button onClick={handleCreate} className="btn-primary w-full py-4 mb-2">Create Battle Room</button>
            <p className="text-[10px] text-gray-500">Host a session and share code with a friend</p>
          </div>

          <div className="relative flex items-center gap-2">
            <div className="flex-grow h-[1px] bg-navy-700"></div>
            <span className="text-[10px] text-gray-600 font-orbitron">OR</span>
            <div className="flex-grow h-[1px] bg-navy-700"></div>
          </div>

          <div>
            <input 
              type="text" 
              placeholder="ENTER ROOM CODE"
              maxLength={4}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="bg-navy-900/50 border border-navy-700 rounded-lg p-3 w-full text-center font-orbitron text-white mb-3 tracking-[0.5em]"
            />
            <button 
              onClick={handleJoin} 
              disabled={roomCode.length !== 4}
              className="btn-secondary w-full disabled:opacity-30"
            >
              Join Mission
            </button>
          </div>
        </div>
      ) : (
        <div className="fade-in">
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-6 mb-6">
            <div className="text-xs text-cyan-400 mb-2 uppercase tracking-tighter">Your Room Code</div>
            <div className="text-5xl font-orbitron text-white tracking-[0.2em]">{createdCode}</div>
          </div>
          <p className="text-sm text-gray-400 mb-8">Waiting for opponent to join the channel...</p>
          <div className="spin-loader mx-auto mb-6 h-8 w-8 border-2"></div>
        </div>
      )}

      <button 
        onClick={onBack} 
        className="absolute -top-14 left-0 px-4 py-2 bg-navy-900/40 border border-cyan-500/20 rounded-lg text-[10px] font-orbitron text-cyan-400 hover:text-white hover:border-cyan-400 uppercase tracking-[0.3em] transition-all flex items-center gap-3 backdrop-blur-sm"
      >
        ← Return to HQ
      </button>
    </div>
  );
};

export default MultiplayerLobby;
