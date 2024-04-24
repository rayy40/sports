import { AllSportsFixtures, Sports } from "@/types/general";
import FixturesList from "./ui/FixturesList";
import { Table } from "@tanstack/react-table";
import Loading from "./Loading";
import {
  usePlayersForTeam,
  usePlayersStandings,
  useStandingsByLeagueIdAndSeason,
  useStandingsByTeamIdAndSeason,
  useStatisticsByTeamIdAndSeason,
} from "@/services/queries";
import { useSeasonsStore, useStatStore, useTabsStore } from "@/lib/store";
import Standings from "./Standings";
import TeamStatistics from "./ui/TeamStatistics";
import Squads from "./ui/Squads";
import PlayerStats from "./ui/PlayerStats";

type Props = {
  id: number;
  isTeam: boolean;
  isNBATeam: boolean;
  currSeason: string;
  sport: Sports;
  league: number | undefined;
  table: Table<AllSportsFixtures>;
};

const TabsContent = ({
  id,
  isTeam,
  isNBATeam,
  currSeason,
  sport,
  league,
  table,
}: Props) => {
  const { tab } = useTabsStore();
  const { stat } = useStatStore();
  const { season } = useSeasonsStore();

  const { data: standingsLeagueData, isFetching: isFetchingLeagueStandings } =
    useStandingsByLeagueIdAndSeason(
      id,
      season ?? currSeason,
      sport,
      isTeam,
      tab
    );

  const { data: standingsTeamData, isFetching: isFetchingTeamStandings } =
    useStandingsByTeamIdAndSeason(
      id,
      league,
      season ?? currSeason,
      sport,
      isTeam,
      isNBATeam,
      tab
    );

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
      isTeam,
      isNBATeam
    );

  const { data: playersStandingsData, isFetching: isFetchingPlayersStandings } =
    usePlayersStandings(id, season ?? currSeason, sport, tab, stat, isTeam);

  if (
    isFetchingLeagueStandings ||
    isFetchingTeamStandings ||
    isFetchingStatistics ||
    isFetchingPlayersStandings ||
    isFetchingSquads
  ) {
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
    return <Squads data={squadsData} sport={sport} />;
  }

  if (tab === "Stats") {
    if (!isTeam) {
      if (!playersStandingsData || playersStandingsData.length === 0) {
        return (
          <div className="flex items-center justify-center w-full h-full">
            No Standings for players found.
          </div>
        );
      }
      return <PlayerStats stat={stat} data={playersStandingsData} />;
    }
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
    if (isTeam) {
      if (!standingsTeamData || standingsTeamData.length === 0) {
        return (
          <div className="flex items-center justify-center w-full h-full">
            No Standings found.
          </div>
        );
      }
      return <Standings sport={sport} standing={standingsTeamData} />;
    } else {
      if (!standingsLeagueData || standingsLeagueData.length === 0) {
        return (
          <div className="flex items-center justify-center w-full h-full">
            No Standings found.
          </div>
        );
      }
      return <Standings sport={sport} standing={standingsLeagueData} />;
    }
  }

  return <FixturesList table={table} />;
};

export default TabsContent;
