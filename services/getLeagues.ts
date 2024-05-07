import { APIResponse, League, Seasons, Sports } from "@/types/general";
import { getBaseURL, getHeaders } from "./api";
import { Leagues } from "@/types/football";
import { AustralianFootballLeagueOrTeamInfo as AFLLeague } from "@/types/australian-football";

export async function getLeagueById<
  T extends Leagues | League<Seasons[]> | AFLLeague
>(id: string, sport: Sports) {
  try {
    const BASE_URL = getBaseURL(sport);
    const response = await fetch(`${BASE_URL}/leagues?id=${id}`, {
      headers: getHeaders(sport),
      next: { revalidate: 24 * 60 * 60 },
    });
    const data: APIResponse<T> = await response.json();
    if (data.errors && Object.keys(data.errors).length > 0) {
      const key = Object.keys(data.errors)[0];
      const errorMessage = data.errors[key as any];
      throw new Error(
        errorMessage ??
          "There is an error while fetching data from the API. Please come back after sometime."
      );
    }
    if (!data.response) {
      throw new Error("No league found.");
    }
    return {
      success:
        sport === "australian-football" ? data.response : data.response[0],
    };
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      return { error: e.message };
    }
    return { error: "Something went wrong." };
  }
}

export async function getLeagueByCode<T extends League<Seasons[]> | Leagues>(
  code: string,
  sport: Sports
) {
  try {
    const BASE_URL = getBaseURL(sport);
    const response = await fetch(`${BASE_URL}/leagues?code=${code}`, {
      headers: getHeaders(sport),
      next: { revalidate: 24 * 60 * 60 },
    });
    const data: APIResponse<T> = await response.json();
    if (data.errors && Object.keys(data.errors).length > 0) {
      const key = Object.keys(data.errors)[0];
      const errorMessage = data.errors[key as any];
      throw new Error(
        errorMessage ??
          "There is an error while fetching data from the API. Please come back after sometime."
      );
    }
    if (!data.response) {
      throw new Error("No league found.");
    }
    return {
      success: data.response,
    };
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      return { error: e.message };
    }
    return { error: "Something went wrong." };
  }
}
