"use client";

import FootballLogo from "@/Assets/Logos/FootballLogo";
import { shortStatusMap } from "@/lib/constants";
import {
  Fixture,
  Fixtures,
  HalftimeOrGoals,
  League,
  StatusType,
  Teams,
} from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const columns: ColumnDef<Fixtures>[] = [
  {
    accessorKey: "fixture",
    header: "Date",
    cell: ({ row }) => {
      const { timestamp }: Fixture = row.getValue("fixture");
      const formattedDate = formatDate(timestamp);

      return (
        <div className="flex flex-col font-medium px-2 w-[80px] items-start">
          <p className="text-sm text-center uppercase text-primary-foreground">
            {formattedDate.date}
          </p>
          <span className="text-sm text-center text-muted-foreground">
            {formattedDate.time}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const status = shortStatusMap[value as StatusType];
      const fixture: Fixture = row.getValue(id);

      return status.includes(fixture.status.short);
    },
  },
  {
    accessorKey: "league",
    header: "League",
    cell: ({ row }) => {
      const leagueInfo: League = row.getValue("league");

      return <span>{leagueInfo.name}</span>;
    },
    filterFn: (row, id, value) => {
      const leagueInfo: League = row.getValue(id);
      return value.includes(leagueInfo.name);
    },
  },
  {
    accessorKey: "teams",
    header: "Teams",
    enableColumnFilter: true,
    cell: ({ row }) => {
      const teams: Teams = row.getValue("teams");
      const isHomeWinner = teams.home.winner;
      const isAwayWinner = teams.away.winner;

      return (
        <div className="flex items-center gap-6 min-w-[250px] flex-1">
          <div className="flex items-center">
            <div
              className={`${
                isHomeWinner ? "z-10 border-home bg-home/70" : "bg-primary"
              } relative p-3 border-2 rounded-full shadow-team`}
            >
              <Image
                className="object-cover rounded-full aspect-[1/1]"
                loading="lazy"
                width={30}
                height={30}
                alt={`${teams.home.name}-logo`}
                src={teams.home.logo}
              />
              {isHomeWinner && (
                <div className="absolute -bottom-1 bg-primary rounded-full z-20 -left-1 size-5">
                  <FootballLogo />
                </div>
              )}
            </div>
            <div
              className={`${
                isAwayWinner ? "z-10 border-away bg-away/70" : "bg-primary"
              } relative p-3 -ml-2 border-2 rounded-full shadow-team`}
            >
              <Image
                className="object-cover rounded-full aspect-[1/1]"
                loading="lazy"
                width={30}
                height={30}
                alt={`${teams.away.name}-logo`}
                src={teams.away.logo}
              />
              {isAwayWinner && (
                <div className="absolute -bottom-1 z-20 bg-primary rounded-full -right-1 size-5">
                  <FootballLogo />
                </div>
              )}
            </div>
          </div>
          <div className="font-medium">
            <p className="text-[0.975rem] capitalize text-primary-foreground">
              {teams.home.name}
            </p>
            <p className="text-[0.975rem] capitalize text-muted-foreground">
              {teams.away.name}
            </p>
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const teamsInfo: Teams = row.getValue(id);
      const teams = [teamsInfo.home.name, teamsInfo.away.name];
      return teams.some((team) => value.includes(team));
    },
  },
  {
    accessorKey: "goals",
    header: "Score",
    cell: ({ row }) => {
      const goals: HalftimeOrGoals = row.getValue("goals");
      const isHomeWinner = goals.home > goals.away;
      const isAwayWinner = goals.away > goals.home;

      return (
        <div className="w-[100px] px-2 ml-auto text-[1.125rem] font-medium">
          <p
            className={`${
              isHomeWinner ? "text-primary-foreground" : "text-muted-foreground"
            } flex items-center justify-end gap-3`}
          >
            {goals.home && <span className="w-4 text-right">{goals.home}</span>}
          </p>
          <p
            className={`${
              isAwayWinner ? "text-primary-foreground" : "text-muted-foreground"
            } flex items-center justify-end gap-3`}
          >
            {goals.away && <span className="w-4 text-right">{goals.away}</span>}
          </p>
        </div>
      );
    },
  },
];
