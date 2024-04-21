import { DetailedTabsType, Sports } from "@/types/general";
import { useQuery } from "@tanstack/react-query";
import {
  getFixturesByDate,
  getFixturesByLeagueIdAndSeason,
  getLeagueById,
  getStandingsByLeagueIdAndSeason,
  getTeamStatisticsBySeason,
  getTeamById,
  getTeamSeasons,
  getFixturesByTeamIdAndSeason,
  getPlayersForTeam,
  getStandingsByTeamIdAndSeason,
  getPlayerStandings,
  getFixtureById,
} from "./api";

export function useLeagueById(id: number, sport: Sports) {
  return useQuery({
    queryKey: [id, sport, "league"],
    queryFn: () => getLeagueById(id, sport),
    staleTime: Infinity,
    enabled: !!id || !!sport,
  });
}

export function useTeamById(id: number, sport: Sports, isNBATeam?: boolean) {
  return useQuery({
    queryKey: [id, sport, "team"],
    queryFn: () => getTeamById(id, sport, isNBATeam),
    staleTime: Infinity,
    enabled: !!id || !!sport,
  });
}

export function useTeamSeasons(id: number, sport: Sports) {
  return useQuery({
    queryKey: [id, sport, "team", "seasons"],
    queryFn: () => getTeamSeasons(id, sport),
    staleTime: Infinity,
    enabled: !!id || !!sport,
  });
}

export function useFixturesByDate(date: string, sport: Sports) {
  return useQuery({
    queryKey: [date, sport, "fixtures"],
    queryFn: () => getFixturesByDate(date, sport),
    staleTime: 15 * 60 * 1000,
    enabled: !!date || !!sport,
  });
}

export function useFixturesByLeagueIdAndSeason(
  leagueId: number,
  season: string | null,
  sport: Sports,
  isTeam: boolean
) {
  return useQuery({
    queryKey: [leagueId, season, sport, "fixtures"],
    queryFn: () => getFixturesByLeagueIdAndSeason(leagueId, season, sport),
    staleTime: 15 * 60 * 1000,
    enabled: season !== null && !isTeam,
  });
}

export function useFixturesByTeamIdAndSeason(
  teamId: number,
  season: string | null,
  sport: Sports,
  isTeam: boolean
) {
  return useQuery({
    queryKey: [teamId, season, sport, "fixtures"],
    queryFn: () => getFixturesByTeamIdAndSeason(teamId, season, sport),
    staleTime: 15 * 60 * 1000,
    enabled: season !== null && isTeam,
  });
}

export function useFixtursById(
  fixtureId: number,
  sport: Sports,
  isNBATeam: boolean
) {
  return useQuery({
    queryKey: [fixtureId, sport, "fixtures"],
    queryFn: () => getFixtureById(fixtureId, sport, isNBATeam),
    staleTime: 15 * 60 * 1000,
    enabled: !!fixtureId,
  });
}

export function useStandingsByLeagueIdAndSeason(
  id: number,
  season: string | null,
  sport: Sports,
  isTeam: boolean,
  tab: DetailedTabsType
) {
  return useQuery({
    queryKey: [id, season, sport, "standings"],
    queryFn: () => getStandingsByLeagueIdAndSeason(id, season, sport),
    enabled: tab === "Standings" && !isTeam && !!season,
  });
}

export function useStandingsByTeamIdAndSeason(
  teamId: number,
  leagueId: number | undefined,
  season: string | null,
  sport: Sports,
  isTeam: boolean,
  isNBATeam: boolean,
  tab: DetailedTabsType
) {
  return useQuery({
    queryKey: [teamId, leagueId, season, sport, "standings"],
    queryFn: () =>
      getStandingsByTeamIdAndSeason(teamId, leagueId, season, isNBATeam, sport),
    enabled: tab === "Standings" && isTeam && !!season,
  });
}

export function useStatisticsByTeamIdAndSeason(
  teamId: number,
  leagueId: number | undefined,
  season: string | null,
  sport: Sports,
  tab: DetailedTabsType,
  isTeam: boolean,
  isNBATeam: boolean = false
) {
  return useQuery({
    queryKey: [teamId, leagueId, season, sport, "statistics"],
    queryFn: () =>
      getTeamStatisticsBySeason(teamId, leagueId, season, sport, isNBATeam),
    enabled: tab === "Stats" && isTeam && (!!season || !!leagueId),
  });
}

export function usePlayersForTeam(
  teamId: number,
  season: string | null,
  sport: Sports,
  tab: DetailedTabsType
) {
  return useQuery({
    queryKey: [teamId, season, "players"],
    queryFn: () => getPlayersForTeam(teamId, season, sport),
    enabled: tab === "Squads" && !!season,
  });
}

export function usePlayersStandings(
  id: number,
  season: string | null,
  sport: Sports,
  tab: DetailedTabsType,
  stat: string,
  isTeam: boolean
) {
  return useQuery({
    queryKey: [id, season, sport, stat, "standings"],
    queryFn: () => getPlayerStandings(stat, id, season, sport),
    enabled: tab === "Stats" && !isTeam && (!!season || !!stat),
  });
}
