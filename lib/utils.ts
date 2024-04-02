import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  AllTeam,
  FetchState,
  FilteredFixtures,
  Fixtures,
  StatusType,
} from "./types";
import { shortStatusMap } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchData<T>(
  url: string,
  timeout: number = 10000 // Default timeout of 10 seconds
): Promise<FetchState<T>> {
  const controller = new AbortController();
  const signal = controller.signal;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
      },
      signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
    const data: { response: T[] } = await response.json();
    return {
      loading: false,
      data: data.response,
      error: null,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if ((error as Error).name === "AbortError") {
      return {
        loading: false,
        data: null,
        error: new Error("Request timed out"),
      };
    }
    return {
      loading: false,
      data: null,
      error: error as Error,
    };
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

export const filterFixturesByStatus = (data: Fixtures[]) => {
  const filteredFixtures: FilteredFixtures = {
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
  const teamInfo: AllTeam[] = [];
  fixtures.forEach((fixture) => {
    teamInfo.push({ id: fixture.teams.home.id, name: fixture.teams.home.name });
    teamInfo.push({ id: fixture.teams.away.id, name: fixture.teams.away.name });
  });

  return teamInfo;
};
