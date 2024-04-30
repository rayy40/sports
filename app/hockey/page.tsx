import React, { cache } from "react";
import { Hockey } from "@/Assets/Icons/Sports";
import HomeWrapper from "@/components/HomeWrapper";
import FilterWrapper from "@/components/FilterWrapper";
import { getCountries, getFixturesByDate } from "@/services/api";
import { format } from "date-fns";
import DatePicker from "@/components/ui/DatePicker";
import ErrorBoundary from "@/components/Error";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hockey",
  description: "Show various data for hockey.",
};

export const getCountry = cache(async () => {
  return await getCountries("hockey");
});

export const getFixture = cache(async (date: string) => {
  return await getFixturesByDate(date, "hockey");
});

const Page = async () => {
  const date = new Date();
  const formattedDate = format(date, "yyyy-MM-dd");

  try {
    const fixturesRes = getFixture(formattedDate);
    const countriesRes = getCountry();

    const [fixtures, countries] = await Promise.all([
      fixturesRes,
      countriesRes,
    ]);

    return (
      <div className="flex flex-col w-full h-screen font-sans bg-background">
        <div className="sticky top-0 z-10 px-3 border border-b shadow-sm lg:px-6 bg-background">
          <div className="flex items-center justify-between py-3 lg:py-6">
            <h2 className="flex items-center gap-2 text-xl font-medium lg:gap-3 lg:text-2xl text-secondary-foreground">
              <Hockey width={50} height={50} />
              Games
            </h2>
            <DatePicker />
          </div>
          <FilterWrapper
            fixtures={fixtures ?? []}
            isHome={true}
            sport={"hockey"}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <HomeWrapper countries={countries} sport={"hockey"} />
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="w-full h-screen">
        <ErrorBoundary message={(error as Error).message} />
      </div>
    );
  }
};

export default Page;
