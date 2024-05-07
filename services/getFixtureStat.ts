import { APIResponse, Sports } from "@/types/general";
import { getBaseURL, getHeaders } from "./api";
import { HockeyEvents } from "@/types/hockey";
import {
  NFLEvents,
  NFLTeamsStatisticsResponse as NFLStatsResponse,
} from "@/types/american-football";
import { AustralianFootballFixtureStatisticsResponse as AFLStatsResponse } from "@/types/australian-football";
import { FixtureStatisticsResponse, Lineups, Timeline } from "@/types/football";

export async function getFixtureEvents(id: string, sport: Sports) {
  try {
    const BASE_URL = getBaseURL(sport);

    if (!["hockey", "american-football", "football"].includes(sport)) {
      throw new Error("No events found for this sport.");
    }

    const params = [];
    if (sport === "hockey") {
      params.push(`game=${id}`);
    } else if (sport === "american-football") {
      params.push(`id=${id}`);
    } else if (sport === "football") {
      params.push(`fixture=${id}`);
    }
    const paramsString = params.join("&");

    const response = await fetch(
      `${BASE_URL}/${
        sport === "football" ? "fixtures" : "games"
      }/events?${paramsString}`,
      {
        headers: getHeaders(sport),
        next: { revalidate: 15 * 60 },
      }
    );
    const data: APIResponse<HockeyEvents | NFLEvents | Timeline> =
      await response.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      const key = Object.keys(data.errors)[0];
      const errorMessage = data.errors[key as any];
      throw new Error(
        errorMessage ??
          "There is an error while fetching data from the API. Please come back after sometime."
      );
    }
    if (!data.response || data.response.length === 0) {
      throw new Error("No fixtures found.");
    }
    return { success: data.response };
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      return { error: e.message };
    }
    return { error: "Something went wrong." };
  }
}

export async function getFixtureStatistics(id: string, sport: Sports) {
  try {
    const BASE_URL = getBaseURL(sport);

    if (
      !["australian-football", "american-football", "football"].includes(sport)
    ) {
      throw new Error("No events found for this sport.");
    }

    const params = [];
    if (sport === "football") {
      params.push(`fixture=${id}`);
    } else {
      params.push(`id=${id}`);
    }

    const paramsString = params.join("&");

    const response = await fetch(
      `${BASE_URL}/${
        sport === "football" ? "fixtures" : "games"
      }/statistics/teams?${paramsString}`,
      {
        headers: getHeaders(sport),
        next: { revalidate: 15 * 60 },
      }
    );

    const data: APIResponse<
      NFLStatsResponse | AFLStatsResponse<number> | FixtureStatisticsResponse
    > = await response.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      const key = Object.keys(data.errors)[0];
      const errorMessage = data.errors[key as any];
      throw new Error(
        errorMessage ??
          "There is an error while fetching data from the API. Please come back after sometime."
      );
    }
    if (!data.response || data.response.length === 0) {
      throw new Error("No fixtures found.");
    }
    return {
      success:
        sport === "australian-football"
          ? (data.response[0] as AFLStatsResponse<number>).teams
          : (data.response as (NFLStatsResponse | FixtureStatisticsResponse)[]),
    };
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      return { error: e.message };
    }
    return { error: "Something went wrong." };
  }
}

export async function getFixtureLineups(id: string, sport: Sports) {
  try {
    const BASE_URL = getBaseURL(sport);

    if (!["football"].includes(sport)) {
      throw new Error("No events found for this sport.");
    }

    const response = await fetch(`${BASE_URL}/fixtures/lineups?fixture=${id}`, {
      headers: getHeaders(sport),
      next: { revalidate: 15 * 60 },
    });
    const data: APIResponse<Lineups> = await response.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      const key = Object.keys(data.errors)[0];
      const errorMessage = data.errors[key as any];
      throw new Error(
        errorMessage ??
          "There is an error while fetching data from the API. Please come back after sometime."
      );
    }
    if (!data.response || data.response.length === 0) {
      throw new Error("No fixtures found.");
    }
    return { success: data.response };
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      return { error: e.message };
    }
    return { error: "Something went wrong." };
  }
}
