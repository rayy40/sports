import { Suspense } from "react";
import { Fixtures, TeamResponse } from "@/types/football";
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

const Page = async ({ params }: { params: { teamId: string } }) => {
  const teamId = parseInt(params.teamId);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [teamId, "football", "team"],
    queryFn: () => getTeamById(teamId, "football"),
  });

  const team: TeamResponse | undefined = queryClient.getQueryData([
    teamId,
    "football",
    "team",
  ]);

  await queryClient.prefetchQuery({
    queryKey: [teamId, "football", "team", "seasons"],
    queryFn: () => getTeamSeasons(teamId, "football"),
  });

  const seasonsList: number[] =
    queryClient.getQueryData([teamId, "football", "team", "seasons"]) ?? [];
  const season = seasonsList?.[seasonsList?.length - 1].toString();

  await queryClient.prefetchQuery({
    queryKey: [teamId, season, "football", "fixtures"],
    queryFn: () => getFixturesByTeamIdAndSeason(teamId, season, "football"),
  });

  const fixtures: Fixtures[] | undefined = queryClient.getQueryData([
    teamId,
    season,
    "football",
    "fixtures",
  ]);

  if (!team) {
    return (
      <div className="flex font-sans text-sm lg:text-[1rem] font-medium h-screen w-full items-center justify-center">
        <p>No team found.</p>
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
          fixtures={fixtures}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
