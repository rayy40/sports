"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
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
import { getSeasonsList, getTeams } from "@/lib/utils";
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
    season ?? initialSeason,
    status
  );

  const topScorerQuery = useTopScorersByLeagueIdAndSeason(
    leagueId,
    season ?? initialSeason,
    status,
    stat
  );

  const topAssistQuery = useTopAssistsByLeagueIdAndSeason(
    leagueId,
    season ?? initialSeason,
    status,
    stat
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
      columnVisibility: {
        league: false,
      },
    },
  });

  const teamInfos = useMemo(
    () => getTeams(fixturesQuery.data!),
    [fixturesQuery.data]
  );

  const seasonsList = useMemo(
    () =>
      leagueQuery?.data?.seasons && getSeasonsList(leagueQuery?.data?.seasons!),
    [leagueQuery]
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
      return <Standings data={standingsQuery?.data} />;
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
      <div className="flex items-center justify-center w-full h-screen">
        <BounceLoader color="hsl(45,89%,55%)" />
      </div>
    );
  }

  return (
    <div className="relative font-sans">
      <div className="sticky top-0 z-20 flex flex-col gap-6 p-6 pb-0 shadow-sm bg-background">
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
          <h2 className="flex text-2xl font-medium">
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
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            {detailedTabs.slice(0, -1).map((tab, index) => (
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
        topAssistQuery.isFetching ||
        topScorerQuery.isFetching ? (
          <div className="flex items-center justify-center w-full h-full">
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
