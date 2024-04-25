"use client";

import { AllSportsStandings, Sports } from "@/types/general";
import { Goals, Team } from "@/types/football";
import { ColumnDef, Getter } from "@tanstack/react-table";
import Link from "next/link";
import ImageWithFallback from "../ImageWithFallback";

export const standingsColumns = <T extends AllSportsStandings>(
  sport: Sports
): ColumnDef<T>[] => [
  {
    id: "rank",
    accessorFn: (row) =>
      "ncaa_conference" in row
        ? row.position
        : "conference" in row
        ? row.division.rank
        : "position" in row
        ? row.position
        : row.rank,
    header: "Rank",
    cell: ({ getValue }: { getValue: Getter<number> }) => {
      const rank: number = getValue();

      return <p className="pl-3 lg:pl-6 text-sm lg:text-[0.975rem]">{rank}</p>;
    },
  },
  {
    id: "team",
    accessorFn: (row) => row.team,
    header: "Team",
    minSize: 150,
    cell: ({ getValue }: { getValue: Getter<Team> }) => {
      const team = getValue();

      return (
        <Link href={`/${sport}/team/${team.id}`}>
          <div className="flex items-center gap-1 lg:gap-3">
            <ImageWithFallback
              className="w-[25px] lg:w-[40px]"
              src={team.logo}
              alt={`${team.name}-logo`}
            />
            <p className="text-sm lg:text-[1rem]">{team.name}</p>
          </div>
        </Link>
      );
    },
  },
  {
    id: "played",
    accessorFn: (row) =>
      "all" in row
        ? row.all.played
        : "games" in row
        ? row.games.played
        : undefined,
    header: "Played",
    cell: ({ getValue }: { getValue: Getter<number> }) => {
      const appearances = getValue();

      return (
        <p className="text-center text-sm lg:text-[0.975rem]">
          {appearances ?? "-"}
        </p>
      );
    },
  },
  {
    id: "win",
    accessorFn: (row) =>
      "pts" in row
        ? row.games.win
        : "all" in row
        ? row.all.win
        : "games" in row
        ? row.games.win.total
        : "win" in row
        ? row.win.total
        : row.won,
    header: "Won",
    cell: ({ getValue }: { getValue: Getter<number> }) => {
      const won = getValue();

      return (
        <p className="text-center text-sm lg:text-[0.975rem]">{won ?? "-"}</p>
      );
    },
  },
  {
    id: "winPercentage",
    accessorFn: (row) =>
      "pts" in row
        ? undefined
        : "games" in row
        ? row.games.win.percentage
        : "win" in row
        ? row.win.percentage
        : undefined,
    header: "Won (in %)",
    cell: ({ getValue }: { getValue: Getter<string> }) => {
      const won = getValue();
      const winPercentage = parseFloat(won) * 100;

      return (
        <p className="text-center text-sm lg:text-[0.975rem]">
          {winPercentage.toFixed(2) ?? "-"}
        </p>
      );
    },
  },
  {
    id: "drawn",
    accessorFn: (row) =>
      "last_5" in row
        ? row.games.drawn
        : "all" in row
        ? row?.all?.draw
        : "ties" in row
        ? row.ties
        : undefined,
    header: "Drawn",
    cell: ({ getValue }: { getValue: Getter<number | undefined> }) => {
      const drawn = getValue();

      return <p className="text-center text-sm lg:text-[0.975rem]">{drawn}</p>;
    },
  },
  {
    id: "lost",
    accessorFn: (row) =>
      "pts" in row
        ? row.games.lost
        : "all" in row
        ? row.all.lose
        : "games" in row
        ? row.games.lose.total
        : "loss" in row
        ? row.loss.total
        : row.lost,
    header: "Lost",
    cell: ({ getValue }: { getValue: Getter<number> }) => {
      const lost = getValue();

      return (
        <p className="text-center text-sm lg:text-[0.975rem]">{lost ?? "-"}</p>
      );
    },
  },
  {
    id: "lostPercentage",
    accessorFn: (row) =>
      "pts" in row
        ? undefined
        : "games" in row
        ? row.games.lose.percentage
        : "loss" in row
        ? row.loss.percentage
        : undefined,
    header: "Lost (in %)",
    cell: ({ getValue }: { getValue: Getter<string> }) => {
      const lose = getValue();
      const losePercentage = parseFloat(lose) * 100;

      return (
        <p className="text-center text-sm lg:text-[0.975rem]">
          {losePercentage.toFixed(2) ?? "-"}
        </p>
      );
    },
  },
  {
    id: "goalsFor",
    accessorFn: (row) => ("all" in row ? row?.all?.goals : undefined),
    header: "GF",
    cell: ({ getValue }: { getValue: Getter<Goals | undefined> }) => {
      const goals = getValue();

      return (
        <p className="text-center text-sm lg:text-[0.975rem]">{goals?.for}</p>
      );
    },
  },
  {
    id: "goalsAgainst",
    accessorFn: (row) => ("all" in row ? row?.all?.goals : undefined),
    header: "GA",
    cell: ({ getValue }: { getValue: Getter<Goals | undefined> }) => {
      const goals = getValue();

      return (
        <p className="text-center text-sm lg:text-[0.975rem]">
          {goals?.against}
        </p>
      );
    },
  },
  {
    id: "goalsDiff",
    accessorFn: (row) => ("all" in row ? row?.goalsDiff : undefined),
    header: "GD",
    cell: ({ getValue }: { getValue: Getter<number | undefined> }) => {
      const goalDiff = getValue();

      return (
        <p className="text-center text-sm lg:text-[0.975rem]">
          {goalDiff ?? "-"}
        </p>
      );
    },
  },
  {
    id: "streak",
    accessorFn: (row) => ("streak" in row ? row?.streak : undefined),
    header: "Streak",
    cell: ({ getValue }: { getValue: Getter<number | undefined> }) => {
      const streak = getValue();

      return (
        <p className="text-center text-sm lg:text-[0.975rem]">
          {streak ?? "-"}
        </p>
      );
    },
  },
  {
    id: "gamesBehind",
    accessorFn: (row) => ("gamesBehind" in row ? row?.gamesBehind : undefined),
    header: "Games Behind",
    cell: ({ getValue }: { getValue: Getter<string | undefined> }) => {
      const gamesBehind = getValue();

      return (
        <p className="text-center text-sm lg:text-[0.975rem]">
          {gamesBehind ?? "-"}
        </p>
      );
    },
  },
  {
    id: "lastTenWin",
    accessorFn: (row) => ("gamesBehind" in row ? row?.win.lastTen : undefined),
    header: "Win last 10",
    cell: ({ getValue }: { getValue: Getter<number | undefined> }) => {
      const winLastTen = getValue();

      return (
        <p className="text-center text-sm lg:text-[0.975rem]">
          {winLastTen ?? "-"}
        </p>
      );
    },
  },
  {
    id: "lastTenLoss",
    accessorFn: (row) => ("gamesBehind" in row ? row?.loss.lastTen : undefined),
    header: "Loss last 10",
    cell: ({ getValue }: { getValue: Getter<number | undefined> }) => {
      const lossLastTen = getValue();

      return (
        <p className="text-center text-sm lg:text-[0.975rem]">
          {lossLastTen ?? "-"}
        </p>
      );
    },
  },
  {
    id: "homeRecords",
    accessorFn: (row) =>
      "ncaa_conference" in row ? row?.records.home : undefined,
    header: "Records (Home)",
    cell: ({ getValue }: { getValue: Getter<number | undefined> }) => {
      const records = getValue();

      return (
        <p className="text-center text-sm lg:text-[0.975rem]">
          {records ?? "-"}
        </p>
      );
    },
  },
  {
    id: "roadRecords",
    accessorFn: (row) =>
      "ncaa_conference" in row ? row?.records.road : undefined,
    header: "Records (Road)",
    cell: ({ getValue }: { getValue: Getter<number | undefined> }) => {
      const records = getValue();

      return (
        <p className="text-center text-sm lg:text-[0.975rem]">
          {records ?? "-"}
        </p>
      );
    },
  },
  {
    id: "pointsDiff",
    accessorFn: (row) =>
      "ncaa_conference" in row ? row?.points.difference : undefined,
    header: "Points Diff",
    cell: ({ getValue }: { getValue: Getter<number | undefined> }) => {
      const pointsDiff = getValue();

      return (
        <p className="text-center text-sm lg:text-[0.975rem]">
          {pointsDiff ?? "-"}
        </p>
      );
    },
  },
  {
    id: "points",
    accessorFn: (row) =>
      "points" in row
        ? typeof row.points === "number"
          ? row.points
          : row.points.for + row.points.against
        : undefined,
    header: "Points",
    cell: ({ getValue }: { getValue: Getter<number> }) => {
      const points = getValue();

      return (
        <p className="text-center text-sm lg:text-[0.975rem] font-medium">
          {points}
        </p>
      );
    },
  },
  {
    id: "form",
    accessorFn: (row) =>
      "last_5" in row ? row.last_5 : "form" in row ? row.form : undefined,
    header: "Form",
    cell: ({ getValue }: { getValue: Getter<string> }) => {
      const form = getValue();
      const renderColor = (char: string) => {
        switch (char) {
          case "W":
            return "hsl(163,49%,52.5%)";
          case "L":
            return "hsl(0,87%,72.5%)";
          default:
            return "hsl(0,0%,72.5%)";
        }
      };

      return (
        <div className="flex items-center justify-center gap-1">
          {form
            ? form
                .slice(0, 5)
                .split("")
                .map((char, index) => (
                  <div
                    style={{
                      backgroundColor: renderColor(char),
                    }}
                    className="rounded-full size-5"
                    key={index}
                  ></div>
                ))
            : "-"}
        </div>
      );
    },
  },
];
