"use client";

import { useLeagueForTeamStatsStore, useSeasonsStore } from "@/lib/store";
import {
  useFixturesByLeagueIdAndSeason,
  useFixturesByTeamIdAndSeason,
} from "@/services/queries";
import { Seasons, Sports, AllSportsFixtures } from "@/types/general";
import {
  ColumnFiltersState,
  Table,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import { fixturesListColumns } from "./Table/fixturesListColumns";
import { getLeagueIdForTeam, getSeasonsList } from "@/lib/utils";
import FilterWrapper from "./FilterWrapper";
import TabsContent from "./TabsContent";
import { SeasonsEntity } from "@/types/football";
import Loading from "./Loading";
import TabsHeader from "./ui/TabsHeader";
import Error from "./Error";

export function isSeasons(
  item: (Seasons | SeasonsEntity)[] | (number | string)[]
): item is (Seasons | SeasonsEntity)[] {
  return Array.isArray(item) && item.length > 0 && typeof item[0] !== "number";
}

type Props = {
  id: number;
  title: string;
  logo?: string | null;
  seasons: (number | string)[] | (Seasons | SeasonsEntity)[];
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
  const { league: leagueForTeam } = useLeagueForTeamStatsStore();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  const {
    data: leagueFixtures,
    isFetching: isFetchingLeagueFixtures,
    isError: isLeagueFixturesError,
    error: leagueFixturesError,
  } = useFixturesByLeagueIdAndSeason(id, season, sport, isTeam);

  const {
    data: teamFixtures,
    isFetching: isFetchingTeamFixtures,
    isError: isTeamFixturesError,
    error: teamFixturesError,
  } = useFixturesByTeamIdAndSeason(id, season, sport, isTeam);

  const seasonList = isSeasons(seasons)
    ? getSeasonsList<SeasonsEntity | Seasons>(seasons)
    : seasons?.map(String).slice().reverse();

  let data: AllSportsFixtures[] | undefined = undefined;

  if (isTeam && teamFixtures) {
    data = teamFixtures;
  } else if (!isTeam && leagueFixtures) {
    data = leagueFixtures;
  } else if (fixtures) {
    data = fixtures;
  } else {
    data = [];
  }

  const league = getLeagueIdForTeam(data, leagueForTeam, isTeam);

  useEffect(() => {
    if (typeof window !== undefined) {
      setIsSmallScreen(window.innerWidth < 1024);
    }
  }, []);

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
        date: isSmallScreen ? false : true,
        arrow: isSmallScreen ? false : true,
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
    league: number | undefined,
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
          isTeam={isTeam}
          isNBATeam={isNBATeam}
          league={league}
          currSeason={currSeason}
          table={table}
          sport={sport}
        />
      );
    }
  };

  if (
    isTeamFixturesError ||
    isLeagueFixturesError ||
    typeof leagueFixtures === "string" ||
    typeof teamFixtures === "string"
  ) {
    return (
      <Error
        message={teamFixturesError?.message ?? leagueFixturesError?.message}
        sport={sport}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-20 flex flex-col gap-3 p-3 pb-0 shadow-sm lg:gap-6 lg:p-6 lg:pb-0 bg-background">
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
      <div className="flex-1 overflow-y-auto">
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
    </div>
  );
};

export default RootComponent;
