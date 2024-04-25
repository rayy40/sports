import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getLeagueById } from "@/services/api";
import { getFixturesByLeagueIdAndSeason } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import { NFLGames } from "@/types/american-football";
import { Leagues } from "@/types/football";

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [leagueId, "american-football", "league"],
    queryFn: () => getLeagueById(leagueId, "american-football"),
  });

  const league: Leagues | undefined = queryClient.getQueryData([
    leagueId,
    "american-football",
    "league",
  ]);

  if (!league) {
    return (
      <div className="flex font-sans text-sm lg:text-[1rem] font-medium h-screen w-full items-center justify-center">
        <p>No league found.</p>
      </div>
    );
  }

  const season = league?.seasons?.[0]?.year.toString();

  await queryClient.prefetchQuery({
    queryKey: [leagueId, season, "american-football", "fixtures"],
    queryFn: () =>
      getFixturesByLeagueIdAndSeason(leagueId, season!, "american-football"),
  });

  const fixtures: NFLGames[] | undefined = queryClient.getQueryData([
    leagueId,
    season,
    "american-football",
    "fixtures",
  ]);

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
          fixtures={fixtures}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
