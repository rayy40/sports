"use client";

import Link from "next/link";
import { Virtuoso } from "react-virtuoso";
import React, { useMemo } from "react";
import BoxFixture from "./ui/BoxFixture";
import { useDateStore, useLeagueStore, useStatusStore } from "@/lib/store";
import Loading from "./Loading";
import { format } from "date-fns";
import {
  filterDataByStatus,
  getFixtureData,
  getLeagueId,
  getLeagueName,
} from "@/lib/utils";
import { AllSportsFixtures, Sports } from "@/types/general";
import Error from "./Error";
import { useFixturesByDate } from "@/services/queries";

type Props = {
  sport: Sports;
  isFootball?: boolean;
};

const HomeFixtures = ({ sport, isFootball = false }: Props) => {
  const { status } = useStatusStore();
  const { date } = useDateStore();
  const { league } = useLeagueStore();
  const formattedDate = format(date, "yyyy-MM-dd");

  const { data, isFetching, isError, error } = useFixturesByDate(
    formattedDate,
    sport
  );

  const groupFixturesByStatus = useMemo(
    () => (data ? filterDataByStatus(data, isFootball) : undefined),
    [data, isFootball]
  );

  const flatFixtures = useMemo(() => {
    if (!groupFixturesByStatus) return [];

    const fixturesByLeague = groupFixturesByStatus[status].reduce(
      (acc, fixture) => {
        const leagueId = getLeagueId(fixture.league);
        const leagueName = getLeagueName(fixture.league);
        const existingIndex = acc.findIndex(
          (item) => item[0]?.leagueId === leagueId
        );

        if (existingIndex !== -1) {
          acc[existingIndex].push({ ...fixture, leagueId, leagueName });
        } else {
          acc.push([{ ...fixture, leagueId, leagueName }]);
        }
        return acc;
      },
      [] as (AllSportsFixtures & { leagueId: number; leagueName: string })[][]
    );
    return fixturesByLeague;
  }, [groupFixturesByStatus, status]);

  const filteredFixtures = useMemo(() => {
    if (!flatFixtures) return [];
    return flatFixtures
      .map((subArray) =>
        subArray.filter((fixture) =>
          league
            ? fixture.leagueName.toLowerCase() === league.toLowerCase()
            : Boolean
        )
      )
      .filter((subArray) => subArray.length > 0);
  }, [flatFixtures, league]);

  if (isFetching) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={error.message} />;
  }

  if (
    filteredFixtures.length === 0 ||
    filteredFixtures.every((fixtures) => fixtures.length === 0)
  ) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p>No fixtures found.</p>
      </div>
    );
  }

  return (
    <Virtuoso
      data={filteredFixtures}
      itemContent={(_, fixtures) => (
        <div className="px-3 space-y-4 lg:space-y-2 py-10 border-b lg:px-6">
          <Link
            className="text-[1rem] lg:text-lg font-medium p-1 opacity-90 hover:opacity-100 transition-opacity"
            href={`/${sport}/league/${fixtures[0].leagueId}`}
          >
            {fixtures[0].leagueName}
          </Link>
          <div className="grid grid-cols-fixtures gap-6">
            {fixtures.map((fixture) => (
              <BoxFixture
                key={getFixtureData(fixture).fixtureId}
                sport={sport}
                fixture={getFixtureData(fixture)}
              />
            ))}
          </div>
        </div>
      )}
    />
  );
};

export default HomeFixtures;
