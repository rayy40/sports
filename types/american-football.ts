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
