"use client";

import React, { useMemo, useState } from "react";

import { FilterDropDown } from "@/components/Table/FilterDropDown";
import { fixturesColumns } from "../Table/fixturesColumns";
import { statusTabs } from "@/lib/constants";
import { Sports, StatusType } from "@/lib/types";
import { formatDatePattern, getLeagues, getTeams } from "@/lib/utils";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import Tabs from "./Tabs";
import FixturesTable from "./FixturesTable";
import { useFixturesByDate } from "@/services/queries";

type Props = {
  sport: Sports;
};

const HomeFixtures = ({ sport }: Props) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [status, setStatus] = useState<StatusType>("AllGames");
  const [date, setDate] = useState(new Date());

  const fixturesByDateQuery = useFixturesByDate(formatDatePattern(date));

  const teamInfos = useMemo(
    () => getTeams(fixturesByDateQuery?.data!),
    [fixturesByDateQuery?.data]
  );

  const leagueInfos = useMemo(
    () => getLeagues(fixturesByDateQuery?.data!),
    [fixturesByDateQuery?.data]
  );

  const table = useReactTable({
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    data: fixturesByDateQuery?.data ?? [],
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

  if (fixturesByDateQuery?.isFetching) {
    return <div>Loading...</div>;
  }

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
          {statusTabs.map((tab) => (
            <Tabs<StatusType>
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
