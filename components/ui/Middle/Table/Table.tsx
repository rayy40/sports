"use client";

import React, { useEffect, useMemo, useState } from "react";
import Tabs from "../../Tabs";
import List from "./List";
import { Fixtures, Sports, StatusType } from "@/lib/types";
import { getTeams } from "@/lib/utils";
import { tabs } from "@/lib/constants";
import { FilterDropDown } from "@/components/FilterDropDown";
import { columns } from "@/components/ui/Middle/Table/columns";
import {
  ColumnFiltersState,
  VisibilityState,
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
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [status, setStatus] = useState<StatusType>("Scheduled");

  const teamInfos = useMemo(() => getTeams(fixtures), [fixtures]);

  useEffect(() => {
    setColumnFilters(() => {
      return [{ id: "fixture", value: "Scheduled" }];
    });
  }, []);

  const table = useReactTable({
    data: fixtures,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
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
              teams={teamInfos}
              column={table.getColumn("teams")}
            />
          </div>
        </div>
        <List rows={rows} fixtures={fixtures} />
      </div>
    </div>
  );
};

export default Table;
