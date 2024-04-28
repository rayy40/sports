import React from "react";
import { Football } from "@/Assets/Icons/Sports";
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
    queryKey: [formattedDate, "football", "fixtures"],
    queryFn: () => getFixturesByDate(formattedDate, "football"),
  });

  if (!fixtures) {
    return (
      <div className="h-screen text-sm lg:text-[1rem] w-full flex items-center justify-center">
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
    <div className="bg-background w-full min-h-screen font-sans">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="px-3 lg:px-6 border border-b shadow-sm sticky top-0 bg-background z-10">
          <div className="py-3 lg:py-6 flex justify-between items-center">
            <h2 className="text-xl lg:text-2xl flex items-center gap-2 lg:gap-3 text-secondary-foreground font-medium">
              <Football width={50} height={50} />
              Games
            </h2>
            <DatePicker />
          </div>
          <FilterWrapper
            fixtures={fixtures}
            isFootball={true}
            isHome={true}
            sport={"football"}
          />
        </div>
        <div className="h-[calc(100vh-100px)] lg:h-[calc(100vh-150px)] overflow-y-auto">
          <HomeWrapper isFootball={true} sport={"football"} />
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
