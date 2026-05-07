import React, { useState, useEffect } from 'react';
import { getLeaderboard, LeaderboardEntry } from '../lib/leaderboard';

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filterCity, setFilterCity] = useState('All');

  useEffect(() => {
    setEntries(getLeaderboard());
  }, []);

  const cities = ['All', ...Array.from(new Set(entries.map(e => e.city)))];
  const filteredEntries = filterCity === 'All' ? entries : entries.filter(e => e.city === filterCity);

  return (
    <div className="glass-card p-12 max-w-3xl w-full mx-auto slide-up">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="font-orbitron text-3xl text-neon-cyan mb-2">Global Leaderboard</h2>
          <p className="text-gray-400 text-sm">Top commanders from across the region</p>
        </div>
        <select 
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          className="bg-navy-800 border border-navy-600 text-cyan-400 text-xs rounded-md p-2 outline-none"
        >
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="space-y-5">
        {filteredEntries.map((entry, i) => (
          <div 
            key={i} 
            className={`flex items-center justify-between p-4 rounded-xl border ${
              i === 0 ? 'bg-gold/10 border-gold/30' : 'bg-navy-800/40 border-navy-700'
            } transition-all hover:bg-navy-800/60`}
          >
            <div className="flex items-center gap-4">
              <span className={`font-orbitron text-xl ${i < 3 ? 'text-neon-gold' : 'text-gray-500'}`}>
                #{i + 1}
              </span>
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  {entry.name}
                  <span className="text-[10px] bg-navy-700 px-1.5 py-0.5 rounded text-gray-400">{entry.city}</span>
                </div>
                <div className="text-[10px] text-neon-cyan uppercase tracking-widest">{entry.rank}</div>
              </div>
            </div>
            <div className="flex gap-6 text-right">
              <div>
                <div className="text-[10px] text-gray-500 uppercase">Wins</div>
                <div className="font-orbitron text-white">{entry.wins}</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase">Acc.</div>
                <div className="font-orbitron text-neon-gold">{entry.accuracy}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
