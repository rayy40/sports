import {
  DetailedTabsType,
  ShortStatusMap,
  StatusType,
  Tabs,
} from "@/types/general";

export const shortStatusMap: ShortStatusMap = {
  Scheduled: ["TBD", "NS"],
  InPlay: [
    "1H",
    "HT",
    "2H",
    "ET",
    "BT",
    "P",
    "INT",
    "LIVE",
    "Q1",
    "Q2",
    "Q3",
    "Q4",
    "OT",
    "BT",
    "HT",
  ],
  Finished: ["FT", "AET", "PEN", "AOT"],
  Postponed: ["PST", "POST"],
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

export const statsFilters = [
  { id: "top scorers", name: "Top Scorers" },
  { id: "top assists", name: "Top Assists" },
  { id: "yellow cards", name: "Yellow Cards" },
  { id: "red cards", name: "Red Cards" },
];

export const basketballSeasons = [
  "2016-2017",
  "2017-2018",
  "2018-2019",
  "2019-2020",
  "2020-2021",
  "2021-2022",
  "2022-2023",
  "2023-2024",
];

export const seasonsList = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];

export const NBAGroup = ["conference", "division"];

export const impFootballLeagueIds = [
  1032, 128, 188, 78, 79, 82, 218, 219, 39, 116, 233, 235, 288, 145, 144, 73,
  475, 72, 136, 172, 265, 169, 239, 281, 210, 212, 318, 345, 119, 242, 539, 528,
  46, 45, 44, 48, 528, 697, 39, 40, 41, 42, 43, 65, 66, 61, 62, 63, 64, 81, 80,
  529, 197, 323, 271, 357, 383, 135, 139, 547, 98, 262, 200, 88, 89, 90, 543,
  103, 108, 106, 94, 95, 96, 97, 305, 283, 236, 237, 504, 307, 181, 179, 286,
  373, 143, 140, 141, 142, 556, 113, 114, 207, 296, 551, 204, 203, 551, 253,
  254, 301, 333, 17, 18, 6, 768, 12, 16, 20, 22, 533, 11, 13, 21, 4, 9, 960, 15,
  772, 480, 2, 3, 5, 38, 493, 14, 531, 525, 848, 1, 29, 31, 32, 30, 8, 490, 34,
  37, 536, 137,
];

export const errorMessage =
  "Something went wrong, please try again after sometime.";
