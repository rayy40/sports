import { TeamStatistics } from "@/lib/types";
import { getTeamsRequiredStatistics } from "@/lib/utils";
import React from "react";

type Props = {
  data?: TeamStatistics | null;
};

const TeamStatistics = ({ data }: Props) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p>No Statistics found.</p>
      </div>
    );
  }

  const requiredStats = getTeamsRequiredStatistics(data);

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
