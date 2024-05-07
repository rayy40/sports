import React, { ReactNode } from "react";

import ImageWithFallback from "@/components/ImageWithFallback";
import { sports } from "@/lib/constants";
import { Sports } from "@/types/general";
import { getFixtureById } from "@/services/getFixtures";
import { cn, getFixtureData } from "@/lib/utils";
import { format } from "date-fns";

type Props = {
  children: ReactNode;
  params: { fixtureId: string; sport: Sports };
};

const FixtureLayout = async ({ children, params }: Props) => {
  if (!sports.includes(params.sport)) {
    throw new Error("Unrecognized sport.");
  }

  const fixtureId = params.fixtureId;

  const data = await getFixtureById(fixtureId, params.sport);

  if (data.error) {
    throw new Error(data.error);
  }

  if (data.success) {
    const fixture = getFixtureData(data.success);

    return (
      <div className="flex flex-col h-screen font-sans">
        <div className="sticky top-0 z-20 flex flex-col gap-3 p-3 pb-0 lg:gap-6 lg:px-6 lg:pb-0 lg:pt-4 bg-background">
          <div className="flex flex-col gap-4 max-w-[1000px] mx-auto">
            <div className="flex items-start justify-between">
              <p className="text-sm">
                {format(fixture.fixtureDate, "EEEE, do MMMM")}
              </p>
              <p className="text-sm">
                {fixture.fixtureVenue ?? fixture.fixtureStatus.long}
              </p>
            </div>
            <div className="grid pt-2 pb-8 lg:pb-12 grid-cols-3 lg:grid-cols-[1fr_150px_1fr] items-center gap-6">
              <div className="flex flex-col items-center justify-start gap-2 lg:flex-row lg:gap-4">
                <ImageWithFallback
                  className="w-[40px] lg:w-[70px]"
                  src={fixture.homeTeam.logo}
                  alt={`${fixture.homeTeam.name}-logo`}
                />
                <h3 className="text-[1rem] lg:text-xl">
                  {fixture.homeTeam.name}
                </h3>
              </div>
              <div className="flex items-center justify-between gap-1 text-lg font-medium lg:gap-3 lg:text-2xl">
                <p
                  className={cn({
                    "text-secondary-foreground": fixture.isHomeTeamWinner,
                    "text-foreground": !fixture.isHomeTeamWinner,
                  })}
                >
                  {fixture.homeTeamScore}
                </p>
                <span>-</span>
                <p
                  className={cn({
                    "text-secondary-foreground": fixture.isAwayTeamWinner,
                    "text-foreground": !fixture.isAwayTeamWinner,
                  })}
                >
                  {fixture.awayTeamScore}
                </p>
              </div>
              <div className="flex flex-col items-center justify-end gap-2 lg:flex-row lg:gap-4">
                <h3 className="text-[1rem] order-2 lg:order-1 lg:text-xl">
                  {fixture.awayTeam.name}
                </h3>
                <ImageWithFallback
                  className="w-[40px] lg:w-[70px] order-1 lg:-order-2"
                  src={fixture.awayTeam.logo}
                  alt={`${fixture.awayTeam.name}-logo`}
                />
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }
};

export default FixtureLayout;
