export interface APIBaseResponse {
  get: string;
  parameters: Parameters;
  errors?: null[] | null;
  results: number;
}
export type NBALeagues =
  | "Africa"
  | "Orlando"
  | "Sacramento"
  | "Standard"
  | "Utah"
  | "Vegas";

export interface APIResponse<T> extends APIBaseResponse {
  response?: T[] | null;
}

export interface APINonArrayResponse<T> extends APIBaseResponse {
  response?: T | null;
}

export interface Parameters {
  [key: string]: string;
}
export interface Games {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  stage: null;
  week: null;
  status: Status;
  league: League;
  country: Country;
  teams: Teams;
  scores: Scores;
}
export interface NBAGames {
  id: number;
  league: string;
  season: number;
  date: NBADate;
  stage: number;
  status: NBAStatus;
  status: NBAPeriods;
  arena: NBAArena;
  teams: NBATeams;
  scores: NBAScores;
  officials: string[];
  timesTied: number;
  leadChanges: number;
  nugget: null;
}
export interface Status {
  long: string;
  short: string;
  timer: number | null;
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
export interface League<T = string> {
  id: number;
  name: string;
  type: string;
  seasons: T;
  logo: string | null;
}
export interface Country {
  id: number;
  name: string;
  code: string;
  flag: string;
}
export interface Team {
  id: number;
  name: string;
  logo?: string;
}
export interface TeamResponse extends Team {
  national: boolean;
  country: Country;
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
export interface Teams {
  home: HomeOrAway;
  away: HomeOrAway;
}
export interface NBATeams {
  home: HomeOrVisitors;
  visitors: HomeOrVisitors;
}
export interface HomeOrAway {
  id: number;
  name: string;
  logo: string | null;
}
export interface HomeOrVisitors {
  id: number;
  name: string;
  nickname: string;
  code: string;
  logo: string;
}
export interface Scores {
  home: HomeOrAway1;
  away: HomeOrAway1;
}
export interface NBAScores {
  home: HomeOrVisitors1;
  visitors: HomeOrVisitors1;
}
export interface HomeOrAway1 {
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

export interface Seasons {
  season: string;
  start: string;
  end: string;
}

export interface Standings {
  position: number;
  stage: string;
  group: Group;
  team: Team;
  league: League;
  country: Country;
  games: Games;
  points: Points;
  form: string;
  description?: null;
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
export interface Group {
  name: string;
  points?: null;
}
export interface Games {
  played: number;
  win: WinOrLose;
  lose: WinOrLose;
}
export interface WinOrLose {
  total: number;
  percentage: string;
}
export interface Points {
  for: number;
  against: number;
}

export interface TeamStatistics {
  league: League;
  country: Country;
  team: Team;
  games: TeamGamesStatistics;
  points: {
    for: PointsStatistics;
    against: PointsStatistics;
  };
}

export interface TeamGamesStatistics {
  played: HomeOrAwayOrAllStats1;
  wins: WinOrDrawOrLosesStats;
  draws: WinOrDrawOrLosesStats;
  loses: WinOrDrawOrLosesStats;
}

export interface WinOrDrawOrLosesStats {
  home: HomeOrAwayOrAllStats;
  away: HomeOrAwayOrAllStats;
  all: HomeOrAwayOrAllStats;
}

export interface HomeOrAwayOrAllStats {
  total: number;
  percentage: string;
}

export interface PointsStatistics {
  total: HomeOrAwayOrAllStats1;
  average: HomeOrAwayOrAllStats1;
}

export interface HomeOrAwayOrAllStats1 {
  home: number;
  away: number;
  all: number;
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
