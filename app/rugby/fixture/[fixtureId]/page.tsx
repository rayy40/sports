import Error from "@/components/Error";
import FixtureFilterWrapper from "@/components/FixtureFilterWrapper";
import FixtureHeader from "@/components/ui/FixtureHeader";
import { getFixtureById } from "@/services/api";
import { AllSportsFixtures, FixtureTabsType } from "@/types/general";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from "react";

const Page = async ({ params }: { params: { fixtureId: string } }) => {
  const fixtureId = parseInt(params.fixtureId);
  const queryClient = new QueryClient();
  const fixture: AllSportsFixtures = await queryClient.fetchQuery({
    queryKey: [fixtureId, "rugby", "fixture"],
    queryFn: () => getFixtureById(fixtureId, "rugby"),
  });

  const tabs: FixtureTabsType[] = ["Head to Head"];

  if (typeof fixture === "string") {
    return (
      <div className="w-full h-screen">
        <Error message={fixture} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen font-sans bg-background">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <FixtureHeader fixture={fixture} tabs={tabs} />
        <FixtureFilterWrapper fixture={fixture} sport="rugby" />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
