import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Player } from './player';

const PLAYERS: Player[] = [
  {id: 1, name: 'Randy Castillo'},
  {id: 2, name: 'Chorby Short'},
  {id: 3, name: 'Dudley Mueller'},
  {id: 4, name: 'Slosh Truk'},
  {id: 5, name: 'Dunlap Figueroa'},
];

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private playersUrl = '';

  constructor(private http: HttpClient) { }

  getPlayers(): Observable<Player[]> {
    const players = of(PLAYERS);
    return players;
  }
}
