import * as express from 'express';
import { HighScores } from '../high-scores/high-scores';

module Route {

  export class Index {
    private highScores : HighScores;

    public index(req: express.Request, res: express.Response, next: express.NextFunction): void {
      res.send('Hello world');
    }
    public glComponent(req: express.Request, res: express.Response, next: express.NextFunction): void {
      res.redirect('/glcomp');
    }

    public getHighScoreNormal(req: express.Request, res: express.Response, next: express.NextFunction): void {
      console.log("Scores normals envoyes");
      this.highScores = new HighScores();
      let newScore = {
        playerName: req.body.playerName,
        points: req.body.points,
        pointsOpponent: req.body.pointsOpponent,
      };
      this.highScores.updateScore(this.highScores.normalScores, newScore);
      res.json(this.highScores.normalScores);
    }

    public getHighScoreHard(req: express.Request, res: express.Response, next: express.NextFunction): void {
      console.log("Scores difficiles envoyes");
      this.highScores = new HighScores();
      let newScore = {
        playerName: req.body.playerName,
        points: req.body.points,
        pointsOpponent: req.body.pointsOpponent,
      };
      this.highScores.updateScore(this.highScores.hardScores, newScore);
      res.json(this.highScores.hardScores);
    }
  }
}

export = Route;
