import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  APIResponse,
  AllTeamOrAllLeague,
  FilteredFixtures,
  Fixtures,
  StatusType,
} from "./types";
import { shortStatusMap } from "./constants";

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
  const teamInfo: AllTeamOrAllLeague[] = [];
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
  const leagueInfo: AllTeamOrAllLeague[] = [];
  const uniqueIds = new Set<number>();

  fixtures?.forEach((fixture) => {
    if (!uniqueIds.has(fixture.league.id)) {
      leagueInfo.push({ id: fixture.league.id, name: fixture.league.name });
      uniqueIds.add(fixture.league.id);
    }
  });

  return leagueInfo;
};
