import { AllSportsFixtures, Sports, isAPIError } from "@/types/general";
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
import Error from "./Error";

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

  const standingsLeaguesQuery = useStandingsByLeagueIdAndSeason(
    id,
    season ?? currSeason,
    sport,
    isTeam,
    tab
  );

  const standingsTeamQuery = useStandingsByTeamIdAndSeason(
    id,
    league,
    season ?? currSeason,
    sport,
    isTeam,
    isNBATeam,
    tab
  );

  const playersQuery = usePlayersForTeam(id, season ?? currSeason, sport, tab);

  const teamStatisticsQuery = useStatisticsByTeamIdAndSeason(
    id,
    league,
    season ?? currSeason,
    sport,
    tab,
    isTeam,
    isNBATeam
  );

  const playersStandingsQuery = usePlayersStandings(
    id,
    season ?? currSeason,
    sport,
    tab,
    stat,
    isTeam
  );

  if (
    standingsLeaguesQuery.isFetching ||
    standingsTeamQuery.isFetching ||
    teamStatisticsQuery.isFetching ||
    playersQuery.isFetching ||
    playersStandingsQuery.isFetching
  ) {
    return <Loading />;
  }

  if (
    standingsLeaguesQuery.isError ||
    standingsTeamQuery.isError ||
    teamStatisticsQuery.isError ||
    playersQuery.isError ||
    playersStandingsQuery.isError
  ) {
    return (
      <Error
        message={
          standingsLeaguesQuery.error?.message ||
          standingsTeamQuery.error?.message ||
          teamStatisticsQuery.error?.message ||
          playersQuery.error?.message ||
          playersStandingsQuery.error?.message
        }
      />
    );
  }

  if (isAPIError(playersQuery.data)) {
    return <Error message="No players found." />;
  } else if (isAPIError(standingsTeamQuery.data)) {
    return <Error message="No standings found." />;
  } else if (isAPIError(standingsLeaguesQuery.data)) {
    return <Error message="No standings found." />;
  }

  if (tab === "Squads") {
    if (!playersQuery.data || playersQuery.data.length === 0) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          No Squads found.
        </div>
      );
    }
    return <Squads data={playersQuery.data} sport={sport} />;
  }

  if (tab === "Stats") {
    if (!isTeam) {
      if (
        !playersStandingsQuery.data ||
        playersStandingsQuery.data.length === 0
      ) {
        return (
          <div className="flex items-center justify-center w-full h-full">
            No Standings for players found.
          </div>
        );
      }
      return <PlayerStats stat={stat} data={playersStandingsQuery.data} />;
    }
    if (!teamStatisticsQuery.data) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          No Stats found.
        </div>
      );
    }
    return <TeamStatistics data={teamStatisticsQuery.data} />;
  }

  if (tab === "Standings") {
    if (isTeam) {
      if (!standingsTeamQuery.data || standingsTeamQuery.data.length === 0) {
        return (
          <div className="flex items-center justify-center w-full h-full">
            No Standings found.
          </div>
        );
      }
      return <Standings sport={sport} standing={standingsTeamQuery.data} />;
    } else {
      if (
        !standingsLeaguesQuery.data ||
        standingsLeaguesQuery.data.length === 0
      ) {
        return (
          <div className="flex items-center justify-center w-full h-full">
            No Standings found.
          </div>
        );
      }
      return <Standings sport={sport} standing={standingsLeaguesQuery.data} />;
    }
  }

  return <FixturesList table={table} />;
};

export default TabsContent;
