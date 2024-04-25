import { Fixtures, Leagues } from "@/types/football";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getFixturesByLeagueIdAndSeason, getLeagueById } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [leagueId, "football", "league"],
    queryFn: () => getLeagueById(leagueId, "football"),
  });

  const league: Leagues | undefined = queryClient.getQueryData([
    leagueId,
    "football",
    "league",
  ]);

  const season =
    league?.seasons?.[league?.seasons?.length - 1]?.year.toString();

  await queryClient.prefetchQuery({
    queryKey: [leagueId, season, "football", "fixtures"],
    queryFn: () =>
      getFixturesByLeagueIdAndSeason(leagueId, season!, "football"),
  });

  const fixtures: Fixtures[] | undefined = queryClient.getQueryData([
    leagueId,
    season,
    "football",
    "fixtures",
  ]);

  if (!league) {
    return (
      <div className="flex font-sans text-sm lg:text-[1rem] font-medium h-screen w-full items-center justify-center">
        <p>No league found.</p>
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
          fixtures={fixtures}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
