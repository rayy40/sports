import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Leagues,
  League as FootballLeague,
  PlayersEntity,
  TeamStatistics as FootballTeamStatistics,
  FixtureStatisticsResponse,
  Timeline,
} from "@/types/football";
import {
  NBAPlayer,
  NBAStandings,
  NBAStatistics,
  NBATeams,
} from "@/types/basketball";
import {
  NFLEvents,
  League as NFLLeague,
  NFLPlayer,
  NFLStandings,
  NFLTeamsStatisticsResponse,
} from "@/types/american-football";
import {
  Filters,
  APIResponse,
  StatusType,
  TeamStatistics,
  Standings,
  League,
  Teams,
  AllSportsFixtures,
  isFootballFixture,
  isNBAFixture,
  isAFLFixture,
  isNFLFixture,
  Sports,
} from "@/types/general";
import { impFootballLeagueIds, shortStatusMap } from "./constants";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import {
  AustralianFootballFixtureStatistics,
  AustralianFootballStatistics,
  TotalOrAverageStats,
} from "@/types/australian-football";
import { differenceInYears } from "date-fns";
import { HockeyEvents } from "@/types/hockey";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl(url: string) {
  const segments = url.split("/");
  segments.pop();
  return segments.join("/");
}

export const getTeams = (fixtures: AllSportsFixtures[]) => {
  const teamInfo: string[] = [];
  const uniqueIds = new Set<string>();

  fixtures?.forEach((fixture) => {
    const { homeTeam, awayTeam } = getFixtureData(fixture);

    if (!uniqueIds.has(homeTeam.name.toLowerCase())) {
      teamInfo.push(homeTeam.name);
      uniqueIds.add(homeTeam.name);
    }

    if (!uniqueIds.has(awayTeam.name)) {
      teamInfo.push(awayTeam.name);
      uniqueIds.add(awayTeam.name);
    }
  });

  return teamInfo;
};

export const getLeagues = (fixtures: AllSportsFixtures[]) => {
  const leagueInfo: string[] = [];
  const uniqueIds = new Set<string>();

  fixtures?.forEach((fixture) => {
    const { fixtureLeague } = getFixtureData(fixture);
    if (!uniqueIds.has(fixtureLeague.name)) {
      leagueInfo.push(fixtureLeague.name);
      uniqueIds.add(fixtureLeague.name);
    }
  });

  return leagueInfo;
};

export const getSeasonsList = <
  T extends {
    year?: number;
    season?: string;
  }
>(
  seasonsList: T[]
): string[] => {
  const seasons: string[] = [];
  seasonsList
    .slice()
    .reverse()
    .forEach((season) => {
      seasons.push(season.year?.toString() || season.season || "");
    });
  return seasons;
};

export const getPlayersByPosition = (
  squads: (PlayersEntity | NBAPlayer | NFLPlayer)[]
) => {
  const playersByPosition: {
    [position: string]: any[];
  } = {};

  squads?.filter(Boolean).forEach((player) => {
    const position =
      "nba" in player ? player.leagues.standard.pos : player.position;
    if (!playersByPosition[position]) {
      playersByPosition[position] = [];
    }
    const id = player.id;
    const height = "height" in player ? player.height : undefined;
    const weight = "weight" in player ? player.weight : undefined;
    const name =
      "nba" in player ? `${player.firstName} ${player.lastName}` : player.name;
    const photo =
      "nba" in player ? "" : "photo" in player ? player.photo : player.image;
    const number =
      "nba" in player
        ? player.leagues.standard.jersey
        : typeof player.number === "string"
        ? parseInt(player.number)
        : player.number;
    const age =
      "nba" in player
        ? differenceInYears(player.birth.date, "YYYY-MM-DD")
        : player.age;
    player = { id, name, photo, number, age, position, height, weight };
    playersByPosition[position].push(player);
  });

  return playersByPosition;
};

export const getItemsByLeague = <T extends AllSportsFixtures>(
  items: T[]
): { [league: string]: T[] } => {
  const itemsByLeague = items.reduce((acc, item) => {
    const league = !isNBAFixture(item)
      ? "name" in item.league
        ? item.league.name
        : "AFL"
      : item.league;
    acc[league] = acc[league] || [];
    acc[league].push(item);
    return acc;
  }, {} as { [league: string]: T[] });

  return itemsByLeague;
};

export const totalCards = (
  stats: FootballTeamStatistics,
  type: "yellow" | "red"
) => {
  const totalCards: number = Object.values(stats.cards?.[type]).reduce(
    (acc, card) => {
      if (card.total !== null) {
        return acc + card.total;
      } else {
        return acc;
      }
    },
    0
  );

  return totalCards;
};

export const getLeagueId = (
  league:
    | string
    | League<string>
    | {
        id: number;
        season: number;
      }
    | FootballLeague
    | NFLLeague
) => {
  if (typeof league === "string") {
    return 12;
  } else {
    return league.id;
  }
};

export const getLeagueIdForTeam = (
  fixtures: AllSportsFixtures[],
  league: string | null,
  isTeam: boolean
) => {
  if (isTeam && league) {
    const fixture = fixtures.find((fixture) => {
      if (!isNBAFixture(fixture) && !isAFLFixture(fixture)) {
        return fixture.league.name.toLowerCase() === league.toLowerCase();
      }
      return undefined;
    });
    if (!fixture || typeof fixture.league === "string") return undefined;
    if (typeof fixture.league.id !== "number") return undefined;

    return fixture.league.id;
  } else {
    if (fixtures.length === 0) return undefined;
    if (typeof fixtures[0].league === "string") return 1;
    return fixtures[0].league.id;
  }
};

export const getLeagueName = (
  league:
    | string
    | League<string>
    | {
        id: number;
        season: number;
      }
    | FootballLeague
    | NFLLeague
) => {
  if (typeof league === "string") {
    return "standard";
  } else if ("flag" in league) {
    return league.name;
  } else if ("type" in league) {
    return league.name;
  } else {
    return "AFL";
  }
};

export const getFixtureData = (
  fixture:
    | (AllSportsFixtures & { leagueId: number; leagueName: string })
    | AllSportsFixtures
) => {
  const homeTeam = {
    id: fixture.teams.home.id,
    logo: fixture.teams.home.logo!,
    name: fixture.teams.home.name,
  };

  let awayTeam;
  if ("visitors" in fixture.teams) {
    awayTeam = {
      id: fixture.teams.visitors.id,
      logo: fixture.teams.visitors.logo,
      name: fixture.teams.visitors.name,
    };
  } else {
    awayTeam = {
      id: fixture.teams.away.id,
      logo: fixture.teams.away.logo!,
      name: fixture.teams.away.name,
    };
  }

  let fixtureId,
    fixtureDate,
    fixtureVenue,
    fixtureStatus,
    fixtureRound,
    fixtureLeague,
    homeTeamScore,
    awayTeamScore;
  if (isFootballFixture(fixture)) {
    fixtureId = fixture.fixture.id;
    fixtureDate = fixture.fixture.date;
    fixtureVenue = fixture.fixture.venue.name;
    fixtureStatus = fixture.fixture.status;
    fixtureRound = fixture.league.round;
    fixtureLeague = { name: fixture.league.name, id: fixture.league.id };
    homeTeamScore = fixture.goals.home;
    awayTeamScore = fixture.goals.away;
  } else if (isNBAFixture(fixture)) {
    fixtureId = fixture.id;
    fixtureDate = fixture.date.start;
    fixtureVenue = fixture.arena.name;
    fixtureStatus = fixture.status;
    fixtureRound = fixture.stage;
    fixtureLeague = { name: fixture.league, id: 0 };
    homeTeamScore = fixture.scores.home.points;
    awayTeamScore = fixture.scores.visitors.points;
  } else if (isAFLFixture(fixture)) {
    fixtureId = fixture.game.id;
    fixtureDate = fixture.date;
    fixtureStatus = fixture.status;
    fixtureRound = fixture.round;
    fixtureLeague = { name: "AFL", id: 1 };
    homeTeamScore = fixture.scores.home.score;
    awayTeamScore = fixture.scores.away.score;
  } else if (isNFLFixture(fixture)) {
    fixtureId = fixture.game.id;
    fixtureDate = fixture.game.date.date;
    fixtureStatus = fixture.game.status;
    fixtureRound = fixture.game.stage;
    fixtureLeague = { name: fixture.league.name, id: fixture.league.id };
    homeTeamScore = fixture.scores.home.total;
    awayTeamScore = fixture.scores.away.total;
  } else {
    fixtureId = fixture.id;
    fixtureDate = fixture.date;
    fixtureStatus = fixture.status;
    fixtureRound = fixture.week;
    fixtureLeague = { name: fixture.league.name, id: fixture.league.id };
    homeTeamScore =
      typeof fixture.scores.home === "number"
        ? fixture.scores.home
        : fixture.scores.home?.total;
    awayTeamScore =
      typeof fixture.scores.away === "number"
        ? fixture.scores.away
        : fixture.scores.away?.total;
  }

  const isHomeTeamWinner =
    homeTeamScore && awayTeamScore && homeTeamScore > awayTeamScore;
  const isAwayTeamWinner =
    homeTeamScore && awayTeamScore && homeTeamScore < awayTeamScore;

  return {
    homeTeam,
    awayTeam,
    homeTeamScore,
    awayTeamScore,
    fixtureVenue,
    fixtureId,
    fixtureDate,
    fixtureStatus,
    fixtureRound,
    fixtureLeague,
    isHomeTeamWinner,
    isAwayTeamWinner,
  };
};

export const getFootballTeamsRequiredStatistics = (
  stats: FootballTeamStatistics
) => {
  const biggestWin =
    (stats?.biggest?.goals?.for?.home ?? 0) >
    (stats?.biggest?.goals?.against?.away ?? 0)
      ? stats?.biggest?.wins?.home
      : stats?.biggest?.wins?.away;

  const requiredStats = [
    { label: "Matches", value: stats?.fixtures?.played?.total ?? "-" },
    { label: "Win", value: stats?.fixtures?.wins?.total ?? "-" },
    { label: "Lost", value: stats?.fixtures?.loses?.total ?? "-" },
    {
      label: "Goals",
      value:
        stats?.goals?.for?.total?.total + stats?.goals?.against?.total?.total,
    },
    { label: "Biggest Win", value: biggestWin ?? "-" },
    { label: "Clean Sheet", value: stats?.clean_sheet?.total ?? "-" },
    { label: "Streak", value: stats?.biggest?.streak.wins ?? "-" },
    { label: "Yellow Cards", value: totalCards(stats, "yellow") ?? "-" },
    { label: "Red Cards", value: totalCards(stats, "red") ?? "-" },
    { label: "Formation", value: stats?.lineups?.[0]?.formation ?? "-" },
  ];

  return requiredStats;
};

export const getTeamsRequiredStatistics = (stats: TeamStatistics) => {
  const PointsOrGoals = stats?.points || stats?.goals;
  const isPointsOrGoals = stats?.points ? "Points" : "Goals";

  const requiredStats = [
    { label: "Matches", value: stats?.games?.played?.all ?? "-" },
    { label: "Win", value: stats?.games?.wins?.all?.total ?? "-" },
    {
      label: "Win (%)",
      value: stats?.games?.wins?.all?.percentage
        ? (parseFloat(stats?.games?.wins?.all?.percentage) * 100).toFixed(2)
        : "-",
    },
    { label: "Drawn", value: stats?.games?.draws?.all?.total ?? "-" },
    {
      label: "Drawn (%)",
      value: stats?.games?.draws?.all?.percentage
        ? (parseFloat(stats?.games?.draws?.all?.percentage) * 100).toFixed(2)
        : "-",
    },
    { label: "Lost", value: stats?.games?.loses?.all?.total ?? "-" },
    {
      label: "Lost (%)",
      value: stats?.games?.loses?.all?.percentage
        ? (parseFloat(stats?.games?.loses?.all?.percentage) * 100).toFixed(2)
        : "-",
    },
    {
      label: `Avg ${isPointsOrGoals} Scored`,
      value: PointsOrGoals?.for?.average?.all ?? "-",
    },
    {
      label: `Avg ${isPointsOrGoals} Conceded`,
      value: PointsOrGoals?.for?.average?.all ?? "-",
    },
    {
      label: `${isPointsOrGoals} Scored (Home)`,
      value: PointsOrGoals?.for?.total?.home ?? "-",
    },
    {
      label: `${isPointsOrGoals} Scored (Away)`,
      value: PointsOrGoals?.for?.total?.away ?? "-",
    },
    {
      label: `${isPointsOrGoals} Conceded (Home)`,
      value: PointsOrGoals?.against?.total?.home ?? "-",
    },
    {
      label: `${isPointsOrGoals} Conceded (Away)`,
      value: PointsOrGoals?.against?.total?.away ?? "-",
    },
  ];
  return requiredStats;
};

export const getNBATeamsRequiredStatistics = (stats: NBAStatistics) => {
  const requiredStats = [
    { label: "Points", value: stats?.points ?? "-" },
    { label: "Assists", value: stats?.assists ?? "-" },
    { label: "Rebounds", value: stats?.totReb ?? "-" },
    { label: "Field Goal (%)", value: stats?.fgp ?? "-" },
    { label: "Three Point (%)", value: stats?.tpp ?? "-" },
    { label: "Free Throw (%)", value: stats?.ftp ?? "-" },
    {
      label: "Steals",
      value: stats?.steals ?? "-",
    },
    {
      label: "TurnOvers",
      value: stats?.turnovers ?? "-",
    },
    {
      label: "Blocks",
      value: stats?.blocks ?? "-",
    },
    {
      label: "Plus/Minus",
      value: stats?.plusMinus ?? "-",
    },
    {
      label: "Biggest Lead",
      value: stats?.biggestLead ?? "-",
    },
    {
      label: "Longest Run",
      value: stats?.longestRun ?? "-",
    },
  ];
  return requiredStats;
};

export const getAFLTeamsRequiredStatistics = (
  stats: AustralianFootballStatistics<TotalOrAverageStats> & {
    games: { played: number };
  }
) => {
  const requiredStats = [
    { label: "Played", value: stats?.games?.played },
    { label: "Goals", value: stats?.scoring?.goals?.total ?? "-" },
    { label: "Assists", value: stats?.scoring?.assists?.total ?? "-" },
    { label: "Behinds", value: stats?.scoring?.behinds?.total ?? "-" },
    { label: "Disposals", value: stats?.disposals?.disposals?.total ?? "-" },
    { label: "Kicks", value: stats?.disposals?.kicks?.total ?? "-" },
    { label: "Free Kicks", value: stats?.disposals?.free_kicks?.total ?? "-" },
    { label: "Handballs", value: stats?.disposals?.handballs?.total ?? "-" },
    { label: "Hitouts", value: stats?.stoppages?.hitouts?.total ?? "-" },
    { label: "Clearances", value: stats?.stoppages?.clearances?.total ?? "-" },
    { label: "Marks", value: stats?.marks?.total ?? "-" },
    { label: "Tackles", value: stats?.defence?.tackles?.total ?? "-" },
  ];
  return requiredStats;
};

export type GroupedData<T extends Standings | NBAStandings | NFLStandings> = {
  [groupName: string]: T[];
};

export const groupStandingsByProperty = <
  T extends Standings | NBAStandings | NFLStandings
>(
  data: T[],
  groupByProperty: (item: T) => string
): GroupedData<T> => {
  const standingsByGroup: GroupedData<T> = {};
  data?.filter(Boolean).forEach((standing) => {
    const groupName = groupByProperty(standing) as string;
    if (!standingsByGroup[groupName]) {
      standingsByGroup[groupName] = [];
    }
    standingsByGroup[groupName].push(standing);
  });

  return standingsByGroup;
};

export const getWeek = (week: string | null) => {
  const wk =
    week !== null && !isNaN(Number(week))
      ? `Week - ${week}`
      : week !== null
      ? week
      : "";
  return wk;
};

export const mergeStatistics = (
  responses: FixtureStatisticsResponse[],
  homeTeam: string
): {
  [key: string]: { [team: string]: number | string };
} => {
  const merged: { [key: string]: { [team: string]: number | string } } = {};

  for (const response of responses) {
    const teamName =
      response.team.name.toLowerCase() === homeTeam.toLowerCase()
        ? "home"
        : "away";
    if (response.statistics) {
      for (const stat of response.statistics) {
        if (stat.type) {
          if (!merged[stat.type]) {
            merged[stat.type] = {};
          }
          merged[stat.type][teamName] = stat.value || "";
        }
      }
    }
  }

  return merged;
};

export const mergeStatisticsForAFL = (
  responses: AustralianFootballFixtureStatistics<number>[]
) => {
  const merge: { [key: string]: { [team: string]: number | string } } = {};
  const homeTeam = responses[0].team.id;

  const addPropertyToMerge = (
    propertyName: string,
    value: number | string,
    team: string
  ) => {
    merge[propertyName] = merge[propertyName] || {};
    merge[propertyName][team] = value;
  };

  responses.forEach((response) => {
    const team = response.team.id === homeTeam ? "home" : "away";
    addPropertyToMerge(
      "Disposals",
      response.statistics.disposals.disposals,
      team
    );
    addPropertyToMerge("Kicks", response.statistics.disposals.kicks, team);
    addPropertyToMerge(
      "Hand balls",
      response.statistics.disposals.handballs,
      team
    );
    addPropertyToMerge(
      "Free kicks",
      response.statistics.disposals.free_kicks,
      team
    );
    addPropertyToMerge("Hitouts", response.statistics.stoppages.hitouts, team);
    addPropertyToMerge(
      "Clearances",
      response.statistics.stoppages.clearances,
      team
    );
    addPropertyToMerge("Marks", response.statistics.marks, team);
    addPropertyToMerge("Goals", response.statistics.scoring.goals, team);
    addPropertyToMerge("Assists", response.statistics.scoring.assists, team);
    addPropertyToMerge("Behinds", response.statistics.scoring.behinds, team);
    addPropertyToMerge("Tackles", response.statistics.defence.tackles, team);
  });

  return merge;
};

export const mergeStatisticsForNFL = (
  responses: NFLTeamsStatisticsResponse[]
): {
  [key: string]: { [team: string]: number | string };
} => {
  const merge: { [key: string]: { [team: string]: number | string } } = {};
  const homeTeam = responses[0].team.name.toLowerCase();

  const addPropertyToMerge = (
    propertyName: string,
    value: number | string,
    team: string
  ) => {
    merge[propertyName] = merge[propertyName] || {};
    merge[propertyName][team] = value;
  };

  responses.forEach((response) => {
    const team =
      response.team.name.toLowerCase() === homeTeam ? "home" : "away";
    addPropertyToMerge(
      "Time of Posession",
      response.statistics.posession.total,
      team
    );
    addPropertyToMerge(
      "Total Drives",
      response.statistics.yards.total_drives,
      team
    );
    addPropertyToMerge("Total Plays", response.statistics.plays.total, team);
    addPropertyToMerge("Total Yards", response.statistics.yards.total, team);
    addPropertyToMerge(
      "Yards Per Play",
      response.statistics.yards.yards_per_play,
      team
    );
    addPropertyToMerge(
      "Red Zone Attempts",
      response.statistics.red_zone.made_att,
      team
    );
    addPropertyToMerge(
      "Total Passing",
      response.statistics.passing.total,
      team
    );
    addPropertyToMerge(
      "Passing Attempts",
      response.statistics.passing.comp_att,
      team
    );
    addPropertyToMerge(
      "Passing TDs",
      response.statistics.first_downs.passing,
      team
    );
    addPropertyToMerge(
      "Yards Per Attempt",
      response.statistics.passing.yards_per_pass,
      team
    );
    addPropertyToMerge(
      "Total Touchdowns",
      response.statistics.first_downs.total,
      team
    );
    addPropertyToMerge(
      "Total Rushing",
      response.statistics.rushings.total,
      team
    );
    addPropertyToMerge(
      "Rushing Attempts",
      response.statistics.rushings.attempts,
      team
    );
    addPropertyToMerge(
      "Yards Per Rush",
      response.statistics.rushings.yards_per_rush,
      team
    );
    addPropertyToMerge(
      "Total Turnovers",
      response.statistics.turnovers.total,
      team
    );
    addPropertyToMerge(
      "Fumbles Lost",
      response.statistics.turnovers.lost_fumbles,
      team
    );
    addPropertyToMerge(
      "Interceptions",
      response.statistics.turnovers.interceptions,
      team
    );
    addPropertyToMerge("Sacks", response.statistics.sacks.total, team);
  });

  return merge;
};

const getSubstitution = (subst: string) => {
  if (subst.includes("1")) return "1st substitution";
  else if (subst.includes("2")) return "2nd substitution";
  else if (subst.includes("3")) return "3rd substitution";
  else return "substitution";
};

export const getFootballPlayByPlayComments = (event: Timeline) => {
  switch (event?.type.toLowerCase()) {
    case "goal":
      if (event.detail.toLowerCase() === "normal goal")
        return `Goal! ${event?.team?.name} scores, it is ${event.player?.name} who puts the ball in the net.`;
      else if (event.detail.toLowerCase() === "own goal")
        return `It's now 2-3, thanks to an own goal from ${event.player?.name}.`;
      else if (event.detail.toLowerCase() === "penalty")
        return `${event.player?.name} scores with a penalty.`;
      else if (event.detail.toLowerCase() === "missed penalty")
        return `${event.player?.name} misses the penalty.`;
      return `${event.player?.name} scores a goal`;
    case "var":
      return `VAR: ${event?.detail}.`;
    case "subst":
      return `${event?.team?.name} is making their ${getSubstitution(
        event?.detail
      )}, with ${event?.player?.name} replacing ${event?.assist?.name}.`;
    case "card":
      return `${event?.player?.name} for ${event?.team?.name}, receives a ${event?.detail}.`;
    default:
      return `${event.type}: ${event.detail}`;
  }
};

const formatGoalEvent = (event: HockeyEvents) => {
  if (event?.assists && event?.assists.length > 0) {
    if (event?.assists.length === 1) {
      return `Goal scored by ${event?.players?.[0]}, assisted by ${event?.assists[0]}.`;
    } else if (event?.assists.length === 2) {
      return `Goal scored by ${event?.players?.[0]}, assisted by ${event?.assists[0]} and ${event?.assists[1]}.`;
    } else {
      const firstTwoAssists = event?.assists.slice(0, 2).join(", ");
      const remainingAssistsCount = event?.assists.length - 2;
      const remainingAssistsText =
        remainingAssistsCount > 1
          ? `and ${remainingAssistsCount} others`
          : "and 1 other";
      return `Goal scored by ${event?.players?.[0]}, assisted by ${firstTwoAssists} ${remainingAssistsText}`;
    }
  } else {
    return `Goal scored by ${event?.players?.[0]}`;
  }
};

export const getHockeyPlayByPlayComments = (event: HockeyEvents) => {
  switch (event?.type.toLowerCase()) {
    case "goal":
      return formatGoalEvent(event);
    case "penalty":
      return `Penalty to ${event.team.name} for ${event.comment}. (Drawn by ${event.players?.[0]})`;
    default:
      return `${event.type}: ${event.players?.[0]}`;
  }
};

export const getNFLPlayByPlayComments = (event: NFLEvents) => {
  switch (event?.type) {
    case "FG":
      return event.comment;
    case "TD":
      return `${event.comment}, TOUCHDOWN.`;
    default:
      return event.comment;
  }
};

export const groupEventsByPeriods = (events: (HockeyEvents | NFLEvents)[]) => {
  const periods: { [key: string]: (HockeyEvents | NFLEvents)[] } = {};

  events.forEach((event) => {
    const period = "period" in event ? event.period : event.quarter;
    if (!periods[period]) {
      periods[period] = [];
    }
    periods[period].push(event);
  });

  return periods;
};

export const getTabs = (sport: Sports) => {
  let tabs: string[] = [];
  if (["baseball", "basketball", "rugby"].includes(sport)) {
    tabs = ["Head to head"];
  } else if (sport === "american-football") {
    tabs = ["Events", "Match Stat"];
  } else if (sport === "australian-football") {
    tabs = ["Match Stat"];
  } else if (sport === "hockey") {
    tabs = ["Head to Head", "Events"];
  } else if (sport === "football") {
    tabs = ["Head to Head", "Events", "Match Stat", "Lineups"];
  }

  return tabs;
};
