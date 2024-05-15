import { Country } from "./general";

export interface Fixtures {
  fixture: Fixture;
  league: League;
  teams: Teams;
  goals: HalftimeOrFulltimeOrExtratimeOrPenalty;
  score: Score;
}
export interface Fixture {
  id: number;
  referee?: null;
  timezone: string;
  date: string;
  timestamp: number;
  periods: Periods;
  venue: FixtureVenue;
  status: Status;
}
export interface Periods {
  first: number | null;
  second?: number | null;
}
export interface FixtureVenue {
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
export interface Score {
  halftime: HalftimeOrFulltimeOrExtratimeOrPenalty;
  fulltime: HalftimeOrFulltimeOrExtratimeOrPenalty;
  extratime: HalftimeOrFulltimeOrExtratimeOrPenalty;
  penalty: HalftimeOrFulltimeOrExtratimeOrPenalty;
}
export interface HalftimeOrFulltimeOrExtratimeOrPenalty {
  home?: number | null;
  away?: number | null;
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
  statistics?: PlayerStatistics[] | null;
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
export interface PlayerStatistics {
  team?: Team;
  league?: League;
  games: Games;
  offsides: number | null;
  substitutes?: Substitutes;
  shots: Shots;
  goals: FixtureGoals;
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
  appearences?: number | null;
  lineups?: string | null;
  minutes: number | null;
  number: number | null;
  position: string | null;
  rating: string | null;
  captain: boolean | null;
  substitute: boolean | null;
}
export interface Substitutes {
  in: number;
  out: number;
  bench: number;
}
export interface Shots {
  total: number | null;
  on: number | null;
}
export interface FixtureGoals {
  total: number | null;
  conceded: number | null;
  assists: number | null;
  saves: number | null;
}
export interface Passes {
  total: number | null;
  key: number | null;
  accuracy: string | null;
}
export interface Tackles {
  total: number | null;
  blocks: number | null;
  interceptions: number | null;
}
export interface Duels {
  total: number | null;
  won: number | null;
}
export interface Dribbles {
  attempts: number | null;
  success: number | null;
  past: number | null;
}
export interface Fouls {
  drawn: number | null;
  committed: number | null;
}
export interface Cards {
  yellow: number | null;
  yellowred?: number | null;
  red: number | null;
}
export interface Penalty {
  won: number | null;
  commited: number | null;
  scored: number | null;
  missed: number | null;
  saved: number | null;
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

export interface TeamStatistics {
  league: League;
  team: Team;
  form: string;
  fixtures: FixturesStats;
  goals: GoalsStats;
  biggest: Biggest;
  clean_sheet: HomeOrAwayOrTotalStats;
  failed_to_score: HomeOrAwayOrTotalStats;
  penalty: PenaltyStats;
  lineups: Lineups[];
  cards: CardsStats;
}

export interface FixturesStats {
  played: HomeOrAwayOrTotalStats;
  wins: HomeOrAwayOrTotalStats;
  draws: HomeOrAwayOrTotalStats;
  loses: HomeOrAwayOrTotalStats;
}
export interface HomeOrAwayOrTotalStats {
  home: number;
  away: number;
  total: number;
}
export interface GoalsStats {
  for: ForOrAgainst;
  against: ForOrAgainst;
}
export interface ForOrAgainst {
  total: HomeOrAwayOrTotalStats;
  average: Average;
  minute: Minutes;
}
export interface Average {
  home: string;
  away: string;
  total: string;
}
export interface Biggest {
  streak: Streak;
  wins: WinsOrLoses;
  loses: WinsOrLoses;
  goals: AchievementGoals;
}
export interface Streak {
  wins: number;
  draws: number;
  loses: number;
}
export interface WinsOrLoses {
  home: string;
  away: string;
}
export interface AchievementGoals {
  for: GoalsForOrAgainst;
  against: GoalsForOrAgainst;
}
export interface GoalsForOrAgainst {
  home: number;
  away: number;
}

export interface TotalOrPercentageStats {
  total: number | null;
  percentage: string | null;
}
export interface PenaltyStats {
  total: number;
  scored: TotalOrPercentageStats;
  missed: TotalOrPercentageStats;
}
export interface Lineups {
  formation: string;
  played: number;
}
export interface CardsStats {
  yellow: Minutes;
  red: Minutes;
}
export interface Minutes {
  "0-15": TotalOrPercentageStats;
  "16-30": TotalOrPercentageStats;
  "31-45": TotalOrPercentageStats;
  "46-60": TotalOrPercentageStats;
  "61-75": TotalOrPercentageStats;
  "76-90": TotalOrPercentageStats;
  "91-105": TotalOrPercentageStats;
  "106-120": TotalOrPercentageStats;
}

export interface TeamResponse {
  venue: Venue;
  team: TeamInfo;
}

export interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  capacity: number;
  surface: string;
  image: string;
}

export interface TeamInfo {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
}

export interface FixtureStatisticsResponse {
  team: Team;
  statistics?: FixtureStatistics[] | null;
}
export interface FixtureStatistics {
  type: string;
  value?: number | string | null;
}

export interface FixtureLineups {
  team: Team & { colors: Colors };
  coach: Coach;
  formation: string;
  startXI?: LineupEntity[] | null;
  substitutes?: LineupEntity[] | null;
}
export interface Colors {
  player: PlayerOrGoalkeeper;
  goalkeeper: PlayerOrGoalkeeper;
}
export interface PlayerOrGoalkeeper {
  primary: string;
  number: string;
  border: string;
}
export interface Coach {
  id: number;
  name: string;
  photo: string;
}
export interface LineupEntity {
  player: LineupPlayer;
}
export interface LineupPlayer {
  id: number;
  name: string;
  number: number;
  pos: string;
  grid: string | null;
}

export interface Timeline {
  time: Time;
  team: Team;
  player: PlayerOrAssist;
  assist: PlayerOrAssist;
  type: string;
  detail: string;
  comments?: string | null;
}
export interface Time {
  elapsed: number;
  extra?: null;
}
export interface PlayerOrAssist {
  id: number | null;
  name: string | null;
}

export interface PlayerStatisticsEntity {
  player: {
    id: number;
    name: string;
    photo: string | null;
  };
  statistics?: PlayerStatistics[] | null;
}

export interface DetailedFixture extends Fixtures {
  statistics: FixtureStatisticsResponse[];
  lineups: FixtureLineups[];
  events: Timeline[];
  players: {
    team: Team & { update: string | null };
    players: PlayerStatisticsEntity[] | null;
  }[];
}
