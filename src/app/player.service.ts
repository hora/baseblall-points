import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Player } from './player';

const STATS_URL = 'https://api.sibr.dev/datablase/v2/stats?group=hitting&type=seasonCombined&season=19';

//const PLAYERS: Player[] = [
  //{id: 1, name: 'Randy Castillo'},
  //{id: 2, name: 'Chorby Short'},
  //{id: 3, name: 'Dudley Mueller'},
  //{id: 4, name: 'Slosh Truk'},
  //{id: 5, name: 'Dunlap Figueroa'},
//];

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private playersUrl = '';

  constructor(private http: HttpClient) { }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(STATS_URL)
      .pipe(
        map((data: any) => {
          const players: Player[] = [];

          for (let p of data[0].splits) {
            const player = new Player(p.player.id, p.player.fullName, p.stat);
            players.push(player);
          }

          return players;
        })
      );
  }
}
