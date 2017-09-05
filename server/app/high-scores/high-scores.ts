import { Score } from './score';

import { NORMALHIGHSCORESTABLE } from './mock-scores';
import { HARDHIGHSCORESTABLE } from './mock-scores';

export class HighScores {

  public normalScores: Score[];
  public hardScores: Score[];

  constructor() {
    this.normalScores = NORMALHIGHSCORESTABLE;
    this.hardScores = HARDHIGHSCORESTABLE;
  }

  public updateScore(scoresTable: Score[], newScore: Score): void {
    let position = scoresTable.length;

    // Tant que le nbr de points du nouveau score est superieur on monte dans la liste des scores.
    while (position >= 1 && newScore.points > scoresTable[position - 1].points) {
      position--;
    }
    // Si les scores sont egaux, on compare les points des adversaires.
    while (position >= 1 && newScore.points === scoresTable[position - 1].points
      && newScore.pointsOpponent < scoresTable[position - 1].pointsOpponent) {
      position--;
    }

    let newHighScore = (position !== scoresTable.length);
    if (newHighScore) {
      scoresTable.splice(position, 0, newScore);
      scoresTable.pop();
    }
  }
}
