"use client";

import React, { useMemo, useState } from "react";

import { FilterDropDown } from "@/components/Table/FilterDropDown";
import { fixturesColumns } from "../Table/fixturesColumns";
import { tabs } from "@/lib/constants";
import { Fixtures, Sports, StatusType } from "@/lib/types";
import {
  formatDatePattern,
  getAPIData,
  getLeagues,
  getTeams,
} from "@/lib/utils";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import Tabs from "./Tabs";
import FixturesTable from "./FixturesTable";
import { useQuery } from "@tanstack/react-query";

type Props = {
  sport: Sports;
};

const HomeFixtures = ({ sport }: Props) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [status, setStatus] = useState<StatusType>("AllGames");
  const [date, setDate] = useState(new Date());

  const { data, error, isFetched, isLoading } = useQuery({
    queryKey: ["fixturesByDate"],
    queryFn: () =>
      getAPIData<Fixtures>(`fixtures?date=${formatDatePattern(date)}`),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const teamInfos = useMemo(() => getTeams(data?.response!), [data?.response]);

  const leagueInfos = useMemo(
    () => getLeagues(data?.response!),
    [data?.response]
  );

  const table = useReactTable({
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    data: data?.response ?? [],
    columns: fixturesColumns,
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

  return (
    <div className="rounded-lg shadow-container bg-primary">
      <div className="flex items-center justify-between p-5">
        <h3 className="text-xl font-medium capitalize text-primary-foreground">
          {sport}&nbsp;
          <span className="text-muted-foreground">Games</span>
        </h3>
        <div></div>
      </div>
      <div className="p-3 pt-0">
        <div className="flex items-end gap-4 border-b border-b-border">
          {tabs.map((tab) => (
            <Tabs
              key={tab.status}
              setColumnFilters={setColumnFilters}
              status={status}
              setStatus={setStatus}
              id={tab.status}
              label={tab.label}
            />
          ))}
          <div className="ml-auto flex gap-2 relative">
            <FilterDropDown
              title={"League"}
              labels={leagueInfos}
              column={table.getColumn("league")}
            />
            <FilterDropDown
              title={"Team"}
              labels={teamInfos}
              column={table.getColumn("teams")}
            />
          </div>
        </div>
        <FixturesTable table={table} rows={table?.getRowModel()?.rows} />
      </div>
    </div>
  );
};

export default HomeFixtures;
