"use client";

import { AllOrHomeOrAway, StandingsEntity, Team } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";

export const standingsColumns: ColumnDef<StandingsEntity | null>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row }) => {
      const rank: number = row.getValue("rank");

      return <p>{rank}</p>;
    },
  },
  {
    accessorKey: "team",
    header: "Team",
    cell: ({ row }) => {
      const teamInfo: Team = row.getValue("team");

      return (
        <Link href={`/football/teams/${teamInfo.id}`}>
          <div className="flex items-center gap-3">
            <Image
              width={25}
              height={25}
              style={{
                objectFit: "contain",
                borderRadius: "50%",
                aspectRatio: "1/1",
              }}
              src={teamInfo.logo}
              alt={`${teamInfo.name}-logo`}
            />
            <p>{teamInfo.name}</p>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "all",
    header: "Played",
    cell: ({ row }) => {
      const matches: AllOrHomeOrAway = row.getValue("all");

      return <p>{matches.played}</p>;
    },
  },
  {
    accessorKey: "all",
    header: "Won",
    cell: ({ row }) => {
      const matches: AllOrHomeOrAway = row.getValue("all");

      return <p>{matches.win}</p>;
    },
  },
  {
    accessorKey: "all",
    header: "Drawn",
    cell: ({ row }) => {
      const matches: AllOrHomeOrAway = row.getValue("all");

      return <p>{matches.draw}</p>;
    },
  },
  {
    accessorKey: "all",
    header: "Lost",
    cell: ({ row }) => {
      const matches: AllOrHomeOrAway = row.getValue("all");

      return <p>{matches.lose}</p>;
    },
  },
  {
    accessorKey: "all",
    header: "GF",
    cell: ({ row }) => {
      const matches: AllOrHomeOrAway = row.getValue("all");

      return <p>{matches.goals.for}</p>;
    },
  },
  {
    accessorKey: "all",
    header: "GA",
    cell: ({ row }) => {
      const matches: AllOrHomeOrAway = row.getValue("all");

      return <p>{matches.goals.against}</p>;
    },
  },
  {
    accessorKey: "goalsDiff",
    header: "GD",
    cell: ({ row }) => {
      const goalDiff: number = row.getValue("goalsDiff");

      return <p>{goalDiff}</p>;
    },
  },
  {
    accessorKey: "points",
    header: "Points",
    cell: ({ row }) => {
      const points: number = row.getValue("points");

      return <p className="font-medium">{points}</p>;
    },
  },
  {
    accessorKey: "form",
    header: "Form",
    cell: ({ row }) => {
      const form: string = row.getValue("form");

      return <div className=""></div>;
    },
  },
];
