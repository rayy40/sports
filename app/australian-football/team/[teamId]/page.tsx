import { Team } from "@/types/general";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getFixturesByTeamIdAndSeason, getTeamById } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import { AustralianFootballGames } from "@/types/australian-football";
import { Seasons } from "@/lib/constants";

const Page = async ({ params }: { params: { teamId: string } }) => {
  const teamId = parseInt(params.teamId);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [teamId, "australian-football", "team"],
    queryFn: () => getTeamById(teamId, "australian-football"),
  });

  const team: Team | undefined = queryClient.getQueryData([
    teamId,
    "australian-football",
    "team",
  ]);

  if (!team) {
    return (
      <div className="flex font-sans text-[1rem] font-medium h-screen w-full items-center justify-center">
        <p>No team found.</p>
      </div>
    );
  }

  const season = "2023";

  await queryClient.prefetchQuery({
    queryKey: [teamId, season, "australian-football", "fixtures"],
    queryFn: () =>
      getFixturesByTeamIdAndSeason(teamId, season, "australian-football"),
  });

  const fixtures: AustralianFootballGames[] | undefined =
    queryClient.getQueryData([
      teamId,
      season,
      "australian-football",
      "fixtures",
    ]);

  return (
    <div className="relative font-sans">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <LeagueOrTeamWrapper
          title={team?.name}
          logo={team?.logo}
          isTeam={true}
          id={1}
          seasons={Seasons}
          sport="australian-football"
          currSeason={season}
          fixtures={fixtures}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
