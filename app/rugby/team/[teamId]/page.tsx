import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getFixturesByTeamIdAndSeason, getTeamById } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import { TeamResponse } from "@/types/general";
import { seasonsList } from "@/lib/constants";
import NotFound from "@/components/ui/NotFound";
import Error from "@/components/Error";

const Page = async ({ params }: { params: { teamId: string } }) => {
  const teamId = parseInt(params.teamId);
  const queryClient = new QueryClient();

  const team: TeamResponse = await queryClient.fetchQuery({
    queryKey: [teamId, "rugby", "team"],
    queryFn: () => getTeamById(teamId, "rugby"),
  });

  if (!team) {
    return <NotFound type="team" sport="rugby" />;
  }

  const season = "2023";

  const fixtures = await queryClient.fetchQuery({
    queryKey: [teamId, season, "rugby", "fixtures"],
    queryFn: () => getFixturesByTeamIdAndSeason(teamId, season, "rugby"),
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
          title={team.name}
          logo={team.logo}
          id={team.id}
          seasons={seasonsList}
          sport="rugby"
          isTeam={true}
          currSeason={season ?? "-"}
          fixtures={fixtures ?? []}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
