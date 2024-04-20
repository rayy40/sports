import { League, Seasons } from "@/types/general";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getLeagueById } from "@/services/api";
import { getFixturesByLeagueIdAndSeason } from "@/services/api";
import RootComponent from "@/components/RootComponent";
import {
  AustralianFootballGames,
  AustralianFootballLeagueInfo,
} from "@/types/australian-football";
import { getNBASeasons } from "@/services/api";

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [leagueId, "australian-football", "league"],
    queryFn: () => getLeagueById(leagueId, "australian-football"),
  });

  const league: AustralianFootballLeagueInfo[] | undefined =
    queryClient.getQueryData([leagueId, "australian-football", "league"]);

  if (!league) {
    return (
      <div className="flex font-sans text-[1rem] font-medium h-screen w-full items-center justify-center">
        <p>No league found.</p>
      </div>
    );
  }

  const seasonsList = league.map((league) => league.season);
  const currSeason = seasonsList[seasonsList.length - 1].toString();

  await queryClient.prefetchQuery({
    queryKey: [leagueId, currSeason, "australian-football", "fixtures"],
    queryFn: () =>
      getFixturesByLeagueIdAndSeason(
        leagueId,
        currSeason,
        "australian-football"
      ),
  });

  const fixtures: AustralianFootballGames[] | undefined =
    queryClient.getQueryData([
      leagueId,
      currSeason,
      "australian-football",
      "fixtures",
    ]);

  return (
    <div className="relative font-sans">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <RootComponent
          title={"AFL"}
          logo={league[league.length - 1].logo}
          id={1}
          seasons={seasonsList}
          sport="australian-football"
          currSeason={currSeason}
          fixtures={fixtures}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
