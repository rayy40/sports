import { TeamStatistics } from "@/types/football";
import {
  TeamStatistics as BasketballTeamStatistics,
  NBAStatistics,
} from "@/types/basketball";
import {
  getBasketballTeamsRequiredStatistics,
  getFootballTeamsRequiredStatistics,
  getNBATeamsRequiredStatistics,
} from "@/lib/utils";
import React from "react";

type Props = {
  data?: TeamStatistics | BasketballTeamStatistics | NBAStatistics | null;
};

type RequiredStats = (
  | {
      label: string;
      value: number;
    }
  | {
      label: string;
      value: string;
    }
)[];

const TeamStatistics = ({ data }: Props) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p>No Statistics found.</p>
      </div>
    );
  }

  let requiredStats: RequiredStats = [];
  if ("cards" in data) {
    requiredStats = getFootballTeamsRequiredStatistics(data);
  } else if ("turnovers" in data) {
    requiredStats = getNBATeamsRequiredStatistics(data);
  } else if ("points" in data) {
    requiredStats = getBasketballTeamsRequiredStatistics(data);
  }

  return (
    <div className="w-full p-9">
      <div className="grid grid-cols-2 gap-16 lg:gap-28 lg:grid-cols-3 xl:grid-cols-4">
        {requiredStats?.map((stat, index) => (
          <div
            key={index}
            className="py-8 border-b w-[260px] border-b-secondary-foreground/50"
          >
            <h3 className="font-medium t">{stat.label}</h3>
            <div className="font-semibold text-7xl">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamStatistics;
