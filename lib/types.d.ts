export type Sports = "football";

type ButtonVariants =
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | null
  | undefined;

type StatusType =
  | "Scheduled"
  | "InPlay"
  | "Finished"
  | "Postponed"
  | "Cancelled"
  | "Abandoned"
  | "NotPlayed"
  | "AllGames";

type DetailedTabsType = "Fixtures" | "Standings" | "Stats" | "Squads";

export type TableFixtures = {
  date: number;
  teams: Teams;
  score: HalftimeOrGoals;
};

export type Tabs<T> = {
  label: string;
  status: T;
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

export type Seasons = number;

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

export interface Filters {
  id: number | string;
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

export interface StandingsReponse {
  league: StandingsType;
}

export interface StandingsType {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  standings?: (StandingsEntity[] | null)[] | null;
}
export interface StandingsEntity {
  rank: number;
  team: Team;
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string;
  all: AllOrHomeOrAway;
  home: AllOrHomeOrAway;
  away: AllOrHomeOrAway;
  update: string;
}
export interface Team {
  id: number;
  name: string;
  logo: string;
}
export interface AllOrHomeOrAway {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: Goals;
}
export interface Goals {
  for: number;
  against: number;
}

export interface DetailedLeagueState {
  detailedLeague: Leagues | null;
  setDetailedLeague: (league: Leagues) => void;
}

export interface PlayerStats {
  player: Player;
  statistics?: Statistics[] | null;
}
export interface Player {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  birth: Birth;
  nationality: string;
  height: string;
  weight: string;
  injured: boolean;
  photo: string;
}
export interface Birth {
  date: string;
  place: string;
  country: string;
}
export interface Statistics {
  team: Team;
  league: League;
  games: Games;
  substitutes: Substitutes;
  shots: Shots;
  goals: Goals;
  passes: Passes;
  tackles: Tackles;
  duels: Duels;
  dribbles: Dribbles;
  fouls: Fouls;
  cards: Cards;
  penalty: Penalty;
}
export interface Team {
  id: number;
  name: string;
  logo: string;
}
export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
}
export interface Games {
  appearences: number;
  lineups: number;
  minutes: number;
  number?: null;
  position: string;
  rating: string;
  captain: boolean;
}
export interface Substitutes {
  in: number;
  out: number;
  bench: number;
}
export interface Shots {
  total: number;
  on: number;
}
export interface Goals {
  total: number;
  conceded?: null;
  assists: number;
  saves: number;
}
export interface Passes {
  total: number;
  key: number;
  accuracy: number;
}
export interface Tackles {
  total: number;
  blocks: number;
  interceptions: number;
}
export interface Duels {
  total: number;
  won: number;
}
export interface Dribbles {
  attempts: number;
  success: number;
  past?: null;
}
export interface Fouls {
  drawn: number;
  committed: number;
}
export interface Cards {
  yellow: number;
  yellowred: number;
  red: number;
}
export interface Penalty {
  won: number;
  commited?: null;
  scored: number;
  missed: number;
  saved?: null;
}

export interface Squads {
  team: Team;
  players?: PlayersEntity[] | null;
}
export interface PlayersEntity {
  id: number;
  name: string;
  age: number;
  number?: number | null;
  position: string;
  photo: string;
}
