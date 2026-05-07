import React, { useState, useEffect } from 'react';

const OrientationPrompt: React.FC = () => {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      setIsMobile(window.innerWidth < 1024); // Consider mobile/tablet below 1024px
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  if (!isMobile || !isPortrait) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-navy-950 flex flex-col items-center justify-center p-8 text-center">
      <div className="ocean-bg opacity-30" />
      
      <div className="relative mb-12">
        <div className="w-20 h-32 border-4 border-cyan-500/30 rounded-2xl relative animate-rotate-device">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-cyan-500/20 rounded-full" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 border-2 border-cyan-500/20 rounded-full" />
        </div>
        <div className="absolute -inset-10 bg-cyan-500/10 blur-[40px] rounded-full -z-10 animate-pulse" />
      </div>

      <h2 className="font-orbitron text-2xl font-black text-white mb-4 tracking-tighter">
        ROTATE DEVICE
      </h2>
      
      <p className="text-cyan-400/60 font-inter text-xs uppercase tracking-[0.2em] max-w-[240px] leading-relaxed">
        Admiral, for optimal tactical command, please switch to <span className="text-white">landscape mode</span>.
      </p>

      <div className="mt-12 flex gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>

      <style jsx>{`
        @keyframes rotate-device {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(0deg); }
          50% { transform: rotate(90deg); }
          70% { transform: rotate(90deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-rotate-device {
          animation: rotate-device 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default OrientationPrompt;
