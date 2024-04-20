import { GamesStats, WinOrLose } from "./general";

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
