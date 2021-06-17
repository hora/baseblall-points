export class StatKind {
  public kind: string;
  public stats: Stat[];

  constructor(kind: string, stats: Stat[]) {
    this.kind = kind;
    this.stats = stats;
  }

  getKind() {
    return this.kind;
  }

  getStats() {
    return this.stats;
  }
}

export class Stat {
  public id: string;
  public label: string;
  public labelBrief: string;
  public dataField: string;
  public description: string;

  constructor(id: string, label: string, labelBrief: string, dataField: string, description: string) {
    this.id = id;
    this.label = label;
    this.labelBrief = labelBrief;
    this.dataField = dataField;
    this.description = description;
  }

  getLabel() {
    return this.label;
  }

  getLabelBrief() {
    return this.labelBrief;
  }
}

/*
export const HITTING_STATS: Stat[] = [
  { abbr: 'g', full: 'games played', default: 0 },
  { abbr: 'pa', full: 'plate appearances', default: 1},
  { abbr: 'ab', full: 'at bats', default: 0},
  { abbr: 'r', full: 'runs scored', default: 1},
  { abbr: 'h', full: 'hits', default: 1},
  { abbr: '2b', full: 'doubles hit', default: 0},
  { abbr: '3b', full: 'triples hit', default: 0},
  { abbr: '4b', full: 'quadruples hit', default: 0},
  { abbr: 'hr', full: 'home runs', default: 0},
  { abbr: 'rbi', full: 'runs batted in', default: 1},
  { abbr: 'sb', full: 'stolen bases', default: 1},
  { abbr: 'cs', full: 'caught stealing', default: 0},
  { abbr: 'bb', full: 'bases on balls (walks)', default: 1},
  { abbr: 'so', full: 'strikeouts', default: -0.5},
  { abbr: 'ba', full: 'batting average', default: 0},
  { abbr: 'ba/risp', full: 'batting average with runners in scoring position', default: 0},
  { abbr: 'obp', full: 'on-base percentage', default: 0},
  { abbr: 'slg', full: 'slugging percentage', default: 0},
  { abbr: 'ops', full: 'on-base plus slugging percentage', default: 0},
  { abbr: 'tb', full: 'total bases', default: 0},
  { abbr: 'gdp', full: 'double plays grounded into', default: 0},
  { abbr: 'sh', full: 'sacrifice hits (sacrifice bunts)', default: 0},
  { abbr: 'sf', full: 'sacrifice flies', default: 0},
];

export const PITCHING_STATS: Stat[] = [
  { abbr: 'w', full: 'wins', default: 0 },
  { abbr: 'l', full: 'losses', default: 0 },
  { abbr: 'w-l%', full: 'winning percentage', default: 0 },
  { abbr: 'era', full: 'earned run average', default: 0 },
  { abbr: 'g', full: 'games played', default: 0 },
  { abbr: 'sho', full: 'shutouts', default: 0 },
  { abbr: 'ip', full: 'innings pitched', default: 0 },
  { abbr: 'h', full: 'hits allowed', default: 0 },
  { abbr: 'r', full: 'earned runs', default: 0 },
  { abbr: 'hr', full: 'home runs', default: 0 },
  { abbr: 'bb', full: 'bases on balls (walks)', default: 0 },
  { abbr: 'so', full: 'strikeouts', default: 0 },
  { abbr: 'qs', full: 'quality starts', default: 0 },
  { abbr: 'bf', full: 'batters faced', default: 0 },
  { abbr: 'whip', full: 'walks and hits per inning pitched', default: 0 },
  { abbr: 'h9', full: 'hits per 9 innings', default: 0 },
  { abbr: 'hr9', full: 'home runs per 9 innings', default: 0 },
  { abbr: 'bb9', full: 'walks per 9 innings', default: 0 },
  { abbr: 'so9', full: 'strikeouts per 9 innings', default: 0 },
];
*/
