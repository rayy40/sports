import { shortStatusMap } from "@/lib/constants";
import { getFixtureData } from "@/lib/utils";
import { AllSportsFixtures } from "@/types/general";
import { useMemo } from "react";

type Props = {
  fixtures?: AllSportsFixtures[];
  team: string | null;
  league: string | null;
  status: string | null;
};

function useFilteredFixtures({ fixtures, team, league, status }: Props) {
  return useMemo(() => {
    if (!team && !league && !status) return fixtures;
    if (!fixtures || fixtures.length === 0) return [];

    const filtered = fixtures.filter((fixture) => {
      const { fixtureStatus, homeTeam, awayTeam, fixtureLeague } =
        getFixtureData(fixture);
      if (!(team || league) && status) {
        const detailedStatus = shortStatusMap[status];
        return detailedStatus.includes(fixtureStatus.short.toString());
      } else if (team && !status) {
        return (
          homeTeam.name.toLowerCase().includes(team.toLowerCase()) ||
          awayTeam.name.toLowerCase().includes(team.toLowerCase())
        );
      } else if (league && !status) {
        return fixtureLeague.name.toLowerCase() === league.toLowerCase();
      } else if (team && status) {
        const detailedStatus = shortStatusMap[status];
        return (
          detailedStatus.includes(fixtureStatus.short.toString()) &&
          (homeTeam.name.toLowerCase().includes(team.toLowerCase()) ||
            awayTeam.name.toLowerCase().includes(team.toLowerCase()))
        );
      } else if (league && status) {
        const detailedStatus = shortStatusMap[status];
        return (
          detailedStatus.includes(fixtureStatus.short.toString()) &&
          fixtureLeague.name.toLowerCase() === league.toLowerCase()
        );
      }
    });

    return filtered;
  }, [team, league, status, fixtures]);
}

export default useFilteredFixtures;
