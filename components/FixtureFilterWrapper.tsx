"use client";

import { useFixtureTabsStore } from "@/lib/store";
import React, { useMemo } from "react";
import Lineups from "./ui/Lineups";
import { DetailedFixture } from "@/types/football";
import {
  AllSportsFixtures,
  Sports,
  isFootballDetailedFixture,
} from "@/types/general";
import MatchStat from "./ui/MatchStat";
import PlayByPlay from "./ui/PlayByPlay";
import { useFixtureEvents, useHeadtoHeadFixtures } from "@/services/queries";
import Loading from "./Loading";
import HeadtoHead from "./ui/HeadtoHead";
import { getFixtureData } from "@/lib/utils";

type Props = {
  fixture: DetailedFixture | AllSportsFixtures;
  sport: Sports;
};

const FixtureFilterWrapper = ({ fixture, sport }: Props) => {
  const { tab } = useFixtureTabsStore();

  const { fixtureId, homeTeam, awayTeam } = useMemo(
    () => getFixtureData(fixture),
    [fixture]
  );

  const {
    data: headtoHeadFixturesData,
    isFetching: isFetchingHeadtoHeadFixtures,
  } = useHeadtoHeadFixtures(homeTeam.id, awayTeam.id, sport, tab);

  const { data: fixturesEventsData, isFetching: isFetchingFixturesEvents } =
    useFixtureEvents(fixtureId, sport, tab);

  if (isFetchingHeadtoHeadFixtures || isFetchingFixturesEvents)
    return (
      <div className="w-full h-[calc(100vh-245px)]">
        <Loading />
      </div>
    );

  if (tab === "Lineups" && isFootballDetailedFixture(fixture)) {
    if (!fixture.lineups || fixture.lineups.length !== 2) {
      return (
        <div className="w-full flex items-center justify-center h-[calc(100vh-245px)]">
          <p>No lineups found for this fixture.</p>
        </div>
      );
    }
    return <Lineups lineups={fixture.lineups} sport={sport} />;
  }

  if (tab === "Match Stats" && isFootballDetailedFixture(fixture)) {
    if (!fixture.statistics || fixture.statistics.length === 0) {
      return (
        <div className="w-full flex items-center justify-center h-[calc(100vh-245px)]">
          <p>No statistics found for this fixture.</p>
        </div>
      );
    }
    return <MatchStat stats={fixture.statistics} sport={sport} />;
  }

  if (tab === "Play By Play" && isFootballDetailedFixture(fixture)) {
    if (!fixture.events || fixture.events.length === 0) {
      return (
        <div className="w-full flex items-center justify-center h-[calc(100vh-245px)]">
          <p>No events found for this fixture.</p>
        </div>
      );
    }
    return <PlayByPlay events={fixture.events} sport={sport} />;
  } else if (tab === "Play By Play") {
    if (!fixturesEventsData || fixturesEventsData.length === 0) {
      return (
        <div className="w-full flex items-center justify-center h-[calc(100vh-245px)]">
          <p>No events found for this fixture.</p>
        </div>
      );
    }
    return <PlayByPlay events={fixturesEventsData} sport={sport} />;
  }

  if (!headtoHeadFixturesData || headtoHeadFixturesData.length === 0) {
    return (
      <div className="w-full flex items-center justify-center h-[calc(100vh-245px)]">
        <p>No head to head fixtures found for this fixture.</p>
      </div>
    );
  }
  return <HeadtoHead fixtures={headtoHeadFixturesData} sport={sport} />;
};

export default FixtureFilterWrapper;
