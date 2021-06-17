import { Component, OnInit } from '@angular/core';
//import { HITTING_STATS, PITCHING_STATS } from '../stats';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {

  battingFormula = '(H + R + RBI + SB + BB - SO/2) / PA * 10';
  pitchingFormula = '((20*QS + SO + 15*SHO - 0.5*R - 0.5*BB) / (4*IP)) * 10';
  seasons: number[] = [];
  selectedSeason = 20;

  constructor() { }

  getSeasons() {
    const min = 1;
    const max = 19;

    for (let i = min; i <= max; i++) {
      this.seasons.push(i + 1);
    }
  }

  ngOnInit(): void {
    this.getSeasons();
  }

}
