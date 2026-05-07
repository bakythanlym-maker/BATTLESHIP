'use client';

import React, { createContext, useContext, useRef } from 'react';

interface SoundContextType {
  playBtn: () => void;
  playHover: () => void;
  playFire: () => void;
  playHit: () => void;
  playMiss: () => void;
  playSunk: () => void;
  playPlace: () => void;
  playWin: () => void;
  playLoss: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRefs = {
    btn: useRef<HTMLAudioElement | null>(null),
    hover: useRef<HTMLAudioElement | null>(null),
    fire: useRef<HTMLAudioElement | null>(null),
    hit: useRef<HTMLAudioElement | null>(null),
    miss: useRef<HTMLAudioElement | null>(null),
    sunk: useRef<HTMLAudioElement | null>(null),
    place: useRef<HTMLAudioElement | null>(null),
    win: useRef<HTMLAudioElement | null>(null),
    loss: useRef<HTMLAudioElement | null>(null),
  };

  const play = (ref: React.RefObject<HTMLAudioElement | null>) => {
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(() => {});
    }
  };

  const value = {
    playBtn: () => play(audioRefs.btn),
    playHover: () => play(audioRefs.hover),
    playFire: () => play(audioRefs.fire),
    playHit: () => play(audioRefs.hit),
    playMiss: () => play(audioRefs.miss),
    playSunk: () => play(audioRefs.sunk),
    playPlace: () => play(audioRefs.place),
    playWin: () => play(audioRefs.win),
    playLoss: () => play(audioRefs.loss),
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
      <audio ref={audioRefs.btn} src="https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" />
      <audio ref={audioRefs.hover} src="https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3" />
      <audio ref={audioRefs.fire} src="https://assets.mixkit.co/active_storage/sfx/1653/1653-preview.mp3" />
      <audio ref={audioRefs.hit} src="https://assets.mixkit.co/active_storage/sfx/123/123-preview.mp3" />
      <audio ref={audioRefs.miss} src="https://assets.mixkit.co/active_storage/sfx/1110/1110-preview.mp3" />
      <audio ref={audioRefs.sunk} src="https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3" />
      <audio ref={audioRefs.place} src="https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3" />
      <audio ref={audioRefs.win} src="https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3" />
      <audio ref={audioRefs.loss} src="https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3" />
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error('useSound must be used within a SoundProvider');
  return context;
};
