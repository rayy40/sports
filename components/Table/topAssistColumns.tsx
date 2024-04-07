"use client";

import { Games, Goals, Player, Team, PlayerStats, Passes } from "@/lib/types";
import { ColumnDef, Getter } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";
import ProfileLogo from "@/Assets/Logos/ProfileLogo";

export const topAssistColumns: ColumnDef<PlayerStats | null>[] = [
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
        <p className="text-center text-[0.975rem]">{goals?.total ?? "-"}</p>
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
        <p className="text-center text-[0.975rem] font-medium">
          {goals?.assists ?? "-"}
        </p>
      );
    },
  },
  {
    id: "totalPasses",
    accessorFn: (row) => row?.statistics?.[0]?.passes,
    header: "Total Passes",
    cell: ({ getValue }: { getValue: Getter<Passes | undefined> }) => {
      const passes = getValue();

      return (
        <p className="text-center text-[0.975rem]">{passes?.total ?? "-"}</p>
      );
    },
  },
  {
    id: "keyPasses",
    accessorFn: (row) => row?.statistics?.[0]?.passes,
    header: "Key Passes",
    cell: ({ getValue }: { getValue: Getter<Passes | undefined> }) => {
      const passes = getValue();

      return (
        <p className="text-center text-[0.975rem]">{passes?.key ?? "-"}</p>
      );
    },
  },
  {
    id: "passAccuracy",
    accessorFn: (row) => row?.statistics?.[0]?.passes,
    header: "Pass Accuracy",
    cell: ({ getValue }: { getValue: Getter<Passes | undefined> }) => {
      const passes = getValue();

      return (
        <p className="text-center text-[0.975rem]">
          {`${passes?.accuracy}%` ?? "-"}
        </p>
      );
    },
  },
];
