import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { SettingsService, Config, Settings } from '../settings.service';
import { StatKind, Stat } from '../stats';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {

  battingFormula: string = '';
  pitchingFormula: string = '';
  seasons: number[] = [];
  selectedSeason: number = -1;
  settingsObservable = new Observable<any>();

  constructor(
    private settingsService: SettingsService,
  ) {
    this.settingsObservable = this.settingsService.getObservable();

    this.settingsObservable.subscribe((settings: Settings) => {
      console.debug('Settings updating settings');

      this.battingFormula = settings.battingFormula;
      this.pitchingFormula = settings.pitchingFormula;

      this.seasons = settings.seasons;
      this.selectedSeason = settings.selectedSeason;
    });
  }

  ngOnInit() { }

  onSeasonSelect(target: EventTarget | null) {
    if (target) {
      this.selectedSeason = parseInt((target as HTMLSelectElement).value);
      this.settingsService.setSelectedSeason(this.selectedSeason);
    }
  }

  onFormulaChange(category: string, target: EventTarget | null) {
    if (target) {
      if (category === 'hitting') {
        this.battingFormula = (target as HTMLInputElement).value;
        this.settingsService.setFormula('hitting', this.battingFormula);
      } else if (category === 'pitching') {
        this.pitchingFormula = (target as HTMLInputElement).value;
        this.settingsService.setFormula('pitching', this.pitchingFormula);
      }
    }
  }

}
