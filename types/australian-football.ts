import { NFLEvents } from "./american-football";
import { Status, Team, Teams } from "./general";

export interface AustralianFootballScores {
  score: number | null;
  goals: number | null;
  behinds: number | null;
  psgoals: number | null;
  psbehinds: number | null;
}

export interface AustralianFootballGames {
  game: { id: number };
  league: {
    id: number;
    season: number;
  };
  date: string;
  time: string;
  timestamp: number;
  timezone: string;
  round: string | null;
  week: number | null;
  status: Status;
  teams: Teams;
  scores: {
    home: AustralianFootballScores;
    away: AustralianFootballScores;
  };
}

export interface AustralianFootballLeagueOrTeamInfo {
  id: number;
  name: string;
  logo: string | null;
  season: number;
  start: string | null;
  end: string | null;
  current: boolean;
}

export interface AustralianFootballStandings {
  position: number;
  stage: string;
  team: Team;
  pts: number | null;
  games: {
    played: number | null;
    win: number | null;
    drawn: number | null;
    lost: number | null;
  };
  points: { for: number; against: number };
  last_5: string | null;
}

export interface AustralianFootballFixtureStatisticsResponse<
  T extends TotalOrAverageStats | number
> {
  game: {
    id: number;
  };
  teams: AustralianFootballFixtureStatistics<T>[];
}

export interface AustralianFootballFixtureStatistics<
  T extends TotalOrAverageStats | number
> {
  team: {
    id: number;
  };
  statistics: AustralianFootballStatistics<T>;
}

export interface AustralianFootballTeamStatisticsResponse<
  T extends TotalOrAverageStats | number
> {
  team: {
    id: number;
  };
  statistics: AustralianFootballStatistics<T> & { games: { played: number } };
}
export interface AustralianFootballStatistics<
  T extends TotalOrAverageStats | number
> {
  disposals: {
    disposals: T;
    kicks: T;
    handballs: T;
    free_kicks: T;
  };
  stoppages: {
    hitouts: T;
    clearances: T;
  };
  marks: T;
  scoring: {
    goals: T;
    assists: T;
    behinds: T;
  };
  defence: {
    tackles: T;
  };
}

export interface TotalOrAverageStats {
  total: number | null;
  average: string | null;
}

export interface AustralianFootballEvents {
  game: { id: number };
  events: NFLEvents;
}
