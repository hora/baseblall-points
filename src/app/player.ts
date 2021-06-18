import { resolve, VariableLookup } from 'equation-resolver';
import { EquationNode } from 'equation-parser';

import { Stat } from './stats';

export class Player {
  public id: number;
  public name: string;
  public stats: { [key: string]: any};

  constructor(id: number, name: string, stats: {contents: any}) {
    this.id = id;
    this.name = name;
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
    return '#';
  }

  // requires knowing their current team
  getAstrologyLink() {
    return '#';
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

}
