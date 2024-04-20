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

const Page = async () => {
  const date = new Date();
  const formattedDate = format(date, "yyyy-MM-dd");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [formattedDate, "australian-football", "fixtures"],
    queryFn: () => getFixturesByDate(formattedDate, "australian-football"),
  });

  const fixtures = queryClient.getQueryData([
    formattedDate,
    "australian-football",
    "fixtures",
  ]);

  return (
    <div className="bg-background w-full min-h-screen font-sans">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="px-6 border border-b shadow-sm sticky top-0 bg-background z-10">
          <div className="py-6 flex justify-between items-center">
            <h2 className="text-2xl flex items-center gap-3 text-secondary-foreground font-medium">
              <Baseball width={50} height={50} />
              Games
            </h2>
            <DatePicker />
          </div>
          <FilterWrapper isHome={true} sport={"australian-football"} />
        </div>
        <div className="h-[calc(100vh-150px)] overflow-y-auto px-6">
          <HomeFixtures sport={"australian-football"} />
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
