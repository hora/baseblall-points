import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as equationParser from 'equation-parser';
import * as equationResolver from 'equation-resolver';

import { StatKind, Stat } from './stats';

export interface Config {
  statsInfo: StatKind[];
  seasons: number[];
}

const CONFIG_URL = 'https://api.sibr.dev/datablase/v2/config';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  battingFormula = '(H + R + RBI + SB + BB - SO/2) / PA * 10';
  parsedBattingFormula: { [key: string]: any } = {};

  pitchingFormula = '((20*QS + SO + 15*SHO - 0.5*R - 0.5*BB) / (4*IP)) * 10';
  parsedPitchingFormula: { [key: string]: any } = {};

  seasons: number[] = [];
  selectedSeason = 20;

  hittingStatsInfo: Stat[] = [];
  pitchingStatsInfo: Stat[] = [];

  activeHittingStatsInfo: Stat[] = [];
  activePitchingStatsInfo: Stat[] = [];

  public ready: Promise<boolean>;

  constructor(private http: HttpClient) {
    this.ready = this.init();
  }

  init(): Promise<boolean> {
    console.debug('Settings initializing');

    return new Promise((resolve, reject) => {
      this.getConfig().subscribe((config) => {
        console.debug('Settings: loaded config', config);

        this.setSeasons(config.seasons[0], config.seasons[1]);
        this.hittingStatsInfo = config.statsInfo[0].stats;
        this.pitchingStatsInfo = config.statsInfo[1].stats;
        this.parseStats();
        this.parseFormulas();

        console.debug('Settings initialized');

        resolve(true);
      });
    });
  }

  getConfig(): Observable<Config> {
    return this.http.get<Config>(CONFIG_URL)
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

          return {
            'statsInfo': [hitting, pitching],
            'seasons': [data.seasons.minSeason, data.seasons.maxSeason]
          };
        })
      );
  }

  parseStats() {
    const batting: string[] = this.battingFormula.match(/[A-Za-z]+/g) || [];
    const pitching: string[] = this.pitchingFormula.match(/[A-Za-z]+/g) || [];

    for (let stat of batting) {
      for (let hittingStat of this.hittingStatsInfo) {
        if (hittingStat.labelBrief === stat) {
          this.activeHittingStatsInfo.push(hittingStat);
        }
      }
    }

    for (let stat of pitching) {
      for (let pitchingStat of this.pitchingStatsInfo) {
        if (pitchingStat.labelBrief === stat) {
          this.activePitchingStatsInfo.push(pitchingStat);
        }
      }
    }
  }

  parseFormulas() {
    this.parsedBattingFormula = equationParser.parse(this.battingFormula);
    console.log('Parsed batting formula:', this.parsedBattingFormula);

    this.parsedPitchingFormula = equationParser.parse(this.pitchingFormula);
    console.log('Parsed pitching formula:', this.parsedPitchingFormula);
  }

  setSeasons(min: number, max: number) {
    for (let i = min; i <= max; i++) {
      this.seasons.push(i + 1);
    }
  }

  getActiveStats(): StatKind[] {
    const hitting = new StatKind('hitting');
    hitting.setStats(this.activeHittingStatsInfo);

    const pitching = new StatKind('pitching');
    pitching.setStats(this.activePitchingStatsInfo);

    return [hitting, pitching];
  }

  getRawFormula(category: string): string {
    if (category === 'hitting') {
      return this.battingFormula;
    } else if (category === 'pitching') {
      return this.pitchingFormula;
    }

    return '';
  }

  getSeasons(): number[] {
    return this.seasons;
  }

  getSelectedSeason(): number {
    return this.selectedSeason;
  }

}
