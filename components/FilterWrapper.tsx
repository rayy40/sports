"use client";

import React, { useMemo } from "react";
import { FilterItems } from "./ui/FilterItems";
import Tabs from "./ui/Tabs";
import {
  Tabs as TTabs,
  AllSportsFixtures,
  DetailedTabsType,
  Games,
  GamesWithPeriods,
  GamesWithPeriodsAndEvents,
  SportScores,
  Sports,
  StatusType,
} from "@/types/general";
import {
  detailedTabs,
  stats,
  statusFilters,
  statusTabs,
} from "@/lib/constants";
import { getLeagues, getTeams } from "@/lib/utils";
import {
  useLeagueForTeamStatsStore,
  useLeagueStore,
  useStatStore,
  useTabsStore,
  useTeamStore,
} from "@/lib/store";
import { Filters, Fixtures } from "@/types/football";
import { FilterDropDown } from "./Table/FilterDropDown";
import { DropDown } from "./ui/DropDown";
import { Column, Table } from "@tanstack/react-table";

type Props = {
  isFootball?: boolean;
  isHome: boolean;
  isTeam?: boolean;
  sport: Sports;
  fixtures?: AllSportsFixtures[];
  table?: Table<AllSportsFixtures>;
};

type Data =
  | Games<SportScores>
  | Fixtures
  | GamesWithPeriods<number | null>
  | GamesWithPeriodsAndEvents<number | null>;

const FilterWrapper = ({
  isFootball = false,
  sport,
  table,
  fixtures,
  isHome,
  isTeam = false,
}: Props) => {
  const { tab } = useTabsStore();
  const { stat, setStat } = useStatStore();
  const { setLeague } = useLeagueStore();
  const { league: leagueForTeam, setLeague: setLeagueForTeam } =
    useLeagueForTeamStatsStore();
  const { setTeam } = useTeamStore();
  const isSquadsAvailable =
    sport === "basketball" ||
    sport === "football" ||
    sport === "american-football";
  sport === "australian-football";

  const leagueInfos = useMemo(
    () => (fixtures ? getLeagues(fixtures as Data[], isFootball) : []),
    [fixtures, isFootball]
  );

  const leagueName = leagueInfos.length > 0 ? leagueInfos[0].name : "";

  const leaguesListForTeams = leagueInfos.map((l) => l.name);

  const teamInfos = useMemo(
    () => (fixtures ? getTeams(fixtures as Data[]) : []),
    [fixtures]
  );

  const renderDropDown = (
    title: string,
    data: string[],
    value: string,
    setValue: (arg: string) => void
  ) => {
    return (
      <DropDown
        title={title}
        data={data}
        value={value}
        setValue={setValue}
        variant={"secondary"}
      />
    );
  };

  const renderTabs = (
    tabs: TTabs<StatusType | DetailedTabsType>[],
    isStatus: boolean
  ) => {
    return tabs.map((tab, index) => (
      <Tabs key={index} label={tab.label} id={tab.status} isStatus={isStatus} />
    ));
  };

  const renderFilterItems = (
    title: string,
    data: Filters[],
    setFilter: (league: string | null) => void
  ) => {
    if (data.length > 1) {
      return (
        <FilterItems
          title={`Filter By: ${title}`}
          data={data}
          setFilter={setFilter}
        />
      );
    }
    return null;
  };

  const renderFilterDropDown = (
    title: string,
    labels: Filters[],
    column: Column<AllSportsFixtures> | undefined
  ) => {
    if (labels.length > 1) {
      return <FilterDropDown title={title} labels={labels} column={column} />;
    }
    return null;
  };

  const renderHomePageFilters = () => {
    return (
      <>
        <div className="flex items-end gap-4">
          {renderTabs(statusTabs, true)}
        </div>
        <div className="space-x-4">
          {renderFilterItems("League", leagueInfos, setLeague)}
          {renderFilterItems("Team", teamInfos, setTeam)}
        </div>
      </>
    );
  };

  const renderLeaguePageFilters = () => {
    const tabs =
      sport === "football"
        ? detailedTabs.slice(0, -1)
        : detailedTabs.slice(0, -2);
    return (
      <>
        <div className="flex items-end gap-4">{renderTabs(tabs, false)}</div>
        <div className="space-x-4">
          {tab === "Fixtures" &&
            renderFilterDropDown(
              "status",
              statusFilters,
              table?.getColumn("status")
            )}
          {tab === "Fixtures" &&
            renderFilterDropDown("team", teamInfos, table?.getColumn("teams"))}
          {tab === "Stats" &&
            sport === "football" &&
            renderDropDown(stat, stats, stat, setStat)}
        </div>
      </>
    );
  };

  const renderTeamPageFilters = () => {
    let tabs: TTabs<DetailedTabsType>[];
    if (sport === "american-football") {
      tabs = detailedTabs.filter((tab) => tab.status.toLowerCase() !== "stats");
    } else if (isSquadsAvailable) {
      tabs = detailedTabs;
    } else {
      tabs = detailedTabs.slice(0, -1);
    }

    return (
      <>
        <div className="flex items-end gap-4">{renderTabs(tabs, false)}</div>
        <div className="space-x-4">
          {tab === "Fixtures" &&
            renderFilterDropDown(
              "status",
              statusFilters,
              table?.getColumn("status")
            )}
          {tab === "Fixtures" &&
            renderFilterDropDown(
              "league",
              leagueInfos,
              table?.getColumn("league")
            )}
          {tab === "Stats" &&
            leaguesListForTeams.length > 1 &&
            renderDropDown(
              leagueName,
              leaguesListForTeams,
              leagueForTeam ?? leagueName,
              setLeagueForTeam
            )}
        </div>
      </>
    );
  };

  return (
    <div className="flex items-end justify-between gap-4">
      {isHome && renderHomePageFilters()}
      {!isHome && isTeam && renderTeamPageFilters()}
      {!isHome && !isTeam && renderLeaguePageFilters()}
    </div>
  );
};

export default FilterWrapper;
