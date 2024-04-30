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
import {
  Baseball,
  Basketball,
  Football,
  Hockey,
  NFL,
  Rugby,
} from "@/Assets/Icons/Sports";
import Link from "next/link";

type FilterByProps<TData, TValue> = {
  setFilter?: (league: string | null) => void;
  type: string;
  status?: Tabs<StatusType>[];
  filters?: Filters[];
  column?: Column<TData, TValue>;
};

const sports = [
  {
    id: "football",
    name: "Football",
    icon: <Football width={30} height={30} />,
  },
  {
    id: "basketball",
    name: "Basketball",
    icon: <Basketball width={30} height={30} />,
  },
  {
    id: "baseball",
    name: "Baseball",
    icon: <Baseball width={30} height={30} />,
  },
  {
    id: "american-football",
    name: "AFL",
    icon: <NFL width={30} height={30} />,
  },
  { id: "hockey", name: "Hockey", icon: <Hockey width={30} height={30} /> },
  { id: "rugby", name: "Rugby", icon: <Rugby width={30} height={30} /> },
  {
    id: "australian-football",
    name: "NFL",
    icon: <NFL width={30} height={30} />,
  },
];

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
          className="flex items-center justify-between w-full p-6 border-b"
          variant="ghost"
        >
          Filter By {type}
          <ArrowRight size="15" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-full h-full p-0 overflow-y-auto font-sans"
        side="left"
      >
        <SheetHeader className="sticky top-0 z-10 bg-background">
          <SheetTitle className="relative flex items-center justify-center w-full p-6 text-lg border-b">
            <SheetClose asChild>
              <ArrowLeft
                className="absolute -translate-y-1/2 cursor-pointer left-6 top-1/2"
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
        {tab === "Stats" && leagues && leagues.length > 1 && (
          <FilterBy
            filters={leagues}
            setFilter={setLeagueForTeam}
            type="Teams in Leagues"
          />
        )}
      </>
    );
  };

  const Sports = () => {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="flex items-center justify-between w-full p-6 border-b"
            variant="ghost"
          >
            More Sports
            <ArrowRight size="15" />
          </Button>
        </SheetTrigger>
        <SheetContent
          className="w-full h-full p-0 overflow-y-auto font-sans"
          side="left"
        >
          <SheetHeader className="sticky top-0 z-10 bg-background">
            <SheetTitle className="relative flex items-center justify-center w-full p-6 text-lg border-b">
              <SheetClose asChild>
                <ArrowLeft
                  className="absolute -translate-y-1/2 cursor-pointer left-6 top-1/2"
                  size="20"
                />
              </SheetClose>
              <p>Sports</p>
            </SheetTitle>
          </SheetHeader>
          <div>
            {sports?.map((sport, index) => (
              <SheetClose asChild key={index}>
                <Link
                  href={`/${sport.id}`}
                  className="flex items-center justify-between w-full p-6 text-sm border-b cursor-pointer"
                >
                  <p>{sport.name}</p>
                  {sport.icon}
                </Link>
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <div className="flex w-full gap-3 lg:hidden">
      {isHome ? (
        <p className="p-2 font-medium underline-tabs">Fixtures</p>
      ) : isLeague || isTeam ? (
        <DrawerWrapper value={tab} values={tabs} setValue={setTab} />
      ) : null}
      <Sheet>
        <SheetTrigger asChild>
          <Button className="mt-1 ml-auto" variant={"outline"}>
            <SlidersHorizontal size="15" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full h-screen p-0 font-sans" side="left">
          <SheetHeader>
            <SheetTitle className="w-full p-6 text-lg text-left border-b">
              Filters
            </SheetTitle>
          </SheetHeader>
          <Sports />
          {isHome && renderHomePageFilters()}
          {!isHome && isLeague && renderLeaguePageFilters()}
          {!isHome && isTeam && renderTeamPageFilters()}
          <SheetFooter className="absolute bottom-0 left-0 w-full">
            <SheetClose asChild>
              <Button
                onClick={removeFilters}
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
