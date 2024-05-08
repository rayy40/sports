import { Suspense } from "react";

import Await from "@/components/Await";
import CountriesWrapper from "@/components/CountriesWrapper";
import BounceLoader from "@/components/ui/BounceLoader";
import { sports } from "@/lib/constants";
import { getLeagueByCode } from "@/services/getLeagues";
import { Sports } from "@/types/general";

type Props = {
  searchParams: {
    search: string;
  };
  params: {
    countryId: string;
    sport: Sports;
  };
};

const Page = async ({ params, searchParams }: Props) => {
  if (!sports.includes(params.sport)) {
    throw new Error("Unrecognized sport.");
  }

  const promise = getLeagueByCode(params.countryId, params.sport);

  const key = JSON.stringify({ ...params });
  const query = searchParams.search || "";

  return (
    <Suspense key={key} fallback={<BounceLoader />}>
      <Await promise={promise}>
        {({ success, error }) => {
          if (error) {
            throw new Error(error);
          }
          return (
            <div className="flex-1 overflow-y-auto">
              <CountriesWrapper
                data={success}
                type={"league"}
                sport={params.sport}
                query={query}
              />
            </div>
          );
        }}
      </Await>
    </Suspense>
  );
};

export default Page;
