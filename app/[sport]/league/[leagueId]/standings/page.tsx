import { Suspense } from "react";

import Await from "@/components/Await";
import Loading from "@/components/Loading";
import MobileFilter from "@/components/MobileFilter";
import Standings from "@/components/Standings";
import Tabs from "@/components/ui/Tabs";
import { sports } from "@/lib/constants";
import { getStandingsByLeagueId } from "@/services/getStandings";
import { Sports } from "@/types/general";

type Props = {
  searchParams: {
    season?: string;
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

  const season = searchParams.season || "2023";
  const leagueId = params.leagueId;
  const key = JSON.stringify({ ...searchParams });

  const promise = getStandingsByLeagueId(leagueId, season, params.sport);

  const tabs = ["Fixtures", "Standings"];

  return (
    <>
      <div className="flex items-center justify-between w-full px-3 pt-3 shadow-sm lg:px-6 bg-background">
        <div className="items-end hidden gap-6 lg:flex">
          {tabs.map((tab, index) => (
            <Tabs key={index} id={tab} />
          ))}
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
                <Standings standing={success} sport="football" />
              </div>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
};

export default Page;
