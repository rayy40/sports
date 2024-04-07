import { useQuery } from "@tanstack/react-query";
import {
  getCountries,
  getFixtureByLeagueIdAndSeason,
  getFixturesByDate,
  getLeagueById,
  getLeaguesByCountry,
  getStandingsByLeagueIdAndSeason,
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
    enabled: !!leagueId && !!season,
  });
}

export function useStandingsByLeagueIdAndSeason(
  leagueId: string | string[],
  season: string
) {
  const query = useQuery({
    queryKey: ["standings", leagueId, season],
    queryFn: () => getStandingsByLeagueIdAndSeason(leagueId, season),
    enabled: false,
  });
  const refetchStandings = () => {
    query.refetch();
  };

  return { ...query, refetchStandings };
}