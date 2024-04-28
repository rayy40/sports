import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getFixturesByTeamIdAndSeason, getTeamById } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import { TeamResponse } from "@/types/general";
import { NBATeamresponse } from "@/types/basketball";
import { seasonsList, basketballSeasons } from "@/lib/constants";
import NotFound from "@/components/ui/NotFound";
import Error from "@/components/Error";

const Page = async ({ params }: { params: { teamId: string } }) => {
  const isNBATeam = params.teamId.split("-")[0] === "nba";

  const teamId = isNBATeam
    ? parseInt(params.teamId.split("-")[1])
    : parseInt(params.teamId);

  const queryClient = new QueryClient();
  const team: TeamResponse | NBATeamresponse = await queryClient.fetchQuery({
    queryKey: [teamId, "basketball", "team"],
    queryFn: () => getTeamById(teamId, "basketball", isNBATeam),
  });

  if (!team) {
    return <NotFound type="team" sport="basketball" />;
  }

  const season = isNBATeam ? "2023" : "2023-2024";

  const fixtures = await queryClient.fetchQuery({
    queryKey: [teamId, season, "basketball", "fixtures"],
    queryFn: () =>
      getFixturesByTeamIdAndSeason(teamId, season, "basketball", isNBATeam),
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
          seasons={isNBATeam ? seasonsList : basketballSeasons}
          sport="basketball"
          isTeam={true}
          isNBATeam={isNBATeam}
          currSeason={season ?? "-"}
          fixtures={fixtures ?? []}
        />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
