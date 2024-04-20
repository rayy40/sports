import { GamesWithPeriods, League, Seasons } from "@/types/general";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getLeagueById } from "@/services/api";
import { getFixturesByLeagueIdAndSeason } from "@/services/api";
import RootComponent from "@/components/RootComponent";

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [leagueId, "rugby", "league"],
    queryFn: () => getLeagueById(leagueId, "rugby"),
  });

  const league: League<Seasons[]> | undefined = queryClient.getQueryData([
    leagueId,
    "rugby",
    "league",
  ]);

  const season = league?.seasons[league.seasons.length - 1].season;

  await queryClient.prefetchQuery({
    queryKey: [leagueId, season, "rugby", "fixtures"],
    queryFn: () => getFixturesByLeagueIdAndSeason(leagueId, season!, "rugby"),
  });

  const fixtures: GamesWithPeriods<number | null>[] | undefined =
    queryClient.getQueryData([leagueId, season, "rugby", "fixtures"]);

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
        <RootComponent
          title={league.name}
          logo={league.logo}
          id={league.id}
          seasons={league.seasons}
          sport="rugby"
          currSeason={season ?? "-"}
          fixtures={fixtures}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
