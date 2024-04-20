import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  APIResponse,
  Filters,
  StatusType,
  Leagues,
  League as FootballLeague,
  PlayersEntity,
  TeamStatistics as FootballTeamStatistics,
} from "@/types/football";
import {
  NBAPlayer,
  NBAStandings,
  NBAStatistics,
  NBATeams,
} from "@/types/basketball";
import {
  TeamStatistics,
  Standings,
  League,
  Teams,
  AllSportsFixtures,
  isFootballFixture,
  isNBAFixture,
  isAFLFixture,
} from "@/types/general";
import { ImpFootballLeagueIds, shortStatusMap } from "./constants";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Row } from "@tanstack/react-table";
import { AustralianFootballStatistics } from "@/types/australian-football";
import { differenceInYears } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getAPIData<T>(param: string) {
  const response = await fetch(`https://v3.football.api-sports.io/${param}`, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "v3.football.api-sports.io",
      "x-rapidapi-key":
        process.env.RAPIDAPI_KEY ?? process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
    },
  });
  const data: Promise<APIResponse<T>> = response.json();
  return data;
}

export async function fetchAPI<T>(param: string) {
  try {
    const response = await fetch(
      `https://v1.basketball.api-sports.io${param}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "v1.basketball.api-sports.io",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
        },
        cache: "force-cache",
      }
    );
    const data: APIResponse<T> = await response.json();
    if (!response.ok) {
      throw Error("Something went wrong, Please try again.");
    }
    return { data: data?.response, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const day = date.getDate();
  const month = date.toLocaleString("en", { month: "short" });
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return { date: `${day} ${month}`, time: `${hours}:${minutes}` };
};

export const filterDataByStatus = (
  data: AllSportsFixtures[],
  isFootball: boolean = false
) => {
  const filteredData: Record<string, AllSportsFixtures[]> = {
    AllGames: [],
    Scheduled: [],
    InPlay: [],
    Finished: [],
    Postponed: [],
    Cancelled: [],
    Abandoned: [],
    NotPlayed: [],
  };

  data.forEach((item) => {
    const fixtureStatus =
      "fixture" in item
        ? item.fixture?.status?.short
        : item.status?.short.toString();
    if (!fixtureStatus) return;

    if (
      isFootball &&
      isFootballFixture(item) &&
      !ImpFootballLeagueIds.includes(item.league.id)
    ) {
      return;
    }

    if (!["CANC", "ABD", "PST", "AWD", "WO"].includes(fixtureStatus)) {
      filteredData.AllGames.push(item);
    }

    const statusType = Object.keys(shortStatusMap).find((type) =>
      shortStatusMap[type as StatusType]?.includes(fixtureStatus)
    );
    if (statusType) {
      filteredData[statusType].push(item);
    }
  });

  return filteredData;
};

export const getTeams = <T extends { teams: Teams | NBATeams }>(
  fixtures: T[]
) => {
  const teamInfo: Filters[] = [];
  const uniqueIds = new Set<number>();

  fixtures?.forEach((fixture) => {
    let awayId, awayName;
    const homeId = fixture.teams.home.id;
    const homeName = fixture.teams.home.name;
    if ("visitors" in fixture.teams) {
      awayId = fixture.teams.visitors.id;
      awayName = fixture.teams.visitors.name;
    } else {
      awayId = fixture.teams.away.id;
      awayName = fixture.teams.away.name;
    }

    if (!uniqueIds.has(homeId)) {
      teamInfo.push({
        id: homeId,
        name: homeName,
      });
      uniqueIds.add(homeId);
    }

    if (!uniqueIds.has(awayId)) {
      teamInfo.push({
        id: awayId,
        name: awayName,
      });
      uniqueIds.add(awayId);
    }
  });

  return teamInfo;
};

export const getLeagues = <
  T extends { league: string | { name: string; id: number } }
>(
  items: T[],
  isFixture: boolean = true
) => {
  const leagueInfo: Filters[] = [];
  const uniqueIds = new Set<string>();

  items?.forEach((item, index) => {
    if (typeof item.league !== "string") {
      if (
        "id" in item.league &&
        isFixture &&
        !ImpFootballLeagueIds.includes(item.league.id)
      )
        return;
      if (!uniqueIds.has(item.league.name)) {
        leagueInfo.push({ id: item.league.id, name: item.league.name });
        uniqueIds.add(item.league.name);
      }
    } else {
      if (!uniqueIds.has(item.league)) {
        leagueInfo.push({ id: index, name: item.league });
        uniqueIds.add(item.league);
      }
    }
  });

  return leagueInfo;
};

export const refactorLeagues = (leagues: Leagues[]) => {
  const leaguesData: FootballLeague[] = [];
  leagues.forEach((league) => {
    leaguesData.push(league.league);
  });
  return leaguesData;
};

export const formatDatePattern = (date: Date) => {
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  return formattedDate;
};

export const formatDatePatternLong = (dt: string) => {
  const date = new Date(dt);
  const formattedDate = date.toLocaleString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return formattedDate;
};

export const filterSearch = <T extends { name: string }>(
  e: ChangeEvent<HTMLInputElement>,
  data: T[],
  setData: Dispatch<SetStateAction<T[]>>,
  setValue: Dispatch<SetStateAction<string>>
) => {
  const keyword = e.target.value;

  if (keyword !== "") {
    const results = data?.filter((d) => {
      return d.name.toLowerCase().startsWith(keyword.toLowerCase());
    });
    setData(results ?? []);
  } else {
    setData(data ?? []);
  }

  setValue(keyword);
};

export const getSeasonsList = <
  T extends {
    year?: number;
    season?: string;
  }
>(
  seasonsList: T[]
): string[] => {
  const seasons: string[] = [];
  seasonsList
    .slice()
    .reverse()
    .forEach((season) => {
      seasons.push(season.year?.toString() || season.season || "");
    });
  return seasons;
};

export const getPlayersByPosition = (squads: (PlayersEntity | NBAPlayer)[]) => {
  const playersByPosition: {
    [position: string]: PlayersEntity[];
  } = {};

  squads?.filter(Boolean).forEach((player) => {
    const postion =
      "college" in player ? player.leagues.standard.pos : player.position;
    if (!playersByPosition[postion]) {
      playersByPosition[postion] = [];
    }
    const id = player.id;
    const name =
      "college" in player
        ? `${player.firstName} ${player.lastName}`
        : player.name;
    const photo = "college" in player ? "" : player.photo;
    const number =
      "college" in player ? player.leagues.standard.jersey : player.number;
    const age =
      "college" in player
        ? differenceInYears(player.birth.date, "YYYY-MM-DD")
        : player.age;
    const position =
      "college" in player ? player.leagues.standard.pos : player.position;
    player = { id, name, photo, number, age, position };
    playersByPosition[postion].push(player);
  });

  return playersByPosition;
};

export const getItemsByLeague = <T extends AllSportsFixtures>(
  items: T[]
): { [league: string]: T[] } => {
  const itemsByLeague = items.reduce((acc, item) => {
    const league = !isNBAFixture(item)
      ? "name" in item.league
        ? item.league.name
        : "AFL"
      : item.league;
    acc[league] = acc[league] || [];
    acc[league].push(item);
    return acc;
  }, {} as { [league: string]: T[] });

  return itemsByLeague;
};

export const totalCards = (
  stats: FootballTeamStatistics,
  type: "yellow" | "red"
) => {
  const totalCards: number = Object.values(stats.cards?.[type]).reduce(
    (acc, card) => {
      if (card.total !== null) {
        return acc + card.total;
      } else {
        return acc;
      }
    },
    0
  );

  return totalCards;
};

export const getLeagueId = (
  league:
    | string
    | League<string>
    | {
        id: number;
        season: number;
      }
    | FootballLeague
) => {
  if (typeof league === "string") {
    return 12;
  } else {
    return league.id;
  }
};

export const getLeagueName = (
  league:
    | string
    | League<string>
    | {
        id: number;
        season: number;
      }
    | FootballLeague
) => {
  if (typeof league === "string") {
    return "standard";
  } else if ("flag" in league) {
    return league.name;
  } else if ("type" in league) {
    return league.name;
  } else {
    return "AFL";
  }
};

export const getFixtureData = (
  fixture: AllSportsFixtures & { leagueId: number; leagueName: string }
) => {
  const homeTeam = {
    logo: fixture.teams.home.logo!,
    name: fixture.teams.home.name,
  };

  let awayTeam;
  if ("visitors" in fixture.teams) {
    awayTeam = {
      logo: fixture.teams.visitors.logo,
      name: fixture.teams.visitors.name,
    };
  } else {
    awayTeam = {
      logo: fixture.teams.away.logo!,
      name: fixture.teams.away.name,
    };
  }

  let fixtureId,
    fixtureDate,
    fixtureStatus,
    fixtureRound,
    homeTeamScore,
    awayTeamScore;
  if (isFootballFixture(fixture)) {
    fixtureId = fixture.fixture.id;
    fixtureDate = fixture.fixture.date;
    fixtureStatus = fixture.fixture.status;
    fixtureRound = fixture.league.round;
    homeTeamScore = fixture.goals.home;
    awayTeamScore = fixture.goals.away;
  } else if (isNBAFixture(fixture)) {
    fixtureId = fixture.id;
    fixtureDate = fixture.date.start;
    fixtureStatus = fixture.status;
    fixtureRound = fixture.stage;
    homeTeamScore = fixture.scores.home.points;
    awayTeamScore = fixture.scores.visitors.points;
  } else if (isAFLFixture(fixture)) {
    fixtureId = fixture.game.id;
    fixtureDate = fixture.date;
    fixtureStatus = fixture.status;
    fixtureRound = fixture.round;
    homeTeamScore = fixture.scores.home.score;
    awayTeamScore = fixture.scores.away.score;
  } else {
    fixtureId = fixture.id;
    fixtureDate = fixture.date;
    fixtureStatus = fixture.status;
    fixtureRound = fixture.week;
    homeTeamScore =
      typeof fixture.scores.home === "number"
        ? fixture.scores.home
        : fixture.scores.home?.total;
    awayTeamScore =
      typeof fixture.scores.away === "number"
        ? fixture.scores.away
        : fixture.scores.away?.total;
  }

  return {
    homeTeam,
    awayTeam,
    homeTeamScore,
    awayTeamScore,
    fixtureId,
    fixtureDate,
    fixtureStatus,
    fixtureRound,
  };
};

export const getScores = <T extends AllSportsFixtures>(row: Row<T>) => {
  let homeScore, awayScore;

  if ("nugget" in row.original) {
    homeScore = row.original.scores.home.points;
    awayScore = row.original.scores.visitors.points;
  } else if ("scores" in row.original) {
    if (
      typeof row.original.scores.home !== "number" &&
      typeof row.original.scores.away !== "number"
    ) {
      homeScore =
        row.original.scores.home !== null
          ? "score" in row.original.scores.home
            ? row.original.scores.home.score
            : row.original.scores.home.total
          : null;
      awayScore =
        row.original.scores.away !== null
          ? "score" in row.original.scores.away
            ? row.original.scores.away.score
            : row.original.scores.away.total
          : null;
    } else {
      homeScore = row.original.scores.home as number | null;
      awayScore = row.original.scores.away as number | null;
    }
  } else {
    homeScore = row.original.goals.home;
    awayScore = row.original.goals.away;
  }

  const isHomeScoreMore = homeScore && awayScore && homeScore > awayScore;
  const isAwayScoreMore = homeScore && awayScore && homeScore < awayScore;

  return { homeScore, awayScore, isHomeScoreMore, isAwayScoreMore };
};

export const getFootballTeamsRequiredStatistics = (
  stats: FootballTeamStatistics
) => {
  const biggestWin =
    stats.biggest.goals.for.home > stats.biggest.goals.against.away
      ? stats.biggest.wins.home
      : stats.biggest.wins.away;

  const requiredStats = [
    { label: "Matches", value: stats.fixtures.played.total },
    { label: "Win", value: stats.fixtures.wins.total },
    { label: "Lost", value: stats.fixtures.loses.total },
    {
      label: "Goals",
      value: stats.goals.for.total.total + stats.goals.against.total.total,
    },
    { label: "Biggest Win", value: biggestWin },
    { label: "Clean Sheet", value: stats.clean_sheet.total },
    { label: "Streak", value: stats.biggest.streak.wins },
    { label: "Yellow Cards", value: totalCards(stats, "yellow") },
    { label: "Red Cards", value: totalCards(stats, "red") },
    { label: "Formation", value: stats.lineups?.[0].formation },
  ];

  return requiredStats;
};

export const getTeamsRequiredStatistics = (stats: TeamStatistics) => {
  const PointsOrGoals = stats.points || stats.goals;
  const isPointsOrGoals = stats.points ? "Points" : "Goals";

  const requiredStats = [
    { label: "Matches", value: stats.games.played.all ?? "-" },
    { label: "Win", value: stats.games.wins.all.total ?? "-" },
    {
      label: "Win (%)",
      value: stats.games.wins.all.percentage
        ? (parseFloat(stats.games.wins.all.percentage) * 100).toFixed(2)
        : "-",
    },
    { label: "Drawn", value: stats.games.draws.all.total ?? "-" },
    {
      label: "Drawn (%)",
      value: stats.games.draws.all.percentage
        ? (parseFloat(stats.games.draws.all.percentage) * 100).toFixed(2)
        : "-",
    },
    { label: "Lost", value: stats.games.loses.all.total ?? "-" },
    {
      label: "Lost (%)",
      value: stats.games.loses.all.percentage
        ? (parseFloat(stats.games.loses.all.percentage) * 100).toFixed(2)
        : "-",
    },
    {
      label: `Avg ${isPointsOrGoals} Scored`,
      value: PointsOrGoals?.for.average.all ?? "-",
    },
    {
      label: `Avg ${isPointsOrGoals} Conceded`,
      value: PointsOrGoals?.for.average.all ?? "-",
    },
    {
      label: `${isPointsOrGoals} Scored (Home)`,
      value: PointsOrGoals?.for.total.home ?? "-",
    },
    {
      label: `${isPointsOrGoals} Scored (Away)`,
      value: PointsOrGoals?.for.total.away ?? "-",
    },
    {
      label: `${isPointsOrGoals} Conceded (Home)`,
      value: PointsOrGoals?.against.total.home ?? "-",
    },
    {
      label: `${isPointsOrGoals} Conceded (Away)`,
      value: PointsOrGoals?.against.total.away ?? "-",
    },
  ];
  return requiredStats;
};

export const getNBATeamsRequiredStatistics = (stats: NBAStatistics) => {
  const requiredStats = [
    { label: "Points", value: stats.points },
    { label: "Assists", value: stats.assists },
    { label: "Rebounds", value: stats.totReb },
    { label: "Field Goal (%)", value: stats.fgp },
    { label: "Three Point (%)", value: stats.tpp },
    { label: "Free Throw (%)", value: stats.ftp },
    {
      label: "Steals",
      value: stats.steals,
    },
    {
      label: "TurnOvers",
      value: stats.turnovers,
    },
    {
      label: "Blocks",
      value: stats.blocks,
    },
    {
      label: "Plus/Minus",
      value: stats.plusMinus,
    },
    {
      label: "Biggest Lead",
      value: stats.biggestLead,
    },
    {
      label: "Longest Run",
      value: stats.longestRun,
    },
  ];
  return requiredStats;
};

export const getAFLTeamsRequiredStatistics = (
  stats: AustralianFootballStatistics
) => {
  const requiredStats = [
    { label: "Played", value: stats.games.played },
    { label: "Goals", value: stats.scoring.goals.total ?? "-" },
    { label: "Assists", value: stats.scoring.assists.total ?? "-" },
    { label: "Behinds", value: stats.scoring.behinds.total ?? "-" },
    { label: "Disposals", value: stats.disposals.disposals.total ?? "-" },
    { label: "Kicks", value: stats.disposals.kicks.total ?? "-" },
    { label: "Free Kicks", value: stats.disposals.free_kicks.total ?? "-" },
    { label: "Handballs", value: stats.disposals.handballs.total ?? "-" },
    { label: "Hitouts", value: stats.stoppages.hitouts.total ?? "-" },
    { label: "Clearances", value: stats.stoppages.clearances.total ?? "-" },
    { label: "Marks", value: stats.marks.total ?? "-" },
    { label: "Tackles", value: stats.defence.tackles.total ?? "-" },
  ];
  return requiredStats;
};

type GroupedData<T extends Standings | NBAStandings> = {
  [groupName: string]: T[];
};

export const groupStandingsByProperty = <T extends Standings | NBAStandings>(
  data: T[],
  groupByProperty: (item: T) => string
): GroupedData<T> => {
  const standingsByGroup: GroupedData<T> = {};
  data?.filter(Boolean).forEach((standing) => {
    const groupName = groupByProperty(standing) as string;
    if (!standingsByGroup[groupName]) {
      standingsByGroup[groupName] = [];
    }
    standingsByGroup[groupName].push(standing);
  });

  return standingsByGroup;
};

export const getWeek = (week: string | null) => {
  const wk =
    week !== null && !isNaN(Number(week))
      ? `Week - ${week}`
      : week !== null
      ? week
      : "";
  return wk;
};
