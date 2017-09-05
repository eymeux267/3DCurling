import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Score } from './../scores/score';

@Injectable()
export class HttpService {
    private serverUrl = 'http://localhost:3002/highscores';


    constructor (private http: Http) {}

    getNewHighScores(newScore : Score, difficulty: string): Promise<Array<Score>> {
        return this.http.post(this.serverUrl + '/' + difficulty, newScore)
        .map((res : Response) => {
            console.log("New highscores received");
            let body = res.json();
            let scoresTable : Array<Score> = [];

            for (let i = 0; i < body.length; i++) {
                let score = {
                    playerName: body[i].playerName,
                    points: body[i].points,
                    pointsOpponent: body[i].pointsOpponent,
                };
                scoresTable.push(score);
            }
            console.log(scoresTable);

            return scoresTable;
         })
        .toPromise();
    }
}
