import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Player } from './player';

const STATS_URL = 'https://api.sibr.dev/datablase/v2/stats?type=seasonCombined';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private playersUrl = '';

  constructor(private http: HttpClient) { }

  getPlayers(category: string, season: number): Observable<Player[]> {
    const url = `${STATS_URL}&group=${category}&season=${season - 1}`;

    return this.http.get<Player[]>(url)
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
