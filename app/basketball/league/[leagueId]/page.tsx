import { League, Seasons } from "@/types/general";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getLeagueById } from "@/services/api";
import { getFixturesByLeagueIdAndSeason } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import { getNBASeasons } from "@/services/api";
import Error from "@/components/Error";
import NotFound from "@/components/ui/NotFound";

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);
  let nbaSeasons: number[] | undefined = undefined;
  const queryClient = new QueryClient();

  const league: League<Seasons[]> = await queryClient.fetchQuery({
    queryKey: [leagueId, "basketball", "league"],
    queryFn: () => getLeagueById(leagueId, "basketball"),
  });

  if (!league) {
    return <NotFound type="league" sport="basketball" />;
  }

  if (leagueId === 12) {
    nbaSeasons = await queryClient.fetchQuery({
      queryKey: [leagueId, "nba", "league", "seasons"],
      queryFn: getNBASeasons,
    });
  }

  const season = !nbaSeasons
    ? league?.seasons[league?.seasons?.length - 1]?.season
    : nbaSeasons?.[nbaSeasons?.length - 1]?.toString();

  const fixtures = await queryClient.fetchQuery({
    queryKey: [leagueId, season, "basketball", "fixtures"],
    queryFn: () =>
      getFixturesByLeagueIdAndSeason(leagueId, season!, "basketball"),
  });

  if (typeof fixtures === "string") {
    return (
      <div className="h-screen w-full">
        <Error message={fixtures} />
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
          seasons={nbaSeasons ?? league.seasons}
          sport="basketball"
          currSeason={season ?? "-"}
          fixtures={fixtures ?? []}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
