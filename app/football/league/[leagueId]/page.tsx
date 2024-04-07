"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

import Tabs from "@/components/ui/Tabs";
import { detailedTabs, statusFilters } from "@/lib/constants";
import { DetailedTabsType } from "@/lib/types";
import { getStandings, getTeams } from "@/lib/utils";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DropDown } from "@/components/ui/DropDown";
import { fixturesListColumns } from "@/components/Table/fixturesListColumns";
import FixturesList from "@/components/ui/FixturesList";
import { FilterDropDown } from "@/components/Table/FilterDropDown";
import { BounceLoader } from "react-spinners";
import Standings from "@/components/Standings";
import {
  useFixturesByLeagueIdAndSeason,
  useLeagueById,
  useStandingsByLeagueIdAndSeason,
} from "@/services/queries";

const DetailedLeague = () => {
  const { leagueId } = useParams();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [status, setStatus] = useState<DetailedTabsType>("Fixtures");
  const [season, setSeason] = useState<string | null>(null);

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

  useEffect(() => {
    if (status === "Standings" && !standingsQuery.isStale) {
      standingsQuery.refetchStandings();
    }
  }, [status, standingsQuery]);

  const teamInfos = useMemo(
    () => getTeams(fixturesQuery.data!),
    [fixturesQuery.data]
  );

  const standingsByGroups = useMemo(
    () => getStandings(standingsQuery?.data?.[0]?.league!),
    [standingsQuery]
  );

  if (leagueQuery.isFetching) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <BounceLoader color="hsl(45,89%,55%)" />
      </div>
    );
  }

  return (
    <div className="font-sans relative">
      <div className="flex flex-col sticky p-6 pb-0 gap-6 shadow-sm bg-background top-0">
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
              data={leagueQuery?.data?.seasons?.slice().reverse()}
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
          {status !== "Standings" && (
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
          )}
        </div>
      </div>
      <div className="h-[calc(100vh-150px)]">
        {fixturesQuery.isFetching || standingsQuery.isFetching ? (
          <div className="w-full h-full flex items-center justify-center">
            <BounceLoader color="hsl(45,89%,55%)" />
          </div>
        ) : status === "Standings" ? (
          <Standings data={standingsByGroups} />
        ) : (
          <FixturesList
            table={fixturesTable}
            rows={fixturesTable?.getRowModel()?.rows}
          />
        )}
      </div>
    </div>
  );
};

export default DetailedLeague;
