"use client";

import {
  Games,
  Goals,
  Penalty,
  Player,
  Shots,
  Team,
  PlayerStats,
} from "@/lib/types";
import { ColumnDef, Getter } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import ProfileLogo from "@/Assets/Logos/ProfileLogo";

export const topScoreColumns: ColumnDef<PlayerStats | null>[] = [
  {
    id: "rank",
    header: "Rank",
    cell: ({ row }) => {
      return <p className="pl-6 text-[0.975rem]">{row.index + 1}</p>;
    },
  },
  {
    id: "player",
    accessorFn: (row) => row?.player,
    header: "Player",
    cell: ({ row }) => {
      const player: Player | undefined = row?.getValue("player");

      return (
        <Link href={`/football/player/${player?.id}`}>
          <div className="flex items-center gap-3">
            {player?.photo ? (
              <Image
                width={37.5}
                height={37.5}
                style={{
                  objectFit: "contain",
                  borderRadius: "50%",
                  aspectRatio: "1/1",
                }}
                src={player?.photo}
                alt={`${player?.name}-logo`}
              />
            ) : (
              <ProfileLogo />
            )}
            <p className="text-[1rem]">{player?.name}</p>
          </div>
        </Link>
      );
    },
  },
  {
    id: "team",
    header: "Team",
    accessorFn: (row) => row?.statistics?.[0]?.team,
    cell: ({ getValue }: { getValue: Getter<Team | undefined> }) => {
      const team = getValue();

      return (
        <Link href={`/football/teams/${team?.id}`}>
          <p className="text-[0.975rem] text-center">{team?.name}</p>
        </Link>
      );
    },
  },
  {
    id: "played",
    accessorFn: (row) => row?.statistics?.[0]?.games,
    header: "Played",
    cell: ({ getValue }: { getValue: Getter<Games | undefined> }) => {
      const games = getValue();

      return (
        <p className="text-center text-[0.975rem]">
          {games?.appearences ?? "-"}
        </p>
      );
    },
  },
  {
    id: "minutes",
    accessorFn: (row) => row?.statistics?.[0]?.games,
    header: "Minutes",
    cell: ({ getValue }: { getValue: Getter<Games | undefined> }) => {
      const games: Games | undefined = getValue();

      return (
        <p className="text-center text-[0.975rem]">{games?.minutes ?? "-"}</p>
      );
    },
  },
  {
    id: "goals",
    accessorFn: (row) => row?.statistics?.[0]?.goals,
    header: "Goals",
    cell: ({ getValue }: { getValue: Getter<Goals | undefined> }) => {
      const goals = getValue();

      return (
        <p className="text-center text-[0.975rem] font-medium">
          {goals?.total ?? "-"}
        </p>
      );
    },
  },
  {
    id: "assists",
    accessorFn: (row) => row?.statistics?.[0]?.goals,
    header: "Assists",
    cell: ({ getValue }: { getValue: Getter<Goals | undefined> }) => {
      const goals = getValue();

      return (
        <p className="text-center text-[0.975rem]">{goals?.assists ?? "-"}</p>
      );
    },
  },
  {
    id: "totalShots",
    accessorFn: (row) => row?.statistics?.[0]?.shots,
    header: "Total Shots",
    cell: ({ getValue }: { getValue: Getter<Shots | undefined> }) => {
      const shots = getValue();

      return (
        <p className="text-center text-[0.975rem]">{shots?.total ?? "-"}</p>
      );
    },
  },
  {
    id: "shotAccuracy",
    accessorFn: (row) => row?.statistics?.[0]?.shots,
    header: "Shot Accuracy",
    cell: ({ getValue }: { getValue: Getter<Shots | undefined> }) => {
      const shots = getValue();

      const accuracy = Math.round((shots?.on! / shots?.total!) * 100);

      return (
        <p className="text-center text-[0.975rem]">{`${accuracy}%` ?? "-"}</p>
      );
    },
  },
  {
    id: "penalty",
    accessorFn: (row) => row?.statistics?.[0]?.penalty,
    header: "Penalty Goals",
    cell: ({ getValue }: { getValue: Getter<Penalty | undefined> }) => {
      const penatly = getValue();

      return (
        <p className="text-center text-[0.975rem]">{penatly?.scored ?? "-"}</p>
      );
    },
  },
];
