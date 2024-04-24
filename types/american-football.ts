import { Status, Team, Teams } from "./general";

export interface NFLGames {
  game: NFLGame;
  league: League;
  teams: Teams;
  scores: NFLScores;
}
export interface NFLGame {
  id: number;
  stage: string;
  week: string;
  date: Date;
  venue: Venue;
  status: Status;
}
export interface Date {
  timezone: string;
  date: string;
  time: string;
  timestamp: number;
}
export interface Venue {
  name?: string | null;
  city?: null;
}

export interface League {
  id: number;
  name: string;
  season: string;
  logo: string;
  country: Country;
}
export interface Country {
  name: string;
  code: string;
  flag: string;
}
export interface NFLScores {
  home: HomeOrAway1;
  away: HomeOrAway1;
}
export interface HomeOrAway1 {
  quarter_1?: number | null;
  quarter_2?: number | null;
  quarter_3?: number | null;
  quarter_4?: number | null;
  overtime?: number | null;
  total?: number | null;
}

export interface NFLStandings {
  league: League;
  conference: string;
  division: string;
  position: number;
  team: Team;
  won: number;
  lost: number;
  ties: number;
  stage: string;
  points: { for: number; against: number; difference: number };
  records: {
    home: string;
    road: string;
    conference: string;
    division: string;
  };
  streak: string;
  ncaa_conference: {
    won: number | null;
    lost: number | null;
    points: {
      for: number | null;
      against: number | null;
    };
  };
}

export interface NFLPlayer {
  id: number;
  name: string;
  age: number;
  height: string;
  weight: string;
  college: string;
  group: string;
  position: string;
  number: string;
  salary: string;
  experience: number;
  image: string;
}

export interface NFLEvents {
  quarter: string;
  minute: string;
  team: Team;
  player: {
    id: string;
    name: string;
    image: string | null;
  };
  type: string;
  comment: string;
  score: {
    home: number;
    away: number;
  };
}

export interface NFLTeamsStatisticsResponse {
  team: Team;
  statistics: NFLTeamStatistics;
}

export interface NFLTeamStatistics {
  first_downs: FirstDowns;
  plays: Total;
  yards: Yards;
  passing: Passing;
  rushings: Rushings;
  turnovers: turnovers;
  penalties: Total;
  red_zone: RedZone;
  posession: Total;
  interception: Total;
  fumbles_recovered: Total;
  sacks: Total;
  safeties: Total;
  int_touchdowns: Total;
  points_against: Total;
}

export interface FirstDowns {
  total: number;
  passing: number;
  rushing: number;
  from_penalties: number;
  thrid_down_efficiency: string;
  fourth_down_efficiency: string;
}

export interface Yards {
  total: number;
  yards_per_play: string;
  total_drives: string;
}

export interface Passing {
  total: number;
  comp_att: string;
  yards_per_pass: string;
  interceptions_thrown: number;
  sacks_yards_lost: string;
}
export interface Rushings {
  total: number;
  attempts: string;
  yards_per_rush: string;
}
export interface turnovers {
  total: number;
  lost_fumbles: number;
  interceptions: number;
}

export interface RedZone {
  made_att: string;
}

export interface Total {
  total: string | number;
}
