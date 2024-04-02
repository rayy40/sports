"use client";

import React, { useMemo, useState } from "react";
import Tabs from "../../Tabs";
import List from "./List";
import { Fixtures, Sports, StatusType } from "@/lib/types";
import { getLeagues, getTeams } from "@/lib/utils";
import { tabs } from "@/lib/constants";
import { FilterDropDown } from "@/components/FilterDropDown";
import { columns } from "@/components/ui/Middle/Table/columns";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Props = {
  fixtures: Fixtures[];
  sport: Sports;
};

const Table = ({ fixtures, sport }: Props) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [status, setStatus] = useState<StatusType>("AllGames");

  const teamInfos = useMemo(() => getTeams(fixtures), [fixtures]);

  const leagueInfos = useMemo(() => getLeagues(fixtures), [fixtures]);

  const table = useReactTable({
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    data: fixtures,
    columns,
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

  const { rows } = table.getRowModel();

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
        <List table={table} rows={rows} />
      </div>
    </div>
  );
};

export default Table;
