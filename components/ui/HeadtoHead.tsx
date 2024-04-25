import { AllSportsFixtures, Sports } from "@/types/general";
import { format } from "date-fns";
import React from "react";
import ImageWithFallback from "../ImageWithFallback";
import Link from "next/link";
import { getFixtureData } from "@/lib/utils";
import { shortStatusMap } from "@/lib/constants";

type Props = {
  fixtures: AllSportsFixtures[];
  sport: Sports;
};

const HeadtoHead = ({ fixtures, sport }: Props) => {
  return (
    <div className="max-w-[1000px] mx-auto">
      {fixtures
        .filter((fixture) => {
          const { fixtureStatus } = getFixtureData(fixture);
          return shortStatusMap["Finished"].includes(
            fixtureStatus.short.toString()
          );
        })
        .slice(0)
        .reverse()
        .map((fixture) => {
          const {
            fixtureDate,
            fixtureId,
            homeTeam,
            awayTeam,
            homeTeamScore,
            awayTeamScore,
            isHomeTeamWinner,
            isAwayTeamWinner,
          } = getFixtureData(fixture);
          return (
            <div key={fixtureId} className="border-b">
              <div className="text-center w-full text-muted-foreground text-xs py-4 border-b">
                {format(fixtureDate, "EEEE d MMMM yyyy")}
              </div>
              <Link href={`/${sport}/fixture/${fixtureId}`}>
                <div className="grid px-4 grid-cols-[1fr_50px_1fr] lg:grid-cols-list gap-2 lg:gap-4 py-4 lg:py-6">
                  <div className="flex items-center gap-2 lg:gap-4">
                    <ImageWithFallback
                      className="w-[25px] lg:w-[30px]"
                      src={homeTeam.logo}
                      alt={`${homeTeam.name}-logo`}
                    />
                    <p>{homeTeam.name}</p>
                  </div>
                  <div className="flex lg:ml-6 ml-4 items-center gap-2 lg:gap-4">
                    <p
                      className={`${
                        isHomeTeamWinner
                          ? "text-foreground"
                          : "text-foreground/60"
                      } font-medium`}
                    >
                      {homeTeamScore}
                    </p>
                    <span>-</span>
                    <p
                      className={`${
                        isAwayTeamWinner
                          ? "text-foreground"
                          : "text-foreground/60"
                      } font-medium`}
                    >
                      {awayTeamScore}
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-2 lg:gap-4">
                    <p>{awayTeam.name}</p>
                    <ImageWithFallback
                      className="w-[25px] lg:w-[30px]"
                      src={awayTeam.logo}
                      alt={`${awayTeam.name}-logo`}
                    />
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
    </div>
  );
};

export default HeadtoHead;
