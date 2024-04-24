import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/Shadcn/table";
import { Sports } from "@/types/general";
import { FixtureStatisticsResponse } from "@/types/football";
import { mergeStatistics, mergeStatisticsForNFL } from "@/lib/utils";
import { NFLTeamsStatisticsResponse } from "@/types/american-football";

export function isNFLTeamStats(
  item: (FixtureStatisticsResponse | NFLTeamsStatisticsResponse)[]
): item is NFLTeamsStatisticsResponse[] {
  return (
    item[0].statistics !== null &&
    item[0].statistics !== undefined &&
    "first_downs" in item?.[0].statistics
  );
}

export function isFootballTeamStats(
  item: (FixtureStatisticsResponse | NFLTeamsStatisticsResponse)[]
): item is FixtureStatisticsResponse[] {
  return (
    item[0].statistics !== null &&
    item[0].statistics !== undefined &&
    Array.isArray(item[0].statistics)
  );
}

type Props = {
  stats: (FixtureStatisticsResponse | NFLTeamsStatisticsResponse)[] | undefined;
  sport: Sports;
};

const MatchStat = ({ stats, sport }: Props) => {
  if (!stats) {
    return <p>No Statistics found for this fixture.</p>;
  }

  const mergedStats = isFootballTeamStats(stats)
    ? mergeStatistics([stats[0], stats[1]], stats[0].team.name)
    : isNFLTeamStats(stats)
    ? mergeStatisticsForNFL(stats)
    : undefined;

  return (
    <div className="max-w-[1000px] mx-auto">
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
