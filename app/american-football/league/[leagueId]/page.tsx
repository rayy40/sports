import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getLeagueById } from "@/services/api";
import { getFixturesByLeagueIdAndSeason } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import { Leagues } from "@/types/football";
import NotFound from "@/components/ui/NotFound";
import Error from "@/components/Error";

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);
  const queryClient = new QueryClient();
  const league: Leagues = await queryClient.fetchQuery({
    queryKey: [leagueId, "american-football", "league"],
    queryFn: () => getLeagueById(leagueId, "american-football"),
  });

  if (!league) {
    return <NotFound type="league" sport="american-football" />;
  }

  const season = league?.seasons?.[0]?.year.toString();

  const fixtures = await queryClient.fetchQuery({
    queryKey: [leagueId, season, "american-football", "fixtures"],
    queryFn: () =>
      getFixturesByLeagueIdAndSeason(leagueId, season!, "american-football"),
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
          title={league.league.name}
          logo={league.league.logo}
          id={league.league.id}
          seasons={league.seasons?.slice(0).reverse() ?? []}
          sport="american-football"
          currSeason={season ?? "-"}
          fixtures={fixtures ?? []}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
