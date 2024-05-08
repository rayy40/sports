import React, { ReactNode } from "react";

import ImageWithFallback from "@/components/ImageWithFallback";
import { DropDown } from "@/components/ui/DropDown";
import { sports } from "@/lib/constants";
import { getSeasonsList } from "@/lib/utils";
import { getLeagueById } from "@/services/getLeagues";
import { AustralianFootballLeagueOrTeamInfo as AFLLeague } from "@/types/australian-football";
import { Leagues } from "@/types/football";
import { League, Seasons, Sports } from "@/types/general";

type Props = {
  children: ReactNode;
  params: { leagueId: string; sport: Sports };
};

function isFootballLeagues(
  item: Leagues | League<Seasons[]> | AFLLeague
): item is Leagues {
  return "league" in item && "country" in item;
}

function isNonFootballLeagues(
  item: Leagues | League<Seasons[]> | AFLLeague
): item is League<Seasons[]> {
  return !("league" in item && "country" in item) && "seasons" in item;
}

function isAmericanFootballLeague(
  item: (Leagues | League<Seasons[]> | AFLLeague)[]
): item is AFLLeague[] {
  return !("league" in item[0] && "country" in item[0]) && "season" in item[0];
}

const LeagueLayout = async ({ children, params }: Props) => {
  if (!sports.includes(params.sport)) {
    throw new Error("Unrecognized sport.");
  }

  const leagueId = params.leagueId;
  let season: string = "";
  let seasonsList: string[] = [];
  let league;

  const data = await getLeagueById(leagueId, params.sport);

  if (data.error) {
    throw new Error(data.error);
  }

  if (data.success) {
    if (!Array.isArray(data.success) && isFootballLeagues(data.success)) {
      season =
        data.success.seasons?.[
          data.success.seasons?.length - 1
        ]?.year.toString() || "";
      seasonsList = getSeasonsList(data.success.seasons ?? []);
      league = data.success.league;
      console.log(league);
    }

    if (!Array.isArray(data.success) && isNonFootballLeagues(data.success)) {
      season =
        data.success.seasons?.[data.success.seasons?.length - 1].season || "";
      seasonsList = data.success.seasons.map((item) => item.season);
      league = data.success;
    }

    if (Array.isArray(data.success) && isAmericanFootballLeague(data.success)) {
      season = data.success[data.success.length - 1].season.toString() || "";
      seasonsList = data.success.map((league) => league.season.toString());
      league = data.success[data.success.length - 1];
    }

    return (
      <div className="flex flex-col h-screen font-sans">
        <div className="sticky top-0 z-20 flex flex-col gap-3 p-3 pb-0 lg:gap-6 lg:px-6 lg:pb-0 lg:pt-4 bg-background">
          <div className="flex items-center gap-2 py-2 lg:gap-4">
            <ImageWithFallback
              className="w-[40px] lg:w-[50px]"
              src={league?.logo}
              alt={`${league?.name}-logo`}
            />
            <h2 className="flex items-center text-lg font-medium lg:text-2xl">
              {league?.name}
              <span className="text-sm hidden lg:inline-block  lg:text-[1rem] ml-3 text-secondary-foreground">
                ({season})
              </span>
            </h2>
            <div className="hidden ml-auto lg:block">
              <DropDown
                title="season"
                data={seasonsList}
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
