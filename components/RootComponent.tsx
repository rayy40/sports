"use client";

import { useSeasonsStore } from "@/lib/store";
import {
  useFixturesByLeagueIdAndSeason,
  useFixturesByTeamIdAndSeason,
} from "@/services/queries";
import {
  Seasons,
  Sports,
  isNBAFixture,
  AllSportsFixtures,
} from "@/types/general";
import {
  ColumnFiltersState,
  Table,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { fixturesListColumns } from "./Table/fixturesListColumns";
import { getSeasonsList } from "@/lib/utils";
import FilterWrapper from "./FilterWrapper";
import TabsContent from "./TabsContent";
import { SeasonsEntity } from "@/types/football";
import Loading from "./Loading";
import TabsHeader from "./TabsHeader";

export function isSeasons(
  item: (Seasons | SeasonsEntity)[] | number[]
): item is (Seasons | SeasonsEntity)[] {
  return Array.isArray(item) && item.length > 0 && typeof item[0] !== "number";
}

type Props = {
  id: number;
  title: string;
  logo?: string | null;
  seasons: number[] | (Seasons | SeasonsEntity)[];
  currSeason: string;
  sport: Sports;
  isTeam?: boolean;
  isNBATeam?: boolean;
  fixtures?: AllSportsFixtures[];
};

const RootComponent = ({
  id,
  title,
  logo,
  sport,
  currSeason,
  seasons,
  isTeam = false,
  isNBATeam = false,
  fixtures,
}: Props) => {
  const { season, setSeason } = useSeasonsStore();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const seasonList = isSeasons(seasons)
    ? getSeasonsList<SeasonsEntity | Seasons>(seasons)
    : seasons?.map(String).slice().reverse();

  const { data: leagueFixtures, isFetching: isFetchingLeagueFixtures } =
    useFixturesByLeagueIdAndSeason(id, season, sport, isTeam);

  const { data: teamFixtures, isFetching: isFetchingTeamFixtures } =
    useFixturesByTeamIdAndSeason(id, season, sport, isTeam);

  const data = (isTeam ? teamFixtures : leagueFixtures) ?? fixtures ?? [];

  const league =
    data.length > 0
      ? !isNBAFixture(data[0])
        ? data?.[0].league.id
        : data?.[0].league
      : undefined;

  const fixturesTable = useReactTable({
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    data: data ?? fixtures ?? [],
    columns: fixturesListColumns(),
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
      columnVisibility: {
        league: false,
        status: false,
      },
    },
  });

  const renderFilters = (
    isFootball: boolean,
    isHome: boolean,
    isTeam: boolean,
    fixtures: AllSportsFixtures[],
    table: Table<AllSportsFixtures>,
    sport: Sports
  ) => {
    return (
      <FilterWrapper
        isFootball={isFootball}
        isHome={isHome}
        isTeam={isTeam}
        fixtures={fixtures}
        table={table}
        sport={sport}
      />
    );
  };

  const renderContent = (
    isFetchingLeagueFixtures: boolean,
    isFetchingTeamFixtures: boolean,
    id: number,
    isNBATeam: boolean,
    league: string | number | undefined,
    currSeason: string,
    table: Table<AllSportsFixtures>,
    sport: Sports
  ) => {
    if (isFetchingLeagueFixtures || isFetchingTeamFixtures) {
      return <Loading />;
    } else {
      return (
        <TabsContent
          id={id}
          isNBATeam={isNBATeam}
          league={league}
          currSeason={currSeason}
          table={table}
          sport={sport}
        />
      );
    }
  };

  return (
    <>
      <div className="sticky top-0 z-20 flex flex-col gap-6 p-6 pb-0 shadow-sm bg-background">
        <TabsHeader
          title={title}
          value={season}
          setValue={setSeason}
          currValue={currSeason}
          data={seasonList}
          logo={logo}
        />
        {renderFilters(
          sport === "football",
          false,
          isTeam,
          data ?? fixtures,
          fixturesTable,
          sport
        )}
      </div>
      <div className="h-[calc(100vh-150px)]">
        {renderContent(
          isFetchingLeagueFixtures,
          isFetchingTeamFixtures,
          id,
          isNBATeam,
          league,
          currSeason,
          fixturesTable,
          sport
        )}
      </div>
    </>
  );
};

export default RootComponent;
