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

export interface AustralianFootballTeamStatistics {
  team: {
    id: number;
  };
  statistics: AustralianFootballStatistics;
}

export interface AustralianFootballStatistics {
  games: {
    played: number;
  };
  disposals: {
    disposals: TotalOrAverageStats;
    kicks: TotalOrAverageStats;
    handballs: TotalOrAverageStats;
    free_kicks: TotalOrAverageStats;
  };
  stoppages: {
    hitouts: TotalOrAverageStats;
    clearances: TotalOrAverageStats;
  };
  marks: TotalOrAverageStats;
  scoring: {
    goals: TotalOrAverageStats;
    assists: TotalOrAverageStats;
    behinds: TotalOrAverageStats;
  };
  defence: {
    tackles: TotalOrAverageStats;
  };
}

export interface TotalOrAverageStats {
  total: number | null;
  average: string | null;
}
