import { AllSportsFixtures, Sports } from "@/types/general";
import { format } from "date-fns";
import React from "react";
import ImageWithFallback from "../ImageWithFallback";
import Link from "next/link";
import { getFixtureData } from "@/lib/utils";
import { shortStatusMap } from "@/lib/constants";
import NotFound from "../NotFound";

type Props = {
  fixtures?: AllSportsFixtures[];
  sport: Sports;
};

const HeadtoHead = ({ fixtures, sport }: Props) => {
  if (!fixtures) return <NotFound type="head to head fixtures" />;

  return (
    <div className="max-w-[1000px] w-full mx-auto">
      {fixtures
        .filter((fixture) => {
          const { fixtureStatus } = getFixtureData(fixture);
          return shortStatusMap["finished"].includes(
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
              <div className="w-full py-4 text-xs text-center border-b text-muted-foreground">
                {format(fixtureDate, "EEEE d MMMM yyyy")}
              </div>
              <Link prefetch={true} href={`/${sport}/fixture/${fixtureId}`}>
                <div className="grid px-4 grid-cols-[1fr_50px_1fr] lg:grid-cols-list gap-2 lg:gap-4 py-4 lg:py-6">
                  <div className="flex items-center gap-2 lg:gap-4">
                    <ImageWithFallback
                      className="w-[25px] lg:w-[30px]"
                      src={homeTeam.logo}
                      alt={`${homeTeam.name}-logo`}
                    />
                    <p className="text-sm lg:text-[1rem] text-left">
                      {homeTeam.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 lg:ml-6 lg:gap-4">
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
                    <p className="text-sm lg:text-[1rem] text-right">
                      {awayTeam.name}
                    </p>
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
