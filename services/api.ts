import axios from "axios";
import {
  APIResponse,
  Country,
  Fixtures,
  Leagues,
  PlayerStats,
  StandingsReponse,
} from "@/lib/types";

const FOOTBALL_BASE_URL = "https://v3.football.api-sports.io";
const HEADERS = {
  "x-rapidapi-host": "v3.football.api-sports.io",
  "x-rapidapi-key":
    process.env.RAPIDAPI_KEY ?? process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
};
const axiosInstance = axios.create({
  baseURL: FOOTBALL_BASE_URL,
  headers: HEADERS,
});

export const getCountries = async () => {
  return (await axiosInstance.get<APIResponse<Country>>("/countries")).data
    .response;
};

export const getLeaguesByCountry = async (countryId: string | string[]) => {
  return (
    await axiosInstance.get<APIResponse<Leagues>>(`/leagues?code=${countryId}`)
  ).data.response;
};

export const getFixturesByDate = async (date: string) => {
  return (
    await axiosInstance.get<APIResponse<Fixtures>>(`/fixtures?date=${date}`)
  ).data.response;
};

export const getLeagueById = async (leagueId: string | string[]) => {
  return (
    await axiosInstance.get<APIResponse<Leagues>>(`/leagues?id=${leagueId}`)
  ).data.response?.[0];
};

export const getFixtureByLeagueIdAndSeason = async (
  leagueId: string | string[],
  season: string | undefined
) => {
  return (
    await axiosInstance.get<APIResponse<Fixtures>>(
      `/fixtures?league=${leagueId}&season=${season}`
    )
  ).data.response;
};

export const getStandingsByLeagueIdAndSeason = async (
  leagueId: string | string[],
  season: string | undefined
) => {
  return (
    await axiosInstance.get<APIResponse<StandingsReponse>>(
      `/standings?league=${leagueId}&season=${season}`
    )
  ).data.response;
};

export const getTopScorersByLeagueIdAndSeason = async (
  leagueId: string | string[],
  season: string | undefined
) => {
  return (
    await axiosInstance.get<APIResponse<PlayerStats>>(
      `/players/topscorers?league=${leagueId}&season=${season}`
    )
  ).data.response;
};

export const getTopAssistsByLeagueIdAndSeason = async (
  leagueId: string | string[],
  season: string | undefined
) => {
  return (
    await axiosInstance.get<APIResponse<PlayerStats>>(
      `/players/topassists?league=${leagueId}&season=${season}`
    )
  ).data.response;
};
