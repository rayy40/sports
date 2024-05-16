import { Player, PlayerStats as TPlayerStats, Team } from "@/types/football";
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "./Shadcn/table";
import NotFound from "../NotFound";
import ImageWithFallback from "../ImageWithFallback";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  data?: TPlayerStats[];
  stat: string;
};

const topScorersHeaders = [
  "rank",
  "player",
  "team",
  "played",
  "goals",
  "assists",
  "minutes",
  "total shots",
  "shot accuracy",
  "penalty",
];
const topAssistHeaders = [
  "rank",
  "player",
  "team",
  "played",
  "assists",
  "goals",
  "minutes",
  "key passes",
  "total passes",
  "pass accuracy",
];

const StandingTableHeader = ({ headers }: { headers: string[] }) => {
  return (
    <TableHeader className="sticky top-0 z-10 shadow-sm pointer-events-none bg-background">
      {headers.map((head, index) => (
        <TableHead
          className={cn("text-center capitalize bg-background", {
            "text-left sticky min-w-[40px] left-0": index === 0,
            "min-w-[160px] text-left sticky z-20 left-[70px] -ml-2":
              index === 1,
          })}
          key={index}
        >
          {head}
        </TableHead>
      ))}
    </TableHeader>
  );
};

const StandingPlayer = ({ player }: { player: Player }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Add fallback profile image*/}
      <ImageWithFallback src={player?.photo} alt={`${player.name}-logo`} />
      <p className="text-sm lg:text-[1rem]">{player?.name}</p>
    </div>
  );
};

const StandingTeam = ({ team }: { team?: Team }) => {
  return (
    <Link prefetch={true} href={`/football/teams/${team?.id}`}>
      <p className="text-sm text-center">{team?.name}</p>
    </Link>
  );
};

const TopScorersStandings = ({ standings }: { standings: TPlayerStats[] }) => {
  return (
    <Table className="border-t ">
      <StandingTableHeader headers={topAssistHeaders} />
      <TableBody className="w-full overflow-x-auto">
        {standings.map((item, index) => {
          const stats = item.statistics?.[0];
          return (
            <TableRow className="text-center" key={index}>
              <TableCell className="sticky left-0 pl-6 text-left lg:left-6 bg-background">
                {index + 1}
              </TableCell>
              <TableCell className="sticky left-[70px] bg-background">
                <StandingPlayer player={item.player} />
              </TableCell>
              <TableCell>
                <StandingTeam team={stats?.team} />
              </TableCell>
              <TableCell>{stats?.games.appearences ?? "-"}</TableCell>
              <TableCell>{stats?.games.minutes ?? "-"}</TableCell>
              <TableCell className="font-medium">
                {stats?.goals.total ?? "-"}
              </TableCell>
              <TableCell>{stats?.goals.assists ?? "-"}</TableCell>
              <TableCell>{stats?.shots.total ?? "-"}</TableCell>
              <TableCell>{stats?.shots.on ?? "-"}</TableCell>
              <TableCell>{stats?.penalty.scored ?? "-"}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const TopAssistsStandings = ({ standings }: { standings: TPlayerStats[] }) => {
  return (
    <Table className="border-t">
      <StandingTableHeader headers={topScorersHeaders} />
      <TableBody className="w-full overflow-x-auto">
        {standings.map((item, index) => {
          const stats = item.statistics?.[0];
          return (
            <TableRow className="text-center" key={index}>
              <TableCell className="sticky left-0 pl-6 text-left lg:left-6 bg-background">
                {index + 1}
              </TableCell>
              <TableCell className="sticky left-[70px] bg-background">
                <StandingPlayer player={item.player} />
              </TableCell>
              <TableCell>
                <StandingTeam team={stats?.team} />
              </TableCell>
              <TableCell>{stats?.games.appearences ?? "-"}</TableCell>
              <TableCell>{stats?.games.minutes ?? "-"}</TableCell>
              <TableCell>{stats?.goals.total ?? "-"}</TableCell>
              <TableCell className="font-medium">
                {stats?.goals.assists ?? "-"}
              </TableCell>
              <TableCell>{stats?.passes.total ?? "-"}</TableCell>
              <TableCell>{stats?.passes.key ?? "-"}</TableCell>
              <TableCell>{stats?.passes.accuracy ?? "-"}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const PlayerStats = ({ data, stat }: Props) => {
  if (!data) return <NotFound type={"player stats"} />;

  if (stat === "topscorers") {
    return <TopScorersStandings standings={data} />;
  } else if (stat === "topassists") {
    return <TopAssistsStandings standings={data} />;
  }
};

export default PlayerStats;
