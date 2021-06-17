import { Component, OnInit } from '@angular/core';

import { PlayerService } from '../player.service';
import { StatsService } from '../stats.service';
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
  ) { }

  getPlayers(): void {
    this.playerService.getPlayers(this.categoryVisible)
      .subscribe((players) => {
        this.onPlayers(players);
      });
  }

  getStatsInfo(): void {
    this.statsService.getStatsInfo().subscribe((statsInfo) => {
      this.onStatsInfo(statsInfo);
    });
  }

  onPlayers(players: Player[]): void {
    console.debug('Loaded Players:', players);
    this.players = players;
  }

  onStatsInfo(statsInfo: StatKind[]): void {
    console.debug('Loaded StatsInfo:', statsInfo);
    this.statsInfo = statsInfo;
    this.hittingStatsInfo = statsInfo[0].stats;
    this.pitchingStatsInfo = statsInfo[1].stats;
    this.setShowStatsInfo();
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
    this.getStatsInfo();
    this.getPlayers();
  }

}
