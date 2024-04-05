import { create } from "zustand";
import { DetailedLeagueState, League } from "./types";

export const useLeagueStore = create<DetailedLeagueState>((set) => ({
  detailedLeague: null,
  setDetailedLeague: (league) => set({ detailedLeague: league }),
}));
