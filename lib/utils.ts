import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  APIResponse,
  Filters,
  FilteredFixtures,
  Fixtures,
  StatusType,
  StandingsType,
  StandingsEntity,
  Leagues,
  League,
  SeasonsEntity,
  PlayersEntity,
  TeamStatistics,
} from "./types";
import { shortStatusMap } from "./constants";
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

export const filterFixturesByStatus = (data: Fixtures[]) => {
  const filteredFixtures: FilteredFixtures = {
    AllGames: [],
    Scheduled: [],
    InPlay: [],
    Finished: [],
    Postponed: [],
    Cancelled: [],
    Abandoned: [],
    NotPlayed: [],
  };
  Object.keys(shortStatusMap).forEach((status) => {
    filteredFixtures[status as StatusType] = [];
  });
  data.forEach((fixture) => {
    const fixtureStatus = fixture.fixture.status.short;

    const statusType = Object.keys(shortStatusMap).find((type) =>
      shortStatusMap[type as StatusType].includes(fixtureStatus)
    );

    if (statusType) {
      filteredFixtures[statusType as StatusType].push(fixture);
    }
  });

  return filteredFixtures;
};

export const getTeams = (fixtures: Fixtures[]) => {
  const teamInfo: Filters[] = [];
  const uniqueIds = new Set<number>();

  fixtures?.forEach((fixture) => {
    if (!uniqueIds.has(fixture.teams.home.id || fixture.teams.away.id)) {
      teamInfo.push({
        id: fixture.teams.home.id,
        name: fixture.teams.home.name,
      });
      teamInfo.push({
        id: fixture.teams.away.id,
        name: fixture.teams.away.name,
      });
      uniqueIds.add(fixture.teams.home.id);
      uniqueIds.add(fixture.teams.away.id);
    }
  });

  return teamInfo;
};

export const getLeagues = (fixtures: Fixtures[]) => {
  const leagueInfo: Filters[] = [];
  const uniqueIds = new Set<number>();

  fixtures?.forEach((fixture) => {
    if (!uniqueIds.has(fixture.league.id)) {
      leagueInfo.push({ id: fixture.league.id, name: fixture.league.name });
      uniqueIds.add(fixture.league.id);
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

export const getStandings = (standings: StandingsType) => {
  const standingsByGroup: { [groupName: string]: StandingsEntity[] } = {};

  standings?.standings?.filter(Boolean).forEach((standing) => {
    if (standing !== null) {
      standing.forEach((s) => {
        const groupName = s.group;
        if (!standingsByGroup[groupName]) {
          standingsByGroup[groupName] = [];
        }
        standingsByGroup[groupName].push(s);
      });
    }
  });

  return standingsByGroup;
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

export const getSeasonsList = (seasonsList: SeasonsEntity[]) => {
  const seasons: number[] = [];
  seasonsList
    .slice()
    .reverse()
    .forEach((season) => {
      seasons.push(season.year);
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

export const getTeamsRequiredStatistics = (stats: TeamStatistics) => {
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
