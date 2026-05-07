import React from 'react';
import { AnalysisResult } from '../lib/aiCoach';

interface AICoachProps {
  analysis: AnalysisResult;
}

const AICoach: React.FC<AICoachProps> = ({ analysis }) => {
  return (
    <div className="glass-card p-6 mt-6 fade-in border-neon-gold">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-2xl">🤖</div>
        <h3 className="font-orbitron text-lg text-neon-gold">AI Strategy Analysis</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="hud-stat">
          <div className="hud-stat-label">Efficiency</div>
          <div className="hud-stat-value" style={{ color: analysis.efficiency > 70 ? '#00ff88' : '#f0b429' }}>
            {analysis.efficiency}%
          </div>
        </div>
        <div className="hud-stat">
          <div className="hud-stat-label">Pattern</div>
          <div className="hud-stat-value" style={{ color: '#00d4ff' }}>
            {analysis.pattern}
          </div>
        </div>
      </div>

      <div className="bg-navy-900/50 p-4 rounded-lg border border-navy-700">
        <p className="text-sm italic text-gray-300 leading-relaxed">
          "{analysis.advice}"
        </p>
      </div>

      <div className="mt-4 pt-4 border-t border-navy-700 flex justify-between items-center text-xs text-gray-500">
        <span>Strategic Score: {Math.round((analysis.accuracy + analysis.efficiency) / 2)}</span>
        <span className="text-neon-cyan cursor-help" title="Based on shot parity and follow-up efficiency">How is this calculated?</span>
      </div>
    </div>
  );
};

export default AICoach;
