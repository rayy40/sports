import { AllSportsFixtures, Sports } from "@/types/general";
import FixturesList from "./ui/FixturesList";
import { Table } from "@tanstack/react-table";
import Loading from "./Loading";
import {
  usePlayersForTeam,
  useStandingsByLeagueIdAndSeason,
  useStatisticsByTeamIdAndSeason,
} from "@/services/queries";
import { useSeasonsStore, useTabsStore } from "@/lib/store";
import Standings from "./Standings";
import TeamStatistics from "./TeamStatistics";

type Props = {
  id: number;
  isNBATeam: boolean;
  currSeason: string;
  sport: Sports;
  league: string | number | null | undefined;
  table: Table<AllSportsFixtures>;
};

const TabsContent = ({
  id,
  isNBATeam,
  currSeason,
  sport,
  league,
  table,
}: Props) => {
  const { tab } = useTabsStore();
  const { season } = useSeasonsStore();

  const { data: standingsData, isFetching: isFetchingStandings } =
    useStandingsByLeagueIdAndSeason(id, season ?? currSeason, sport, tab);

  const { data: squadsData, isFetching: isFetchingSquads } = usePlayersForTeam(
    id,
    season ?? currSeason,
    sport,
    tab
  );

  const { data: statisticsData, isFetching: isFetchingStatistics } =
    useStatisticsByTeamIdAndSeason(
      id,
      league,
      season ?? currSeason,
      sport,
      tab,
      isNBATeam
    );

  if (isFetchingStandings || isFetchingStatistics || isFetchingSquads) {
    return <Loading />;
  }

  if (tab === "Squads") {
    if (!squadsData || squadsData.length === 0) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          No Squads found.
        </div>
      );
    }
    return <p>Squads</p>;
  }

  if (tab === "Stats") {
    if (!statisticsData) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          No Stats found.
        </div>
      );
    }
    return <TeamStatistics data={statisticsData} />;
  }

  if (tab === "Standings") {
    if (!standingsData || standingsData.length === 0) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          No Standings found.
        </div>
      );
    }
    return <Standings standing={standingsData} />;
  }

  return <FixturesList table={table} />;
};

export default TabsContent;
