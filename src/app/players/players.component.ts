import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as equationParser from 'equation-parser';

import { PlayerService } from '../player.service';
import { SettingsService, Settings } from '../settings.service';
import { Player } from '../player';
import { StatKind, Stat } from '../stats';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.sass']
})
export class PlayersComponent implements OnInit {

  players: Player[] = [];

  hittingStatsInfo: Stat[] = [];
  pitchingStatsInfo: Stat[] = [];

  activeHittingStatsInfo: Stat[] = [];
  activePitchingStatsInfo: Stat[] = [];
  showStatsInfo: Stat[] = [];
  categoryVisible: string = 'hitting';

  parsedBattingFormula: { [key: string]: any } = {};
  parsedPitchingFormula: { [key: string]: any } = {};

  selectedSeason: number = -1;

  sortColumn: string = 'points';
  sortDirection: string = 'desc';

  settingsObservable = new Observable<any>();

  constructor(
    private playerService: PlayerService,
    private settingsService: SettingsService,
  ) {
    this.settingsObservable = this.settingsService.getObservable();

    this.settingsObservable.subscribe((settings: Settings) => {
      console.debug('Players updating settings');

      this.hittingStatsInfo = settings.hittingStatsInfo;
      this.pitchingStatsInfo = settings.pitchingStatsInfo;

      this.activeHittingStatsInfo = settings.activeHittingStatsInfo;
      this.activePitchingStatsInfo = settings.activePitchingStatsInfo;

      this.selectedSeason = settings.selectedSeason;
      this.getPlayers();

      this.parsedBattingFormula = equationParser.parse(settings.battingFormula.toLowerCase());
      console.log('Parsed batting formula:', this.parsedBattingFormula);

      this.parsedPitchingFormula = equationParser.parse(settings.pitchingFormula.toLowerCase());
      console.log('Parsed pitching formula:', this.parsedPitchingFormula);

      this.setShowStatsInfo();

      console.debug('Active hitting stats set', settings.activeHittingStatsInfo);
      console.debug('Active pitching stats set', settings.activePitchingStatsInfo);
    });
  }

  getPlayers(): void {
    this.playerService
    .getPlayers(this.categoryVisible, this.selectedSeason)
      .subscribe((players) => {
        this.onPlayers(players);
      });
  }

  onPlayers(players: Player[]): void {
    console.debug('Loaded Players:', players);
    this.players = players;
    this.sortPlayers();
  }

  setShowStatsInfo() {
    if (this.categoryVisible === 'hitting') {
      this.showStatsInfo = this.activeHittingStatsInfo;
    } else if (this.categoryVisible === 'pitching') {
      this.showStatsInfo = this.activePitchingStatsInfo;
    }
  }

  showStatsFor(category: string) {
    this.categoryVisible = category;
    this.getPlayers();

    this.setShowStatsInfo();
  }

  getFormula(category: string): { [key: string]: any} {
    if (category === 'hitting') {
      return this.parsedBattingFormula;
    } else if (category === 'pitching') {
      return this.parsedPitchingFormula;
    }

    return {};
  }

  getStats(category: string): Stat[] {
    if (category === 'hitting') {
      return this.hittingStatsInfo;
    } else if (category === 'pitching') {
      return this.pitchingStatsInfo;
    }

    return [];
  }

  sortPlayers() {
    this.players.sort((a: Player, b: Player) => {
      let aVal: any = 0;
      let bVal: any = 0;

      switch (this.sortColumn) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;

        case 'points':
          aVal = a.getPoints(this.getFormula(this.categoryVisible),
        this.getStats(this.categoryVisible));
          bVal = b.getPoints(this.getFormula(this.categoryVisible),
        this.getStats(this.categoryVisible));
          break;

        default:
          aVal = a.getStat(this.sortColumn);
          bVal = b.getStat(this.sortColumn);
          break;
      }

      if (aVal < bVal) {
        return (this.sortDirection === 'desc') ? 1 : -1;
      }
      if (aVal > bVal) {
        return (this.sortDirection === 'desc') ? -1 : 1;
      }

      return 0;
    });
  }

  setSortColumn(col: string) {
    if (col === this.sortColumn) {
      if (this.sortDirection === 'desc') {
        this.sortDirection = 'asc';
      } else {
        this.sortDirection = 'desc';
      }
    } else {
      this.sortColumn = col;
      this.sortDirection = 'desc';
    }

    this.sortPlayers();
  }

  ngOnInit() { }

}
