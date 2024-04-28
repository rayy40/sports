import React from "react";
import { NFL } from "@/Assets/Icons/Sports";
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
    queryKey: [formattedDate, "american-football", "fixtures"],
    queryFn: () => getFixturesByDate(formattedDate, "american-football"),
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
      <div className="h-screen w-full">
        <Error message={fixtures} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen font-sans bg-background">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="px-3 lg:px-6 sticky top-0 z-10 border border-b shadow-sm bg-background">
          <div className="py-3 lg:py-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 lg:gap-3 text-xl lg:text-2xl font-medium text-secondary-foreground">
              <NFL width={50} height={50} />
              Games
            </h2>
            <DatePicker />
          </div>
          <FilterWrapper
            fixtures={fixtures}
            isHome={true}
            sport={"american-football"}
          />
        </div>
        <div className="h-[calc(100vh-100px)] lg:h-[calc(100vh-150px)] overflow-y-auto">
          <HomeWrapper sport={"american-football"} />
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
