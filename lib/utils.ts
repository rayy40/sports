import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  APIResponse,
  Filters,
  Fixtures,
  StatusType,
  Leagues,
  League,
  PlayersEntity,
  TeamStatistics,
} from "@/types/football";
import {
  Games,
  NBAGames,
  NBAStandings,
  TeamStatistics as BasketballTeamStatistics,
  Standings,
  NBAStatistics,
} from "@/types/basketball";
import { ImpFootballLeagueIds, shortStatusMap } from "./constants";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

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

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const day = date.getDate();
  const month = date.toLocaleString("en", { month: "short" });
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return { date: `${day} ${month}`, time: `${hours}:${minutes}` };
};

export const filterDataByStatus = <
  T extends {
    league?: { id: number };
    status?: { short: string };
    fixture?: { status?: { short: string } };
  }
>(
  data: T[],
  isFixture: boolean = true
): Record<string, T[]> => {
  const filteredData: Record<string, T[]> = {
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
      "fixture" in item && item.fixture
        ? item.fixture.status?.short
        : item.status?.short;
    if (!fixtureStatus) return;
    if (
      isFixture &&
      item.league &&
      !ImpFootballLeagueIds.includes(item.league.id)
    )
      return;

    if (!["CANC", "ABD", "PST", "AWD", "WO"].includes(fixtureStatus)) {
      filteredData["AllGames"].push(item);
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

export const getTeams = <T extends Fixtures | Games | NBAGames>(
  fixtures: T[]
) => {
  const teamInfo: Filters[] = [];
  const uniqueIds = new Set<number>();

  fixtures?.forEach((fixture) => {
    let awayId, awayName;
    const homeId = fixture.teams.home.id;
    const homeName = fixture.teams.home.name;
    if ("nugget" in fixture) {
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
  const leaguesData: League[] = [];
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

export const getSeasonsList = <T extends { year?: number; season?: string }>(
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

export const getPlayersByPosition = (squads: PlayersEntity[]) => {
  const playersByPosition: { [position: string]: PlayersEntity[] } = {};

  squads?.filter(Boolean).forEach((player) => {
    const postion = player.position;
    if (!playersByPosition[postion]) {
      playersByPosition[postion] = [];
    }
    playersByPosition[postion].push(player);
  });

  return playersByPosition;
};

export const getItemsByLeague = <T extends { league: { name: string } }>(
  items?: T[] | null
): { [league: string]: T[] } | null => {
  const itemsByLeague: { [league: string]: T[] } = {};

  if (!items) {
    return null;
  }

  items.filter(Boolean).forEach((item) => {
    const league = item.league.name;
    if (!itemsByLeague[league]) {
      itemsByLeague[league] = [];
    }
    itemsByLeague[league].push(item);
  });

  return itemsByLeague;
};

export const totalCards = (stats: TeamStatistics, type: "yellow" | "red") => {
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

export const getFootballTeamsRequiredStatistics = (stats: TeamStatistics) => {
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

export const getBasketballTeamsRequiredStatistics = (
  stats: BasketballTeamStatistics
) => {
  const requiredStats = [
    { label: "Matches", value: stats.games.played.all },
    { label: "Win", value: stats.games.wins.all.total },
    {
      label: "Win (%)",
      value: (parseFloat(stats.games.wins.all.percentage) * 100).toFixed(2),
    },
    { label: "Drawn", value: stats.games.draws.all.total },
    {
      label: "Drawn (%)",
      value: (parseFloat(stats.games.draws.all.percentage) * 100).toFixed(2),
    },
    { label: "Lost", value: stats.games.loses.all.total },
    {
      label: "Lost (%)",
      value: (parseFloat(stats.games.loses.all.percentage) * 100).toFixed(2),
    },
    {
      label: "Avg Points Scored",
      value: stats.points.for.average.all,
    },
    {
      label: "Avg Points Conceded",
      value: stats.points.for.average.all,
    },
    {
      label: "Points Scored (Home)",
      value: stats.points.for.total.home,
    },
    {
      label: "Points Scored (Away)",
      value: stats.points.for.total.away,
    },
    {
      label: "Points Conceded (Home)",
      value: stats.points.against.total.home,
    },
    {
      label: "Points Conceded (Away)",
      value: stats.points.against.total.away,
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
