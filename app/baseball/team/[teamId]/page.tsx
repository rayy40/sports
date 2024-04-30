import { getFixturesByTeamIdAndSeason, getTeamById } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import { TeamResponse } from "@/types/general";
import { seasonsList } from "@/lib/constants";
import ErrorBoundary from "@/components/Error";
import NotFound from "@/components/ui/NotFound";
import { cache } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Baseball",
  description: "Show various data for baseball.",
};

export const getTeam = cache(async (id: number) => {
  return await getTeamById(id, "baseball");
});

export const getFixture = cache(async (id: number, season: string) => {
  return await getFixturesByTeamIdAndSeason(id, season, "baseball");
});

const Page = async ({ params }: { params: { teamId: string } }) => {
  const teamId = parseInt(params.teamId);
  try {
    const team = (await getTeam(teamId)) as TeamResponse;
    if (!team) {
      return <NotFound type="team" sport="baseball" />;
    }

    const season = "2023";

    const fixtures = await getFixture(teamId, season);

    return (
      <div className="relative font-sans">
        <LeagueOrTeamWrapper
          title={team.name}
          logo={team.logo}
          id={team.id}
          seasons={seasonsList}
          sport="baseball"
          isTeam={true}
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
