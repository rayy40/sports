export type Sports = "football";

type StatusType =
  | "Scheduled"
  | "InPlay"
  | "Finished"
  | "Postponed"
  | "Cancelled"
  | "Abandoned"
  | "NotPlayed"
  | "AllGames";

export type TableFixtures = {
  date: number;
  teams: Teams;
  score: HalftimeOrGoals;
};

export type Tabs = {
  label: string;
  status: StatusType;
};

export type FetchState<T> = {
  loading: boolean;
  data: T[] | null;
  error: Error | null;
};

export interface Parameters {
  [key: string]: string;
}
export interface Paging {
  current: number;
  total: number;
}

export interface APIResponse<T> {
  get: string;
  parameters: Parameters;
  errors?: null[] | null;
  results: number;
  paging: Paging;
  response?: T[] | null;
}

export interface Country {
  name: string;
  code: string;
  flag: string;
}

export interface ShortStatusMap {
  Scheduled: string[];
  InPlay: string[];
  Finished: string[];
  Postponed: string[];
  Cancelled: string[];
  Abandoned: string[];
  NotPlayed: string[];
  AllGames: string[];
}

export interface FilteredFixtures {
  Scheduled: Fixtures[];
  InPlay: Fixtures[];
  Finished: Fixtures[];
  Postponed: Fixtures[];
  Cancelled: Fixtures[];
  Abandoned: Fixtures[];
  NotPlayed: Fixtures[];
  AllGames: Fixtures[];
}

export interface Fixtures {
  fixture: Fixture;
  league: League;
  teams: Teams;
  goals: HalftimeOrGoals;
  score: Score;
}
export interface Fixture {
  id: number;
  referee?: null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: Periods;
  venue: Venue;
  status: Status;
}
export interface Periods {
  first: number;
  second?: null;
}
export interface Venue {
  id: number;
  name: string;
  city: string;
}
export interface Status {
  long: string;
  short: string;
  elapsed: number;
}
export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round: string;
}
export interface Teams {
  home: HomeOrAway;
  away: HomeOrAway;
}
export interface HomeOrAway {
  id: number;
  name: string;
  logo: string;
  winner: boolean;
}
export interface HalftimeOrGoals {
  home: number;
  away: number;
}
export interface Score {
  halftime: HalftimeOrGoals;
  fulltime: FulltimeOrExtratimeOrPenalty;
  extratime: FulltimeOrExtratimeOrPenalty;
  penalty: FulltimeOrExtratimeOrPenalty;
}
export interface FulltimeOrExtratimeOrPenalty {
  home?: null;
  away?: null;
}

export interface AllTeamOrAllLeague {
  id: number;
  name: string;
}
export interface Leagues {
  league: League;
  country: Country;
  seasons?: SeasonsEntity[] | null;
}
export interface SeasonsEntity {
  year: number;
  start: string;
  end: string;
  current: boolean;
  coverage: Coverage;
}
export interface Coverage {
  fixtures: LeagueFixtures;
  standings: boolean;
  players: boolean;
  top_scorers: boolean;
  top_assists: boolean;
  top_cards: boolean;
  injuries: boolean;
  predictions: boolean;
  odds: boolean;
}
export interface LeagueFixtures {
  events: boolean;
  lineups: boolean;
  statistics_fixtures: boolean;
  statistics_players: boolean;
}
