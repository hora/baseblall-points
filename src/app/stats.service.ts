import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { StatKind, Stat } from './stats';

/*
const STATS: StatKind[] = [
  {
    kind: 'hitting',
    stats: [
      {
        id: 'gamesPlayed',
        label: 'Games Played',
        labelBrief: 'G',
        dataField: 'games_played',
        description: '',
      },
      {
        id: 'atBats',
        label: 'At Bats',
        labelBrief: 'AB',
        dataField: 'at_bats',
        description: '',
      },
    ],
  },
  {
    kind: 'pitching',
    stats: [
      {
        id: 'wins',
        label: 'Wins',
        labelBrief: 'W',
        dataField: 'wins',
        description: '',
      },
      {
        id: 'losses',
        label: 'Losses',
        labelBrief: 'L',
        dataField: 'losses',
        description: '',
      },
    ],
  },
];
*/

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private http: HttpClient) { }

  getStatsInfo(): Observable<StatKind[]> {
    const wins = new Stat('wins', 'Wins', 'W', 'wins', '');
    const pitching = new StatKind('pitching', [wins]);

    const gp = new Stat('gamesPlayed', 'Games Played', 'G', 'games_played', '');
    const atBats = new Stat('atBats', 'At Bats', 'AB', 'at_bats', '');
    const hitting = new StatKind('hitting', [gp, atBats]);

    const stats = of([hitting, pitching]);
    return stats;
  }
}
