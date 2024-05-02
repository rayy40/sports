import React, { cache } from "react";
import { NFL } from "@/Assets/Icons/Sports";
import HomeWrapper from "@/components/HomeWrapper";
import FilterWrapper from "@/components/FilterWrapper";
import { getFixturesByDate } from "@/services/api";
import { format } from "date-fns";
import DatePicker from "@/components/ui/DatePicker";
import ErrorBoundary from "@/components/Error";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AFL",
  description: "Show various data for AFL.",
};

const getFixture = cache(async (date: string) => {
  return await getFixturesByDate(date, "australian-football");
});

const Page = async () => {
  const date = new Date();
  const formattedDate = format(date, "yyyy-MM-dd");

  try {
    const fixtures = await getFixture(formattedDate);

    return (
      <div className="flex flex-col w-full h-screen font-sans bg-background">
        <div className="sticky top-0 z-10 px-3 border border-b shadow-sm lg:px-6 bg-background">
          <div className="flex items-center justify-between py-3 lg:py-6">
            <h2 className="flex items-center gap-2 text-xl font-medium lg:gap-3 lg:text-2xl text-secondary-foreground">
              <NFL width={50} height={50} />
              Games
            </h2>
            <DatePicker />
          </div>
          <FilterWrapper
            fixtures={fixtures ?? []}
            isHome={true}
            sport={"australian-football"}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <HomeWrapper sport={"australian-football"} />
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
