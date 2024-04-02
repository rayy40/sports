import { ShortStatusMap, Tabs } from "./types";

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

export const tabs: Tabs[] = [
  { status: "AllGames", label: "All Games" },
  { status: "Scheduled", label: "Not Started" },
  { status: "InPlay", label: "Live" },
  { status: "Finished", label: "Finished" },
];
