"use client";

import React, { useMemo, useState } from "react";
import { useFixturesByDate } from "@/services/basketball/queries";
import {
  filterDataByStatus,
  formatDatePattern,
  getItemsByLeague,
  getLeagues,
} from "@/lib/utils";
import { BounceLoader } from "react-spinners";
import BoxFixture from "@/components/ui/BoxFixture";
import { StatusType } from "@/types/football";
import { statusTabs } from "@/lib/constants";
import Tabs from "@/components/ui/Tabs";
import { FilterItems } from "@/components/ui/FilterItems";
import DatePicker from "@/components/ui/DatePicker";
import BasketballLogo from "@/Assets/Logos/BasketballLogo";
import Link from "next/link";

const Basketball = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const fixturesQuery = useFixturesByDate(formatDatePattern(date!));
  const [status, setStatus] = useState<StatusType>("AllGames");
  const [league, setLeague] = useState<string | null>(null);

  const groupFixturesByStatus = useMemo(
    () =>
      fixturesQuery.data
        ? filterDataByStatus(fixturesQuery.data, false)
        : undefined,
    [fixturesQuery.data]
  );

  const fixturesByLeague = useMemo(
    () =>
      groupFixturesByStatus
        ? getItemsByLeague(groupFixturesByStatus[status])
        : undefined,
    [groupFixturesByStatus, status]
  );

  const leagueInfos = useMemo(
    () => getLeagues(fixturesQuery.data!, false),
    [fixturesQuery.data]
  );

  return (
    <div className="bg-background w-full min-h-screen font-sans">
      <div className="px-6 border border-b shadow-sm sticky top-0 bg-background z-10">
        <div className="py-6 flex justify-between items-center">
          <h2 className="text-2xl flex items-center gap-3 text-secondary-foreground font-medium">
            <BasketballLogo width={30} height={30} />
            Games
          </h2>
          <DatePicker date={date} setDate={setDate} />
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            {statusTabs.map((tab, index) => (
              <Tabs<StatusType>
                key={index}
                label={tab.label}
                id={tab.status}
                status={status}
                setStatus={setStatus}
              />
            ))}
          </div>
          <FilterItems
            title={"Filter By: League"}
            data={leagueInfos}
            setFilter={setLeague}
          />
        </div>
      </div>
      {fixturesQuery.isFetching ? (
        <div className="h-[calc(100vh-150px)] w-full flex items-center justify-center">
          <BounceLoader color="hsl(45,89%,55%)" />
        </div>
      ) : (
        <div className="h-[calc(100vh-150px)] overflow-y-auto px-6">
          {fixturesByLeague && Object.keys(fixturesByLeague).length > 0 ? (
            Object.keys(fixturesByLeague)
              ?.filter((l) =>
                league ? l.toLowerCase() === league.toLowerCase() : Boolean
              )
              ?.map((league, index) => {
                const leagueId = fixturesByLeague[league][0].league.id;

                return (
                  <div key={index} className="space-y-2 py-10 border-b">
                    <Link
                      className="text-lg font-medium p-1 opacity-90 hover:opacity-100 transition-opacity"
                      href={`/basketball/league/${leagueId}`}
                    >
                      {league}
                    </Link>
                    <div className="grid grid-cols-fixtures gap-6">
                      {fixturesByLeague[league].map((fixture) => {
                        const week =
                          fixture.week !== null && !isNaN(Number(fixture.week))
                            ? `Week - ${fixture.week}`
                            : fixture.week !== null
                            ? fixture.week
                            : "";
                        return (
                          <BoxFixture
                            key={fixture.id}
                            sport="basketball"
                            id={fixture.id}
                            date={fixture.date}
                            status={fixture.status}
                            round={week}
                            homeTeam={{
                              logo: fixture.teams.home.logo!,
                              name: fixture.teams.home.name,
                            }}
                            awayTeam={{
                              logo: fixture.teams.away.logo!,
                              name: fixture.teams.away.name,
                            }}
                            homeTeamScore={fixture.scores.home.total}
                            awayTeamScore={fixture.scores.away.total}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-150px)] w-full">
              <p>No fixtures found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Basketball;
