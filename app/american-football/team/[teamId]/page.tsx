import { Team } from "@/types/general";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getFixturesByTeamIdAndSeason, getTeamById } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import { NFLGames } from "@/types/american-football";
import { Seasons } from "@/lib/constants";

const Page = async ({ params }: { params: { teamId: string } }) => {
  const teamId = parseInt(params.teamId);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [teamId, "american-football", "team"],
    queryFn: () => getTeamById(teamId, "american-football"),
  });

  const team: Team | undefined = queryClient.getQueryData([
    teamId,
    "american-football",
    "team",
  ]);

  if (!team) {
    return (
      <div className="flex font-sans text-sm lg:text-[1rem] h-screen w-full items-center justify-center">
        <p>No team found.</p>
      </div>
    );
  }

  const season = "2023";

  await queryClient.prefetchQuery({
    queryKey: [teamId, season, "american-football", "fixtures"],
    queryFn: () =>
      getFixturesByTeamIdAndSeason(teamId, season, "american-football"),
  });

  const fixtures: NFLGames[] | undefined = queryClient.getQueryData([
    teamId,
    season,
    "american-football",
    "fixtures",
  ]);

  return (
    <div className="relative font-sans">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <LeagueOrTeamWrapper
          title={team?.name}
          logo={team?.logo}
          isTeam={true}
          id={team.id}
          seasons={Seasons}
          sport="american-football"
          currSeason={season}
          fixtures={fixtures}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
