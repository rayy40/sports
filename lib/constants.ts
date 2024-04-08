import { DetailedTabsType, ShortStatusMap, StatusType, Tabs } from "./types";

export const shortStatusMap: ShortStatusMap = {
  Scheduled: ["TBD", "NS"],
  InPlay: ["1H", "HT", "2H", "ET", "BT", "P", "SUSP", "INT", "LIVE"],
  Finished: ["FT", "AET", "PEN"],
  Postponed: ["PST"],
  Cancelled: ["CANC"],
  Abandoned: ["ABD"],
  NotPlayed: ["AWD", "WO"],
  AllGames: [
    "TBD",
    "NS",
    "1H",
    "HT",
    "2H",
    "ET",
    "BT",
    "P",
    "SUSP",
    "INT",
    "LIVE",
    "FT",
    "AET",
    "PEN",
    "PST",
    "CANC",
    "ABD",
    "AWD",
    "WO",
  ],
};

export const statusTabs: Tabs<StatusType>[] = [
  { status: "AllGames", label: "All Games" },
  { status: "Scheduled", label: "Not Started" },
  { status: "InPlay", label: "Live" },
  { status: "Finished", label: "Finished" },
];

export const detailedTabs: Tabs<DetailedTabsType>[] = [
  { status: "Fixtures", label: "Fixtures" },
  { status: "Standings", label: "Standings" },
  { status: "Stats", label: "Stats" },
  { status: "Squads", label: "Squads" },
];

export const statusFilters = [
  { id: "AllGames", name: "All Games" },
  { id: "Scheduled", name: "Not Started" },
  { id: "InPlay", name: "Live" },
  { id: "Finished", name: "Finished" },
];

export const stats = [
  "top scorers",
  "top assists",
  "yellow cards",
  "red cards",
];
