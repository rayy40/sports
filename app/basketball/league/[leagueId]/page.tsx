"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { BounceLoader } from "react-spinners";

import Standings from "@/components/Standings";
import { FilterDropDown } from "@/components/Table/FilterDropDown";
import { fixturesListColumns } from "@/components/Table/fixturesListColumns";
import { DropDown } from "@/components/ui/DropDown";
import FixturesList from "@/components/ui/FixturesList";
import Tabs from "@/components/ui/Tabs";
import { NBAGroup, detailedTabs, stats, statusFilters } from "@/lib/constants";
import { DetailedTabsType } from "@/types/football";
import { getSeasonsList, getTeams } from "@/lib/utils";
import {
  useLeagueById,
  useFixturesByLeagueIdAndSeason,
  useStandingsByLeagueIdAndSeason,
  useNBASeasons,
} from "@/services/basketball/queries";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Games,
  NBAGames,
  Standings as BasketballStandings,
  NBAStandings,
} from "@/types/basketball";

const DetailedLeague = () => {
  const { leagueId } = useParams();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [status, setStatus] = useState<DetailedTabsType>("Fixtures");
  const [season, setSeason] = useState<string | null>(null);
  const [stat, setStat] = useState<string>("top assists");
  const [nbaGroup, setNbaGroup] = useState("conference");

  const leagueQuery = useLeagueById(leagueId);

  const nbaSeasonsQuery = useNBASeasons(leagueId);

  const initialSeason = nbaSeasonsQuery?.data
    ? nbaSeasonsQuery?.data[nbaSeasonsQuery?.data?.length - 1].toString()
    : leagueQuery?.data?.seasons?.[
        leagueQuery?.data?.seasons.length - 1
      ]?.season.toString() ?? "";

  const fixturesQuery = useFixturesByLeagueIdAndSeason(
    leagueId,
    season ?? initialSeason
  );

  const standingsQuery = useStandingsByLeagueIdAndSeason(
    leagueId,
    season ?? initialSeason,
    status,
    leagueId === "12" ? "standard" : undefined
  );

  const fixturesTable = useReactTable({
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    data: fixturesQuery?.data ?? [],
    columns: fixturesListColumns<Games | NBAGames>(),
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

  const teamInfos = useMemo(
    () => getTeams<Games | NBAGames>(fixturesQuery.data!),
    [fixturesQuery.data]
  );

  const seasonsList = useMemo(
    () =>
      nbaSeasonsQuery?.data
        ? nbaSeasonsQuery?.data?.slice()?.reverse().map(String)
        : leagueQuery?.data
        ? getSeasonsList(leagueQuery?.data?.seasons)
        : [],
    [leagueQuery, nbaSeasonsQuery]
  );

  const renderList = () => {
    if (status === "Standings") {
      if (!standingsQuery.data) {
        return null;
      }
      if (standingsQuery.data.length === 0) {
        return (
          <div className="flex items-center justify-center w-full h-full">
            No Standings found.
          </div>
        );
      }
      let data: NBAStandings[] | BasketballStandings[];
      if (
        Array.isArray(standingsQuery?.data) &&
        !Array.isArray(standingsQuery?.data?.[0])
      ) {
        data = standingsQuery?.data as NBAStandings[];
      } else {
        data = standingsQuery?.data?.[0] as BasketballStandings[];
      }
      return <Standings<BasketballStandings | NBAStandings> standing={data} />;
    } else {
      return (
        <FixturesList<Games | NBAGames>
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
              column={fixturesTable.getColumn("status")}
            />
            <FilterDropDown
              title={"teams"}
              labels={teamInfos}
              column={fixturesTable.getColumn("teams")}
            />
          </div>
        );
      case "Standings":
        if (leagueId === "12") {
          return (
            <DropDown
              title={"Filter By: Group"}
              data={NBAGroup}
              setValue={setNbaGroup}
              value={nbaGroup}
              variant={"secondary"}
            />
          );
        }
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

  if (
    leagueQuery.isFetching ||
    (leagueId === "12" && nbaSeasonsQuery.isFetching)
  ) {
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
            src={leagueQuery?.data?.logo!}
            alt={`${leagueQuery?.data?.name}-logo`}
          />
          <h2 className="flex text-2xl font-medium">
            {leagueQuery?.data?.name}
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
            {detailedTabs.slice(0, -2).map((tab, index) => (
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
        {fixturesQuery.isFetching || standingsQuery.isFetching ? (
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
