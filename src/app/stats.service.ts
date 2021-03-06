import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { StatKind, Stat } from './stats';

const CONFIG_URL = 'https://api.sibr.dev/datablase/v2/config';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private http: HttpClient) { }

  // todo: remove this once it's all in settings
  getStatsInfo(): Observable<StatKind[]> {
    return this.http.get<StatKind[]>(CONFIG_URL)
      .pipe(
        map((data: any) => {
          const hitting = new StatKind('hitting');
          const pitching = new StatKind('hitting');

          for (let s of data.columns.hitting) {
            const stat = new Stat(s.id, s.label, s.labelBrief, s.dataField, s.description);
            hitting.addStat(stat);
          }

          for (let s of data.columns.pitching) {
            const stat = new Stat(s.id, s.label, s.labelBrief, s.dataField, s.description);
            pitching.addStat(stat);
          }

          return [hitting, pitching];
        })
      );
  }
}
