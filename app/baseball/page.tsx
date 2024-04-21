import React from "react";
import { Baseball } from "@/Assets/Icons/Sports";
import HomeFixtures from "@/components/HomeFixtures";
import FilterWrapper from "@/components/FilterWrapper";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getFixturesByDate } from "@/services/api";
import { format } from "date-fns";
import DatePicker from "@/components/ui/DatePicker";
import { Games } from "@/types/general";
import { BaseballScores } from "@/types/baseball";

const Page = async () => {
  const date = new Date();
  const formattedDate = format(date, "yyyy-MM-dd");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [formattedDate, "baseball", "fixtures"],
    queryFn: () => getFixturesByDate(formattedDate, "baseball"),
  });

  const fixtures: Games<BaseballScores>[] | undefined =
    queryClient.getQueryData([formattedDate, "baseball", "fixtures"]);

  if (!fixtures) {
    <div className="flex items-center justify-center w-full h-screen">
      <p>No fixtures found.</p>
    </div>;
  }

  return (
    <div className="w-full min-h-screen font-sans bg-background">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="sticky top-0 z-10 px-6 border border-b shadow-sm bg-background">
          <div className="flex items-center justify-between py-6">
            <h2 className="flex items-center gap-3 text-2xl font-medium text-secondary-foreground">
              <Baseball width={50} height={50} />
              Games
            </h2>
            <DatePicker />
          </div>
          <FilterWrapper fixtures={fixtures} isHome={true} sport={"baseball"} />
        </div>
        <div className="h-[calc(100vh-150px)] overflow-y-auto">
          <HomeFixtures sport={"baseball"} />
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
