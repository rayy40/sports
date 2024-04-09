import { useQuery } from "@tanstack/react-query";
import {
  getCountries,
  getFixtureByLeagueIdAndSeason,
  getFixturesByDate,
  getFixturesByTeamIdAndSeaosns,
  getLeagueById,
  getLeaguesByCountry,
  getSquads,
  getStandingsByLeagueIdAndSeason,
  getStandingsByTeamIdAndSeason,
  getTeamInfo,
  getTeamSeasons,
  getTeamsStatistics,
  getTopAssistsByLeagueIdAndSeason,
  getTopScorersByLeagueIdAndSeason,
} from "./api";
import { DetailedTabsType } from "@/lib/types";

export function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    staleTime: Infinity,
  });
}

export function useFixturesByDate(date: string) {
  return useQuery({
    queryKey: ["fixtures", date],
    queryFn: () => getFixturesByDate(date),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLeaguesByCountryId(countryId: string | string[]) {
  return useQuery({
    queryKey: ["leagues", countryId],
    queryFn: () => getLeaguesByCountry(countryId),
    enabled: !!countryId,
  });
}

export function useLeagueById(leagueId: string | string[]) {
  return useQuery({
    queryKey: ["league", leagueId],
    queryFn: () => getLeagueById(leagueId),
  });
}

export function useFixturesByLeagueIdAndSeason(
  leagueId: string | string[],
  season: string | undefined
) {
  return useQuery({
    queryKey: ["fixtures", leagueId, season],
    queryFn: () => getFixtureByLeagueIdAndSeason(leagueId, season),
    staleTime: 5 * 60 * 1000,
    enabled: !!season && (!!leagueId || !!season),
  });
}

export function useStandingsByLeagueIdAndSeason(
  leagueId: string | string[],
  season: string,
  status: DetailedTabsType
) {
  return useQuery({
    queryKey: ["standings", leagueId, season],
    queryFn: () => getStandingsByLeagueIdAndSeason(leagueId, season),
    staleTime: 15 * 60 * 1000,
    enabled: status === "Standings" && (!!leagueId || !!season),
  });
}

export function useTopScorersByLeagueIdAndSeason(
  leagueId: string | string[],
  season: string,
  status: DetailedTabsType,
  stat: string
) {
  return useQuery({
    queryKey: ["topScorers", leagueId, season],
    queryFn: () => getTopScorersByLeagueIdAndSeason(leagueId, season),
    enabled:
      status === "Stats" && stat === "top scorers" && (!!leagueId || !!season),
  });
}

export function useTopAssistsByLeagueIdAndSeason(
  leagueId: string | string[],
  season: string,
  status: DetailedTabsType,
  stat: string
) {
  return useQuery({
    queryKey: ["topAssists", leagueId, season],
    queryFn: () => getTopAssistsByLeagueIdAndSeason(leagueId, season),
    enabled:
      status === "Stats" && stat === "top assists" && (!!leagueId || !!season),
  });
}

export function useTeamInfo(teamId: string | string[]) {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: () => getTeamInfo(teamId),
    enabled: !!teamId,
    staleTime: Infinity,
  });
}

export function useTeamSeasons(teamId: string | string[]) {
  return useQuery({
    queryKey: ["seasons", teamId],
    queryFn: () => getTeamSeasons(teamId),
    enabled: !!teamId,
  });
}

export function useFixturesByTeamIdAndSeason(
  teamId: string | string[],
  season: string | undefined,
  status: DetailedTabsType
) {
  return useQuery({
    queryKey: ["fixtures", teamId, season],
    queryFn: () => getFixturesByTeamIdAndSeaosns(teamId, season),
    staleTime: 5 * 60 * 1000,
    enabled: status === "Fixtures" && (!!teamId || !!season),
  });
}

export function useStandingsByTeamIdAndSeason(
  teamId: string | string[],
  season: string,
  status: DetailedTabsType
) {
  return useQuery({
    queryKey: ["standings", teamId, season],
    queryFn: () => getStandingsByTeamIdAndSeason(teamId, season),
    staleTime: 15 * 60 * 1000,
    enabled: status === "Standings" && (!!teamId || !!season),
  });
}

export function useSquads(teamId: string | string[], status: DetailedTabsType) {
  return useQuery({
    queryKey: ["squads", teamId],
    queryFn: () => getSquads(teamId),
    enabled: status === "Squads" && !!teamId,
  });
}

export function useTeamStatistics(
  teamId: string | string[],
  season: string | undefined,
  leagueId: string | undefined,
  status: DetailedTabsType
) {
  return useQuery({
    queryKey: ["statistics", teamId, season, leagueId],
    queryFn: () => getTeamsStatistics(teamId, season, leagueId),
    enabled: status === "Stats" && (!!leagueId || !!season || !!teamId),
  });
}
