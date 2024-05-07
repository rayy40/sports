import { APIResponse, Country, Sports } from "@/types/general";
import { getBaseURL, getHeaders } from "./api";

export async function getCountries(sport: Sports) {
  try {
    const BASE_URL = getBaseURL(sport);

    const response = await fetch(`${BASE_URL}/countries`, {
      headers: getHeaders(sport),
      next: { revalidate: 24 * 60 * 60 },
    });
    const data: APIResponse<Country> = await response.json();
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
