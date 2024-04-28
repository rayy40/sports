import { Fixtures, Leagues } from "@/types/football";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getFixturesByLeagueIdAndSeason, getLeagueById } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import Error from "@/components/Error";
import NotFound from "@/components/ui/NotFound";

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);
  const queryClient = new QueryClient();

  const league: Leagues = await queryClient.fetchQuery({
    queryKey: [leagueId, "football", "league"],
    queryFn: () => getLeagueById(leagueId, "football"),
  });

  if (!league) {
    return <NotFound type="league" sport="football" />;
  }

  if (typeof league === "string") {
    return (
      <div className="h-screen w-full">
        <Error message={league} />
      </div>
    );
  }

  const season =
    league?.seasons?.[league?.seasons?.length - 1]?.year.toString();

  const fixtures = await queryClient.fetchQuery({
    queryKey: [leagueId, season, "football", "fixtures"],
    queryFn: () =>
      getFixturesByLeagueIdAndSeason(leagueId, season!, "football"),
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
          seasons={league.seasons ?? []}
          sport="football"
          currSeason={season ?? "-"}
          fixtures={fixtures ?? []}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
