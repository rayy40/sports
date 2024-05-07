import { APIResponse } from "@/types/general";
import { getBaseURL, getHeaders } from "./api";
import { PlayerStats } from "@/types/football";

export async function getPlayerStats(id: string, season: string, type: string) {
  try {
    const BASE_URL = getBaseURL("football");
    const response = await fetch(
      `${BASE_URL}/players/${type}?league=${id}&season=${season}`,
      {
        headers: getHeaders("football"),
        next: { revalidate: 60 * 60 },
      }
    );
    const data: APIResponse<PlayerStats> = await response.json();
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
