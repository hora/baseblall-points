import { resolve, VariableLookup } from 'equation-resolver';
import { EquationNode } from 'equation-parser';

import { Stat } from './stats';

interface Abbrs {
  string: string
}

const playerViewerAbbrs: { [index:string]: string } = {
  'KCBM': 'KCBM',
  'CRAB': 'BALC',
  'DALE': 'MIA',
  'CHI': 'CHIF',
  'BOS': 'BOF',
  'FRI': 'HF',
  'SEA': 'SEA',
  'ATL': 'ATL',
  'JAZZ': 'BJAZ',
  'LIFT': 'TKL',
  'LVRS': 'SFL',
  'YELL': 'YELL',
  'CORE': 'CORE',
  'NYM': 'NYMI',
  'CAN': 'CAN',
  'PIES': 'PHIL',
  'CHST': 'CHST',
  'SPY': 'HOU',
  'STK': 'DAL',
  'HELL': 'SUN',
  'TACO': 'LATA',
  'TGRS': 'HAT',
  'CDMX': 'MCWW',
  'OHWO': 'OHWO',
};

const astroAbbrs: { [index:string]: string } = {
  'KCBM': 'kansas-city-breath-mints',
  'CRAB': 'baltimore-crabs',
  'DALE': 'miami-dale',
  'CHI': 'chicago-firefighters',
  'BOS': 'boston-flowers',
  'FRI': 'hawaii-fridays',
  'SEA': 'seattle-garages',
  'ATL': 'atlantis-georgias',
  'JAZZ': 'breckenridge-jazz-hands',
  'LIFT': 'tokyo-lift',
  'LVRS': 'san-francisco-lovers',
  'YELL': 'yellowstone-magic',
  'CORE': 'core-mechanics',
  'NYM': 'new-york-millennials',
  'CAN': 'canada-moist-talkers',
  'PIES': 'philly-pies',
  'CHST': 'charleston-shoe-thieves',
  'SPY': 'houston-spies',
  'STK': 'dallas-steaks',
  'HELL': 'hellmouth-sunbeams',
  'TACO': 'la-unlimited-tacos',
  'TGRS': 'hades-tigers',
  'CDMX': 'mexico-city-wild-wings',
  'OHWO': 'ohio-worms',
};

export class Player {
  public id: number;
  public name: string;
  public stats: { [key: string]: any};
  public team: string;
  public teamAbbr: string;
  public bStars: number;
  public rStars: number;
  public dStars: number;
  public pStars: number;
  public stars: number;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.stats = {};
    this.team = '';
    this.teamAbbr = '';
    this.bStars = 0;
    this.rStars = 0;
    this.dStars = 0;
    this.pStars = 0;
    this.stars = 0;
  }

  setTeam(team: string, teamAbbr: string) {
    this.team = team || 'Null';
    this.teamAbbr = teamAbbr || '';
  }

  setStars(p: { [key: string]: any }) {
    this.bStars = this.setBattingStars(p);
    this.rStars = this.setRunningStars(p);
    this.dStars = this.setDefenseStars(p);
    this.pStars = this.setPitchingStars(p);
    this.stars = this.bStars + this.rStars + this.dStars + this.pStars;

    this.stars = Number(this.stars.toFixed(4));
  }

  setBattingStars(p: { [key: string]: any }): number {
    return 5 *
      Math.pow(1 - p.tragicness, 0.01) *
      //Math.pow(p.buoyancy, 0) *
      Math.pow(p.thwackability, 0.35) *
      Math.pow(p.moxie, 0.075) *
      Math.pow(p.divinity, 0.35) *
      Math.pow(p.musclitude, 0.075) *
      Math.pow(1 - p.patheticism, 0.05) *
      Math.pow(p.martyrdom, 0.02);
  }

  setRunningStars(p: { [key: string]: any }): number {
    return 5 *
      Math.pow(p.laserlikeness, 0.5) *
      Math.pow(p.continuation, 0.1) *
      Math.pow(p.base_thirst, 0.1) *
      Math.pow(p.indulgence, 0.1) *
      Math.pow(p.ground_friction, 0.1);
  }

  setDefenseStars(p: { [key: string]: any }): number {
    return 5 *
      Math.pow(p.omniscience, 0.2) *
      Math.pow(p.tenaciousness, 0.2) *
      Math.pow(p.watchfulness, 0.1) *
      Math.pow(p.anticapitalism, 0.1) *
      Math.pow(p.chasiness, 0.1);
  }

  setPitchingStars(p: { [key: string]: any }): number {
    return 5 *
      Math.pow(p.shakespearianism, 0.1) *
      //Math.pow(p.suppression, 0) *
      Math.pow(p.unthwackability, 0.5) *
      Math.pow(p.coldness, 0.025) *
      Math.pow(p.overpowerment, 0.15) *
      Math.pow(p.ruthlessness, 0.4);
  }

  setStats(stats: {contents: any}) {
    this.stats = stats;
  }

  getStat(stat: any) {
    if (stat === 'runs_scored') {
      stat = 'runs';
    } else if (stat === 'games_played') {
      stat = 'appearances';
    }

    return this.stats[stat];
  }

  getFirst() {
    return this.name.split(' ')[0] || '';
  }

  getLast() {
    return this.name.split(' ')[1] || '';
  }

  getBlaseballLink() {
    return `https://www.blaseball.com/player/${this.id}`;
  }

  getWikiLink() {
    return `https://www.blaseball.wiki/w/${this.getFirst()}_${this.getLast()}`;
  }

  // requires knowing their current team
  getViewerLink() {
    return `https://blaseballplayers.netlify.app/team/${playerViewerAbbrs[this.teamAbbr]}`;
  }

  // requires knowing their current team
  getAstrologyLink() {
    return `https://teagrrl.github.io/astrology/astrology/#${astroAbbrs[this.teamAbbr]}`;
  }

  getChangesLink() {
    let link = `http://yoori.space/hloroscopes/#all-players/${this.getFirst().toLowerCase()}`;

    if (this.getLast()) {
      link += `-${this.getLast().toLowerCase()}`;
    }

    return link;
  }

  getPoints(formula: { [key: string]: any }, stats: Stat[]) : number {
    const statVars: { [key: string]: any } = {};
    let ret: any = 0;

    for (let stat of stats) {
      statVars[stat.labelBrief.toLowerCase()] = {
        type: 'number',
        value: this.getStat(stat.dataField),
      };
    }

    const eq: any = resolve((formula as EquationNode), {
      variables: (statVars as VariableLookup),
    });

    ret = eq.value?.toFixed(2);

    if (ret) {
      ret = Number(ret);
    }

    return ret;
  }

  getPPS(formula: { [key: string]: any }, stats: Stat[]) {
    const points = this.getPoints(formula, stats);
    let pps = points / this.stars;

    return Number(pps.toFixed(2));
  }

}
