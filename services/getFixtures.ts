import { APIResponse, AllSportsFixtures, Sports } from "@/types/general";
import { getBaseURL, getHeaders } from "./api";

export async function getFixturesByDate(date: string, sport: Sports) {
  try {
    const BASE_URL = getBaseURL(sport);
    const response = await fetch(
      `${BASE_URL}/${sport === "football" ? "fixtures" : "games"}?date=${date}`,
      {
        headers: getHeaders(sport),
        next: { revalidate: 15 * 60 },
      }
    );
    const data: APIResponse<AllSportsFixtures> = await response.json();
    if (!Array.isArray(data.errors)) {
      console.log(data.errors);
      throw new Error(
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

export async function getFixturesByLeagueId(
  id: string,
  season: string,
  sport: Sports
) {
  try {
    const BASE_URL = getBaseURL(sport);
    const response = await fetch(
      `${BASE_URL}/${
        sport === "football" ? "fixtures" : "games"
      }?season=${season}&league=${id}`,
      {
        headers: getHeaders(sport),
        next: { revalidate: 15 * 60 },
      }
    );
    const data: APIResponse<AllSportsFixtures> = await response.json();
    if (!Array.isArray(data.errors)) {
      console.log(data.errors);
      throw new Error(
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

export async function getFixturesByTeamId(
  id: string,
  season: string,
  sport: Sports
) {
  try {
    const BASE_URL = getBaseURL(sport);
    const params = [];
    params.push(`season=${season}`);
    params.push(`team=${id}`);
    if (sport === "australian-football") {
      params.push(`league=1`);
    }
    const paramsString = params.join("&");
    const response = await fetch(
      `${BASE_URL}/${
        sport === "football" ? "fixtures" : "games"
      }?${paramsString}`,
      {
        headers: getHeaders(sport),
        next: { revalidate: 15 * 60 },
      }
    );
    const data: APIResponse<AllSportsFixtures> = await response.json();
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

export async function getFixtureById(id: string, sport: Sports) {
  try {
    const BASE_URL = getBaseURL(sport);
    const response = await fetch(
      `${BASE_URL}/${sport === "football" ? "fixtures" : "games"}?id=${id}`,
      {
        headers: getHeaders(sport),
        next: { revalidate: 15 * 60 },
      }
    );
    const data: APIResponse<AllSportsFixtures> = await response.json();
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
    return { success: data.response[0] };
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      return { error: e.message };
    }
    return { error: "Something went wrong." };
  }
}

export async function getHeadtoHeadFixtures(
  teamId1: number,
  teamId2: number,
  sport: Sports
) {
  try {
    const BASE_URL = getBaseURL(sport);

    if (["american-football", "australian-football"].includes(sport)) {
      throw new Error("No head to head fixtures for this sport.");
    }

    const response = await fetch(
      `${BASE_URL}/${
        sport === "football"
          ? "fixtures/headtohead"
          : sport === "basketball"
          ? "games"
          : "games/h2h"
      }?h2h=${teamId1}-${teamId2}`,
      {
        headers: getHeaders(sport),
        next: { revalidate: 15 * 60 },
      }
    );
    const data: APIResponse<AllSportsFixtures> = await response.json();
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

export async function getFeaturedFixtures(
  date: string,
  season: string,
  sport: Sports,
  id?: string
) {
  try {
    const BASE_URL = getBaseURL(sport);

    const params = [];

    if (id) {
      params.push(`date=${date}&league=${id}&season=${season}`);
    } else {
      params.push(`date=${date}`);
    }

    const paramsString = params.join("&");

    const response = await fetch(
      `${BASE_URL}/${
        sport === "football" ? "fixtures" : "games"
      }?${paramsString}`,
      {
        headers: getHeaders(sport),
        next: { revalidate: 15 * 60 },
      }
    );
    const data: APIResponse<AllSportsFixtures> = await response.json();
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
