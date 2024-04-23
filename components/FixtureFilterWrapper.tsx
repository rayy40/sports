"use client";

import { useFixtureTabsStore } from "@/lib/store";
import React from "react";
import Lineups from "./ui/Lineups";
import { DetailedFixture } from "@/types/football";
import { Sports } from "@/types/general";
import MatchStat from "./ui/MatchStat";
import PlayByPlay from "./ui/PlayByPlay";

type Props = {
  fixture: DetailedFixture;
  sport: Sports;
};

const FixtureFilterWrapper = ({ fixture, sport }: Props) => {
  const { tab } = useFixtureTabsStore();

  if (tab === "Match Stats") {
    if (!fixture.statistics || fixture.statistics.length === 0) {
      return <p>No statistics found for this fixture.</p>;
    }
    return <MatchStat stats={fixture.statistics} sport={sport} />;
  }

  if (tab === "Play By Play") {
    if (!fixture.events || fixture.events.length === 0) {
      return <p>No events found for this fixture.</p>;
    }
    return <PlayByPlay events={fixture.events} sport={sport} />;
  }

  if (!fixture.lineups || fixture.lineups.length !== 2) {
    return <p>No lineups found for this fixture.</p>;
  }
  return <Lineups lineups={fixture.lineups} sport={sport} />;
};

export default FixtureFilterWrapper;
