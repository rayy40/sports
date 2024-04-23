import { GamesStats, WinOrLose, Team } from "./general";

export interface Periods {
  first: string | null;
  second: string | null;
  third: string | null;
  overtime: string | null;
  penalties: string | null;
}

export interface HockeyGameStats extends GamesStats {
  win_overtime: WinOrLose;
  lose_overtime: WinOrLose;
}

export interface HockeyEvents {
  game_id: number;
  period: string;
  minute: string;
  team: Team;
  players?: string[] | null;
  assists?: (string | null)[] | null;
  comment?: string | null;
  type: string;
}
