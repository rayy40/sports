"use client";

import PlayerStats from "@/components/PlayerStats";
import Squads from "@/components/Squads";
import Standings from "@/components/Standings";
import { FilterDropDown } from "@/components/Table/FilterDropDown";
import { fixturesListColumns } from "@/components/Table/fixturesListColumns";
import { DropDown } from "@/components/ui/DropDown";
import FixturesList from "@/components/ui/FixturesList";
import Tabs from "@/components/ui/Tabs";
import { detailedTabs, statusFilters } from "@/lib/constants";
import { DetailedTabsType } from "@/lib/types";
import {
  getLeagues,
  getSeasonsList,
  getStandings,
  getTeam,
  getTeams,
} from "@/lib/utils";
import {
  useFixturesByTeamIdAndSeason,
  useSquads,
  useStandingsByTeamIdAndSeason,
  useTeamSeasons,
} from "@/services/queries";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { BounceLoader } from "react-spinners";

const DetailedTeam = () => {
  const { teamId } = useParams();
  const [season, setSeason] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [status, setStatus] = useState<DetailedTabsType>("Fixtures");

  const teamSeasonsQuery = useTeamSeasons(teamId);

  const initialSeason =
    teamSeasonsQuery?.data?.[teamSeasonsQuery?.data?.length - 1].toString() ??
    "";

  const fixturesQuery = useFixturesByTeamIdAndSeason(
    teamId,
    season ?? initialSeason
  );

  const standingsQuery = useStandingsByTeamIdAndSeason(
    teamId,
    season ?? initialSeason
  );

  const squadsQuery = useSquads(teamId);

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

  //Issue with stale standings data.
  useEffect(() => {
    if (status === "Standings") {
      standingsQuery.refetch();
    } else if (status === "Squads") {
      squadsQuery.refetch();
    }
  }, [status]);

  const leagueInfos = useMemo(
    () => getLeagues(fixturesQuery.data!),
    [fixturesQuery.data]
  );

  const team = useMemo(
    () => getTeam(fixturesQuery?.data!, parseInt(teamId as string)),
    [teamId, fixturesQuery.data]
  );

  console.log(standingsQuery?.data);

  //   const standingsByGroups = useMemo(
  //     () => getStandings(standingsQuery?.data?.[0]?.league!),
  //     [standingsQuery]
  //   );

  const renderList = () => {
    if (status === "Stats") {
      //   switch (stat) {
      //     case "top scorers":
      //       return <PlayerStats type="goal" data={topScorerQuery?.data} />;
      //     case "top assists":
      //       return <PlayerStats type="assist" data={topAssistQuery?.data} />;
      //   }
    } else if (status === "Standings") {
      return <Standings data={standingsQuery?.data} />;
    } else if (status === "Squads") {
      return <Squads data={squadsQuery?.data} />;
    } else {
      return (
        <FixturesList
          table={fixturesTable}
          rows={fixturesTable?.getRowModel()?.rows}
        />
      );
    }
  };

  if (teamSeasonsQuery.isFetching || fixturesQuery.isFetching) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <BounceLoader color="hsl(45,89%,55%)" />
      </div>
    );
  }

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
              title={"leagues"}
              labels={leagueInfos}
              column={fixturesTable.getColumn("league")}
            />
          </div>
        );
      case "Stats":
      // return (
      //   <DropDown
      //     title={stat}
      //     data={stats}
      //     setValue={setStat}
      //     value={stat}
      //     variant={"secondary"}
      //   />
      // );
      default:
        return null;
    }
  };

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
            src={team?.logo!}
            alt={`${team?.name}-logo`}
          />
          <h2 className="flex text-2xl font-medium">
            {team?.name}
            <span className="text-[1rem] ml-3 text-secondary-foreground">
              ({season ?? initialSeason})
            </span>
          </h2>
          <div className="ml-auto">
            <DropDown
              title="seasons"
              data={teamSeasonsQuery?.data?.slice().reverse()!}
              setValue={setSeason}
              value={season ?? initialSeason}
            />
          </div>
        </div>
        <div className="flex items-end justify-between gap-4">
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
      <div className="h-[calc(100vh-150px)]">{renderList()}</div>
    </div>
  );
};

export default DetailedTeam;
