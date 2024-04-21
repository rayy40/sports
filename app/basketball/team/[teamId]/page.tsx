import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getFixturesByTeamIdAndSeason, getTeamById } from "@/services/api";
import RootComponent from "@/components/RootComponent";
import { Games, TeamResponse } from "@/types/general";
import {
  BasketballScores,
  NBAGames,
  NBATeamresponse,
} from "@/types/basketball";
import { Seasons, BasketballSeasons } from "@/lib/constants";

const Page = async ({ params }: { params: { teamId: string } }) => {
  const isNBATeam = params.teamId.split("-")[0] === "nba";

  const teamId = isNBATeam
    ? parseInt(params.teamId.split("-")[1])
    : parseInt(params.teamId);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [teamId, "basketball", "team"],
    queryFn: () => getTeamById(teamId, "basketball", isNBATeam),
  });

  const team: TeamResponse | NBATeamresponse | undefined =
    queryClient.getQueryData([teamId, "basketball", "team"]);

  const season = isNBATeam ? "2023" : "2023-2024";

  await queryClient.prefetchQuery({
    queryKey: [teamId, season, "basketball", "fixtures"],
    queryFn: () =>
      getFixturesByTeamIdAndSeason(teamId, season, "basketball", isNBATeam),
  });

  const fixtures: Games<BasketballScores>[] | NBAGames[] | undefined =
    queryClient.getQueryData([teamId, season, "basketball", "fixtures"]);

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
          seasons={isNBATeam ? Seasons : BasketballSeasons}
          sport="basketball"
          isTeam={true}
          isNBATeam={isNBATeam}
          currSeason={season ?? "-"}
          fixtures={fixtures}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
