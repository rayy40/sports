import {
  AustralianFootballGames,
  AustralianFootballLeagueOrTeamInfo,
  AustralianFootballStandings,
  AustralianFootballTeamStatistics,
} from "@/types/australian-football";
import { BaseballScores } from "@/types/baseball";
import {
  BasketballScores,
  NBAGames,
  NBAPlayer,
  NBAStandings,
  NBAStatistics,
  NBATeamresponse,
} from "@/types/basketball";
import {
  Fixtures,
  Leagues,
  TeamResponse as FootballTeamResponse,
  TeamStatistics as FootballTeamStatistics,
  StandingsReponse,
  Squads,
  PlayerStats,
} from "@/types/football";
import {
  APINonArrayResponse,
  APIResponse,
  Games,
  GamesStats,
  GamesWithPeriods,
  GamesWithPeriodsAndEvents,
  League,
  Player,
  Seasons,
  Sports,
  Standings,
  Team,
  TeamResponse,
  TeamStatistics,
} from "@/types/general";
import { HockeyEvents, HockeyGameStats } from "@/types/hockey";
import { RugbyGameStats } from "@/types/rugby";
import axios from "axios";

const getBaseURL = (sport: Sports) => {
  switch (sport) {
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
      return "";
  }
};

const getHost = (sport: Sports) => {
  switch (sport) {
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
      return "";
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
  return axios.create({
    baseURL: getBaseURL(sport),
    headers: {
      "x-rapidapi-host": getHost(sport),
      "x-rapidapi-key":
        process.env.RAPIDAPI_KEY ?? process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
    },
  });
}

export const getLeagueById = async (id: number, sport: Sports) => {
  const axiosInstance = createAxiosInstance(sport);
  switch (sport) {
    case "basketball":
    case "baseball":
    case "rugby":
    case "hockey":
      return (
        await axiosInstance.get<APIResponse<League<Seasons[]>>>(
          `/leagues?id=${id}`
        )
      ).data.response?.[0];
    case "australian-football":
      return (
        await axiosInstance.get<
          APIResponse<AustralianFootballLeagueOrTeamInfo>
        >(`/leagues?id=${id}`)
      ).data.response;
    case "football":
      return (
        await axiosInstance.get<APIResponse<Leagues>>(`/leagues?id=${id}`)
      ).data.response?.[0];
    default:
      return undefined;
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
        return (
          await axiosNBAInstance.get<APIResponse<NBATeamresponse>>(
            `/teams?id=${id}`
          )
        ).data.response?.[0];
      }
    case "baseball":
    case "rugby":
    case "hockey":
      return (
        await axiosInstance.get<APIResponse<TeamResponse>>(`/teams?id=${id}`)
      ).data.response?.[0];
    case "australian-football":
      return (await axiosInstance.get<APIResponse<Team>>(`/teams?id=${id}`))
        .data.response?.[0];
    case "football":
      return (
        await axiosInstance.get<APIResponse<FootballTeamResponse>>(
          `/teams?id=${id}`
        )
      ).data.response?.[0];
    default:
      return undefined;
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

  switch (sport) {
    case "basketball":
      return (
        await axiosInstance.get<APIResponse<Games<BasketballScores>>>(
          `/games?date=${date}`
        )
      ).data.response;
    case "baseball":
      return (
        await axiosInstance.get<APIResponse<Games<BaseballScores>>>(
          `/games?date=${date}`
        )
      ).data.response;
    case "rugby":
      return (
        await axiosInstance.get<APIResponse<GamesWithPeriods<number | null>>>(
          `/games?date=${date}`
        )
      ).data.response;
    case "australian-football":
      return (
        await axiosInstance.get<APIResponse<AustralianFootballGames>>(
          `/games?date=${date}`
        )
      ).data.response;
    case "hockey":
      return (
        await axiosInstance.get<
          APIResponse<GamesWithPeriodsAndEvents<number | null>>
        >(`/games?date=${date}`)
      ).data.response;
    case "football":
      return (
        await axiosInstance.get<APIResponse<Fixtures>>(`/fixtures?date=${date}`)
      ).data.response;
    default:
      return undefined;
  }
};

export const getFixturesByLeagueIdAndSeason = async (
  leagueId: number | string,
  season: string | null,
  sport: Sports
) => {
  const axiosInstance = createAxiosInstance(sport);

  if (!season) {
    return undefined;
  }

  switch (sport) {
    case "basketball":
      if (leagueId === 12) {
        return (
          await axiosNBAInstance.get<APIResponse<NBAGames>>(
            `/games?season=${season}`
          )
        ).data.response;
      }
      return (
        await axiosInstance.get<APIResponse<Games<BasketballScores>>>(
          `/games?league=${leagueId}&season=${season}`
        )
      ).data.response;
    case "baseball":
      return (
        await axiosInstance.get<APIResponse<Games<BaseballScores>>>(
          `/games?league=${leagueId}&season=${season}`
        )
      ).data.response;
    case "rugby":
      return (
        await axiosInstance.get<APIResponse<GamesWithPeriods<number | null>>>(
          `/games?league=${leagueId}&season=${season}`
        )
      ).data.response;
    case "australian-football":
      return (
        await axiosInstance.get<APIResponse<AustralianFootballGames>>(
          `/games?league=${leagueId}&season=${season}`
        )
      ).data.response;
    case "hockey":
      return (
        await axiosInstance.get<
          APIResponse<GamesWithPeriodsAndEvents<number | null>>
        >(`/games?league=${leagueId}&season=${season}`)
      ).data.response;
    case "football":
      return (
        await axiosInstance.get<APIResponse<Fixtures>>(
          `/fixtures?league=${leagueId}&season=${season}`
        )
      ).data.response;
    default:
      return undefined;
  }
};

export const getFixturesByTeamIdAndSeason = async (
  teamId: number | string,
  season: string | null,
  sport: Sports,
  isNBATeam: boolean = false
) => {
  const axiosInstance = createAxiosInstance(sport);

  if (!season) {
    return undefined;
  }

  switch (sport) {
    case "basketball":
      if (isNBATeam) {
        return (
          await axiosNBAInstance.get<APIResponse<NBAGames>>(
            `/games?team=${teamId}&season=${season}`
          )
        ).data.response;
      }
      return (
        await axiosInstance.get<APIResponse<Games<BasketballScores>>>(
          `/games?team=${teamId}&season=${season}`
        )
      ).data.response;
    case "baseball":
      return (
        await axiosInstance.get<APIResponse<Games<BaseballScores>>>(
          `/games?team=${teamId}&season=${season}`
        )
      ).data.response;
    case "rugby":
      return (
        await axiosInstance.get<APIResponse<GamesWithPeriods<number | null>>>(
          `/games?team=${teamId}&season=${season}`
        )
      ).data.response;
    case "hockey":
      return (
        await axiosInstance.get<
          APIResponse<GamesWithPeriodsAndEvents<number | null>>
        >(`/games?team=${teamId}&season=${season}`)
      ).data.response;
    case "australian-football":
      return (
        await axiosInstance.get<APIResponse<AustralianFootballGames>>(
          `/games?league=1&team=${teamId}&season=${season}`
        )
      ).data.response;
    case "football":
      return (
        await axiosInstance.get<APIResponse<Fixtures>>(
          `/fixtures?team=${teamId}&season=${season}`
        )
      ).data.response;
    default:
      return undefined;
  }
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
  const axiosInstance = createAxiosInstance(sport);
  if (!season) {
    return undefined;
  }
  switch (sport) {
    case "baseball":
      return (
        await axiosInstance.get<APIResponse<Standings<GamesStats>[]>>(
          `/standings?league=${id}&season=${season}`
        )
      ).data.response;
    case "hockey":
      return (
        await axiosInstance.get<APIResponse<Standings<HockeyGameStats>[]>>(
          `/standings?league=${id}&season=${season}`
        )
      ).data.response;
    case "rugby":
      return (
        await axiosInstance.get<APIResponse<Standings<RugbyGameStats>[]>>(
          `/standings?league=${id}&season=${season}`
        )
      ).data.response;
    case "australian-football":
      return (
        await axiosInstance.get<APIResponse<AustralianFootballStandings>>(
          `/standings?league=${id}&season=${season}`
        )
      ).data.response;
    case "basketball":
      if (id === 12) {
        return (
          await axiosNBAInstance.get<APIResponse<NBAStandings>>(
            `/standings?league=standard&season=${season}`
          )
        ).data.response;
      }
      return (
        await axiosInstance.get<APIResponse<Standings<GamesStats>[]>>(
          `/standings?league=${id}&season=${season}`
        )
      ).data.response;
    case "football":
      return (
        await axiosInstance.get<APIResponse<StandingsReponse>>(
          `/standings?league=${id}&season=${season}`
        )
      ).data.response;
    default:
      return undefined;
  }
};

export const getStandingsByTeamIdAndSeason = async (
  teamId: number | string,
  leagueId: number | undefined,
  season: string | null,
  isNBATeam: boolean,
  sport: Sports
) => {
  const axiosInstance = createAxiosInstance(sport);
  if (!season || !leagueId) {
    return undefined;
  }

  switch (sport) {
    case "baseball":
      return (
        await axiosInstance.get<APIResponse<Standings<GamesStats>[]>>(
          `/standings?league=${leagueId}&team=${teamId}&season=${season}`
        )
      ).data.response;
    case "hockey":
      return (
        await axiosInstance.get<APIResponse<Standings<HockeyGameStats>[]>>(
          `/standings?league=${leagueId}&team=${teamId}&season=${season}`
        )
      ).data.response;
    case "rugby":
      return (
        await axiosInstance.get<APIResponse<Standings<RugbyGameStats>[]>>(
          `/standings?league=${leagueId}&team=${teamId}&season=${season}`
        )
      ).data.response;
    case "australian-football":
      return (
        await axiosInstance.get<APIResponse<AustralianFootballStandings>>(
          `/standings?league=${leagueId}&team=${teamId}&season=${season}`
        )
      ).data.response;
    case "basketball":
      if (isNBATeam) {
        return (
          await axiosNBAInstance.get<APIResponse<NBAStandings>>(
            `/standings?league=standard&team=${teamId}&season=${season}`
          )
        ).data.response;
      }
      return (
        await axiosInstance.get<APIResponse<Standings<GamesStats>[]>>(
          `/standings?league=${leagueId}&team=${teamId}&season=${season}`
        )
      ).data.response;
    case "football":
      return (
        await axiosInstance.get<APIResponse<StandingsReponse>>(
          `/standings?team=${teamId}&season=${season}`
        )
      ).data.response;
    default:
      return undefined;
  }
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
          APINonArrayResponse<AustralianFootballTeamStatistics>
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

  switch (sport) {
    case "australian-football":
      return (
        await axiosInstance.get<APIResponse<Player>>(
          `/players?team=${teamId}&season=${season}`
        )
      ).data.response;
    case "basketball":
      return (
        await axiosNBAInstance.get<APIResponse<NBAPlayer>>(
          `/players?team=${teamId}&season=${season}`
        )
      ).data.response;
    case "football":
      return (
        await axiosInstance.get<APIResponse<Squads>>(
          `/players/squads?team=${teamId}`
        )
      ).data.response;
    default:
      return undefined;
  }
};

export const getPlayerStandings = async (
  stat: string,
  id: number,
  season: string | null,
  sport: Sports
) => {
  if (!season) return undefined;

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
  const axiosInstance = createAxiosInstance(sport);

  switch (sport) {
    case "basketball":
      if (isNBATeam) {
        return (
          await axiosNBAInstance.get<APIResponse<NBAGames>>(
            `/games?id=${fixtureId}`
          )
        ).data.response;
      }
      return (
        await axiosInstance.get<APIResponse<Games<BasketballScores>>>(
          `/games?id=${fixtureId}`
        )
      ).data.response?.[0];
    case "baseball":
      return (
        await axiosInstance.get<APIResponse<Games<BaseballScores>>>(
          `/games?id=${fixtureId}`
        )
      ).data.response?.[0];
    case "rugby":
      return (
        await axiosInstance.get<APIResponse<GamesWithPeriods<number | null>>>(
          `/games?id=${fixtureId}`
        )
      ).data.response?.[0];
    case "hockey":
      return (
        await axiosInstance.get<
          APIResponse<GamesWithPeriodsAndEvents<number | null>>
        >(`/games?id=${fixtureId}`)
      ).data.response?.[0];
    case "australian-football":
      return (
        await axiosInstance.get<APIResponse<AustralianFootballGames>>(
          `/games?league=1&id=${fixtureId}`
        )
      ).data.response?.[0];
    case "football":
      return (
        await axiosInstance.get<APIResponse<Fixtures>>(
          `/fixtures?id=${fixtureId}`
        )
      ).data.response?.[0];
    default:
      return undefined;
  }
};

export const getHeadtoHeadFixtures = async (
  teamId1: number,
  teamId2: number,
  sport: Sports
) => {
  const axiosInstance = createAxiosInstance(sport);

  switch (sport) {
    case "football":
      return (
        await axiosInstance.get<APIResponse<Fixtures>>(
          `/fixtures/headtohead?h2h=${teamId1}-${teamId2}`
        )
      ).data.response;
    case "rugby":
      return (
        await axiosInstance.get<APIResponse<GamesWithPeriods<number | null>>>(
          `/games/h2h?h2h=${teamId1}-${teamId2}`
        )
      ).data.response;
    case "hockey":
      return (
        await axiosInstance.get<
          APIResponse<GamesWithPeriodsAndEvents<number | null>>
        >(`/games/h2h?h2h=${teamId1}-${teamId2}`)
      ).data.response;
    case "baseball":
      return (
        await axiosInstance.get<APIResponse<Games<BaseballScores>>>(
          `/games/h2h?h2h=${teamId1}-${teamId2}`
        )
      ).data.response;
    case "basketball":
      return (
        await axiosInstance.get<APIResponse<Games<BasketballScores>>>(
          `/games?h2h=${teamId1}-${teamId2}`
        )
      ).data.response;
    default:
      return undefined;
  }
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
    default:
      return undefined;
  }
};
