export type Sports = "football";

type StatusType =
  | "Scheduled"
  | "InPlay"
  | "Finished"
  | "Postponed"
  | "Cancelled"
  | "Abandoned"
  | "NotPlayed";

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

export interface Countries {
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
}

export interface FilteredFixtures {
  Scheduled: Fixtures[];
  InPlay: Fixtures[];
  Finished: Fixtures[];
  Postponed: Fixtures[];
  Cancelled: Fixtures[];
  Abandoned: Fixtures[];
  NotPlayed: Fixtures[];
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

export interface AllTeam {
  id: number;
  name: string;
}
