export type NBALeagues =
  | "Africa"
  | "Orlando"
  | "Sacramento"
  | "Standard"
  | "Utah"
  | "Vegas";

export interface NBAGames {
  id: number;
  league: string;
  season: number;
  date: NBADate;
  stage: number;
  status: NBAStatus;
  periods: NBAPeriods;
  arena: NBAArena;
  teams: NBATeams;
  scores: NBAScores;
  officials: string[];
  timesTied: number;
  leadChanges: number;
  nugget: null;
}

export interface NBADate {
  start: string;
  end: string;
  duration: string | null;
}
export interface NBAStatus {
  clock: string | null;
  halftime: boolean;
  short: number;
  long: string;
}
export interface NBAPeriods {
  current: number;
  total: number;
  endOfPeriod: boolean;
}
export interface NBAArena {
  name: string;
  city: string;
  state: string;
  country: string;
}

export interface NBATeamresponse extends HomeOrVisitors {
  city: string;
  allStar: boolean;
  nbaFranchise: boolean;
  leagues: {
    [key: string]: {
      conference: string;
      division: string;
    };
  };
}

export interface NBATeams {
  home: HomeOrVisitors;
  visitors: HomeOrVisitors;
}

export interface HomeOrVisitors {
  id: number;
  name: string;
  nickname: string;
  code: string;
  logo: string;
}

export interface NBAScores {
  home: HomeOrVisitors1;
  visitors: HomeOrVisitors1;
}
export interface BasketballScores {
  quarter_1: number;
  quarter_2: number;
  quarter_3: number;
  quarter_4: number;
  over_time: null | number;
  total: number;
}
export interface HomeOrVisitors1 {
  win: number;
  loss: number;
  series: {
    win: number;
    loss: number;
  };
  linescore: string[];
  points: number;
}

export interface NBAStandings {
  league: NBALeagues;
  season: number;
  team: HomeOrVisitors;
  conference: NBAConference;
  division: NBAConference & { gamesBehind: string };
  win: NBAStandingsWinOrLoss;
  loss: NBAStandingsWinOrLoss;
  gamesBehind: string;
  streak: number;
  winStreak: boolean;
  tieBreakerPoints: string | null;
}
export interface NBAConference {
  name: string;
  rank: number;
  win: number;
  loss: number;
}
export interface NBAStandingsWinOrLoss {
  home: number;
  away: number;
  total: number;
  percentage: string;
  lastTen: number;
}

export interface NBATeamStatistics {
  team: NBATeams;
  statistics: NBAStatistics;
}

export interface NBAStatistics {
  fastBreakPoints: number;
  pointsInPaint: number;
  biggestLead: number;
  secondChancePoints: number;
  pointsOffTurnovers: number;
  longestRun: number;
  points: number;
  fgm: number;
  fga: number;
  fgp: string;
  ftm: number;
  fta: number;
  ftp: string;
  tpm: number;
  tpa: number;
  tpp: string;
  offReb: number;
  defReb: number;
  totReb: number;
  assists: number;
  pFouls: number;
  steals: number;
  turnovers: number;
  blocks: number;
  plusMinus: string;
  min: string;
}

export interface NBAPlayer {
  id: number;
  firstName: string;
  lastName: string;
  birth: {
    date: string;
    country: string;
  };
  nba: {
    start: number;
    pro: number | null;
  };
  height: {
    feets: string;
    inches: string;
    meters: string;
  };
  weight: {
    pounds: string;
    kilograms: string;
  };
  college: string | null;
  affiliation: string | null;
  leagues: {
    standard: {
      jersey: number;
      active: boolean;
      pos: string;
    };
  };
}
