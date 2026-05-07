'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { GameState, GameMove, AIDifficulty, GameMode, BOARD_SIZE, SHIP_TYPES, ShipInstance } from '@/app/types/game';
import { GameEngine } from '@/app/lib/gameEngine';
import { AIPlayer } from '@/app/lib/aiPlayer';
import { MultiplayerManager, MultiplayerMessage, generateRoomCode } from '@/app/lib/multiplayer';
import { analyzeStrategy, AnalysisResult } from '@/app/lib/aiCoach';
import { saveToLeaderboard } from '@/app/lib/leaderboard';

interface GameContextType {
  gameState: GameState;
  setDifficulty: (difficulty: AIDifficulty) => void;
  setMode: (mode: GameMode) => void;
  placeShip: (x: number, y: number, typeId: string, orientation: 'horizontal' | 'vertical') => boolean;
  autoPlaceShips: (isHuman: boolean) => void;
  startGame: () => void;
  makeShot: (x: number, y: number) => void;
  resetGame: () => void;
  createMultiplayerGame: () => string;
  joinMultiplayerGame: (code: string) => void;
  analysis: AnalysisResult | null;
  playerName: string;
  setPlayerName: (name: string) => void;
  playerCity: string;
  setPlayerCity: (city: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(GameEngine.createGameState());
  const [playerName, setPlayerName] = useState('Admiral');
  const [playerCity, setPlayerCity] = useState('Almaty');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const aiPlayerRef = useRef<AIPlayer>(new AIPlayer('medium'));
  const mpManagerRef = useRef<MultiplayerManager | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Quick Mode Timer
  useEffect(() => {
    if (gameState.status === 'playing' && gameState.mode === 'quick' && gameState.timeLeft !== undefined) {
      if (gameState.timeLeft > 0) {
        timerRef.current = setTimeout(() => {
          setGameState(prev => ({ ...prev, timeLeft: (prev.timeLeft || 0) - 1 }));
        }, 1000);
      } else {
        // Time's up! Winner is the one with more ship health
        const humanHealth = gameState.humanShips.reduce((acc, s) => acc + (SHIP_TYPES.find(t => t.id === s.typeId)!.length - s.hits), 0);
        const aiHealth = gameState.aiShips.reduce((acc, s) => acc + (SHIP_TYPES.find(t => t.id === s.typeId)!.length - s.hits), 0);
        setGameState(prev => ({
          ...prev,
          status: 'finished',
          winner: humanHealth >= aiHealth ? 'human' : 'ai'
        }));
      }
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [gameState.status, gameState.mode, gameState.timeLeft, gameState.humanShips, gameState.aiShips]);

  // Multiplayer Message Handler
  const handleMPMessage = useCallback((msg: MultiplayerMessage) => {
    switch (msg.type) {
      case 'JOIN_REQUEST':
        mpManagerRef.current?.send({ type: 'JOIN_ACCEPT', hostName: playerName });
        break;
      case 'PLACE_READY':
        // Opponent ready logic
        break;
      case 'SHOT':
        const result = GameEngine.processShot(gameState.humanBoard, gameState.humanShips, msg.x, msg.y);
        mpManagerRef.current?.send({ type: 'SHOT_RESULT', x: msg.x, y: msg.y, hit: result.hit, sunk: result.sunk });
        setGameState(prev => {
          const newState = { ...prev, turn: 'human' as const };
          if (GameEngine.allShipsSunk(newState.humanShips)) {
            newState.status = 'finished';
            newState.winner = 'opponent';
          }
          return newState;
        });
        break;
      case 'SHOT_RESULT':
        setGameState(prev => {
          const newState = { ...prev };
          const cell = newState.aiBoard[msg.y][msg.x];
          if (msg.hit) {
            cell.isHit = true;
            if (msg.sunk) {
              const ship = newState.aiShips.find(s => s.id === msg.sunk);
              if (ship) ship.sunk = true;
            }
          } else {
            cell.isMiss = true;
          }
          newState.turn = 'opponent';
          if (GameEngine.allShipsSunk(newState.aiShips)) {
            newState.status = 'finished';
            newState.winner = 'human';
          }
          return newState;
        });
        break;
    }
  }, [playerName, gameState.humanBoard, gameState.humanShips, gameState.aiShips]);

  const setDifficulty = useCallback((difficulty: AIDifficulty) => {
    aiPlayerRef.current.setDifficulty(difficulty);
    setGameState(prev => ({ ...prev, difficulty }));
  }, []);

  const setMode = useCallback((mode: GameMode) => {
    setGameState(prev => ({
      ...prev,
      mode,
      timeLeft: mode === 'quick' ? 180 : undefined
    }));
  }, []);

  const placeShip = useCallback((x: number, y: number, typeId: string, orientation: 'horizontal' | 'vertical') => {
    const type = SHIP_TYPES.find(t => t.id === typeId);
    if (!type) return false;

    let success = false;
    // We update the board and ships in a single state update
    setGameState(prev => {
      if (!GameEngine.isValidPlacement(prev.humanBoard, x, y, type.length, orientation)) {
        success = false;
        return prev;
      }
      
      const newState = { ...prev };
      const shipId = `ship_${type.id}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Update board cells
      for (let i = 0; i < type.length; i++) {
        const cx = orientation === 'horizontal' ? x + i : x;
        const cy = orientation === 'vertical' ? y + i : y;
        newState.humanBoard[cy][cx] = { 
          ...newState.humanBoard[cy][cx], 
          hasShip: true, 
          shipId: shipId 
        };
      }
      
      // Add ship to fleet
      newState.humanShips = [...newState.humanShips, { 
        id: shipId, 
        typeId, 
        x, 
        y, 
        orientation, 
        hits: 0, 
        sunk: false 
      }];
      
      success = true;
      return newState;
    });
    
    return success;
  }, []);

  const autoPlaceShips = useCallback((isHuman: boolean) => {
    setGameState(prev => {
      const newState = { ...prev };
      if (isHuman) {
        GameEngine.autoPlaceShips(newState.humanBoard, newState.humanShips);
      } else {
        GameEngine.autoPlaceShips(newState.aiBoard, newState.aiShips);
      }
      return newState;
    });
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({ ...prev, status: 'playing', turn: 'human' }));
  }, []);

  const makeShot = useCallback((x: number, y: number) => {
    if (gameState.status !== 'playing' || gameState.turn !== 'human') return;

    if (gameState.mode === 'multiplayer') {
      mpManagerRef.current?.send({ type: 'SHOT', x, y });
      setGameState(prev => ({ ...prev, turn: 'opponent' }));
      return;
    }

    setGameState(prev => {
      const newState = { ...prev };
      const result = GameEngine.processShot(newState.aiBoard, newState.aiShips, x, y);
      
      newState.moveHistory.push({ player: 'human', x, y, hit: result.hit, sunkShipId: result.sunk });

      if (GameEngine.allShipsSunk(newState.aiShips)) {
        newState.status = 'finished';
        newState.winner = 'human';
        newState.humanStats.wins++;
        return newState;
      }

      if (!result.hit) {
        newState.turn = 'ai';
        // AI move
        setTimeout(() => {
          processAIMove();
        }, 600);
      }

      return newState;
    });
  }, [gameState.status, gameState.turn, gameState.mode]);

  const processAIMove = useCallback(() => {
    setGameState(prev => {
      if (prev.status !== 'playing') return prev;
      const newState = { ...prev };
      const move = aiPlayerRef.current.getNextMove(newState.humanBoard, newState.moveHistory);
      const result = GameEngine.processShot(newState.humanBoard, newState.humanShips, move.x, move.y);

      newState.moveHistory.push({ player: 'ai', x: move.x, y: move.y, hit: result.hit, sunkShipId: result.sunk });

      if (GameEngine.allShipsSunk(newState.humanShips)) {
        newState.status = 'finished';
        newState.winner = 'ai';
        newState.aiStats.wins++;
      } else if (result.hit) {
        setTimeout(() => processAIMove(), 600);
      } else {
        newState.turn = 'human';
      }

      return newState;
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(GameEngine.createGameState());
    setAnalysis(null);
  }, []);

  const createMultiplayerGame = useCallback(() => {
    const code = generateRoomCode();
    mpManagerRef.current = new MultiplayerManager(code, handleMPMessage);
    setGameState(prev => ({ ...prev, mode: 'multiplayer', roomCode: code }));
    return code;
  }, [handleMPMessage]);

  const joinMultiplayerGame = useCallback((code: string) => {
    mpManagerRef.current = new MultiplayerManager(code, handleMPMessage);
    mpManagerRef.current.send({ type: 'JOIN_REQUEST', playerName });
    setGameState(prev => ({ ...prev, mode: 'multiplayer', roomCode: code }));
  }, [playerName, handleMPMessage]);

  // Handle Game Finish
  useEffect(() => {
    if (gameState.status === 'finished') {
      const result = analyzeStrategy(gameState.moveHistory);
      setAnalysis(result);
      if (gameState.winner === 'human') {
        saveToLeaderboard({
          name: playerName,
          city: playerCity,
          wins: gameState.humanStats.wins,
          accuracy: result.accuracy,
          rank: result.accuracy > 70 ? 'Grand Admiral' : 'Captain'
        });
      }
    }
  }, [gameState.status, gameState.winner, gameState.moveHistory, playerName, playerCity, gameState.humanStats.wins]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        setDifficulty,
        setMode,
        placeShip,
        autoPlaceShips,
        startGame,
        makeShot,
        resetGame,
        createMultiplayerGame,
        joinMultiplayerGame,
        analysis,
        playerName,
        setPlayerName,
        playerCity,
        setPlayerCity,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};
