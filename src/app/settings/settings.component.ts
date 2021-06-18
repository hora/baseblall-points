import { Component, OnInit } from '@angular/core';

import { SettingsService, Config } from '../settings.service';
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

  constructor(
    private settingsService: SettingsService,
  ) { }

  async ngOnInit() {
    await this.settingsService.ready;

    this.battingFormula = this.settingsService.getRawFormula('hitting');
    this.pitchingFormula = this.settingsService.getRawFormula('pitching');

    this.seasons = this.settingsService.getSeasons();
    this.selectedSeason = this.settingsService.getSelectedSeason();
  }

}
