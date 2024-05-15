import { Suspense } from "react";

import Await from "@/components/Await";
import BounceLoader from "@/components/ui/BounceLoader";
import MobileFilter from "@/components/MobileFilter";
import Tabs from "@/components/ui/Tabs";
import { sports } from "@/lib/constants";
import { Sports } from "@/types/general";
import { getFixtureById, getHeadtoHeadFixtures } from "@/services/getFixtures";
import { getFixtureData, getTabs } from "@/lib/utils";
import HeadtoHead from "@/components/ui/HeadtoHead";

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

  const { success } = await getFixtureById(fixtureId, params.sport);

  if (!success) {
    throw new Error("Fixture not found.");
  }

  const { homeTeam, awayTeam } = getFixtureData(success);

  const promise = getHeadtoHeadFixtures(homeTeam.id, awayTeam.id, params.sport);

  const tabs = getTabs(params.sport);

  return (
    <>
      <div className="flex bg-secondary/30 items-center justify-center w-full px-3 pt-3 shadow-sm border-b-2 lg:px-6">
        <div className="items-end hidden gap-6 lg:flex">
          {tabs?.map((tab, index) => (
            <Tabs key={index} id={tab} />
          ))}
        </div>
        {tabs && (
          <MobileFilter
            tabs={tabs}
            isHome={false}
            labels={[]}
            isFixture={false}
          />
        )}
      </div>
      <Suspense key={key} fallback={<BounceLoader />}>
        <Await promise={promise}>
          {({ success, error }) => {
            if (error) {
              throw new Error(error);
            }
            return (
              <div className="flex-1 overflow-y-auto">
                <HeadtoHead fixtures={success} sport={params.sport} />
              </div>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
};

export default Page;
