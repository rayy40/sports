import { Suspense } from "react";

import BounceLoader from "@/components/ui/BounceLoader";
import MobileFilter from "@/components/MobileFilter";
import { FilterDropDown } from "@/components/FilterDropDown";
import Tabs from "@/components/ui/Tabs";
import { sports, statusFilters } from "@/lib/constants";
import { getLeagues, getTeams } from "@/lib/utils";
import { getFixturesByDate } from "@/services/getFixtures";
import { Sports } from "@/types/general";
import { format } from "date-fns";
import FixturesBox from "@/components/FixturesBox";
import {
  Baseball,
  Basketball,
  Football,
  Hockey,
  NFL,
  Rugby,
} from "@/Assets/Icons/Sports";
import DatePicker from "@/components/ui/DatePicker";
import { getCountries } from "@/services/getCountries";
import Await from "@/components/Await";

type Props = {
  searchParams: {
    date?: string;
  };
  params: {
    sport: Sports;
  };
};

const Icon = ({ sport }: { sport: Sports }) => {
  switch (sport) {
    case "football":
      return <Football className="mt-2" width={40} height={40} />;
    case "basketball":
      return <Basketball className="mt-2" width={40} height={40} />;
    case "baseball":
      return <Baseball className="mt-1" width={40} height={40} />;
    case "hockey":
      return <Hockey className="mt-2" width={40} height={40} />;
    case "rugby":
      return <Rugby className="mt-2" width={45} height={45} />;
    case "american-football":
    case "australian-football":
      return <NFL className="mt-2" width={40} height={40} />;
    default:
      return <Football className="mt-2" width={40} height={40} />;
  }
};

const Page = async ({ searchParams, params }: Props) => {
  if (!sports.includes(params.sport)) {
    throw new Error("Unrecognized sport.");
  }

  const today = format(new Date(), "yyyy-MM-dd");

  const date = searchParams.date || today;
  const key = JSON.stringify({ ...searchParams });

  const promise = Promise.all([
    getFixturesByDate(date, params.sport),
    getCountries(params.sport),
  ]);

  const [fixturesPromise] = await promise;

  const teams = fixturesPromise.success
    ? getTeams(fixturesPromise.success)
    : undefined;
  const leagues = fixturesPromise.success
    ? getLeagues(fixturesPromise.success)
    : undefined;

  return (
    <div className="flex flex-col h-screen font-sans">
      <div className="sticky top-0 z-20 flex flex-col gap-3 p-3 pb-0 lg:gap-6 lg:px-6 lg:pb-0 lg:pt-4 bg-background">
        <div className="flex items-center gap-2 py-2 lg:gap-4">
          <Icon sport={params.sport} />
          <h2 className="flex items-center text-lg font-medium capitalize lg:text-2xl">
            {params.sport.replaceAll("-", " ")}
          </h2>
          <div className="hidden ml-auto lg:block">
            <DatePicker date={date} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between w-full px-3 pt-3 font-sans shadow-sm lg:px-6 bg-background">
        <div className="items-end hidden gap-6 lg:flex">
          {statusFilters.map((tab, index) => (
            <Tabs key={index} id={tab} isHome={true} />
          ))}
        </div>
        <div className="relative items-center hidden gap-4 lg:flex">
          <FilterDropDown labels={teams ?? []} title={"team"} />
          <FilterDropDown labels={leagues ?? []} title={"league"} />
        </div>
        <MobileFilter
          tabs={[]}
          isHome={true}
          labels={teams ?? []}
          isFixture={true}
        />
      </div>
      <Suspense key={key} fallback={<BounceLoader />}>
        <Await promise={promise}>
          {(data) => {
            if (data[0].error) {
              throw new Error(data[0].error);
            }
            return (
              <div className="flex-1 overflow-y-auto">
                <FixturesBox
                  fixtures={data[0].success}
                  countries={data[1].success}
                  sport={params.sport}
                />
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
};

export default Page;
