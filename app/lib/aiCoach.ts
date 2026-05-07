import { GameMove } from '../types/game';

export interface AnalysisResult {
  efficiency: number;
  pattern: 'Random' | 'Strategic' | 'Systematic' | 'Brute Force';
  advice: string;
  accuracy: number;
}

export const analyzeStrategy = (moves: GameMove[]): AnalysisResult => {
  const humanMoves = moves.filter(m => m.player === 'human');
  if (humanMoves.length === 0) return { efficiency: 0, pattern: 'Random', advice: 'No shots fired.', accuracy: 0 };

  const hits = humanMoves.filter(m => m.hit).length;
  const accuracy = Math.round((hits / humanMoves.length) * 100);

  // Efficiency: Did player follow up hits with adjacent shots?
  let effectiveFollowUps = 0;
  let totalFollowUps = 0;

  humanMoves.forEach((move, i) => {
    if (move.hit && i < humanMoves.length - 1) {
      const nextMove = humanMoves[i + 1];
      totalFollowUps++;
      // Check if next shot is adjacent
      const dx = Math.abs(nextMove.x - move.x);
      const dy = Math.abs(nextMove.y - move.y);
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        effectiveFollowUps++;
      }
    }
  });

  const efficiency = totalFollowUps > 0 ? Math.round((effectiveFollowUps / totalFollowUps) * 100) : 50;

  // Pattern detection
  let pattern: AnalysisResult['pattern'] = 'Random';
  if (accuracy > 40 && efficiency > 70) pattern = 'Strategic';
  else if (efficiency > 80) pattern = 'Systematic';
  else if (humanMoves.length > 50) pattern = 'Brute Force';

  // Advice generation
  let advice = "Try to shoot in a checkerboard pattern to find ships faster.";
  if (efficiency < 40) {
    advice = "When you hit a ship, focus on surrounding cells to sink it completely.";
  } else if (accuracy < 20) {
    advice = "Your shots are scattered. Ships are usually placed with some gap between them.";
  } else if (pattern === 'Strategic') {
    advice = "Impressive efficiency! You have the instincts of a seasoned Admiral.";
  } else if (pattern === 'Systematic') {
    advice = "Methodical approach. Consider varying your rhythm to confuse advanced opponents.";
  }

  return { efficiency, pattern, advice, accuracy };
};
