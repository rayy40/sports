import { useQuery } from "@tanstack/react-query";
import {
  getFixturesByDate,
  getFixturesByLeagueIdAndSeason,
  getFixturesByTeamIdAndSeason,
  getLeagueById,
  getNBASeasons,
  getStandingsByLeagueIdAndSeason,
  getStatsByTeamIdAndSeason,
  getTeamById,
} from "./api";
import { DetailedTabsType } from "@/types/football";

export function useFixturesByDate(date: string) {
  return useQuery({
    queryKey: ["basketball", "fixtures", date],
    queryFn: () => getFixturesByDate(date),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLeagueById(leagueId: string | string[]) {
  return useQuery({
    queryKey: ["basketball", "league", leagueId],
    queryFn: () => getLeagueById(leagueId),
  });
}

export function useTeamInfo(
  teamId: string | string[],
  isNBATeam: boolean = false
) {
  return useQuery({
    queryKey: ["basketball", "team", teamId],
    queryFn: () => getTeamById(teamId, isNBATeam),
  });
}

export function useNBASeasons(leagueId: string | string[]) {
  return useQuery({
    queryKey: ["basketball", "league", "nba"],
    queryFn: getNBASeasons,
    enabled: leagueId === "12",
  });
}

export function useFixturesByLeagueIdAndSeason(
  leagueId: string | string[],
  season: string | undefined
) {
  return useQuery({
    queryKey: ["basketball", "fixtures", leagueId, season],
    queryFn: () => getFixturesByLeagueIdAndSeason(leagueId, season),
    staleTime: 5 * 60 * 1000,
    enabled:
      !!season &&
      season.length > 0 &&
      (leagueId !== "12" || !isNaN(parseInt(season))),
  });
}

export function useFixturesByTeamIdAndSeason(
  teamId: string | string[],
  season: string | undefined,
  status: string,
  isNBATeam: boolean = false
) {
  return useQuery({
    queryKey: ["basketball", "fixtures", teamId, season],
    queryFn: () => getFixturesByTeamIdAndSeason(teamId, season, isNBATeam),
    staleTime: 5 * 60 * 1000,
    enabled: status === "Fixtures" && (!!season || !!teamId),
  });
}

export function useTeamStatistics(
  teamId: string | string[],
  season: string | undefined,
  leagueId: string,
  status: string,
  isNBATeam: boolean = false
) {
  return useQuery({
    queryKey: ["basketball", "stats", teamId, season],
    queryFn: () =>
      getStatsByTeamIdAndSeason(teamId, season, leagueId, isNBATeam),
    enabled: status === "Stats" && (!!season || !!teamId),
  });
}

export function useStandingsByLeagueIdAndSeason(
  leagueId: string | string[],
  season: string | undefined,
  status: DetailedTabsType,
  nbaLeague?: string
) {
  return useQuery({
    queryKey: ["basketball", "standings", leagueId, season],
    queryFn: () => getStandingsByLeagueIdAndSeason(leagueId, season, nbaLeague),
    staleTime: 15 * 60 * 1000,
    enabled: status === "Standings" && (!!leagueId || !!season),
  });
}
