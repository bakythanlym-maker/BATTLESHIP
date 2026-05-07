'use client';

import React, { useEffect, useState } from 'react';

const CinematicEffects: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div className="scanlines" />
      <div className="noise" />
      <div 
        className="custom-cursor hidden lg:flex" 
        style={{ 
          transform: `translate(${position.x - 12}px, ${position.y - 12}px)` 
        }} 
      />
    </>
  );
};

export default CinematicEffects;
