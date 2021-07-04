import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { StatKind, Stat } from './stats';

export interface Config {
  statsInfo: StatKind[];
  seasons: number[];
}

export interface Settings {
  battingFormula: string;
  pitchingFormula: string;
  seasons: number[];
  selectedSeason: number;
  hittingStatsInfo: Stat[];
  pitchingStatsInfo: Stat[];
  activeHittingStatsInfo: Stat[];
  activePitchingStatsInfo: Stat[];
}

const CONFIG_URL = 'https://api.sibr.dev/datablase/v2/config';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private settings = {
    preS23battingFormula: '(H + R + RBI + SB + BB - SO/2) / PA * 10',
    preS23pitchingFormula: '((20*QS + SO + 15*SHO - 0.5*R - 0.5*BB) / (4*IP)) * 10',

    s23battingFormula: '10 * (H + TB/2 + SB + BB - SO/2) / PA',
    s23pitchingFormula: '10 * (20*QS + SO + 15*SHO - HR - BB) / 4*IP',

    battingFormula: '10 * (H + TB/2 + SB + BB - SO/2) / PA',
    pitchingFormula: '10 * (20*QS + SO + 15*SHO - HR - BB) / 4*IP',

    seasons: [],
    selectedSeason: -1,

    hittingStatsInfo: [],
    pitchingStatsInfo: [],

    activeHittingStatsInfo: [],
    activePitchingStatsInfo: [],
  } as Settings;

  subject = new Subject<any>();

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
        this.settings.hittingStatsInfo = config.statsInfo[0].stats;
        this.settings.pitchingStatsInfo = config.statsInfo[1].stats;
        this.parseStats();

        this.sendSettings();

        resolve(true);
        console.debug('Settings initialized');
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

          // for some reason plate appearances don't show up in config
          const pa = new Stat('plateAppearances', 'Plate Appearances', 'PA', 'plate_appearances', '');
          hitting.addStat(pa);

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
    const batting: string[] = this.settings.battingFormula.match(/[A-Za-z]+/g) || [];
    const pitching: string[] = this.settings.pitchingFormula.match(/[A-Za-z]+/g) || [];

    this.settings.activeHittingStatsInfo = [];
    for (let stat of batting) {
      for (let hittingStat of this.settings.hittingStatsInfo) {
        if (hittingStat.labelBrief === stat) {
          this.settings.activeHittingStatsInfo.push(hittingStat);
        }
      }
    }

    this.settings.activePitchingStatsInfo = [];
    for (let stat of pitching) {
      for (let pitchingStat of this.settings.pitchingStatsInfo) {
        if (pitchingStat.labelBrief === stat) {
          this.settings.activePitchingStatsInfo.push(pitchingStat);
        }
      }
    }
  }

  setSeasons(min: number, max: number) {
    for (let i = min; i <= max; i++) {
      this.settings.seasons.push(i + 1);
    }

    this.settings.selectedSeason = max + 1;
  }

  setSelectedSeason(selectedSeason: number) {
    this.settings.selectedSeason = selectedSeason;
    this.sendSettings();
  }

  setFormula(category: string, formula: string) {
      if (category === 'hitting') {
        this.settings.battingFormula = formula;
      } else if (category === 'pitching') {
        this.settings.pitchingFormula = formula;
      }
      this.parseStats();
      this.sendSettings();
  }

  sendSettings() {
    this.subject.next(this.settings);
  }

  getObservable() {
    return this.subject.asObservable();
  }

}
