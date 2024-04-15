"use client";

import Squads from "@/components/Squads";
import Standings from "@/components/Standings";
import { FilterDropDown } from "@/components/Table/FilterDropDown";
import { fixturesListColumns } from "@/components/Table/fixturesListColumns";
import TeamStatistics from "@/components/TeamStatistics";
import { DropDown } from "@/components/ui/DropDown";
import FixturesList from "@/components/ui/FixturesList";
import Tabs from "@/components/ui/Tabs";
import { detailedTabs, statusFilters } from "@/lib/constants";
import { DetailedTabsType, Fixtures, StandingsReponse } from "@/types/football";
import { getLeagues } from "@/lib/utils";
import {
  useFixturesByTeamIdAndSeason,
  useSquads,
  useStandingsByTeamIdAndSeason,
  useTeamInfo,
  useTeamSeasons,
  useTeamStatistics,
} from "@/services/football/queries";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BounceLoader } from "react-spinners";

const DetailedTeam = () => {
  const { teamId } = useParams();
  const [season, setSeason] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [status, setStatus] = useState<DetailedTabsType>("Fixtures");
  const [value, setValue] = useState<string>("");
  const [league, setLeague] = useState<string | null>(null);

  const teamQuery = useTeamInfo(teamId);

  const teamSeasonsQuery = useTeamSeasons(teamId);

  const initialSeason =
    teamSeasonsQuery?.data?.[teamSeasonsQuery?.data?.length - 1].toString() ??
    "";

  const fixturesQuery = useFixturesByTeamIdAndSeason(
    teamId,
    season ?? initialSeason,
    status
  );

  const standingsQuery = useStandingsByTeamIdAndSeason(
    teamId,
    season ?? initialSeason,
    status
  );

  const leagueInfos = useMemo(
    () => getLeagues(fixturesQuery.data!),
    [fixturesQuery.data]
  );

  useEffect(() => {
    if (value.length > 0) {
      const league = leagueInfos.find((league) => league.name === value);
      if (league) {
        setLeague(league.id.toString());
      }
    }
  }, [value, leagueInfos]);

  const teamStatisticsQuery = useTeamStatistics(
    teamId,
    season ?? initialSeason,
    league ?? leagueInfos?.[0]?.id.toString(),
    status
  );

  const squadsQuery = useSquads(teamId, status);

  const fixturesTable = useReactTable({
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    data: fixturesQuery?.data ?? [],
    columns: fixturesListColumns<Fixtures>(),
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

  const renderList = () => {
    if (status === "Stats") {
      return <TeamStatistics data={teamStatisticsQuery?.data} />;
    } else if (status === "Standings") {
      if (!standingsQuery?.data) return null;
      if (standingsQuery?.data.length === 0)
        return (
          <div className="flex items-center justify-center w-full h-full">
            No Standings found.
          </div>
        );
      return <Standings<StandingsReponse> standing={standingsQuery?.data} />;
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
        return (
          <DropDown
            title={value?.length > 0 ? value : leagueInfos?.[0]?.name}
            data={leagueInfos.map((league) => league.name)}
            setValue={setValue}
            value={value}
            variant={"secondary"}
          />
        );
      default:
        return null;
    }
  };

  if (teamSeasonsQuery.isFetching || teamQuery.isFetching) {
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
            src={teamQuery?.data?.[0]?.team?.logo!}
            alt={`${teamQuery?.data?.[0]?.team?.name}-logo`}
          />
          <h2 className="flex text-2xl font-medium">
            {teamQuery?.data?.[0]?.team?.name}
            <span className="text-[1rem] ml-3 text-secondary-foreground">
              ({season ?? initialSeason})
            </span>
          </h2>
          <div className="ml-auto">
            <DropDown
              title="seasons"
              data={teamSeasonsQuery?.data?.slice().reverse().map(String)}
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
      <div className="h-[calc(100vh-150px)]">
        {fixturesQuery.isFetching ||
        standingsQuery.isFetching ||
        squadsQuery.isFetching ||
        teamStatisticsQuery.isFetching ? (
          <div className="flex items-center justify-center w-full h-screen">
            <BounceLoader color="hsl(45,89%,55%)" />
          </div>
        ) : (
          renderList()
        )}
      </div>
    </div>
  );
};

export default DetailedTeam;
