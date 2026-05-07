export interface LeaderboardEntry {
  name: string;
  city: string;
  wins: number;
  accuracy: number;
  rank: string;
}

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { name: 'Admiral_Kairat', city: 'Almaty', wins: 42, accuracy: 68, rank: 'Grand Admiral' },
  { name: 'Sea_Wolf_99', city: 'Astana', wins: 38, accuracy: 72, rank: 'Captain' },
  { name: 'Nomad_Sailor', city: 'Shymkent', wins: 35, accuracy: 65, rank: 'Captain' },
  { name: 'Storm_Breaker', city: 'Karaganda', wins: 31, accuracy: 59, rank: 'Commander' },
  { name: 'Caspian_King', city: 'Aktau', wins: 29, accuracy: 61, rank: 'Commander' },
  { name: 'Irtysh_Phantom', city: 'Pavlodar', wins: 26, accuracy: 54, rank: 'Lieutenant' },
  { name: 'Steppe_Captain', city: 'Oral', wins: 22, accuracy: 50, rank: 'Lieutenant' },
  { name: 'Salt_Sea_7', city: 'Atyrau', wins: 19, accuracy: 48, rank: 'Recruit' },
];

export const getLeaderboard = (): LeaderboardEntry[] => {
  if (typeof window === 'undefined') return DEFAULT_LEADERBOARD;
  const stored = localStorage.getItem('battleship_leaderboard');
  if (!stored) return DEFAULT_LEADERBOARD;
  return JSON.parse(stored);
};

export const saveToLeaderboard = (entry: LeaderboardEntry) => {
  const current = getLeaderboard();
  const updated = [...current, entry].sort((a, b) => b.wins - a.wins || b.accuracy - a.accuracy).slice(0, 20);
  localStorage.setItem('battleship_leaderboard', JSON.stringify(updated));
};
