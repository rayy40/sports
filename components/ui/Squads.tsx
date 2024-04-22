import { PlayersEntity, Squads } from "@/types/football";
import { getPlayersByPosition } from "@/lib/utils";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Shadcn/table";
import ImageWithFallback from "../ImageWithFallback";
import { NBAPlayer } from "@/types/basketball";
import Link from "next/link";
import { Player } from "@/types/general";

type Props = {
  data: (Squads | NBAPlayer | Player)[];
};

const Squads = ({ data }: Props) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        No Squads found
      </div>
    );
  }
  const playersByPosition = getPlayersByPosition(
    data as (PlayersEntity | NBAPlayer)[]
  );

  return (
    <div className="h-full overflow-y-auto">
      {Object.keys(playersByPosition).map((pos) => (
        <div key={pos}>
          <p className="font-medium text-[1.125rem] p-6 pl-9 border-b">{pos}</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: "60%" }} className="text-left pl-9">
                  Player
                </TableHead>
                <TableHead className="text-center">No</TableHead>
                <TableHead className="text-center">Age</TableHead>
                <TableHead className="text-center">Position</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playersByPosition?.[pos]?.map((player) => (
                <TableRow key={player.id}>
                  <TableCell
                    style={{ width: "60%" }}
                    className="text-left pl-9"
                  >
                    <div className="flex items-center gap-3">
                      {player.photo.length > 0 && (
                        <Link href={`/player/${player.id}`}>
                          <ImageWithFallback
                            src={player.photo}
                            alt={`${player.name}-profile`}
                          />
                        </Link>
                      )}
                      <Link href={`/player/${player.id}`}>
                        <p>{player?.name}</p>
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {player?.number ?? "-"}
                  </TableCell>
                  <TableCell className="text-center">{player?.age}</TableCell>
                  <TableCell className="text-center">
                    {player?.position}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default Squads;
