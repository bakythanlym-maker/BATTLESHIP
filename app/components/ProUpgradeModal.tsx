import React from 'react';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy-950/90 backdrop-blur-xl fade-in">
      <div className="glass-card-strong max-w-4xl w-full p-10 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/20 blur-[100px] rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full"></div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-12">
          <h2 className="font-orbitron text-4xl text-neon-gold mb-4 tracking-tight">Upgrade to Grand Admiral</h2>
          <p className="text-gray-400 max-w-lg mx-auto">Unlock premium tactical advantages, global competition, and advanced AI training modules.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Free Tier */}
          <div className="glass-card p-6 border-navy-700 bg-navy-900/40">
            <h3 className="font-orbitron text-lg text-white mb-2">Recruit</h3>
            <div className="text-2xl font-bold mb-4">$0 <span className="text-xs font-normal text-gray-500">/ forever</span></div>
            <ul className="text-xs space-y-3 text-gray-400 mb-8">
              <li className="flex items-center gap-2">✓ Classic AI Battle</li>
              <li className="flex items-center gap-2">✓ Local Leaderboard</li>
              <li className="flex items-center gap-2 opacity-30">✗ AI Strategy Coach</li>
              <li className="flex items-center gap-2 opacity-30">✗ Global Rankings</li>
            </ul>
            <button disabled className="w-full py-2 border border-navy-700 rounded text-xs text-gray-600 uppercase">Current Plan</button>
          </div>

          {/* Pro Tier */}
          <div className="glass-card p-6 border-cyan-500/40 bg-cyan-500/5 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-[10px] font-bold px-3 py-1 rounded-full text-navy-950 uppercase">Most Popular</div>
            <h3 className="font-orbitron text-lg text-cyan-400 mb-2">Captain</h3>
            <div className="text-2xl font-bold mb-4">$4.99 <span className="text-xs font-normal text-gray-500">/ mo</span></div>
            <ul className="text-xs space-y-3 text-white/80 mb-8">
              <li className="flex items-center gap-2">✓ Everything in Recruit</li>
              <li className="flex items-center gap-2">✓ Global Leaderboard Access</li>
              <li className="flex items-center gap-2">✓ Advanced AI Coach Analysis</li>
              <li className="flex items-center gap-2">✓ Custom Fleet Skins</li>
            </ul>
            <button className="btn-primary w-full py-3 text-xs">Upgrade Now</button>
          </div>

          {/* Elite Tier */}
          <div className="glass-card p-6 border-gold/40 bg-gold/5">
            <h3 className="font-orbitron text-lg text-gold mb-2">Admiral</h3>
            <div className="text-2xl font-bold mb-4">$9.99 <span className="text-xs font-normal text-gray-500">/ mo</span></div>
            <ul className="text-xs space-y-3 text-white/80 mb-8">
              <li className="flex items-center gap-2">✓ Everything in Captain</li>
              <li className="flex items-center gap-2">✓ Priority Multiplayer Servers</li>
              <li className="flex items-center gap-2">✓ Tournament Access</li>
              <li className="flex items-center gap-2">✓ Real-time Strategy Tips</li>
            </ul>
            <button className="btn-gold w-full py-3 text-xs">Go Elite</button>
          </div>
        </div>

        <div className="mt-10 text-center text-[10px] text-gray-600">
          Secure payment integration via Stripe. No credit card required for trial.
        </div>
      </div>
    </div>
  );
};

export default ProUpgradeModal;
