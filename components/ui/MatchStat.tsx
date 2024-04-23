import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Shadcn/table";
import { Sports } from "@/types/general";
import { FixtureStatisticsResponse } from "@/types/football";
import { mergeStatistics } from "@/lib/utils";

type Props = {
  stats: FixtureStatisticsResponse[] | undefined;
  sport: Sports;
};

const MatchStat = ({ stats, sport }: Props) => {
  if (!stats) {
    return <p>No Statistics found for this fixture.</p>;
  }

  const mergedStats = mergeStatistics([stats[0], stats[1]], stats[0].team.name);

  return (
    <div className="max-w-[1000px] mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="py-8 max-w-[100px]">
              <p className="text-lg text-foreground text-center font-medium">
                {stats?.[0]?.team?.name}
              </p>
            </TableHead>
            <TableHead></TableHead>
            <TableHead className="py-8 max-w-36">
              <p className="text-lg text-foreground text-center font-medium">
                {stats?.[1]?.team?.name}
              </p>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(mergedStats).map((stat, index) => (
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
