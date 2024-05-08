import { Sports } from "@/types/general";

export const getBaseURL = (sport: Sports) => {
  switch (sport) {
    case "american-football":
    case "basketball":
    case "baseball":
    case "rugby":
    case "hockey":
      return `https://v1.${sport}.api-sports.io`;
    case "australian-football":
      return `https://v1.afl.api-sports.io`;
    case "football":
      return `https://v3.football.api-sports.io`;
    default:
      return undefined;
  }
};

export const getHost = (sport: Sports) => {
  switch (sport) {
    case "american-football":
    case "basketball":
    case "baseball":
    case "rugby":
    case "hockey":
      return `v1.${sport}.api-sports.io`;
    case "australian-football":
      return `https://v1.afl.api-sports.io`;
    case "football":
      return `v3.football.api-sports.io`;
    default:
      return undefined;
  }
};

export const getHeaders = (sport: Sports) => {
  const host = getHost(sport);
  if (!host) throw new Error("Unrecognized sport");
  return {
    "x-rapidapi-host": host,
    "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
  };
};
