"use client";

import { AllSportsStandings } from "@/types/general";
import { AllOrHomeOrAway, Goals, Team } from "@/types/football";
import { ColumnDef, Getter } from "@tanstack/react-table";
import Link from "next/link";
import ImageWithFallback from "../ImageWithFallback";

export const standingsColumns = <
  T extends AllSportsStandings
>(): ColumnDef<T>[] => [
  {
    id: "rank",
    accessorFn: (row) =>
      "conference" in row
        ? row.conference.rank
        : "position" in row
        ? row.position
        : row.rank,
    header: "Rank",
    cell: ({ getValue }: { getValue: Getter<number> }) => {
      const rank: number = getValue();

      return <p className="pl-6 text-[0.975rem]">{rank}</p>;
    },
  },
  {
    id: "team",
    accessorFn: (row) => row.team,
    header: "Team",
    cell: ({ getValue }: { getValue: Getter<Team> }) => {
      const team = getValue();

      return (
        <Link href={`/football/teams/${team.id}`}>
          <div className="flex items-center gap-3">
            <ImageWithFallback src={team.logo} alt={`${team.name}-logo`} />
            <p className="text-[1rem]">{team.name}</p>
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
        <p className="text-center text-[0.975rem]">{appearances ?? "-"}</p>
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
        : row.win.total,
    header: "Won",
    cell: ({ getValue }: { getValue: Getter<number> }) => {
      const won = getValue();

      return <p className="text-center text-[0.975rem]">{won ?? "-"}</p>;
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
        <p className="text-center text-[0.975rem]">
          {winPercentage.toFixed(2) ?? "-"}
        </p>
      );
    },
  },
  {
    id: "drawn",
    accessorFn: (row) => ("all" in row ? row?.all : undefined),
    header: "Drawn",
    cell: ({ getValue }: { getValue: Getter<AllOrHomeOrAway | undefined> }) => {
      const matches = getValue();

      return <p className="text-center text-[0.975rem]">{matches?.draw}</p>;
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
        : row.loss.total,
    header: "Lost",
    cell: ({ getValue }: { getValue: Getter<number> }) => {
      const lost = getValue();

      return <p className="text-center text-[0.975rem]">{lost ?? "-"}</p>;
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
        <p className="text-center text-[0.975rem]">
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

      return <p className="text-center text-[0.975rem]">{goals?.for}</p>;
    },
  },
  {
    id: "goalsAgainst",
    accessorFn: (row) => ("all" in row ? row?.all?.goals : undefined),
    header: "GA",
    cell: ({ getValue }: { getValue: Getter<Goals | undefined> }) => {
      const goals = getValue();

      return <p className="text-center text-[0.975rem]">{goals?.against}</p>;
    },
  },
  {
    id: "goalsDiff",
    accessorFn: (row) => ("all" in row ? row?.goalsDiff : undefined),
    header: "GD",
    cell: ({ getValue }: { getValue: Getter<number | undefined> }) => {
      const goalDiff = getValue();

      return <p className="text-center text-[0.975rem]">{goalDiff ?? "-"}</p>;
    },
  },
  {
    id: "streak",
    accessorFn: (row) => ("streak" in row ? row?.streak : undefined),
    header: "Streak",
    cell: ({ getValue }: { getValue: Getter<number | undefined> }) => {
      const streak = getValue();

      return <p className="text-center text-[0.975rem]">{streak ?? "-"}</p>;
    },
  },
  {
    id: "gamesBehind",
    accessorFn: (row) => ("gamesBehind" in row ? row?.gamesBehind : undefined),
    header: "Games Behind",
    cell: ({ getValue }: { getValue: Getter<string | undefined> }) => {
      const gamesBehind = getValue();

      return (
        <p className="text-center text-[0.975rem]">{gamesBehind ?? "-"}</p>
      );
    },
  },
  {
    id: "lastTenWin",
    accessorFn: (row) => ("gamesBehind" in row ? row?.win.lastTen : undefined),
    header: "Win last 10",
    cell: ({ getValue }: { getValue: Getter<number | undefined> }) => {
      const winLastTen = getValue();

      return <p className="text-center text-[0.975rem]">{winLastTen ?? "-"}</p>;
    },
  },
  {
    id: "lastTenLoss",
    accessorFn: (row) => ("gamesBehind" in row ? row?.loss.lastTen : undefined),
    header: "Loss last 10",
    cell: ({ getValue }: { getValue: Getter<number | undefined> }) => {
      const lossLastTen = getValue();

      return (
        <p className="text-center text-[0.975rem]">{lossLastTen ?? "-"}</p>
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
        <p className="text-center text-[0.975rem] font-medium">{points}</p>
      );
    },
  },
  {
    id: "form",
    accessorFn: (row) => ("form" in row ? row.form : undefined),
    header: "Form",
    cell: ({ getValue }: { getValue: Getter<string> }) => {
      const form = getValue();
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
          {form
            ? form.split("").map((char, index) => (
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
