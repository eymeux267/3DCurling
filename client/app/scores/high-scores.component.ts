import { Component } from '@angular/core';
import { Score } from './score';
import { HttpService } from './../services/http.service';



@Component({
  selector: 'high-scores',
  templateUrl: 'app/scores/high-scores.html',
  styleUrls: ['app/scores/high-scores.css']
})

export class HighScoresComponent {
  private scoresTable: Array<Score>;
  private difficulty : string;
  private highScoreHasBeenShown: boolean;

  constructor(private httpService: HttpService) {
    this.difficulty = "";
    this.scoresTable = [];
    this.highScoreHasBeenShown = false;
  }

  getScoresTable(): void {
    let score = {
      playerName: "Papa john",
      points: 10,
      pointsOpponent: 1,
    };
    this.httpService.getNewHighScores(score, this.difficulty).then((newScoresTable) => {
      for (let i = 0; i < newScoresTable.length; i++) {
        this.scoresTable.push(newScoresTable[i]);
      }
      console.log(this.scoresTable);
    });
  }

  setDifficultyToNormal() : void {
    this.difficulty = "normal";
    this.getScoresTable();
    this.highScoreHasBeenShown = true;
  }

  setDifficultyToHard() : void {
    this.difficulty = "hard";
    this.getScoresTable();
    this.highScoreHasBeenShown = true;
  }


}
