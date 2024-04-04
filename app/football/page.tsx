import Sidebar from "@/components/ui/Sidebar";
import Hero from "@/components/ui/Hero";
import HomeFixtures from "@/components/ui/HomeFixtures";
import { Country, Fixtures } from "@/lib/types";
import { getAPIData } from "@/lib/utils";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const Football = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["countries", "fixturesByDate"],
    queryFn: () => {
      getAPIData<Country>("countries");
      getAPIData<Fixtures>(`fixtures?date=${"2024-03-03"}`);
    },
  });

  return (
    <div className="flex flex-row w-full h-screen font-sans gap-6 py-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="w-[15%] min-w-[220px]">
          <Sidebar />
        </div>
        <div className="flex flex-col flex-1 gap-4 pr-4">
          <Hero />
          <HomeFixtures sport="football" />
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Football;
