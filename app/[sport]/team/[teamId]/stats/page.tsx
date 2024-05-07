import Await from "@/components/Await";
import Loading from "@/components/Loading";
import MobileFilter from "@/components/MobileFilter";
import { FilterDropDown } from "@/components/FilterDropDown";
import Tabs from "@/components/ui/Tabs";
import TeamStatistics from "@/components/ui/TeamStatistics";
import { sports } from "@/lib/constants";
import { getTeamStatistics } from "@/services/getTeamStatistics";
import { Sports } from "@/types/general";
import React, { Suspense } from "react";

type Props = {
  searchParams: {
    season?: string;
    league?: string;
  };
  params: {
    teamId: string;
    sport: Sports;
  };
};

const Page = async ({ searchParams, params }: Props) => {
  if (!sports.includes(params.sport)) {
    throw new Error("Unrecognized sport.");
  }

  const teamId = params.teamId;
  const leagueId = searchParams.league;
  const season = searchParams.season || "2023";
  const key = JSON.stringify({ ...searchParams });

  if (!leagueId) {
    throw new Error("League ID is required.");
  }

  const promise = getTeamStatistics(teamId, season, params.sport, leagueId);

  const tabs = ["Fixtures", "Standings", "Stats"];

  return (
    <>
      <div className="flex items-center justify-between w-full px-3 pt-3 shadow-sm lg:px-6 bg-background">
        <div className="items-end hidden gap-6 lg:flex">
          {tabs.map((tab, index) => (
            <Tabs key={index} id={tab} />
          ))}
        </div>
        <div className="relative items-center hidden gap-4 lg:flex">
          <FilterDropDown labels={[]} title={"league"} isTeam={true} />
        </div>
        <MobileFilter tabs={tabs} isHome={false} isFixture={false} />
      </div>
      <Suspense key={key} fallback={<Loading />}>
        <Await promise={promise}>
          {({ success, error }) => {
            if (error) {
              throw new Error(error);
            }
            return (
              <div className="flex-1 overflow-y-auto">
                <TeamStatistics data={success} />
              </div>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
};

export default Page;
