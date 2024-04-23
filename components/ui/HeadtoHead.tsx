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
        .filter((fixture) =>
          "fixture" in fixture
            ? shortStatusMap["Finished"].includes(fixture.fixture.status.short)
            : shortStatusMap["Finished"].includes(
                fixture.status.short.toString()
              )
        )
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
                <div className="grid grid-cols-list gap-4 py-6">
                  <div className="flex items-center gap-4">
                    <ImageWithFallback
                      width={30}
                      height={30}
                      src={homeTeam.logo}
                      alt={`${homeTeam.name}-logo`}
                    />
                    <p>{homeTeam.name}</p>
                  </div>
                  <div className="flex ml-6 items-center gap-4">
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
                  <div className="flex items-center justify-end gap-4">
                    <p>{awayTeam.name}</p>
                    <ImageWithFallback
                      width={30}
                      height={30}
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
