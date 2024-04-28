import { League, Seasons } from "@/types/general";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getLeagueById } from "@/services/api";
import { getFixturesByLeagueIdAndSeason } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import Error from "@/components/Error";
import NotFound from "@/components/ui/NotFound";

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);
  const queryClient = new QueryClient();
  const league: League<Seasons[]> = await queryClient.fetchQuery({
    queryKey: [leagueId, "hockey", "league"],
    queryFn: () => getLeagueById(leagueId, "hockey"),
    staleTime: 5 * 60 * 1000,
  });

  if (!league) {
    return <NotFound type="league" sport="hockey" />;
  }

  if (typeof league === "string") {
    return (
      <div className="h-screen w-full">
        <Error message={league} />
      </div>
    );
  }

  const season = league?.seasons[league.seasons.length - 1].season;

  const fixtures = await queryClient.fetchQuery({
    queryKey: [leagueId, season, "hockey", "fixtures"],
    queryFn: () => getFixturesByLeagueIdAndSeason(leagueId, season!, "hockey"),
    staleTime: 5 * 60 * 1000,
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
          sport="hockey"
          currSeason={season ?? "-"}
          fixtures={fixtures ?? []}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
