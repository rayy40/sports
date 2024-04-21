import { GamesStats, WinOrLose } from "./general";

export interface RugbyScores {
  home: number | null;
  away: number | null;
}

export interface Periods {
  first: RugbyScores;
  second: RugbyScores;
  overtime: RugbyScores;
  second_overtime: RugbyScores;
}

export interface RugbyGameStats extends GamesStats {
  draw: WinOrLose;
}
