import { Suspense } from "react";

import Await from "@/components/Await";
import Loading from "@/components/Loading";
import MobileFilter from "@/components/MobileFilter";
import { FilterDropDown } from "@/components/FilterDropDown";
import FixturesTable from "@/components/FixturesTable";
import Tabs from "@/components/ui/Tabs";
import { sports, statusFilters } from "@/lib/constants";
import { getFixtureData, getLeagues } from "@/lib/utils";
import { getFixturesByTeamId } from "@/services/getFixtures";
import { Sports } from "@/types/general";

type Props = {
  searchParams: {
    season?: string;
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
  const season = searchParams.season || "2023";
  const key = JSON.stringify({ ...searchParams });

  const promise = getFixturesByTeamId(teamId, season, params.sport);

  const { success } = await promise;

  const fixture = success ? getFixtureData(success[0]) : undefined;

  const leagues = success ? getLeagues(success) : undefined;

  const tabs = ["Fixtures", "Standings", "Stats"];

  return (
    <>
      <div className="flex items-center justify-between w-full px-3 pt-3 shadow-sm lg:px-6 bg-background">
        <div className="items-end hidden gap-6 lg:flex">
          {tabs.map((tab, index) => (
            <Tabs
              key={index}
              id={tab}
              leagueId={fixture?.fixtureLeague.id.toString()}
              isTeam={true}
            />
          ))}
        </div>
        <div className="relative items-center hidden gap-4 lg:flex">
          <FilterDropDown labels={leagues ?? []} title={"league"} />
          <FilterDropDown labels={statusFilters ?? []} title={"status"} />
        </div>
        <MobileFilter
          tabs={tabs}
          isHome={false}
          labels={leagues ?? []}
          isFixture={true}
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
                <FixturesTable
                  fixtures={success}
                  leagues={leagues}
                  sport={params.sport}
                />
              </div>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
};

export default Page;
