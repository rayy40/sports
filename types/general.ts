import { RugbyGameStats, Periods as RugbyPeriods } from "./rugby";
import { HockeyGameStats, Periods as HockeyPeriods } from "./hockey";
import {
  DetailedFixture,
  Fixtures,
  TeamStatistics as FootballTeamStatistics,
  SeasonsEntity,
  Squads,
  StandingsEntity,
} from "./football";
import {
  BasketballScores,
  NBAGames,
  NBAPlayer,
  NBAStandings,
  NBAStatistics,
} from "./basketball";
import { BaseballScores } from "./baseball";
import {
  AustralianFootballGames,
  AustralianFootballStandings,
  AustralianFootballTeamStatisticsResponse,
  TotalOrAverageStats,
} from "./australian-football";
import { NFLGames, NFLPlayer, NFLStandings } from "./american-football";
import { Table } from "@tanstack/react-table";

export type SportScores = BasketballScores | BaseballScores;

export type Sports =
  | "basketball"
  | "baseball"
  | "football"
  | "rugby"
  | "hockey"
  | "australian-football"
  | "american-football";

export type ButtonVariants =
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | null
  | undefined;

export type StatusType =
  | "scheduled"
  | "inplay"
  | "finished"
  | "postponed"
  | "cancelled"
  | "abandoned"
  | "notplayed"
  | "allgames";

export interface ShortStatusMap {
  scheduled: string[];
  inplay: string[];
  finished: string[];
  postponed: string[];
  cancelled: string[];
  abandoned: string[];
  notplayed: string[];
  allgames: string[];
}

export interface Filters {
  id: number | string;
  name: string;
}

export type Tabs<T> = {
  label: string;
  status: T;
};

export type DetailedTabsType = "Fixtures" | "Standings" | "Stats" | "Squads";

export type FixtureTabsType =
  | "Play By Play"
  | "Match Stats"
  | "Lineups"
  | "Head to Head";

export interface APIBaseResponse {
  get: string;
  parameters: Parameters;
  errors?: string | null;
  results: number;
}

export interface APIResponse<T> extends APIBaseResponse {
  response?: T[] | null;
}

export interface APINonArrayResponse<T> extends APIBaseResponse {
  response?: T | null;
}

export interface Parameters {
  [key: string]: string;
}

export interface Games<T> {
  id: number;
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  stage?: string | null;
  week: string | null;
  status: Status;
  league: League;
  country: Country;
  teams: Teams;
  scores: Scores<T>;
}

export interface GamesWithPeriods<T> extends Games<T> {
  periods: RugbyPeriods;
}

export interface GamesWithPeriodsAndEvents<T> extends Games<T> {
  timer?: string | null;
  periods: HockeyPeriods;
  events: boolean;
}

export interface Status {
  long: string;
  short: string;
  timer?: number | null;
}

export interface League<T = string | number> {
  id: number;
  name: string;
  type: string;
  seasons?: T;
  season?: T;
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

export interface Teams {
  home: Team;
  away: Team;
}

export interface Scores<T> {
  home: T;
  away: T;
}

export interface Seasons {
  season: string;
  start: string;
  end: string;
}

export interface Standings<T = GamesStats> {
  position: number;
  stage: string;
  group: Group;
  team: Team;
  league: League;
  country: Country;
  games: T;
  points: Points | number;
  goals?: { for: number; against: number };
  form: string | null;
  description: string | null;
}

export interface Group {
  name: string;
  points?: null;
}

export interface GamesStats {
  played: number;
  win: WinOrLose;
  lose: WinOrLose;
}
export interface WinOrLose {
  total: number | null;
  percentage: string | null;
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
  goals?: {
    for: PointsStatistics;
    against: PointsStatistics;
  };
  points?: {
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
  total: number | null;
  percentage: string | null;
}

export interface PointsStatistics {
  total: HomeOrAwayOrAllStats1;
  average: HomeOrAwayOrAllStats1;
}

export interface HomeOrAwayOrAllStats1 {
  home: number | null;
  away: number | null;
  all: number | null;
}

export interface Player {
  id: number;
  name: string;
}

export type AllSportsFixtures =
  | Games<SportScores>
  | Fixtures
  | NBAGames
  | GamesWithPeriodsAndEvents<number | null>
  | GamesWithPeriods<number | null>
  | AustralianFootballGames
  | NFLGames;

export type AllSportsTeamStats =
  | TeamStatistics
  | NBAStatistics
  | AustralianFootballTeamStatisticsResponse<TotalOrAverageStats>
  | FootballTeamStatistics;

export type AllSportsStandings =
  | NBAStandings
  | StandingsEntity
  | AustralianFootballStandings
  | NFLStandings
  | Standings<HockeyGameStats | RugbyGameStats | GamesStats>;

export type WithoutStandingEntity = Exclude<
  AllSportsStandings,
  StandingsEntity
>;

export type AllSportsPlayesr = NFLPlayer | NBAPlayer | Squads | Player;

export function isFootballFixture(item: AllSportsFixtures): item is Fixtures {
  return "goals" in item;
}

export function isFootballDetailedFixture(item: any): item is DetailedFixture {
  return "fixture" in item && "goals" in item && "lineups" in item;
}

export function isBaseballFixture(item: any): item is Games<BaseballScores> {
  return (
    typeof item.scores === "object" &&
    "home" in item.scores &&
    typeof item.scores.home === "object" &&
    "innings" in item.scores.home
  );
}

export function isBasketballFixture(
  item: any
): item is Games<BasketballScores> {
  return (
    "scores" in item &&
    typeof item.scores === "object" &&
    "home" in item.scores &&
    typeof item.scores.home === "object" &&
    "quarter_1" in item.scores.home &&
    "over_time" in item.scores.home
  );
}

export function isHockeyFixture(
  item: any
): item is GamesWithPeriodsAndEvents<number | null> {
  return (
    "periods" in item &&
    typeof item.periods === "object" &&
    "first" in item.periods &&
    "penalties" in item.periods &&
    "overtime" in item.periods &&
    !("second_overtime" in item.periods)
  );
}

export function isRugbyFixture(
  item: any
): item is GamesWithPeriods<number | null> {
  return (
    "periods" in item &&
    typeof item.periods === "object" &&
    "first" in item.periods &&
    "overtime" in item.periods &&
    "second_overtime" in item.periods
  );
}

export function isNBAFixture(item: AllSportsFixtures): item is NBAGames {
  return typeof item.league === "string";
}

export function isAFLFixture(
  item: AllSportsFixtures
): item is AustralianFootballGames {
  return "game" in item && "id" in item.game && !("country" in item.league);
}

export function isNFLFixture(item: any): item is NFLGames {
  return (
    "game" in item &&
    typeof item.league === "object" &&
    "country" in item.league &&
    typeof item.scores === "object" &&
    "home" in item.scores &&
    typeof item.scores.home === "object" &&
    "quarter_1" in item.scores.home &&
    "total" in item.scores.home
  );
}

export function isFootballTeamStats(
  item: AllSportsTeamStats
): item is FootballTeamStatistics {
  return "cards" in item;
}

export function isNBATeamStats(
  item: AllSportsTeamStats
): item is NBAStatistics {
  return "fgm" in item && "fga" in item && "fgp" in item;
}

export function isAFLTeamStats(
  item: AllSportsTeamStats
): item is AustralianFootballTeamStatisticsResponse<TotalOrAverageStats> {
  return "statistics" in item && "disposals" in item.statistics;
}

export function isAPIError(item: any): item is string {
  return typeof item === "string";
}

export function isSeasons(
  item: (Seasons | SeasonsEntity)[] | (number | string)[]
): item is (Seasons | SeasonsEntity)[] {
  return Array.isArray(item) && item.length > 0 && typeof item[0] !== "number";
}

export type FilterWrappers = {
  sport: Sports;
  tab?: DetailedTabsType;
  tabs?: Tabs<DetailedTabsType>[];
  table?: Table<AllSportsFixtures> | undefined;
  teams?: Filters[];
  leagues?: Filters[];
  setTeam?: (team: string | null) => void;
  setLeague?: (league: string | null) => void;
  setLeagueForTeam?: (league: string | null) => void;
  setStat?: (stat: string | null) => void;
  isHome: boolean;
  isTeam: boolean;
  isLeague: boolean;
};
