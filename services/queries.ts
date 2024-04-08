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
  getTeamSeasons,
  getTopAssistsByLeagueIdAndSeason,
  getTopScorersByLeagueIdAndSeason,
} from "./api";

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
    enabled: !!leagueId && !!season,
  });
}

export function useStandingsByLeagueIdAndSeason(
  leagueId: string | string[],
  season: string
) {
  return useQuery({
    queryKey: ["standings", leagueId, season],
    queryFn: () => getStandingsByLeagueIdAndSeason(leagueId, season),
    staleTime: 1000,
    enabled: false,
  });
}

export function useTopScorersByLeagueIdAndSeason(
  leagueId: string | string[],
  season: string
) {
  return useQuery({
    queryKey: ["topScorers", leagueId, season],
    queryFn: () => getTopScorersByLeagueIdAndSeason(leagueId, season),
    enabled: false,
  });
}

export function useTopAssistsByLeagueIdAndSeason(
  leagueId: string | string[],
  season: string
) {
  return useQuery({
    queryKey: ["topAssists", leagueId, season],
    queryFn: () => getTopAssistsByLeagueIdAndSeason(leagueId, season),
    enabled: false,
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
  season: string | undefined
) {
  return useQuery({
    queryKey: ["fixtures", teamId, season],
    queryFn: () => getFixturesByTeamIdAndSeaosns(teamId, season),
    staleTime: 5 * 60 * 1000,
    enabled: !!teamId && !!season,
  });
}

export function useStandingsByTeamIdAndSeason(
  teamId: string | string[],
  season: string
) {
  return useQuery({
    queryKey: ["standings", teamId, season],
    queryFn: () => getStandingsByTeamIdAndSeason(teamId, season),
    enabled: false,
  });
}

export function useSquads(teamId: string | string[]) {
  return useQuery({
    queryKey: ["squads", teamId],
    queryFn: () => getSquads(teamId),
    enabled: !!teamId,
  });
}
