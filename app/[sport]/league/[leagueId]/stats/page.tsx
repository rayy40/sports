import { Suspense } from "react";

import Await from "@/components/Await";
import Loading from "@/components/Loading";
import MobileFilter from "@/components/MobileFilter";
import { FilterDropDown } from "@/components/FilterDropDown";
import Tabs from "@/components/ui/Tabs";
import { sports } from "@/lib/constants";
import { Sports } from "@/types/general";
import { getPlayerStats } from "@/services/getPlayerStats";
import PlayerStats from "@/components/ui/PlayerStats";

type Props = {
  searchParams: {
    season?: string;
    stat?: string;
  };
  params: {
    leagueId: string;
    sport: Sports;
  };
};

const Page = async ({ searchParams, params }: Props) => {
  if (!sports.includes(params.sport)) {
    throw new Error("Unrecognized sport.");
  }

  const id = params.leagueId;
  const season = searchParams.season || "2023";
  const stat = searchParams.stat?.replaceAll(" ", "") || "topscorers";
  const key = JSON.stringify({ ...searchParams });

  const promise = getPlayerStats(id, season, stat);

  const tabs = ["Fixtures", "Standings", "Stats"];
  const stats = ["top scorers", "top assists"];

  return (
    <>
      <div className="flex items-center justify-between w-full px-3 pt-3 shadow-sm lg:px-6 bg-background">
        <div className="items-end hidden gap-6 lg:flex">
          {tabs.map((tab, index) => (
            <Tabs key={index} id={tab} />
          ))}
        </div>
        <div className="relative items-center hidden gap-4 lg:flex">
          <FilterDropDown labels={stats} title={"stat"} isReload={true} />
        </div>
        <MobileFilter
          tabs={tabs}
          isHome={false}
          labels={[]}
          isFixture={false}
        />
      </div>
      <Suspense key={key} fallback={<Loading />}>
        <Await promise={promise}>
          {({ success, error }) => {
            if (error) {
              throw new Error(error);
            }
            return (
              <div className="flex-1 overflow-y-auto">
                <PlayerStats data={success} stat={stat} />
              </div>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
};

export default Page;
