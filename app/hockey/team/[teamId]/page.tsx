import { Suspense } from "react";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getFixturesByTeamIdAndSeason, getTeamById } from "@/services/api";
import RootComponent from "@/components/RootComponent";
import { GamesWithPeriodsAndEvents, TeamResponse } from "@/types/general";
import { Seasons } from "@/lib/constants";

const Page = async ({ params }: { params: { teamId: string } }) => {
  const teamId = parseInt(params.teamId);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [teamId, "hockey", "team"],
    queryFn: () => getTeamById(teamId, "hockey"),
  });

  const team: TeamResponse | undefined = queryClient.getQueryData([
    teamId,
    "hockey",
    "team",
  ]);

  const season = "2023";

  await queryClient.prefetchQuery({
    queryKey: [teamId, season, "hockey", "fixtures"],
    queryFn: () => getFixturesByTeamIdAndSeason(teamId, season, "hockey"),
  });

  const fixtures: GamesWithPeriodsAndEvents<number | null>[] | undefined =
    queryClient.getQueryData([teamId, season, "hockey", "fixtures"]);

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
        <RootComponent
          title={team.name}
          logo={team.logo}
          id={team.id}
          seasons={Seasons}
          sport="hockey"
          isTeam={true}
          currSeason={season ?? "-"}
          fixtures={fixtures}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
