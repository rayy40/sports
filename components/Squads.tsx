import { Squads } from "@/types/football";
import { getPlayersByPosition } from "@/lib/utils";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Shadcn/table";
import Image from "next/image";

type Props = {
  data?: Squads[] | null;
};

const Squads = ({ data }: Props) => {
  if (!data?.[0]?.players) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        No Squads found
      </div>
    );
  }
  const playersByPosition = getPlayersByPosition(data?.[0]?.players);

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
                      <Image
                        loading="lazy"
                        width={40}
                        height={40}
                        style={{
                          borderRadius: "50%",
                          aspectRatio: "1/1",
                          objectFit: "contain",
                        }}
                        src={player.photo}
                        alt={`${player.name}-profile`}
                      />
                      <p>{player?.name}</p>
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
