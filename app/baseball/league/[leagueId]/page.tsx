import { League, Seasons } from "@/types/general";
import { getFixturesByLeagueIdAndSeason, getLeagueById } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import ErrorBoundary from "@/components/Error";
import NotFound from "@/components/ui/NotFound";
import { cache } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Baseball",
  description: "Show various data for baseball.",
};

const getLeague = cache(async (id: number) => {
  return await getLeagueById(id, "baseball");
});

const getFixture = cache(async (id: number, season: string) => {
  return await getFixturesByLeagueIdAndSeason(id, season, "baseball");
});

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);

  try {
    const league = (await getLeague(leagueId)) as League<Seasons[]>;

    if (!league) {
      return <NotFound type="league" sport="baseball" />;
    }

    const season = league.seasons?.[league.seasons?.length - 1]?.season;

    if (!season) {
      return <NotFound type="season" sport="baseball" />;
    }

    const fixtures = await getFixture(leagueId, season);

    return (
      <div className="relative font-sans">
        <LeagueOrTeamWrapper
          title={league.name}
          logo={league.logo}
          id={league.id}
          seasons={league.seasons ?? []}
          sport="baseball"
          currSeason={season ?? "-"}
          fixtures={fixtures ?? []}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="w-full h-screen">
        <ErrorBoundary message={(error as Error).message} sport="baseball" />
      </div>
    );
  }
};

export default Page;
