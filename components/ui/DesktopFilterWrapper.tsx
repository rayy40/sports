import {
  AllSportsFixtures,
  DetailedTabsType,
  StatusType,
  Tabs as TTabs,
  Filters,
  FilterWrappers,
} from "@/types/general";
import { statusTabs, statusFilters, statsFilters } from "@/lib/constants";
import { Column } from "@tanstack/react-table";
import React from "react";
import Tabs from "./Tabs";
import { FilterDropDown } from "../Table/FilterDropDown";

const DesktopFilterWrapper = ({
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
  const renderTabs = (
    isStatus: boolean,
    tabs?: TTabs<StatusType | DetailedTabsType>[]
  ) => {
    return tabs?.map((tab, index) => (
      <Tabs key={index} label={tab.label} id={tab.status} isStatus={isStatus} />
    ));
  };

  const renderFilterDropDown = (
    title: string,
    labels: Filters[],
    column?: Column<AllSportsFixtures> | undefined,
    setFilter?: (league: string | null) => void
  ) => {
    if (labels.length > 1) {
      return (
        <FilterDropDown
          title={title}
          labels={labels}
          setFilter={setFilter}
          column={column}
        />
      );
    }
    return null;
  };

  const renderFilters = () => {
    if (isHome && teams && leagues) {
      return (
        <>
          {renderFilterDropDown("Teams", teams, undefined, setTeam)}
          {renderFilterDropDown("Leagues", leagues, undefined, setLeague)}
        </>
      );
    } else if (isLeague) {
      return (
        <>
          {tab === "Fixtures" &&
            renderFilterDropDown(
              "status",
              statusFilters,
              table?.getColumn("status")
            )}
          {tab === "Fixtures" &&
            teams &&
            renderFilterDropDown("team", teams, table?.getColumn("teams"))}
          {tab === "Stats" &&
            sport === "football" &&
            renderFilterDropDown("stat", statsFilters, undefined, setStat)}
        </>
      );
    } else if (isTeam) {
      return (
        <>
          {tab === "Fixtures" &&
            renderFilterDropDown(
              "status",
              statusFilters,
              table?.getColumn("status")
            )}
          {tab === "Fixtures" &&
            leagues &&
            renderFilterDropDown("league", leagues, table?.getColumn("league"))}
          {tab === "Stats" &&
            leagues &&
            leagues.length > 1 &&
            renderFilterDropDown(
              "league",
              leagues,
              undefined,
              setLeagueForTeam
            )}
        </>
      );
    } else return null;
  };

  return (
    <div className="items-end justify-between hidden w-full gap-4 lg:flex">
      {(isHome || isLeague || isTeam) && (
        <div className="flex items-end gap-4">
          {renderTabs(isHome ? true : false, isHome ? statusTabs : tabs)}
        </div>
      )}
      <div className="space-x-4">{renderFilters()}</div>
    </div>
  );
};

export default DesktopFilterWrapper;
