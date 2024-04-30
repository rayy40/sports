"use client";

import Link from "next/link";
import { Virtuoso } from "react-virtuoso";
import React, { useMemo } from "react";
import BoxFixture from "./ui/BoxFixture";
import {
  useDateStore,
  useLeagueStore,
  useStatusStore,
  useTeamStore,
} from "@/lib/store";
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
  const { team } = useTeamStore();
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
    const fixturesByLeagueAndTeam = flatFixtures.map((subArray) => {
      if (league && team) {
        return subArray.filter(
          (fixture) =>
            fixture.leagueName.toLowerCase() === league.toLowerCase() &&
            fixture.teams.home.name.toLowerCase() === team.toLowerCase()
        );
      } else if (league) {
        return subArray.filter(
          (fixture) => fixture.leagueName.toLowerCase() === league.toLowerCase()
        );
      } else if (team) {
        return subArray.filter((fixture) => {
          const {
            homeTeam: { name: homeName },
            awayTeam: { name: awayName },
          } = getFixtureData(fixture);
          return [homeName, awayName].some(
            (t) => team.toLowerCase() === t.toLowerCase()
          );
        });
      } else {
        return subArray;
      }
    });
    return fixturesByLeagueAndTeam.filter((subArray) => subArray.length > 0);
  }, [flatFixtures, league, team]);

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
      <div className="flex items-center justify-center w-full h-full">
        <p>No fixtures found.</p>
      </div>
    );
  }

  return (
    <Virtuoso
      data={filteredFixtures}
      itemContent={(_, fixtures) => (
        <div className="px-3 py-10 space-y-4 border-b lg:space-y-2 lg:px-6">
          <div className="flex items-center justify-between w-full px-1 py-2 rounded-sm bg-secondary/70">
            <Link
              className="text-[1rem] font-medium p-1 opacity-90 hover:opacity-100 transition-opacity"
              href={`/${sport}/league/${fixtures[0].leagueId}`}
            >
              {fixtures[0].leagueName}
            </Link>
            <Link
              href={`/${sport}/league/${fixtures[0].leagueId}`}
              className="mr-2 text-sm text-secondary-foreground underline-hover"
            >
              See more
            </Link>
          </div>
          <div className="grid gap-6 grid-cols-fixtures">
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
