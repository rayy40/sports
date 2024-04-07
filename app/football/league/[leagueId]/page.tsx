"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { BounceLoader } from "react-spinners";

import PlayerStats from "@/components/PlayerStats";
import Standings from "@/components/Standings";
import { FilterDropDown } from "@/components/Table/FilterDropDown";
import { fixturesListColumns } from "@/components/Table/fixturesListColumns";
import { DropDown } from "@/components/ui/DropDown";
import FixturesList from "@/components/ui/FixturesList";
import Tabs from "@/components/ui/Tabs";
import { detailedTabs, stats, statusFilters } from "@/lib/constants";
import { DetailedTabsType } from "@/lib/types";
import { getSeasonsList, getStandings, getTeams } from "@/lib/utils";
import {
  useFixturesByLeagueIdAndSeason,
  useLeagueById,
  useStandingsByLeagueIdAndSeason,
  useTopAssistsByLeagueIdAndSeason,
  useTopScorersByLeagueIdAndSeason,
} from "@/services/queries";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

const DetailedLeague = () => {
  const { leagueId } = useParams();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [status, setStatus] = useState<DetailedTabsType>("Fixtures");
  const [season, setSeason] = useState<string | null>(null);
  const [stat, setStat] = useState<string>("top assists");

  const leagueQuery = useLeagueById(leagueId);

  const initialSeason =
    leagueQuery?.data?.seasons?.[
      leagueQuery?.data?.seasons.length - 1
    ]?.year.toString() ?? "";

  const fixturesQuery = useFixturesByLeagueIdAndSeason(
    leagueId,
    season ?? initialSeason
  );

  const standingsQuery = useStandingsByLeagueIdAndSeason(
    leagueId,
    season ?? initialSeason
  );

  const topScorerQuery = useTopScorersByLeagueIdAndSeason(
    leagueId,
    season ?? initialSeason
  );

  const topAssistQuery = useTopAssistsByLeagueIdAndSeason(
    leagueId,
    season ?? initialSeason
  );

  const fixturesTable = useReactTable({
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    data: fixturesQuery?.data ?? [],
    columns: fixturesListColumns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  //Issue with stale standings data.
  useEffect(() => {
    if (status === "Standings") {
      standingsQuery.refetchStandings();
    }
  }, [status]);

  useEffect(() => {
    if (status === "Stats") {
      if (stat === "top scorers") {
        topScorerQuery.refetchTopScorer();
      } else if (stat === "top assists") {
        topAssistQuery.refetchTopAssist();
      }
      console.log(stat);
    }
  }, [stat, status]);

  const teamInfos = useMemo(
    () => getTeams(fixturesQuery.data!),
    [fixturesQuery.data]
  );

  const seasonsList = useMemo(
    () =>
      leagueQuery?.data?.seasons && getSeasonsList(leagueQuery?.data?.seasons!),
    [leagueQuery]
  );

  const standingsByGroups = useMemo(
    () => getStandings(standingsQuery?.data?.[0]?.league!),
    [standingsQuery]
  );

  const renderList = () => {
    if (status === "Stats") {
      switch (stat) {
        case "top scorers":
          return <PlayerStats type="goal" data={topScorerQuery?.data} />;
        case "top assists":
          return <PlayerStats type="assist" data={topAssistQuery?.data} />;
      }
    } else if (status === "Standings") {
      return <Standings data={standingsByGroups} />;
    } else {
      return (
        <FixturesList
          table={fixturesTable}
          rows={fixturesTable?.getRowModel()?.rows}
        />
      );
    }
  };

  const renderFilters = () => {
    switch (status) {
      case "Fixtures":
        return (
          <div className="flex gap-4">
            <FilterDropDown
              title={"status"}
              labels={statusFilters}
              column={fixturesTable.getColumn("fixture")}
            />
            <FilterDropDown
              title={"teams"}
              labels={teamInfos}
              column={fixturesTable.getColumn("teams")}
            />
          </div>
        );
      case "Stats":
        return (
          <DropDown
            title={stat}
            data={stats}
            setValue={setStat}
            value={stat}
            variant={"secondary"}
          />
        );
      default:
        return null;
    }
  };

  if (leagueQuery.isFetching) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <BounceLoader color="hsl(45,89%,55%)" />
      </div>
    );
  }

  return (
    <div className="font-sans relative">
      <div className="flex flex-col sticky z-20 p-6 pb-0 gap-6 shadow-sm bg-background top-0">
        <div className="flex items-center gap-4">
          <Image
            width={50}
            height={50}
            style={{
              objectFit: "contain",
              borderRadius: "50%",
              aspectRatio: "1/1",
            }}
            className="shadow-team"
            src={leagueQuery?.data?.league.logo!}
            alt={`${leagueQuery?.data?.league.name}-logo`}
          />
          <h2 className="font-medium text-2xl flex">
            {leagueQuery?.data?.league.name}
            <span className="text-[1rem] ml-3 text-secondary-foreground">
              ({season ?? initialSeason})
            </span>
          </h2>
          <div className="ml-auto">
            <DropDown
              title="seasons"
              data={seasonsList!}
              setValue={setSeason}
              value={season ?? initialSeason}
            />
          </div>
        </div>
        <div className="flex justify-between items-end gap-4">
          <div className="flex items-end gap-4">
            {detailedTabs.map((tab, index) => (
              <Tabs<DetailedTabsType>
                key={index}
                label={tab.label}
                id={tab.status}
                status={status}
                setStatus={setStatus}
              />
            ))}
          </div>
          {renderFilters()}
        </div>
      </div>
      <div className="h-[calc(100vh-150px)]">
        {fixturesQuery.isFetching ||
        standingsQuery.isFetching ||
        topScorerQuery.isFetching ? (
          <div className="w-full h-full flex items-center justify-center">
            <BounceLoader color="hsl(45,89%,55%)" />
          </div>
        ) : (
          renderList()
        )}
      </div>
    </div>
  );
};

export default DetailedLeague;
