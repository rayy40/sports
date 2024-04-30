import React, { cache } from "react";
import { Football } from "@/Assets/Icons/Sports";
import HomeWrapper from "@/components/HomeWrapper";
import FilterWrapper from "@/components/FilterWrapper";
import { getCountries, getFixturesByDate } from "@/services/api";
import { format } from "date-fns";
import DatePicker from "@/components/ui/DatePicker";
import ErrorBoundary from "@/components/Error";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Football",
  description: "Show various data for football.",
};

export const getFixture = cache(async (date: string) => {
  return await getFixturesByDate(date, "football");
});

export const getCountry = cache(async () => {
  return await getCountries("football");
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
            <h2 className="flex items-center gap-2 text-xl font-medium lg:text-2xl lg:gap-3 text-secondary-foreground">
              <Football width={50} height={50} />
              Games
            </h2>
            <DatePicker />
          </div>
          <FilterWrapper
            fixtures={fixtures ?? []}
            isFootball={true}
            isHome={true}
            sport={"football"}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <HomeWrapper
            isFootball={true}
            countries={countries}
            sport={"football"}
          />
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
