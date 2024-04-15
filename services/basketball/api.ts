import {
  APINonArrayResponse,
  APIResponse,
  Games,
  League,
  NBAGames,
  NBAStandings,
  NBAStatistics,
  NBATeamresponse,
  Seasons,
  Standings,
  TeamResponse,
  TeamStatistics,
} from "@/types/basketball";
import axios from "axios";

const BASKETBALL_BASE_URL = "https://v1.basketball.api-sports.io";
const NBA_BASE_URL = "https://v2.nba.api-sports.io";

const BASKETBALL_HEADERS = {
  "x-rapidapi-host": "v1.basketball.api-sports.io",
  "x-rapidapi-key":
    process.env.RAPIDAPI_KEY ?? process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
};
const NBA_HEADERS = {
  "x-rapidapi-host": "v2.nba.api-sports.io",
  "x-rapidapi-key":
    process.env.RAPIDAPI_KEY ?? process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
};

const axiosBasketballInstance = axios.create({
  baseURL: BASKETBALL_BASE_URL,
  headers: BASKETBALL_HEADERS,
});

const axiosNBAInstance = axios.create({
  baseURL: NBA_BASE_URL,
  headers: NBA_HEADERS,
});

export const getFixturesByDate = async (date: string) => {
  return (
    await axiosBasketballInstance.get<APIResponse<Games>>(`/games?date=${date}`)
  ).data.response;
};

export const getLeagueById = async (leagueId: string | string[]) => {
  return (
    await axiosBasketballInstance.get<APIResponse<League<Seasons[]>>>(
      `/leagues?id=${leagueId}`
    )
  ).data.response?.[0];
};

export const getTeamById = async (
  teamId: string | string[],
  isNBATeam: boolean
) => {
  if (isNBATeam) {
    const team = (teamId as string).split("-")[1];
    return (
      await axiosNBAInstance.get<APIResponse<NBATeamresponse>>(
        `/teams?id=${team}`
      )
    ).data.response?.[0];
  }
  return (
    await axiosBasketballInstance.get<APIResponse<TeamResponse>>(
      `/teams?id=${teamId}`
    )
  ).data.response?.[0];
};

export const getNBASeasons = async () => {
  return (await axiosNBAInstance.get<APIResponse<number>>(`/seasons`)).data
    .response;
};

export const getFixturesByLeagueIdAndSeason = async (
  leagueId: string | string[],
  season: string | undefined
) => {
  if (leagueId === "12") {
    return (
      await axiosNBAInstance.get<APIResponse<NBAGames>>(
        `/games?season=${season}`
      )
    ).data.response;
  }
  return (
    await axiosBasketballInstance.get<APIResponse<Games>>(
      `/games?league=${leagueId}&season=${season}`
    )
  ).data.response;
};

export const getFixturesByTeamIdAndSeason = async (
  teamId: string | string[],
  season: string | undefined,
  isNBATeam: boolean = false
) => {
  if (isNBATeam) {
    const team = (teamId as string).split("-")[1];
    return (
      await axiosNBAInstance.get<APIResponse<NBAGames>>(
        `/games?team=${team}&season=${season}`
      )
    ).data.response;
  }
  return (
    await axiosBasketballInstance.get<APIResponse<Games>>(
      `/games?team=${teamId}&season=${season}`
    )
  ).data.response;
};

export const getStandingsByLeagueIdAndSeason = async (
  leagueId: string | string[],
  season: string | undefined,
  leagueName?: string
) => {
  if (leagueId === "12") {
    return (
      await axiosNBAInstance.get<APIResponse<NBAStandings>>(
        `/standings?league=${leagueName}&season=${season}`
      )
    ).data.response;
  }
  return (
    await axiosBasketballInstance.get<APIResponse<Standings[]>>(
      `/standings?league=${leagueId}&season=${season}`
    )
  ).data.response;
};

export const getStatsByTeamIdAndSeason = async (
  teamId: string | string[],
  season: string | undefined,
  leagueId: string,
  isNBATeam: boolean = false
) => {
  if (isNBATeam) {
    const team = (teamId as string).split("-")[1];
    return (
      await axiosNBAInstance.get<APIResponse<NBAStatistics>>(
        `/teams/statistics?id=${team}&season=${season}`
      )
    ).data.response?.[0];
  }
  return (
    await axiosBasketballInstance.get<APINonArrayResponse<TeamStatistics>>(
      `/statistics?team=${teamId}&league=${leagueId}&season=${season}`
    )
  ).data.response;
};
