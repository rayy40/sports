"use client";

import { AllOrHomeOrAway, Goals, StandingsEntity, Team } from "@/lib/types";
import { ColumnDef, Getter } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";

export const standingsColumns: ColumnDef<StandingsEntity | null>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row }) => {
      const rank: number = row.getValue("rank");

      return <p className="pl-6 text-[0.975rem]">{rank}</p>;
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
              loading="lazy"
              width={37.5}
              height={37.5}
              style={{
                objectFit: "contain",
                borderRadius: "50%",
                aspectRatio: "1/1",
              }}
              src={teamInfo.logo}
              alt={`${teamInfo.name}-logo`}
            />
            <p className="text-[1rem]">{teamInfo.name}</p>
          </div>
        </Link>
      );
    },
  },
  {
    id: "played",
    accessorFn: (row) => row?.all,
    header: "Played",
    cell: ({ getValue }: { getValue: Getter<AllOrHomeOrAway | undefined> }) => {
      const matches = getValue();

      return <p className="text-center text-[0.975rem]">{matches?.played}</p>;
    },
  },
  {
    id: "win",
    accessorFn: (row) => row?.all,
    header: "Won",
    cell: ({ getValue }: { getValue: Getter<AllOrHomeOrAway | undefined> }) => {
      const matches = getValue();

      return <p className="text-center text-[0.975rem]">{matches?.win}</p>;
    },
  },
  {
    id: "drawn",
    accessorFn: (row) => row?.all,
    header: "Drawn",
    cell: ({ getValue }: { getValue: Getter<AllOrHomeOrAway | undefined> }) => {
      const matches = getValue();

      return <p className="text-center text-[0.975rem]">{matches?.draw}</p>;
    },
  },
  {
    id: "lost",
    accessorFn: (row) => row?.all,
    header: "Lost",
    cell: ({ getValue }: { getValue: Getter<AllOrHomeOrAway | undefined> }) => {
      const matches = getValue();

      return <p className="text-center text-[0.975rem]">{matches?.lose}</p>;
    },
  },
  {
    id: "goalsFor",
    accessorFn: (row) => row?.all?.goals,
    header: "GF",
    cell: ({ getValue }: { getValue: Getter<Goals | undefined> }) => {
      const goals = getValue();

      return <p className="text-center text-[0.975rem]">{goals?.for}</p>;
    },
  },
  {
    id: "goalsAgainst",
    accessorFn: (row) => row?.all?.goals,
    header: "GA",
    cell: ({ getValue }: { getValue: Getter<Goals | undefined> }) => {
      const goals = getValue();

      return <p className="text-center text-[0.975rem]">{goals?.against}</p>;
    },
  },
  {
    accessorKey: "goalsDiff",
    header: "GD",
    cell: ({ row }) => {
      const goalDiff: number = row.getValue("goalsDiff");

      return <p className="text-center text-[0.975rem]">{goalDiff}</p>;
    },
  },
  {
    accessorKey: "points",
    header: "Points",
    cell: ({ row }) => {
      const points: number = row.getValue("points");

      return (
        <p className="text-center text-[0.975rem] font-medium">{points}</p>
      );
    },
  },
  {
    accessorKey: "form",
    header: "Form",
    cell: ({ row }) => {
      const form: string = row.getValue("form");
      const renderColor = (char: string) => {
        switch (char) {
          case "W":
            return "hsl(163,49%,52.5%)";
          case "L":
            return "hsl(0,87%,72.5%)";
          case "D":
            return "hsl(0,0%,72.5%)";
          default:
            return "hsl(0,0%,92.5%)";
        }
      };

      return (
        <div className="flex items-center justify-center gap-1">
          {form.split("").map((char, index) => (
            <div
              style={{
                backgroundColor: renderColor(char),
              }}
              className="rounded-full size-5"
              key={index}
            ></div>
          ))}
        </div>
      );
    },
  },
];
