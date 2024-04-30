import React, { cache } from "react";

import ErrorBoundary from "@/components/Error";
import FixtureFilterWrapper from "@/components/FixtureFilterWrapper";
import FixtureHeader from "@/components/ui/FixtureHeader";
import { getFixtureById } from "@/services/api";
import { AllSportsFixtures, FixtureTabsType } from "@/types/general";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hockey",
  description: "Show various data for hockey.",
};

export const getFixture = cache(async (id: number) => {
  return await getFixtureById(id, "hockey");
});

const Page = async ({ params }: { params: { fixtureId: string } }) => {
  const fixtureId = parseInt(params.fixtureId);
  try {
    const fixture = (await getFixture(fixtureId)) as AllSportsFixtures;

    const tabs: FixtureTabsType[] = ["Head to Head", "Play By Play"];

    return (
      <div className="flex flex-col w-full h-screen font-sans bg-background">
        <FixtureHeader fixture={fixture} tabs={tabs} />
        <FixtureFilterWrapper fixture={fixture} sport="hockey" />
      </div>
    );
  } catch (error) {
    return (
      <div className="w-full h-screen">
        <ErrorBoundary message={(error as Error).message} sport="hockey" />
      </div>
    );
  }
};

export default Page;
