import React, { ReactNode } from "react";

import ImageWithFallback from "@/components/ImageWithFallback";
import { DropDown } from "@/components/ui/DropDown";
import { sports } from "@/lib/constants";
import { TeamResponse as FootballTeamResponse } from "@/types/football";
import { Sports, TeamResponse } from "@/types/general";
import { getTeamById } from "@/services/getTeams";

type Props = {
  children: ReactNode;
  params: { teamId: string; sport: Sports };
};

function isFootballTeam(
  item: TeamResponse | FootballTeamResponse
): item is FootballTeamResponse {
  return "venue" in item && "team" in item;
}

function isNonFootballTeam(
  item: TeamResponse | FootballTeamResponse
): item is TeamResponse {
  return "id" in item && "name" in item && "logo" in item;
}

const LeagueLayout = async ({ children, params }: Props) => {
  const date = new Date();
  const previousYear = (date.getFullYear() - 1).toString();
  const currentYear = date.getFullYear().toString();
  const last10Years: number[] = [];

  for (let i = 0; i < 10; i++) {
    last10Years.push(parseInt(currentYear) - i);
  }

  if (!sports.includes(params.sport)) {
    throw new Error("Unrecognized sport.");
  }

  const isPreviousYear = ["football", "hockey", "american-football"].includes(
    params.sport
  );

  const teamId = params.teamId;
  const season = isPreviousYear ? previousYear : currentYear;
  let team;

  const data = await getTeamById(teamId, params.sport);

  if (data.error) {
    throw new Error(data.error);
  }

  if (data.success) {
    if (isFootballTeam(data.success)) {
      team = data.success.team;
    }

    if (isNonFootballTeam(data.success)) {
      team = data.success;
    }

    return (
      <div className="flex flex-col h-screen font-sans">
        <div className="sticky top-0 z-20 flex flex-col gap-3 p-3 pb-0 lg:gap-6 lg:px-6 lg:pb-0 lg:pt-4 bg-background">
          <div className="flex items-center gap-2 py-2 lg:gap-4">
            <ImageWithFallback
              className="w-[40px] lg:w-[50px]"
              src={team?.logo}
              alt={`${team?.name}-logo`}
            />
            <h2 className="flex items-center text-lg font-medium lg:text-2xl">
              {team?.name}
              <span className="text-sm hidden lg:inline-block  lg:text-[1rem] ml-3 text-secondary-foreground">
                ({season})
              </span>
            </h2>
            <div className="hidden ml-auto lg:block">
              <DropDown
                title="season"
                data={last10Years.map(String)}
                value={season ?? "-"}
              />
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }
};

export default LeagueLayout;
