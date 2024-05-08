import { Suspense } from "react";

import Await from "@/components/Await";
import BounceLoader from "@/components/ui/BounceLoader";
import MobileFilter from "@/components/MobileFilter";
import Tabs from "@/components/ui/Tabs";
import { sports } from "@/lib/constants";
import { Sports } from "@/types/general";
import { getFixtureLineups } from "@/services/getFixtureStat";
import Lineups from "@/components/ui/Lineups";

type Props = {
  searchParams: {
    season?: string;
  };
  params: {
    fixtureId: string;
    sport: Sports;
  };
};

const Page = async ({ searchParams, params }: Props) => {
  if (!sports.includes(params.sport)) {
    throw new Error("Unrecognized sport.");
  }

  const fixtureId = params.fixtureId;
  const key = JSON.stringify({ ...searchParams });

  const promise = getFixtureLineups(fixtureId, params.sport);

  const tabs = ["Head to Head", "Events", "Lineups", "Match Stat"];

  return (
    <>
      <div className="flex items-center justify-center w-full px-3 pt-3 shadow-sm lg:px-6 bg-background">
        <div className="items-end hidden gap-6 lg:flex">
          {tabs.map((tab, index) => (
            <Tabs key={index} id={tab} />
          ))}
        </div>
        <MobileFilter
          tabs={tabs}
          isHome={false}
          labels={[]}
          isFixture={false}
        />
      </div>
      <Suspense key={key} fallback={<BounceLoader />}>
        <Await promise={promise}>
          {({ success, error }) => {
            if (error) {
              throw new Error(error);
            }
            return (
              <div className="flex-1 overflow-y-auto">
                <Lineups lineups={success} />
              </div>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
};

export default Page;
