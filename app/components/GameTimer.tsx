import React from 'react';

interface GameTimerProps {
  timeLeft: number;
}

const GameTimer: React.FC<GameTimerProps> = ({ timeLeft }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 30;

  return (
    <div className={`hud-stat transition-all duration-300 ${isLowTime ? 'border-red-fire shadow-[0_0_15px_rgba(255,61,61,0.3)]' : ''}`}>
      <div className="hud-stat-label">Mission Time</div>
      <div className={`hud-stat-value font-mono ${isLowTime ? 'text-red-fire animate-pulse' : 'text-white'}`}>
        {formatTime(timeLeft)}
      </div>
      {isLowTime && (
        <div className="text-[8px] text-red-fire font-orbitron uppercase mt-1">Critical Time</div>
      )}
    </div>
  );
};

export default GameTimer;
