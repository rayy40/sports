import { APIResponse, TeamResponse, Sports } from "@/types/general";
import { getBaseURL, getHeaders } from "./api";
import { TeamResponse as FootballTeamResponse } from "@/types/football";

export async function getTeamById<
  T extends FootballTeamResponse | TeamResponse
>(id: string, sport: Sports) {
  try {
    const BASE_URL = getBaseURL(sport);
    const response = await fetch(`${BASE_URL}/teams?id=${id}`, {
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
      success: data.response[0],
    };
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      return { error: e.message };
    }
    return { error: "Something went wrong." };
  }
}
