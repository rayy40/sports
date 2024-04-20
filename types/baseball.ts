export interface BaseballScores {
  hits: number;
  errors: number;
  innings: InningsScore;
  total: number;
}

export interface InningsScore {
  1: number | null;
  2: number | null;
  3: number | null;
  4: number | null;
  5: number | null;
  6: number | null;
  7: number | null;
  8: number | null;
  9: number | null;
  extra: number | null;
}
