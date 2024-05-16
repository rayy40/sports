"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import { Virtuoso } from "react-virtuoso";

import useFilteredFixtures from "@/hooks/useFilteredFixtures";
import { getFixtureData, getLeagueName } from "@/lib/utils";
import { AllSportsFixtures, Country, Sports } from "@/types/general";

import NotFound from "./NotFound";
import BoxFixture from "./ui/BoxFixture";
import BoxList from "./ui/BoxList";

type Props = {
  fixtures?: AllSportsFixtures[];
  countries?: Country[];
  sport: Sports;
  isFootball?: boolean;
};

const BoxHeader = ({
  sport,
  id,
  name,
}: {
  sport: Sports;
  id?: number;
  name: string;
}) => {
  return (
    <div className="flex items-center justify-between w-full px-1 py-2 rounded-sm bg-secondary/70">
      <Link
        prefetch={true}
        className="text-sm lg:text-[1rem] capitalize font-medium p-1 opacity-90 hover:opacity-100 transition-opacity"
        href={id ? `/${sport}/league/${id}/fixtures` : `/${sport}/countries`}
      >
        {name}
      </Link>
      <Link
        prefetch={true}
        className="mr-2 text-xs lg:text-sm text-secondary-foreground underline-hover"
        href={id ? `/${sport}/league/${id}/fixtures` : `/${sport}/countries`}
      >
        See more
      </Link>
    </div>
  );
};

const FixturesBox = ({ fixtures, sport, countries }: Props) => {
  const searchParams = useSearchParams();

  const status = searchParams.get("status") || "all games";
  const team = searchParams.get("team");
  const league = searchParams.get("league");

  const filteredFixtures = useFilteredFixtures({
    fixtures,
    team,
    league,
    status,
  });

  const fixturesByLeague = useMemo(() => {
    const groupedFixtures: AllSportsFixtures[][] = [];

    filteredFixtures?.forEach((fixture) => {
      const leagueName = getLeagueName(fixture.league);
      const existingLeagueIndex = groupedFixtures.findIndex((leagueFixtures) =>
        leagueFixtures.some((f) => getLeagueName(f.league) === leagueName)
      );

      if (existingLeagueIndex === -1) {
        groupedFixtures.push([{ ...fixture }]);
      } else {
        groupedFixtures[existingLeagueIndex].push({ ...fixture });
      }
    });

    return groupedFixtures;
  }, [filteredFixtures]);

  if (
    !fixturesByLeague ||
    fixturesByLeague.length === 0 ||
    fixturesByLeague.every((fixtures) => fixtures.length === 0)
  ) {
    return <NotFound type="fixtures" />;
  }

  return (
    <div className="h-full overflow-y-auto scroll-smooth">
      <Virtuoso
        data={fixturesByLeague}
        itemContent={(index, fixtures) => {
          const fixture = getFixtureData(fixtures[0]);

          return (
            <>
              {index === 0 && countries && countries?.length > 0 && (
                <div className="px-3 py-10 space-y-4 border-b first:pt-5 lg:first:pt-10 lg:px-4">
                  <BoxHeader sport={sport} name="countries" />
                  <div className="grid gap-6 grid-cols-fixtures">
                    {countries
                      .filter((_, index) => index < 5)
                      .map((country) => (
                        <BoxList
                          key={country.code}
                          logo={country.flag}
                          name={country.name}
                          url={`/${sport}/countries/${country.code}/league`}
                        />
                      ))}
                  </div>
                </div>
              )}
              <div
                key={index}
                className="w-full px-3 py-10 space-y-4 border-b first:pt-5 lg:first:pt-10 lg:px-4"
              >
                <BoxHeader
                  sport={sport}
                  id={fixture.fixtureLeague.id}
                  name={fixture.fixtureLeague.name}
                />
                <div className="grid gap-6 grid-cols-fixtures">
                  {fixtures?.map((fixture) => (
                    <BoxFixture
                      key={getFixtureData(fixture).fixtureId}
                      sport={"football"}
                      fixture={getFixtureData(fixture)}
                    />
                  ))}
                </div>
              </div>
            </>
          );
        }}
      />
    </div>
  );
};

export default FixturesBox;
