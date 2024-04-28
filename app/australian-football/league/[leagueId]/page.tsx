import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getLeagueById } from "@/services/api";
import { getFixturesByLeagueIdAndSeason } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import { AustralianFootballLeagueOrTeamInfo } from "@/types/australian-football";
import NotFound from "@/components/ui/NotFound";
import Error from "@/components/Error";

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);
  const queryClient = new QueryClient();
  const league: AustralianFootballLeagueOrTeamInfo[] =
    await queryClient.fetchQuery({
      queryKey: [leagueId, "australian-football", "league"],
      queryFn: () => getLeagueById(leagueId, "australian-football"),
    });

  if (!league) {
    return <NotFound type="league" sport="australian-football" />;
  }

  const seasonsList = league.map((league) => league.season);
  const currSeason = seasonsList[seasonsList.length - 1].toString();

  const fixtures = await queryClient.fetchQuery({
    queryKey: [leagueId, currSeason, "australian-football", "fixtures"],
    queryFn: () =>
      getFixturesByLeagueIdAndSeason(
        leagueId,
        currSeason,
        "australian-football"
      ),
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
          title={league[league.length - 1].name}
          logo={league[league.length - 1].logo}
          id={1}
          seasons={seasonsList}
          sport="australian-football"
          currSeason={currSeason}
          fixtures={fixtures ?? []}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
