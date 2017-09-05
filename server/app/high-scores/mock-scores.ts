import { Score } from './score';

// Pour simuler une fin de partie avec des scores deja presents

export const NORMALHIGHSCORESTABLE: Score[] = [
  {playerName: 'JohnDoe111', points: 13, pointsOpponent: 5 },
  {playerName: 'JohnDoe222', points: 10, pointsOpponent: 5 },
  {playerName: 'JohnDoe333', points: 9, pointsOpponent: 5 },
];

export const HARDHIGHSCORESTABLE: Score[] = [
  { playerName: 'JohnDoe11', points: 9, pointsOpponent: 5 },
  { playerName: 'JohnDoe22', points: 8, pointsOpponent: 5 },
  { playerName: 'JohnDoe33', points: 5, pointsOpponent: 3 }
];
