import React from "react";
import { Basketball } from "@/Assets/Icons/Sports";
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
import { BasketballScores } from "@/types/basketball";

const Page = async () => {
  const date = new Date();
  const formattedDate = format(date, "yyyy-MM-dd");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [formattedDate, "basketball", "fixtures"],
    queryFn: () => getFixturesByDate(formattedDate, "basketball"),
  });

  const fixtures: Games<BasketballScores>[] | undefined =
    queryClient.getQueryData([formattedDate, "basketball", "fixtures"]);

  if (!fixtures) {
    <div className="h-screen w-full flex items-center justify-center">
      <p>No fixtures found.</p>
    </div>;
  }

  return (
    <div className="bg-background w-full min-h-screen font-sans">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="px-6 border border-b shadow-sm sticky top-0 bg-background z-10">
          <div className="py-6 flex justify-between items-center">
            <h2 className="text-2xl flex items-center gap-3 text-secondary-foreground font-medium">
              <Basketball width={50} height={50} />
              Games
            </h2>
            <DatePicker />
          </div>
          <FilterWrapper
            fixtures={fixtures}
            isHome={true}
            sport={"basketball"}
          />
        </div>
        <div className="h-[calc(100vh-150px)] overflow-y-auto px-6">
          <HomeFixtures sport={"basketball"} />
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
