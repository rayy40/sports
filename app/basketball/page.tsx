import React, { cache } from "react";
import { Basketball } from "@/Assets/Icons/Sports";
import HomeWrapper from "@/components/HomeWrapper";
import FilterWrapper from "@/components/FilterWrapper";
import { getFixturesByDate } from "@/services/api";
import { format } from "date-fns";
import DatePicker from "@/components/ui/DatePicker";
import ErrorBoundary from "@/components/Error";
import { AllSportsFixtures } from "@/types/general";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Basketball",
  description: "Show various data for basketball.",
};

export const getFixture = cache(async (date: string) => {
  return await getFixturesByDate(date, "basketball");
});

const Page = async () => {
  const date = new Date();
  const formattedDate = format(date, "yyyy-MM-dd");
  let fixtures: AllSportsFixtures[] | null | undefined = undefined;

  try {
    fixtures = await getFixture(formattedDate);
  } catch (error) {
    return (
      <div className="w-full h-screen">
        <ErrorBoundary message={(error as Error).message} />
      </div>
    );
  }

  if (!fixtures) {
    return (
      <div className="h-screen text-sm lg:text-[1rem] w-full flex items-center justify-center">
        <p>No fixtures found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen font-sans bg-background">
      <div className="sticky top-0 z-10 px-3 border border-b shadow-sm lg:px-6 bg-background">
        <div className="flex items-center justify-between py-3 lg:py-6">
          <h2 className="flex items-center gap-2 text-xl font-medium lg:gap-3 lg:text-2xl text-secondary-foreground">
            <Basketball width={50} height={50} />
            Games
          </h2>
          <DatePicker />
        </div>
        <FilterWrapper fixtures={fixtures} isHome={true} sport={"basketball"} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <HomeWrapper sport={"basketball"} />
      </div>
    </div>
  );
};

export default Page;
