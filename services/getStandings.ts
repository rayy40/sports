import {
  APIResponse,
  Sports,
  Standings,
  WithoutStandingEntity,
} from "@/types/general";
import { getBaseURL, getHeaders } from "./api";

export async function getStandingsByLeagueId(
  id: string,
  season: string,
  sport: Sports
) {
  try {
    const BASE_URL = getBaseURL(sport);
    const response = await fetch(
      `${BASE_URL}/standings?season=${season}&league=${id}`,
      {
        headers: getHeaders(sport),
        next: { revalidate: 15 * 60 },
      }
    );
    const data: APIResponse<WithoutStandingEntity | Standings[]> =
      await response.json();
    if (data.errors && Object.keys(data.errors).length > 0) {
      const key = Object.keys(data.errors)[0];
      const errorMessage = data.errors[key as any];
      throw new Error(
        errorMessage ??
          "There is an error while fetching data from the API. Please come back after sometime."
      );
    }
    if (!data.response) {
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

export async function getStandingsByTeamId(
  teamId: string,
  season: string,
  sport: Sports,
  leagueId?: string
) {
  try {
    const BASE_URL = getBaseURL(sport);
    const params = [];
    params.push(`season=${season}`);
    params.push(`team=${teamId}`);
    if (leagueId) {
      params.push(`league=${leagueId}`);
    }

    const paramsString = params.join("&");

    const response = await fetch(`${BASE_URL}/standings?${paramsString}`, {
      headers: getHeaders(sport),
      next: { revalidate: 15 * 60 },
    });
    const data: APIResponse<WithoutStandingEntity | Standings[]> =
      await response.json();
    if (data.errors && Object.keys(data.errors).length > 0) {
      const key = Object.keys(data.errors)[0];
      const errorMessage = data.errors[key as any];
      throw new Error(
        errorMessage ??
          "There is an error while fetching data from the API. Please come back after sometime."
      );
    }
    if (!data.response) {
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
