import React, { cache } from "react";

import ErrorBoundary from "@/components/Error";
import FixtureFilterWrapper from "@/components/FixtureFilterWrapper";
import FixtureHeader from "@/components/ui/FixtureHeader";
import { getFixtureById } from "@/services/api";
import { DetailedFixture } from "@/types/football";
import { FixtureTabsType } from "@/types/general";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Football",
  description: "Show various data for football.",
};

export const getFixture = cache(async (id: number) => {
  return await getFixtureById(id, "football");
});

const Page = async ({ params }: { params: { fixtureId: string } }) => {
  const fixtureId = parseInt(params.fixtureId);
  try {
    const fixture = (await getFixture(fixtureId)) as DetailedFixture;

    const tabs: FixtureTabsType[] = [
      "Match Stats",
      "Lineups",
      "Play By Play",
      "Head to Head",
    ];

    return (
      <div className="flex flex-col w-full h-screen font-sans bg-background">
        <FixtureHeader fixture={fixture} tabs={tabs} />
        <FixtureFilterWrapper fixture={fixture} sport="football" />
      </div>
    );
  } catch (error) {
    return (
      <div className="w-full h-screen">
        <ErrorBoundary message={(error as Error).message} sport="football" />
      </div>
    );
  }
};

export default Page;
