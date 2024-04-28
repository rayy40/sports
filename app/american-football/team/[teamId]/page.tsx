import { Team } from "@/types/general";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getFixturesByTeamIdAndSeason, getTeamById } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import { seasonsList } from "@/lib/constants";
import NotFound from "@/components/ui/NotFound";
import Error from "@/components/Error";

const Page = async ({ params }: { params: { teamId: string } }) => {
  const teamId = parseInt(params.teamId);
  const queryClient = new QueryClient();
  const team: Team = await queryClient.fetchQuery({
    queryKey: [teamId, "american-football", "team"],
    queryFn: () => getTeamById(teamId, "american-football"),
  });

  if (!team) {
    return <NotFound type="team" sport="american-football" />;
  }

  const season = "2023";

  const fixtures = await queryClient.fetchQuery({
    queryKey: [teamId, season, "american-football", "fixtures"],
    queryFn: () =>
      getFixturesByTeamIdAndSeason(teamId, season, "american-football"),
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
          title={team?.name}
          logo={team?.logo}
          isTeam={true}
          id={team.id}
          seasons={seasonsList}
          sport="american-football"
          currSeason={season}
          fixtures={fixtures ?? []}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
