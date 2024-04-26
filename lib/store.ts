import { DetailedTabsType, FixtureTabsType, StatusType } from "@/types/general";
import { create } from "zustand";

const dt = new Date();

export interface StatusStore {
  status: StatusType;
  setStatus: (arg: StatusType) => void;
}

export interface TabsStore {
  tab: DetailedTabsType;
  setTab: (arg: DetailedTabsType) => void;
}
export interface FixtureTabsStore {
  tab: FixtureTabsType;
  setTab: (arg: FixtureTabsType) => void;
}

export interface StatStore {
  stat: string | null;
  setStat: (stat: string | null) => void;
}

export interface DateStore {
  date: Date;
  setDate: (date: Date | undefined) => void;
}

export interface LeagueStore {
  league: string | null;
  setLeague: (league: string | null) => void;
}

export interface TeamStore {
  team: string | null;
  setTeam: (team: string | null) => void;
}

export interface SeasonsStore {
  season: string | null;
  setSeason: (season: string | null) => void;
}

export const useStatusStore = create<StatusStore>((set) => ({
  status: "AllGames",
  setStatus: (arg: StatusType) => set({ status: arg }),
}));

export const useTabsStore = create<TabsStore>((set) => ({
  tab: "Fixtures",
  setTab: (arg: DetailedTabsType) => set({ tab: arg }),
}));

export const useFixtureTabsStore = create<FixtureTabsStore>((set) => ({
  tab: "Head to Head",
  setTab: (arg: FixtureTabsType) => set({ tab: arg }),
}));

export const useStatStore = create<StatStore>((set) => ({
  stat: "top scorers",
  setStat: (stat: string | null) => set({ stat }),
}));

export const useDateStore = create<DateStore>((set) => ({
  date: dt,
  setDate: (date: Date | undefined) => set({ date }),
}));

export const useLeagueStore = create<LeagueStore>((set) => ({
  league: null,
  setLeague: (league: string | null) => set({ league }),
}));

export const useLeagueForTeamStatsStore = create<LeagueStore>((set) => ({
  league: null,
  setLeague: (league: string | null) => set({ league }),
}));

export const useTeamStore = create<TeamStore>((set) => ({
  team: null,
  setTeam: (team: string | null) => set({ team }),
}));

export const useSeasonsStore = create<SeasonsStore>((set) => ({
  season: null,
  setSeason: (season: string | null) => set({ season }),
}));
