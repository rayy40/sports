import {
  AllSportsTeamStats,
  isAFLTeamStats,
  isFootballTeamStats,
  isNBATeamStats,
} from "@/types/general";
import {
  getAFLTeamsRequiredStatistics,
  getFootballTeamsRequiredStatistics,
  getNBATeamsRequiredStatistics,
  getTeamsRequiredStatistics,
} from "@/lib/utils";
import React from "react";
import NotFound from "../NotFound";

type Props = {
  data?: AllSportsTeamStats;
};

type RequiredStats = {
  label: string;
  value: number | string;
}[];

const TeamStatistics = ({ data }: Props) => {
  if (!data) return <NotFound type="statistics" />;

  let requiredStats: RequiredStats = [];
  if (isFootballTeamStats(data)) {
    requiredStats = getFootballTeamsRequiredStatistics(data);
  } else if (isNBATeamStats(data)) {
    requiredStats = getNBATeamsRequiredStatistics(data);
  } else if (isAFLTeamStats(data)) {
    requiredStats = getAFLTeamsRequiredStatistics(data.statistics);
  } else if ("points" in data || "goals" in data) {
    requiredStats = getTeamsRequiredStatistics(data);
  }

  return (
    <div className="w-full p-5 lg:p-9">
      <div className="grid grid-cols-2 gap-12 lg:gap-28 lg:grid-cols-3 xl:grid-cols-4">
        {requiredStats?.map((stat, index) => (
          <div
            key={index}
            className="py-4 lg:py-8 border-b lg:w-[260px] border-b-secondary-foreground/50"
          >
            <h3 className="font-medium">{stat.label}</h3>
            <div className="text-4xl font-semibold lg:text-7xl">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamStatistics;
