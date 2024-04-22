import { Suspense } from "react";
import { BaseballScores } from "@/types/baseball";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getFixturesByTeamIdAndSeason, getTeamById } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import { Games, TeamResponse } from "@/types/general";
import { Seasons } from "@/lib/constants";

const Page = async ({ params }: { params: { teamId: string } }) => {
  const teamId = parseInt(params.teamId);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [teamId, "baseball", "team"],
    queryFn: () => getTeamById(teamId, "baseball"),
  });

  const team: TeamResponse | undefined = queryClient.getQueryData([
    teamId,
    "baseball",
    "team",
  ]);

  const season = "2023";

  await queryClient.prefetchQuery({
    queryKey: [teamId, season, "baseball", "fixtures"],
    queryFn: () => getFixturesByTeamIdAndSeason(teamId, season, "baseball"),
  });

  const fixtures: Games<BaseballScores>[] | undefined =
    queryClient.getQueryData([teamId, season, "baseball", "fixtures"]);

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
          sport="baseball"
          isTeam={true}
          currSeason={season ?? "-"}
          fixtures={fixtures}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
