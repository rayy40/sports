import { TeamResponse } from "@/types/football";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import {
  getFixturesByTeamIdAndSeason,
  getTeamById,
  getTeamSeasons,
} from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import Error from "@/components/Error";
import NotFound from "@/components/ui/NotFound";

const Page = async ({ params }: { params: { teamId: string } }) => {
  const teamId = parseInt(params.teamId);
  const queryClient = new QueryClient();
  const team: TeamResponse = await queryClient.fetchQuery({
    queryKey: [teamId, "football", "team"],
    queryFn: () => getTeamById(teamId, "football"),
  });

  if (!team) {
    return <NotFound type="team" sport="football" />;
  }

  if (typeof team === "string") {
    return (
      <div className="h-screen w-full">
        <Error message={team} />
      </div>
    );
  }

  const seasonsList = await queryClient.fetchQuery({
    queryKey: [teamId, "football", "team", "seasons"],
    queryFn: () => getTeamSeasons(teamId, "football"),
  });

  if (!seasonsList) {
    return (
      <div className="flex font-sans text-sm lg:text-[1rem] font-medium h-screen w-full items-center justify-center">
        <p>No season found.</p>
      </div>
    );
  }

  const season = seasonsList?.[seasonsList?.length - 1]?.toString();

  const fixtures = await queryClient.fetchQuery({
    queryKey: [teamId, season, "football", "fixtures"],
    queryFn: () => getFixturesByTeamIdAndSeason(teamId, season, "football"),
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
          title={team.team.name}
          logo={team.team.logo}
          id={team.team.id}
          seasons={seasonsList}
          sport="football"
          isTeam={true}
          currSeason={season}
          fixtures={fixtures ?? []}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
