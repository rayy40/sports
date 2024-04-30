import { getFixturesByTeamIdAndSeason, getTeamById } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import { TeamResponse } from "@/types/general";
import { NBATeamresponse } from "@/types/basketball";
import { seasonsList, basketballSeasons } from "@/lib/constants";
import NotFound from "@/components/ui/NotFound";
import ErrorBoundary from "@/components/Error";
import { cache } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Basketball",
  description: "Show various data for basketball.",
};

export const getTeam = cache(async (id: number) => {
  return await getTeamById(id, "basketball");
});

export const getFixture = cache(
  async (id: number, season: string, isNBATeam: boolean) => {
    return await getFixturesByTeamIdAndSeason(
      id,
      season,
      "basketball",
      isNBATeam
    );
  }
);

const Page = async ({ params }: { params: { teamId: string } }) => {
  const isNBATeam = params.teamId.split("-")[0] === "nba";

  const teamId = isNBATeam
    ? parseInt(params.teamId.split("-")[1])
    : parseInt(params.teamId);

  try {
    const team = (await getTeam(teamId)) as TeamResponse | NBATeamresponse;
    if (!team) {
      return <NotFound type="team" sport="basketball" />;
    }

    const season = isNBATeam ? "2023" : "2023-2024";

    const fixtures = await getFixture(teamId, season, isNBATeam);
    return (
      <div className="relative font-sans">
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
      </div>
    );
  } catch (error) {
    return (
      <div className="w-full h-screen">
        <ErrorBoundary message={(error as Error).message} sport="basketball" />
      </div>
    );
  }
};

export default Page;
