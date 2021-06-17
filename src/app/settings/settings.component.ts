import { Component, OnInit } from '@angular/core';
//import { HITTING_STATS, PITCHING_STATS } from '../stats';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {

  //hittingStats = HITTING_STATS;
  //pitchingStats = PITCHING_STATS;

  battingFormula = '(h + r + rbi + sb + bb - so/2) / pa * 10';
  pitchingFormula = '((20*qs + so + 15*sho - 0.5*r - 0.5*bb) / (4*ip)) * 10';
  season = '20';

  constructor() { }

  ngOnInit(): void {
  }

}
