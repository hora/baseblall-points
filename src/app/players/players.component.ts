import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

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
  showStatsInfo: Stat[] = [];
  selectedSeason: number = -1;
  categoryVisible: string = 'hitting';
  settingsObservable = new Observable<any>();

  constructor(
    private playerService: PlayerService,
    private settingsService: SettingsService,
  ) {
    this.settingsObservable = this.settingsService.getObservable();

    this.settingsObservable.subscribe((settings: Settings) => {
      console.debug('Players updating settings');

      this.hittingStatsInfo = settings.activeHittingStatsInfo;
      this.pitchingStatsInfo = settings.activePitchingStatsInfo;
      this.selectedSeason = settings.selectedSeason;
      this.getPlayers();
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
  }

  setShowStatsInfo() {
    if (this.categoryVisible === 'hitting') {
      this.showStatsInfo = this.hittingStatsInfo;
    } else if (this.categoryVisible === 'pitching') {
      this.showStatsInfo = this.pitchingStatsInfo;
    }
  }

  showStatsFor(category: string) {
    this.categoryVisible = category;
    this.getPlayers();

    this.setShowStatsInfo();
  }

  async ngOnInit() { }

}
