import { TeamResponse } from "@/types/football";
import {
  getFixturesByTeamIdAndSeason,
  getTeamById,
  getTeamSeasons,
} from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import ErrorBoundary from "@/components/Error";
import NotFound from "@/components/ui/NotFound";
import { cache } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Football",
  description: "Show various data for football.",
};

export const getTeam = cache(async (id: number) => {
  return await getTeamById(id, "football");
});

export const getFixture = cache(async (id: number, season: string) => {
  return await getFixturesByTeamIdAndSeason(id, season, "football");
});

export const getSeasons = cache(async (id: number) => {
  return await getTeamSeasons(id, "football");
});

const Page = async ({ params }: { params: { teamId: string } }) => {
  const teamId = parseInt(params.teamId);
  try {
    const team = (await getTeam(teamId)) as TeamResponse;

    if (!team) {
      return <NotFound type="team" sport="football" />;
    }

    const seasonsList = await getSeasons(teamId);

    if (!seasonsList) {
      return <NotFound type="season" sport="football" />;
    }
    const season = seasonsList[seasonsList.length - 1].toString();

    const fixtures = await getFixture(teamId, season);

    return (
      <div className="relative font-sans">
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
      </div>
    );
  } catch (error) {
    return (
      <div className="w-full h-screen">
        <ErrorBoundary message={(error as Error).message} sport="football" />
      </div>
    );
  }
};

export default Page;
