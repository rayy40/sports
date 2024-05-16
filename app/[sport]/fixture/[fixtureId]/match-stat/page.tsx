import { Suspense } from "react";

import Await from "@/components/Await";
import BounceLoader from "@/components/ui/BounceLoader";
import MobileFilter from "@/components/MobileFilter";
import Tabs from "@/components/ui/Tabs";
import { sports } from "@/lib/constants";
import { Sports } from "@/types/general";
import { getFixtureStatistics } from "@/services/getFixtureStat";
import MatchStat from "@/components/ui/MatchStat";
import { getTabs } from "@/lib/utils";

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

  return;

  // const promise = getFixtureStatistics(fixtureId, params.sport);

  // const tabs = getTabs(params.sport);

  // return (
  //   <>
  //     <div className="flex bg-secondary/30 items-center justify-center w-full px-3 pt-3 shadow-sm border-b-2 lg:px-6">
  //       <div className="items-end hidden gap-6 lg:flex">
  //         {tabs
  //           .filter((_, index) => index > 0)
  //           .map((tab, index) => (
  //             <Tabs key={index} id={tab} />
  //           ))}
  //       </div>
  //       {tabs.length > 0 && (
  //         <MobileFilter
  //           tabs={tabs}
  //           isHome={false}
  //           labels={[]}
  //           isFixture={false}
  //         />
  //       )}
  //     </div>
  //     <Suspense key={key} fallback={<BounceLoader />}>
  //       <Await promise={promise}>
  //         {({ success, error }) => {
  //           if (error) {
  //             throw new Error(error);
  //           }
  //           return (
  //             <div className="flex-1 overflow-y-auto">
  //               <MatchStat stats={success} />
  //             </div>
  //           );
  //         }}
  //       </Await>
  //     </Suspense>
  //   </>
  // );
};

export default Page;
