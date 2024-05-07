import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/Shadcn/table";
import { FixtureStatisticsResponse as FootballStats } from "@/types/football";
import {
  mergeStatistics,
  mergeStatisticsForAFL,
  mergeStatisticsForNFL,
} from "@/lib/utils";
import { NFLTeamsStatisticsResponse as NFLStats } from "@/types/american-football";
import { AustralianFootballFixtureStatistics as AFLStats } from "@/types/australian-football";
import NotFound from "../NotFound";

export function isNFLTeamStats(
  item: (FootballStats | NFLStats | AFLStats<number>)[]
): item is NFLStats[] {
  return (
    item[0].statistics !== null &&
    item[0].statistics !== undefined &&
    "first_downs" in item?.[0].statistics
  );
}

export function isAFLTeamStats(
  item: (FootballStats | NFLStats | AFLStats<number>)[]
): item is AFLStats<number>[] {
  return (
    item[0].statistics !== null &&
    item[0].statistics !== undefined &&
    "stoppages" in item?.[0].statistics
  );
}

export function isFootballTeamStats(
  item: (FootballStats | NFLStats | AFLStats<number>)[]
): item is FootballStats[] {
  return (
    item[0].statistics !== null &&
    item[0].statistics !== undefined &&
    Array.isArray(item[0].statistics)
  );
}

type Props = {
  stats: (FootballStats | NFLStats | AFLStats<number>)[] | undefined;
};

const MatchStat = ({ stats }: Props) => {
  if (!stats) return <NotFound type="statistics" />;

  const mergedStats = isFootballTeamStats(stats)
    ? mergeStatistics([stats[0], stats[1]], stats[0].team.name)
    : isNFLTeamStats(stats)
    ? mergeStatisticsForNFL(stats)
    : isAFLTeamStats(stats)
    ? mergeStatisticsForAFL(stats)
    : undefined;

  return (
    <div className="max-w-[1000px] w-full mx-auto">
      <Table className="my-6">
        <TableBody>
          {mergedStats &&
            Object.keys(mergedStats).map((stat, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">
                  {mergedStats[stat]?.home ?? "-"}
                </TableCell>
                <TableCell className="text-center">{stat}</TableCell>
                <TableCell className="text-center">
                  {mergedStats[stat]?.away ?? "-"}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatchStat;
