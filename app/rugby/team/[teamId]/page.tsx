import { Suspense } from "react";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getFixturesByTeamIdAndSeason, getTeamById } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import { GamesWithPeriods, TeamResponse } from "@/types/general";
import { Seasons } from "@/lib/constants";

const Page = async ({ params }: { params: { teamId: string } }) => {
  const teamId = parseInt(params.teamId);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [teamId, "rugby", "team"],
    queryFn: () => getTeamById(teamId, "rugby"),
  });

  const team: TeamResponse | undefined = queryClient.getQueryData([
    teamId,
    "rugby",
    "team",
  ]);

  const season = "2023";

  await queryClient.prefetchQuery({
    queryKey: [teamId, season, "rugby", "fixtures"],
    queryFn: () => getFixturesByTeamIdAndSeason(teamId, season, "rugby"),
  });

  const fixtures: GamesWithPeriods<number | null>[] | undefined =
    queryClient.getQueryData([teamId, season, "rugby", "fixtures"]);

  if (!team) {
    return (
      <div className="flex font-sans text-[1rem] font-medium h-screen w-full items-center justify-center">
        <p>No team found.</p>
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
          seasons={Seasons}
          sport="rugby"
          isTeam={true}
          currSeason={season ?? "-"}
          fixtures={fixtures}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
