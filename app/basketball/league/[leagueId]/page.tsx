import { League, Seasons } from "@/types/general";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getLeagueById } from "@/services/api";
import { getFixturesByLeagueIdAndSeason } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import { NBAGames } from "@/types/basketball";
import { getNBASeasons } from "@/services/api";

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [leagueId, "basketball", "league"],
    queryFn: () => getLeagueById(leagueId, "basketball"),
  });

  if (leagueId === 12) {
    await queryClient.prefetchQuery({
      queryKey: [leagueId, "nba", "league", "seasons"],
      queryFn: getNBASeasons,
    });
  }

  const league: League<Seasons[]> | undefined = queryClient.getQueryData([
    leagueId,
    "basketball",
    "league",
  ]);

  const NBASeasons: number[] | undefined =
    leagueId === 12
      ? queryClient.getQueryData([leagueId, "nba", "league", "seasons"])
      : undefined;

  const season = !NBASeasons
    ? league?.seasons[league?.seasons?.length - 1]?.season
    : NBASeasons?.[NBASeasons?.length - 1]?.toString();

  await queryClient.prefetchQuery({
    queryKey: [leagueId, season, "basketball", "fixtures"],
    queryFn: () =>
      getFixturesByLeagueIdAndSeason(leagueId, season!, "basketball"),
  });

  const fixtures: NBAGames[] | undefined = queryClient.getQueryData([
    leagueId,
    season,
    "basketball",
    "fixtures",
  ]);

  if (!league) {
    return (
      <div className="flex font-sans text-[1rem] font-medium h-screen w-full items-center justify-center">
        <p>No league found.</p>
      </div>
    );
  }

  return (
    <div className="relative font-sans">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <LeagueOrTeamWrapper
          title={league.name}
          logo={league.logo}
          id={league.id}
          seasons={NBASeasons ?? league.seasons}
          sport="basketball"
          currSeason={season ?? "-"}
          fixtures={fixtures}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
