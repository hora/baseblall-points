import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
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
    const playersUrl = 'https://api.blaseball-reference.com/v1/allPlayers?includeShadows=true';
    const statsUrl = `${STATS_URL}&group=${category}&season=${season - 1}`;
    const players: Player[] = [];
    const playersById: { [key: string]: Player } = {};

    let position = '';

    if (category === 'hitting') {
      position = 'BATTER';
    } else if (category === 'pitching') {
      position = 'PITCHER';
    }

    const playersObs = this.http.get(playersUrl);
    const statsObs = this.http.get(statsUrl);

    return forkJoin([playersObs, statsObs]).pipe(
      map((data) => {
        const playersData = data[0] as any;
        const statsData = data[1] as any;

        for (let p of playersData) {
          const player = new Player(p.player_id, p.player_name);

          player.setTeam(p.team);
          player.setStars(p);

          playersById[player.id] = player;
        }

        for (let p of statsData[0].splits) {
          const player = playersById[p.player.id];
          player.setStats(p.stat);
          players.push(player);
        }

        return players;
      })
    );
  }
}
