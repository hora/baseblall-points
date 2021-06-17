import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

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

  constructor(
    private playerService: PlayerService,
    private statsService: StatsService,
    private changeDetection: ChangeDetectorRef,
  ) { }

  getPlayers(): void {
    this.playerService.getPlayers()
      .subscribe(players => this.players = players);
  }

  getStatsInfo(): void {
    this.statsService.getStatsInfo().subscribe((statsInfo) => {
      this.onStatsInfo(statsInfo);
    });
  }

  onStatsInfo(statsInfo: StatKind[]): void {
    console.debug('Loaded StatsInfo:', statsInfo);
    this.statsInfo = statsInfo;
    this.hittingStatsInfo = statsInfo[0].stats;
    this.pitchingStatsInfo = statsInfo[1].stats;
    //this.changeDetection.detectChanges();
  }

  ngOnInit(): void {
    this.getStatsInfo();
    this.getPlayers();
  }

}
