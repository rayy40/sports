"use client";

import { shortStatusMap } from "@/lib/constants";
import {
  Fixture,
  Fixtures,
  HalftimeOrGoals,
  StatusType,
  Teams,
} from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { LucideArrowRight } from "lucide-react";
import Image from "next/image";

export const fixturesListColumns: ColumnDef<Fixtures>[] = [
  {
    accessorKey: "fixture",
    header: "Date",
    enableColumnFilter: true,
    size: 100,
    cell: ({ row }) => {
      const { timestamp }: Fixture = row.getValue("fixture");
      const formattedDate = formatDate(timestamp);

      return (
        <div className="flex flex-col font-medium px-2 pl-3 w-[80px] items-center">
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
      const fixture: Fixture = row.getValue(id);
      const status = shortStatusMap[value as StatusType];

      return status.includes(fixture.status.short);
    },
  },
  {
    accessorKey: "teams",
    header: "Teams",
    enableColumnFilter: true,
    cell: ({ row }) => {
      const teams: Teams = row.getValue("teams");
      const goals: HalftimeOrGoals = row.getValue("goals");
      const isHomeScoreMore = goals.home > goals.away;
      const isAwayScoreMore = goals.home < goals.away;

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
            <Image
              width={40}
              height={40}
              style={{ aspectRatio: "1/1", borderRadius: "50%" }}
              src={teams.home.logo}
              alt={`${teams.home.name}-logo`}
            />
          </div>
          <div className="flex items-center justify-center font-medium text-lg gap-3">
            {goals.home !== null && (
              <p
                className={
                  isHomeScoreMore
                    ? "text-primary-foreground"
                    : "text-secondary-foreground"
                }
              >
                {goals.home}
              </p>
            )}
            <span>-</span>
            {goals.away !== null && (
              <p
                className={
                  isAwayScoreMore
                    ? "text-primary-foreground"
                    : "text-secondary-foreground"
                }
              >
                {goals.away}
              </p>
            )}
          </div>
          <div className="flex items-center justify-start gap-3">
            <Image
              width={40}
              height={40}
              style={{ aspectRatio: "1/1", borderRadius: "50%" }}
              src={teams.away.logo}
              alt={`${teams.away.name}-logo`}
            />
            <p
              className={`${
                isAwayScoreMore
                  ? "text-primary-foreground"
                  : "text-secondary-foreground"
              } text-[1.075rem]`}
            >
              {teams.away.name}
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
    accessorKey: "goals",
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
