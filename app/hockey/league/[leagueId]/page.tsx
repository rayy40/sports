import { Suspense } from "react";
import { GamesWithPeriodsAndEvents, League, Seasons } from "@/types/general";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getLeagueById } from "@/services/api";
import { getFixturesByLeagueIdAndSeason } from "@/services/api";
import Loading from "@/components/Loading";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [leagueId, "hockey", "league"],
    queryFn: () => getLeagueById(leagueId, "hockey"),
    staleTime: 5 * 60 * 1000,
  });

  const league: League<Seasons[]> | undefined = queryClient.getQueryData([
    leagueId,
    "hockey",
    "league",
  ]);

  const season = league?.seasons[league.seasons.length - 1].season;

  await queryClient.prefetchQuery({
    queryKey: [leagueId, season, "hockey", "fixtures"],
    queryFn: () => getFixturesByLeagueIdAndSeason(leagueId, season!, "hockey"),
    staleTime: 5 * 60 * 1000,
  });

  const fixtures: GamesWithPeriodsAndEvents<number | null>[] | undefined =
    queryClient.getQueryData([leagueId, season, "hockey", "fixtures"]);

  if (queryClient.isFetching()) {
    return <Loading />;
  }

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
          seasons={league.seasons}
          sport="hockey"
          currSeason={season ?? "-"}
          fixtures={fixtures}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
