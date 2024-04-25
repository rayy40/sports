import { getFixtureData } from "@/lib/utils";
import { AllSportsFixtures, FixtureTabsType, Sports } from "@/types/general";
import { format } from "date-fns";
import React from "react";
import ImageWithFallback from "../ImageWithFallback";
import Tabs from "./Tabs";

type Props = {
  fixture: AllSportsFixtures;
  tabs: FixtureTabsType[];
};

const FixtureHeader = ({ fixture, tabs }: Props) => {
  const {
    homeTeam,
    awayTeam,
    homeTeamScore,
    awayTeamScore,
    fixtureDate,
    fixtureVenue,
    fixtureStatus,
    isHomeTeamWinner,
    isAwayTeamWinner,
  } = getFixtureData(fixture);

  return (
    <div className="sticky top-0 z-10 px-3 lg:px-6 py-5 lg:py-10 border border-b shadow-sm bg-background">
      <div className="flex flex-col gap-4 max-w-[1000px] mx-auto">
        <div className="flex items-start justify-between">
          <p className="text-sm">{format(fixtureDate, "EEEE, do MMMM")}</p>
          <p className="text-sm">{fixtureVenue ?? fixtureStatus.long}</p>
        </div>
        <div className="grid pt-2 pb-8 lg:pb-12 grid-cols-3 lg:grid-cols-[1fr_150px_1fr] items-center gap-6">
          <div className="flex flex-col lg:flex-row items-center justify-start gap-2 lg:gap-4">
            <ImageWithFallback
              className="w-[40px] lg:w-[70px]"
              src={homeTeam.logo}
              alt={`${homeTeam.name}-logo`}
            />
            <h3 className="text-[1rem] lg:text-xl">{homeTeam.name}</h3>
          </div>
          <div className="flex items-center justify-between gap-1 lg:gap-3 text-lg lg:text-2xl font-medium">
            <p
              className={
                !isHomeTeamWinner
                  ? "text-secondary-foreground"
                  : "text-foreground"
              }
            >
              {homeTeamScore}
            </p>
            <span>-</span>
            <p
              className={
                !isAwayTeamWinner
                  ? "text-secondary-foreground"
                  : "text-foreground"
              }
            >
              {awayTeamScore}
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-end gap-2 lg:gap-4">
            <h3 className="text-[1rem] order-2 lg:order-1 lg:text-xl">
              {awayTeam.name}
            </h3>
            <ImageWithFallback
              className="w-[40px] lg:w-[70px] order-1 lg:-order-2"
              src={awayTeam.logo}
              alt={`${awayTeam.name}-logo`}
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 flex items-center gap-2 lg:gap-4 -translate-x-1/2 left-1/2">
        {tabs.map((tab, index) => (
          <Tabs
            key={index}
            label={tab}
            id={tab}
            isStatus={false}
            isStat={true}
          />
        ))}
      </div>
    </div>
  );
};

export default FixtureHeader;
