"use client";

import { shortStatusMap } from "@/lib/constants";
import { League as FootballLeague, Teams } from "@/types/football";
import { formatDatePatternLong, getFixtureData } from "@/lib/utils";
import { ColumnDef, Getter, Row } from "@tanstack/react-table";
import { LucideArrowRight } from "lucide-react";
import { NBATeams } from "@/types/basketball";
import { AllSportsFixtures, StatusType, League } from "@/types/general";
import ImageWithFallback from "@/components/ImageWithFallback";

export const fixturesListColumns = <
  T extends AllSportsFixtures
>(): ColumnDef<T>[] => [
  {
    id: "date",
    accessorFn: (row) => getFixtureData(row).fixtureDate,
    header: "Date",
    size: 150,
    cell: ({ getValue }: { getValue: Getter<string> }) => {
      const date = getValue();
      const formattedDate = formatDatePatternLong(date);

      return (
        <div className="hidden lg:flex flex-col px-2 lg:pl-6 lg:w-[150px] items-start">
          <p className="text-sm lg:text-[0.925rem] text-left font-medium text-primary-foreground">
            {formattedDate}
          </p>
        </div>
      );
    },
  },
  {
    id: "status",
    accessorFn: (row) => getFixtureData(row).fixtureStatus.short,
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

      const {
        homeTeamScore,
        awayTeamScore,
        isHomeTeamWinner,
        isAwayTeamWinner,
      } = getFixtureData(row.original);

      return (
        <div className="grid grid-cols-[1fr_50px_1fr] lg:grid-cols-list justify-center items-center gap-4 lg:gap-6 lg:min-w-[250px] flex-1">
          <div className="flex items-center justify-end gap-1 lg:gap-3">
            <p
              className={`${
                isHomeTeamWinner
                  ? "text-primary-foreground"
                  : "text-secondary-foreground"
              } text-sm text-right lg:text-[1.075rem]`}
            >
              {teams.home.name}
            </p>
            <ImageWithFallback
              className="w-[25px] lg:w-[40px]"
              src={teams.home.logo}
              alt={`${teams.home.name}-logo`}
            />
          </div>
          <div className="flex items-center justify-center gap-1 lg:gap-3 text-[1rem] lg:text-lg font-medium">
            {homeTeamScore && (
              <p
                className={
                  isHomeTeamWinner
                    ? "text-primary-foreground"
                    : "text-secondary-foreground"
                }
              >
                {homeTeamScore}
              </p>
            )}
            <span>-</span>
            {awayTeamScore && (
              <p
                className={
                  isAwayTeamWinner
                    ? "text-primary-foreground"
                    : "text-secondary-foreground"
                }
              >
                {awayTeamScore}
              </p>
            )}
          </div>
          <div className="flex items-center justify-start gap-1 lg:gap-3">
            <ImageWithFallback
              className="w-[25px] lg:w-[40px]"
              src={"visitors" in teams ? teams.visitors.logo : teams.away.logo}
              alt={`${
                "visitors" in teams ? teams.visitors.name : teams.away.name
              }-logo`}
            />
            <p
              className={`${
                isAwayTeamWinner
                  ? "text-primary-foreground"
                  : "text-secondary-foreground"
              } text-sm text-left lg:text-[1.075rem]`}
            >
              {"visitors" in teams ? teams.visitors.name : teams.away.name}
            </p>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const teamsInfo: Teams | NBATeams = row.getValue(id);
      const awayTeam =
        "away" in teamsInfo ? teamsInfo.away.name : teamsInfo.visitors.name;
      const teams = [teamsInfo.home.id, awayTeam];
      return teams.some((team) => value === team);
    },
  },
  {
    id: "league",
    accessorFn: (row) => row.league,
    header: "League",
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      const leagueInfo: League | FootballLeague = row.getValue(id);
      return value === leagueInfo.id;
    },
  },
  {
    id: "arrow",
    header: "",
    size: 50,
    cell: () => {
      return (
        <div className="hidden lg:block w-[50px] px-2 ml-auto font-medium text-secondary-foreground transition-colors hover:text-primary-foreground">
          <LucideArrowRight size={20} />
        </div>
      );
    },
  },
];
