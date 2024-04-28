import { League, Seasons } from "@/types/general";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getLeagueById } from "@/services/api";
import { getFixturesByLeagueIdAndSeason } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import NotFound from "@/components/ui/NotFound";
import Error from "@/components/Error";

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);
  const queryClient = new QueryClient();
  const league: League<Seasons[]> = await queryClient.fetchQuery({
    queryKey: [leagueId, "rugby", "league"],
    queryFn: () => getLeagueById(leagueId, "rugby"),
  });

  if (!league) {
    return <NotFound type="league" sport="rugby" />;
  }

  if (typeof league === "string") {
    return (
      <div className="h-screen w-full">
        <Error message={league} />
      </div>
    );
  }

  const season = league?.seasons[league?.seasons?.length - 1]?.season;

  const fixtures = await queryClient.fetchQuery({
    queryKey: [leagueId, season, "rugby", "fixtures"],
    queryFn: () => getFixturesByLeagueIdAndSeason(leagueId, season!, "rugby"),
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
          seasons={league.seasons}
          sport="rugby"
          currSeason={season ?? "-"}
          fixtures={fixtures ?? []}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
