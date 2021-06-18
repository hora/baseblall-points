import { Component, OnInit } from '@angular/core';

import { PlayerService } from '../player.service';
import { StatsService } from '../stats.service';
import { SettingsService } from '../settings.service';
import { Player } from '../player';
import { StatKind, Stat } from '../stats';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.sass']
})
export class PlayersComponent implements OnInit {

  players: Player[] = [];
  statsInfo: StatKind[] = [];
  hittingStatsInfo: Stat[] = [];
  pitchingStatsInfo: Stat[] = [];
  showStatsInfo: Stat[] = [];
  categoryVisible: string = 'hitting';

  constructor(
    private playerService: PlayerService,
    private statsService: StatsService,
    private settingsService: SettingsService,
  ) { }

  getPlayers(): void {
    this.playerService.getPlayers(this.categoryVisible)
      .subscribe((players) => {
        this.onPlayers(players);
      });
  }

  getActiveStats(): void {
    this.statsInfo = this.settingsService.getActiveStats();
    this.hittingStatsInfo = this.statsInfo[0].stats;
    this.pitchingStatsInfo = this.statsInfo[1].stats;
    this.setShowStatsInfo();
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

  ngOnInit(): void {
    this.getActiveStats();
    this.getPlayers();
  }

}
