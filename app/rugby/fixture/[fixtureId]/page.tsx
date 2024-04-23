import FixtureFilterWrapper from "@/components/FixtureFilterWrapper";
import FixtureHeader from "@/components/ui/FixtureHeader";
import { getFixtureById } from "@/services/api";
import { FixtureTabsType, GamesWithPeriods } from "@/types/general";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";

const Page = async ({ params }: { params: { fixtureId: string } }) => {
  const fixtureId = parseInt(params.fixtureId);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [fixtureId, "rugby", "fixture"],
    queryFn: () => getFixtureById(fixtureId, "rugby"),
  });

  const fixture: GamesWithPeriods<number | null> | undefined =
    queryClient.getQueryData([fixtureId, "rugby", "fixture"]);

  const tabs: FixtureTabsType[] = ["Head to Head"];

  if (!fixture) {
    return (
      <div className="flex font-sans text-[1rem] font-medium h-screen w-full items-center justify-center">
        <p>No fixture found.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen font-sans bg-background">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <FixtureHeader fixture={fixture} tabs={tabs} />
        <FixtureFilterWrapper fixture={fixture} sport="rugby" />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
