import {
  APINonArrayResponse,
  AllSportsTeamStats,
  Sports,
} from "@/types/general";
import { getBaseURL, getHeaders } from "./api";

export async function getTeamStatistics<T extends AllSportsTeamStats>(
  teamId: string,
  season: string,
  sport: Sports,
  leagueId: string
) {
  try {
    const BASE_URL = getBaseURL(sport);
    const response = await fetch(
      `${BASE_URL}/teams/statistics?team=${teamId}&league=${leagueId}&season=${season}`,
      {
        headers: getHeaders(sport),
        next: { revalidate: 24 * 60 * 60 },
      }
    );
    const data: APINonArrayResponse<T> = await response.json();
    if (data.errors && Object.keys(data.errors).length > 0) {
      const key = Object.keys(data.errors)[0];
      const errorMessage = data.errors[key as any];
      throw new Error(
        errorMessage ??
          "There is an error while fetching data from the API. Please come back after sometime."
      );
    }
    if (!data.response) {
      throw new Error("No statistics found.");
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
