"use client";

import React, { useMemo } from "react";
import {
  AllSportsFixtures,
  Games,
  GamesWithPeriods,
  GamesWithPeriodsAndEvents,
  SportScores,
  Sports,
} from "@/types/general";
import { detailedTabs } from "@/lib/constants";
import { getLeagues, getTeams } from "@/lib/utils";
import {
  useLeagueForTeamStatsStore,
  useLeagueStore,
  useStatStore,
  useTabsStore,
  useTeamStore,
} from "@/lib/store";
import { Fixtures } from "@/types/football";
import { Table } from "@tanstack/react-table";
import MobileFilterWrapper from "./ui/MobileFilterWrapper";
import DesktopFilterWrapper from "./ui/DesktopFilterWrapper";

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
  const { setStat } = useStatStore();
  const { setLeague } = useLeagueStore();
  const { setLeague: setLeagueForTeam } = useLeagueForTeamStatsStore();
  const { setTeam } = useTeamStore();

  const tabs = useMemo(() => {
    const tabWithoutStats = detailedTabs.filter(
      (tab) => tab.status.toLowerCase() !== "stats"
    );
    switch (sport) {
      case "football":
        return detailedTabs.slice(0, -1);
      case "american-football":
        return isTeam ? tabWithoutStats : detailedTabs.slice(0, -2);
      case "australian-football":
      case "basketball":
        return isTeam ? detailedTabs : detailedTabs.slice(0, -2);
      default:
        return isTeam ? detailedTabs.slice(0, -1) : detailedTabs.slice(0, -2);
    }
  }, [sport, isTeam]);

  const leagueInfos = useMemo(
    () => (fixtures ? getLeagues(fixtures as Data[], isFootball) : []),
    [fixtures, isFootball]
  );

  const teamInfos = useMemo(
    () => (fixtures ? getTeams(fixtures as Data[]) : []),
    [fixtures]
  );

  return (
    <>
      <DesktopFilterWrapper
        sport={sport}
        tab={tab}
        tabs={tabs}
        table={table}
        teams={teamInfos}
        leagues={leagueInfos}
        setTeam={setTeam}
        setLeague={setLeague}
        setLeagueForTeam={setLeagueForTeam}
        setStat={setStat}
        isHome={isHome}
        isLeague={!isTeam}
        isTeam={isTeam}
      />
      <MobileFilterWrapper
        sport={sport}
        tab={tab}
        tabs={tabs}
        table={table}
        teams={teamInfos}
        leagues={leagueInfos}
        setTeam={setTeam}
        setLeague={setLeague}
        setLeagueForTeam={setLeagueForTeam}
        setStat={setStat}
        isHome={isHome}
        isLeague={!isTeam}
        isTeam={isTeam}
      />
    </>
  );
};

export default FilterWrapper;
