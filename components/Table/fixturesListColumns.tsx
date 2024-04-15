"use client";

import { shortStatusMap } from "@/lib/constants";
import { Fixtures, League, StatusType, Teams } from "@/types/football";
import { formatDatePatternLong } from "@/lib/utils";
import { ColumnDef, Getter, Row } from "@tanstack/react-table";
import { LucideArrowRight } from "lucide-react";
import { Games, NBAGames, NBATeams } from "@/types/basketball";
import ImageWithFallback from "@/components/ImageWithFallback";

export const fixturesListColumns = <
  T extends Fixtures | Games | NBAGames
>(): ColumnDef<T>[] => [
  {
    id: "date",
    accessorFn: (row) =>
      "date" in row
        ? typeof row.date === "string"
          ? row.date
          : row.date.start
        : row.fixture.date,
    header: "Date",
    size: 150,
    cell: ({ getValue }: { getValue: Getter<string> }) => {
      const date = getValue();
      const formattedDate = formatDatePatternLong(date);

      return (
        <div className="flex flex-col px-2 pl-6 w-[150px] items-start">
          <p className="text-[0.925rem] text-left font-medium text-primary-foreground">
            {formattedDate}
          </p>
        </div>
      );
    },
  },
  {
    id: "status",
    accessorFn: (row) =>
      "status" in row ? row.status.short : row.fixture.status.short,
    header: "Status",
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      const fixtureStatus: string = row.getValue(id);
      const status = shortStatusMap[value as StatusType];
      return status.includes(fixtureStatus);
    },
  },
  {
    id: "teams",
    accessorFn: (row) => row?.teams,
    header: "Teams",
    enableColumnFilter: true,
    cell: ({
      getValue,
      row,
    }: {
      getValue: Getter<Teams | NBATeams>;
      row: Row<T>;
    }) => {
      const teams = getValue();

      let homeScore: number | null, awayScore: number | null;

      if ("nugget" in row.original) {
        homeScore = row.original.scores.home.points;
        awayScore = row.original.scores.visitors.points;
      } else if ("scores" in row.original) {
        homeScore = row.original.scores.home.total;
        awayScore = row.original.scores.away.total;
      } else {
        homeScore = row.original.goals.home;
        awayScore = row.original.goals.away;
      }

      const isHomeScoreMore = homeScore > awayScore;
      const isAwayScoreMore = homeScore < awayScore;

      return (
        <div className="grid grid-cols-list justify-center items-center gap-6 min-w-[250px] flex-1">
          <div className="flex items-center justify-end gap-3">
            <p
              className={`${
                isHomeScoreMore
                  ? "text-primary-foreground"
                  : "text-secondary-foreground"
              } text-[1.075rem]`}
            >
              {teams.home.name}
            </p>
            <ImageWithFallback
              src={teams.home.logo}
              alt={`${teams.home.name}-logo`}
            />
          </div>
          <div className="flex items-center justify-center gap-3 text-lg font-medium">
            {homeScore && (
              <p
                className={
                  isHomeScoreMore
                    ? "text-primary-foreground"
                    : "text-secondary-foreground"
                }
              >
                {homeScore}
              </p>
            )}
            <span>-</span>
            {awayScore && (
              <p
                className={
                  isAwayScoreMore
                    ? "text-primary-foreground"
                    : "text-secondary-foreground"
                }
              >
                {awayScore}
              </p>
            )}
          </div>
          <div className="flex items-center justify-start gap-3">
            <ImageWithFallback
              src={"visitors" in teams ? teams.visitors.logo : teams.away.logo}
              alt={`${
                "visitors" in teams ? teams.visitors.name : teams.away.name
              }-logo`}
            />
            <p
              className={`${
                isAwayScoreMore
                  ? "text-primary-foreground"
                  : "text-secondary-foreground"
              } text-[1.075rem]`}
            >
              {"visitors" in teams ? teams.visitors.name : teams.away.name}
            </p>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const teamsInfo: Teams = row.getValue(id);
      const teams = [teamsInfo.home.id, teamsInfo.away.id];
      return teams.some((team) => value === team);
    },
  },
  {
    id: "league",
    accessorFn: (row) => row.league,
    header: "League",
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      const leagueInfo: League = row.getValue(id);
      return value === leagueInfo.id;
    },
  },
  {
    id: "arrow",
    header: "",
    size: 50,
    cell: () => {
      return (
        <div className="w-[50px] px-2 ml-auto font-medium text-secondary-foreground transition-colors hover:text-primary-foreground">
          <LucideArrowRight size={20} />
        </div>
      );
    },
  },
];
