"use client";

import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./Shadcn/sheet";
import { Button } from "./Shadcn/button";
import { ArrowRight, ArrowLeft, SlidersHorizontal } from "lucide-react";
import { StatusType, Tabs, Filters, FilterWrappers } from "@/types/general";
import { useStatusStore, useTabsStore } from "@/lib/store";
import { Column } from "@tanstack/react-table";
import { statsFilters, statusFilters, statusTabs } from "@/lib/constants";
import DrawerWrapper from "./DrawerWrapper";

type FilterByProps<TData, TValue> = {
  setFilter?: (league: string | null) => void;
  type: string;
  status?: Tabs<StatusType>[];
  filters?: Filters[];
  column?: Column<TData, TValue>;
};

const FilterBy = <TData, TValue>({
  type,
  status,
  setFilter,
  filters,
  column,
}: FilterByProps<TData, TValue>) => {
  const { setStatus } = useStatusStore();
  const handleClick = <TData, TValue>({
    status,
    id,
    column,
  }: {
    status?: StatusType;
    id?: string;
    column?: Column<TData, TValue>;
  }) => {
    if (status) {
      setStatus(status);
    } else if (id && column) {
      column.setFilterValue(id);
    } else if (id && setFilter) {
      setFilter(id);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="w-full flex items-center justify-between p-6 border-b"
          variant="ghost"
        >
          Filter By {type}
          <ArrowRight size="15" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full h-full overflow-y-auto font-sans p-0"
        side="left"
      >
        <SheetHeader className="sticky top-0 bg-background z-10">
          <SheetTitle className="flex relative items-center text-lg justify-center w-full p-6 border-b">
            <SheetClose asChild>
              <ArrowLeft
                className="absolute cursor-pointer left-6 top-1/2 -translate-y-1/2"
                size="20"
              />
            </SheetClose>
            <p>Filter By {type}</p>
          </SheetTitle>
        </SheetHeader>
        <div>
          {filters?.map((filter, index) => (
            <SheetClose asChild key={index}>
              <p
                onClick={() =>
                  handleClick({ id: filter.id.toString(), column })
                }
                className="p-6 text-sm border-b cursor-pointer"
              >
                {filter.name}
              </p>
            </SheetClose>
          ))}
          {status?.map((status, index) => (
            <SheetClose asChild key={index}>
              <p
                onClick={() => handleClick({ status: status.status })}
                className="p-6 text-sm border-b cursor-pointer"
              >
                {status.label}
              </p>
            </SheetClose>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const MobileFilterWrapper = ({
  sport,
  tab,
  tabs,
  table,
  teams,
  leagues,
  setTeam,
  setLeague,
  setLeagueForTeam,
  setStat,
  isHome,
  isTeam,
  isLeague,
}: FilterWrappers) => {
  const { setTab } = useTabsStore();
  const { setStatus } = useStatusStore();

  const removeFilters = () => {
    setStatus("AllGames");
    table?.resetColumnFilters();
  };

  const renderHomePageFilters = () => {
    return (
      <>
        <FilterBy status={statusTabs} type="Status" />
        <FilterBy filters={leagues} setFilter={setLeague} type="Leagues" />
        <FilterBy filters={teams} setFilter={setTeam} type="Teams" />
      </>
    );
  };

  const renderLeaguePageFilters = () => {
    return (
      <>
        {tab === "Fixtures" && (
          <FilterBy
            column={table?.getColumn("status")}
            filters={statusFilters}
            type="Status"
          />
        )}
        {tab === "Fixtures" && (
          <FilterBy
            column={table?.getColumn("teams")}
            filters={teams}
            type="Teams"
          />
        )}
        {tab === "Stats" && sport === "football" && (
          <FilterBy filters={statsFilters} setFilter={setStat} type="Stats" />
        )}
      </>
    );
  };

  const renderTeamPageFilters = () => {
    return (
      <>
        {tab === "Fixtures" && (
          <FilterBy
            column={table?.getColumn("status")}
            filters={statusFilters}
            type="Status"
          />
        )}
        {tab === "Fixtures" && (
          <FilterBy
            column={table?.getColumn("league")}
            filters={leagues}
            type="Leagues"
          />
        )}
        {tab === "Stats" && leagues.length > 1 && (
          <FilterBy
            filters={leagues}
            setFilter={setLeagueForTeam}
            type="Teams in Leagues"
          />
        )}
      </>
    );
  };

  return (
    <div className="w-full flex lg:hidden gap-3">
      {isHome ? (
        <p className="p-2 font-medium underline-tabs">Fixtures</p>
      ) : (
        <DrawerWrapper value={tab} values={tabs} setValue={setTab} />
      )}
      <Sheet>
        <SheetTrigger asChild>
          <Button className="ml-auto mt-1" variant={"outline"}>
            <SlidersHorizontal size="15" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full h-screen font-sans p-0" side="left">
          <SheetHeader>
            <SheetTitle className="text-lg text-left w-full p-6 border-b">
              Filters
            </SheetTitle>
          </SheetHeader>
          {isHome && renderHomePageFilters()}
          {!isHome && isLeague && renderLeaguePageFilters()}
          {!isHome && isTeam && renderTeamPageFilters()}
          <SheetFooter>
            <SheetClose asChild>
              <Button
                onClick={removeFilters}
                size="sm"
                className="w-full"
                variant="outline"
              >
                Reset Filters
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileFilterWrapper;
