import React from "react";
import { Baseball } from "@/Assets/Icons/Sports";
import HomeWrapper from "@/components/HomeWrapper";
import FilterWrapper from "@/components/FilterWrapper";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getFixturesByDate } from "@/services/api";
import { format } from "date-fns";
import DatePicker from "@/components/ui/DatePicker";
import Error from "@/components/Error";

const Page = async () => {
  const date = new Date();
  const formattedDate = format(date, "yyyy-MM-dd");
  const queryClient = new QueryClient();

  const fixtures = await queryClient.fetchQuery({
    queryKey: [formattedDate, "australian-football", "fixtures"],
    queryFn: () => getFixturesByDate(formattedDate, "australian-football"),
  });

  if (!fixtures) {
    return (
      <div className="flex text-sm lg:text-[1rem] items-center justify-center w-full h-screen">
        <p>No fixtures found.</p>
      </div>
    );
  }

  if (typeof fixtures === "string") {
    return (
      <div className="w-full h-screen">
        <Error message={fixtures} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen font-sans bg-background">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="sticky top-0 z-10 px-3 border border-b shadow-sm lg:px-6 bg-background">
          <div className="flex items-center justify-between py-3 lg:py-6">
            <h2 className="flex items-center gap-2 text-xl font-medium lg:gap-3 lg:text-2xl text-secondary-foreground">
              <Baseball width={50} height={50} />
              Games
            </h2>
            <DatePicker />
          </div>
          <FilterWrapper
            fixtures={fixtures}
            isHome={true}
            sport={"australian-football"}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <HomeWrapper sport={"australian-football"} />
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
