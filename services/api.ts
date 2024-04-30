import { errorMessage } from "@/lib/constants";
import {
  NFLEvents,
  NFLTeamsStatisticsResponse,
} from "@/types/american-football";
import {
  AustralianFootballFixtureStatisticsResponse,
  AustralianFootballLeagueOrTeamInfo,
  AustralianFootballTeamStatisticsResponse,
  TotalOrAverageStats,
} from "@/types/australian-football";
import { NBAStatistics, NBATeamresponse } from "@/types/basketball";
import {
  Leagues,
  TeamResponse as FootballTeamResponse,
  TeamStatistics as FootballTeamStatistics,
  PlayerStats,
} from "@/types/football";
import {
  APINonArrayResponse,
  APIResponse,
  AllSportsFixtures,
  AllSportsPlayesr,
  Country,
  League,
  Seasons,
  Sports,
  Standings,
  Team,
  TeamResponse,
  TeamStatistics,
  WithoutStandingEntity,
} from "@/types/general";
import { HockeyEvents } from "@/types/hockey";
import axios from "axios";

const getBaseURL = (sport: Sports) => {
  switch (sport) {
    case "american-football":
    case "basketball":
    case "baseball":
    case "rugby":
    case "hockey":
      return `https://v1.${sport}.api-sports.io`;
    case "australian-football":
      return `https://v1.afl.api-sports.io`;
    case "football":
      return `https://v3.football.api-sports.io`;
    default:
      return undefined;
  }
};

const getHost = (sport: Sports) => {
  switch (sport) {
    case "american-football":
    case "basketball":
    case "baseball":
    case "rugby":
    case "hockey":
      return `v1.${sport}.api-sports.io`;
    case "australian-football":
      return `https://v1.afl.api-sports.io`;
    case "football":
      return `v3.football.api-sports.io`;
    default:
      return undefined;
  }
};

const axiosNBAInstance = axios.create({
  baseURL: "https://v2.nba.api-sports.io",
  headers: {
    "x-rapidapi-host": "v2.nba.api-sports.io",
    "x-rapidapi-key":
      process.env.RAPIDAPI_KEY ?? process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
  },
});

function createAxiosInstance(sport: Sports) {
  const baseURL = getBaseURL(sport);
  const host = getHost(sport);

  if (!baseURL || !host) {
    throw new Error(`Unsupported sport: ${sport}`);
  }

  return axios.create({
    baseURL: baseURL,
    headers: {
      "x-rapidapi-host": host,
      "x-rapidapi-key":
        process.env.RAPIDAPI_KEY ?? process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
    },
  });
}

export const getCountries = async (sport: Sports) => {
  const axiosInstance = createAxiosInstance(sport);
  const response = await axiosInstance.get<APIResponse<Country>>("/countries");
  if (!Array.isArray(response.data.errors)) {
    throw new Error(errorMessage);
  }
  return response.data.response;
};

export const getLeaguesByCode = async (sport: Sports, code: string) => {
  const axiosInstance = createAxiosInstance(sport);
  switch (sport) {
    case "basketball":
    case "baseball":
    case "rugby":
    case "hockey":
      const response = await axiosInstance.get<APIResponse<League<Seasons[]>>>(
        `/leagues?code=${code}`
      );
      if (!Array.isArray(response.data.errors)) {
        throw new Error(errorMessage);
      }
      return response.data.response?.[0];
    case "football":
      const footballResponse = await axiosInstance.get<APIResponse<Leagues>>(
        `/leagues?code=${code}`
      );
      if (!Array.isArray(footballResponse.data.errors)) {
        throw new Error(errorMessage);
      }
      return footballResponse.data.response?.[0];
    default:
      throw new Error("Unrecognized sport.");
  }
};

export const getLeagueById = async (id: number, sport: Sports) => {
  const axiosInstance = createAxiosInstance(sport);
  switch (sport) {
    case "basketball":
    case "baseball":
    case "rugby":
    case "hockey":
      const response = await axiosInstance.get<APIResponse<League<Seasons[]>>>(
        `/leagues?id=${id}`
      );
      if (!Array.isArray(response.data.errors)) {
        throw new Error(errorMessage);
      }
      return response.data.response?.[0];
    case "australian-football":
      const AFLresponse = await axiosInstance.get<
        APIResponse<AustralianFootballLeagueOrTeamInfo>
      >(`/leagues?id=${id}`);
      if (!Array.isArray(AFLresponse.data.errors)) {
        throw new Error(errorMessage);
      }
      return AFLresponse.data.response;
    case "american-football":
    case "football":
      const footballResponse = await axiosInstance.get<APIResponse<Leagues>>(
        `/leagues?id=${id}`
      );
      if (!Array.isArray(footballResponse.data.errors)) {
        throw new Error(errorMessage);
      }
      return footballResponse.data.response?.[0];
    default:
      throw new Error("Unrecognized sport.");
  }
};

export const getTeamById = async (
  id: number,
  sport: Sports,
  isNBATeam: boolean = false
) => {
  const axiosInstance = createAxiosInstance(sport);
  switch (sport) {
    case "basketball":
      if (isNBATeam) {
        const nbaTeamResponse = await axiosNBAInstance.get<
          APIResponse<NBATeamresponse>
        >(`/teams?id=${id}`);
        if (!Array.isArray(nbaTeamResponse.data.errors)) {
          throw new Error(errorMessage);
        }
        return nbaTeamResponse.data.response?.[0];
      }
    case "baseball":
    case "rugby":
    case "hockey":
    case "american-football":
      const response = await axiosInstance.get<APIResponse<TeamResponse>>(
        `/teams?id=${id}`
      );
      if (!Array.isArray(response.data.errors)) {
        throw new Error(errorMessage);
      }
      return response.data.response?.[0];
    case "australian-football":
      const AFLresponse = await axiosInstance.get<APIResponse<Team>>(
        `/teams?id=${id}`
      );
      if (!Array.isArray(AFLresponse.data.errors)) {
        throw new Error(errorMessage);
      }
      return AFLresponse.data.response?.[0];
    case "football":
      const footballResponse = await axiosInstance.get<
        APIResponse<FootballTeamResponse>
      >(`/teams?id=${id}`);
      if (!Array.isArray(footballResponse.data.errors)) {
        throw new Error(errorMessage);
      }
      return footballResponse.data.response?.[0];
    default:
      throw new Error("Unrecognized sport.");
  }
};

export const getTeamSeasons = async (id: number, sport: Sports) => {
  const axiosInstance = createAxiosInstance(sport);
  return (
    await axiosInstance.get<APIResponse<number>>(`/teams/seasons?team=${id}`)
  ).data.response;
};

export const getFixturesByDate = async (date: string, sport: Sports) => {
  const axiosInstance = createAxiosInstance(sport);
  const response = await axiosInstance.get<APIResponse<AllSportsFixtures>>(
    `/${sport === "football" ? "fixtures" : "games"}?date=${date}`
  );
  if (!Array.isArray(response.data.errors)) {
    throw new Error(errorMessage);
  }
  return response.data.response;
};

export const getFixturesByLeagueIdAndSeason = async (
  leagueId: number | string,
  season: string | null,
  sport: Sports
) => {
  const isNBAFixture = sport === "basketball" && leagueId === 12;

  if (!season) {
    throw new Error(
      "No season found. A season is required to fetch fixtures for a particular league."
    );
  }
  const axiosInstance = !isNBAFixture
    ? createAxiosInstance(sport)
    : axiosNBAInstance;
  const response = await axiosInstance.get<APIResponse<AllSportsFixtures>>(
    `/${sport === "football" ? "fixtures" : "games"}?season=${season}`,
    {
      params: {
        ...(isNBAFixture ? {} : { league: leagueId }),
      },
    }
  );
  if (!Array.isArray(response.data.errors)) {
    throw new Error(errorMessage);
  }
  return response.data.response;
};

export const getFixturesByTeamIdAndSeason = async (
  teamId: number | string,
  season: string | null,
  sport: Sports,
  isNBATeam: boolean = false
) => {
  if (!season) {
    throw new Error(
      "No season found. A season is required to fetch fixtures for a particular league."
    );
  }
  const axiosInstance = !isNBATeam
    ? createAxiosInstance(sport)
    : axiosNBAInstance;
  const response = await axiosInstance.get<APIResponse<AllSportsFixtures>>(
    `/${
      sport === "football" ? "fixtures" : "games"
    }?season=${season}&team=${teamId}`,
    {
      params: {
        ...(sport === "australian-football" ? { league: 1 } : {}),
      },
    }
  );
  if (!Array.isArray(response.data.errors)) {
    throw new Error(errorMessage);
  }
  return response.data.response;
};

export const getNBASeasons = async () => {
  return (await axiosNBAInstance.get<APIResponse<number>>(`/seasons`)).data
    .response;
};

export const getStandingsByLeagueIdAndSeason = async (
  id: number | string,
  season: string | null,
  sport: Sports
) => {
  const isNBAStandings = sport === "basketball" && id === 12;

  if (!season) {
    throw new Error(
      "No season found. A season is required to fetch fixtures for a particular league."
    );
  }
  const axiosInstance = !isNBAStandings
    ? createAxiosInstance(sport)
    : axiosNBAInstance;
  const response = await axiosInstance.get<
    APIResponse<WithoutStandingEntity | Standings[]>
  >(`/standings?season=${season}`, {
    params: {
      ...(isNBAStandings ? { league: "standard" } : { league: id }),
    },
  });
  if (!Array.isArray(response.data.errors)) {
    throw new Error(errorMessage);
  }
  return response.data.response;
};

export const getStandingsByTeamIdAndSeason = async (
  teamId: number | string,
  leagueId: number | undefined,
  season: string | null,
  isNBATeam: boolean,
  sport: Sports
) => {
  if (!season) {
    throw new Error(
      "No season found. A season is required to fetch fixtures for a particular league."
    );
  }

  if (!leagueId) {
    throw new Error(
      "A league is required for getting standings for a particular team."
    );
  }

  const axiosInstance = !isNBATeam
    ? createAxiosInstance(sport)
    : axiosNBAInstance;
  const response = await axiosInstance.get<
    APIResponse<WithoutStandingEntity | Standings[]>
  >(`/standings?season=${season}&team=${teamId}`, {
    params: {
      ...(isNBATeam
        ? { league: "standard" }
        : sport === "football"
        ? {}
        : { league: leagueId }),
    },
  });
  if (!Array.isArray(response.data.errors)) {
    throw new Error(errorMessage);
  }
  return response.data.response;
};

export const getTeamStatisticsBySeason = async (
  teamId: number | string,
  leagueId: number | undefined,
  season: string | null,
  sport: Sports,
  isNBATeam: boolean = false
) => {
  const axiosInstance = createAxiosInstance(sport);
  if (!season || !leagueId) return undefined;

  switch (sport) {
    case "basketball":
      if (isNBATeam) {
        return (
          await axiosNBAInstance.get<APIResponse<NBAStatistics>>(
            `/teams/statistics?id=${teamId}&season=${season}`
          )
        ).data.response?.[0];
      }
    case "hockey":
    case "rugby":
    case "baseball":
      return (
        await axiosInstance.get<APINonArrayResponse<TeamStatistics>>(
          `/teams/statistics?team=${teamId}&league=${leagueId}&season=${season}`
        )
      ).data.response;
    case "australian-football":
      return (
        await axiosInstance.get<
          APINonArrayResponse<
            AustralianFootballTeamStatisticsResponse<TotalOrAverageStats>
          >
        >(
          `/teams/statistics?team=${teamId}&league=${leagueId}&season=${season}`
        )
      ).data.response;
    case "football":
      return (
        await axiosInstance.get<APINonArrayResponse<FootballTeamStatistics>>(
          `/teams/statistics?league=${leagueId}&team=${teamId}&season=${season}`
        )
      ).data.response;
    default:
      return undefined;
  }
};

export const getPlayersForTeam = async (
  teamId: number | string,
  season: string | null,
  sport: Sports
) => {
  if (!season) return undefined;
  const axiosInstance = createAxiosInstance(sport);
  const response = await axiosInstance.get<APIResponse<AllSportsPlayesr>>(
    sport === "football"
      ? `players/squads?team=${teamId}`
      : `players?team=${teamId}`,
    {
      params: {
        ...(sport == "football" ? {} : { season: season }),
      },
    }
  );
  if (!Array.isArray(response.data.errors)) {
    throw new Error(errorMessage);
  }
  return response.data.response;
};

export const getPlayerStandings = async (
  stat: string | null,
  id: number,
  season: string | null,
  sport: Sports
) => {
  if (!season || !stat) return undefined;

  const axiosInstance = createAxiosInstance(sport);

  switch (stat) {
    case "top scorers":
      return (
        await axiosInstance.get<APIResponse<PlayerStats>>(
          `/players/topscorers?league=${id}&season=${season}`
        )
      ).data.response;
    case "top assists":
      return (
        await axiosInstance.get<APIResponse<PlayerStats>>(
          `/players/topassists?league=${id}&season=${season}`
        )
      ).data.response;
    case "yellow cards":
      return (
        await axiosInstance.get<APIResponse<PlayerStats>>(
          `/players/yellowcards?league=${id}&season=${season}`
        )
      ).data.response;
    case "red cards":
      return (
        await axiosInstance.get<APIResponse<PlayerStats>>(
          `/players/redcards?league=${id}&season=${season}`
        )
      ).data.response;
    default:
      return undefined;
  }
};

export const getFixtureById = async (
  fixtureId: number,
  sport: Sports,
  isNBATeam: boolean = false
) => {
  const axiosInstance = !isNBATeam
    ? createAxiosInstance(sport)
    : axiosNBAInstance;
  const response = await axiosInstance.get<APIResponse<AllSportsFixtures>>(
    `/${sport === "football" ? "fixtures" : "games"}?id=${fixtureId}`
  );
  if (!Array.isArray(response.data.errors)) {
    throw new Error(errorMessage);
  }
  return isNBATeam ? response.data.response : response.data.response?.[0];
};

export const getHeadtoHeadFixtures = async (
  teamId1: number,
  teamId2: number,
  sport: Sports
) => {
  const axiosInstance = createAxiosInstance(sport);
  const response = await axiosInstance.get<APIResponse<AllSportsFixtures>>(
    sport === "football"
      ? "fixtures/headtohead"
      : sport === "basketball"
      ? "games"
      : "games/h2h",
    {
      params: {
        h2h: `${teamId1}-${teamId2}`,
      },
    }
  );
  if (!Array.isArray(response.data.errors)) {
    throw new Error(errorMessage);
  }
  return response.data.response;
};

export const getFixtureEvents = async (fixtureId: number, sport: Sports) => {
  const axiosInstance = createAxiosInstance(sport);

  switch (sport) {
    case "hockey":
      return (
        await axiosInstance.get<APIResponse<HockeyEvents>>(
          `/games/events?game=${fixtureId}`
        )
      ).data.response;
    case "american-football":
      return (
        await axiosInstance.get<APIResponse<NFLEvents>>(
          `/games/events?id=${fixtureId}`
        )
      ).data.response;
    default:
      return undefined;
  }
};

export const getFixtureStatistics = async (
  fixtureId: number,
  sport: Sports
) => {
  const axiosInstance = createAxiosInstance(sport);

  switch (sport) {
    case "american-football":
      return (
        await axiosInstance.get<APIResponse<NFLTeamsStatisticsResponse>>(
          `/games/statistics/teams?id=${fixtureId}`
        )
      ).data.response;
    case "australian-football":
      return (
        await axiosInstance.get<
          APIResponse<AustralianFootballFixtureStatisticsResponse<number>>
        >(`/games/statistics/teams?id=${fixtureId}`)
      ).data.response?.[0].teams;
    default:
      return undefined;
  }
};

export const getNBAFixtures = async (date: string) => {
  const axiosInstance = createAxiosInstance("basketball");
  const response = await axiosInstance.get<APIResponse<AllSportsFixtures>>(
    `/games?league=12&date=${date}&season=2023-2024`
  );
  if (!Array.isArray(response.data.errors)) {
    throw new Error(errorMessage);
  }
  return response.data.response;
};

export const getMLBFixtures = async (date: string) => {
  const axiosInstance = createAxiosInstance("baseball");
  const response = await axiosInstance.get<APIResponse<AllSportsFixtures>>(
    `/games?league=1&date=${date}&season=2024`
  );
  if (!Array.isArray(response.data.errors)) {
    throw new Error(errorMessage);
  }
  return response.data.response;
};

export const getFeaturedFootballFixtures = async (
  date: string,
  leagueId: number
) => {
  const axiosInstance = createAxiosInstance("football");
  const response = await axiosInstance.get<APIResponse<AllSportsFixtures>>(
    `/fixtures?league=${leagueId}&date=${date}&season=2023`
  );
  if (!Array.isArray(response.data.errors)) {
    throw new Error(errorMessage);
  }
  return response.data.response;
};
