import { League, Seasons } from "@/types/general";
import { getFixturesByLeagueIdAndSeason, getLeagueById } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import ErrorBoundary from "@/components/Error";
import NotFound from "@/components/ui/NotFound";
import { cache } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rugby",
  description: "Show various data for rugby.",
};

export const getLeague = cache(async (id: number) => {
  return await getLeagueById(id, "rugby");
});

export const getFixture = cache(async (id: number, season: string) => {
  return await getFixturesByLeagueIdAndSeason(id, season, "rugby");
});

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);

  try {
    const league = (await getLeague(leagueId)) as League<Seasons[]>;

    if (!league) {
      return <NotFound type="league" sport="rugby" />;
    }

    const season = league.seasons?.[league.seasons?.length - 1]?.season;

    if (!season) {
      return <NotFound type="season" sport="rugby" />;
    }

    const fixtures = await getFixture(leagueId, season);

    return (
      <div className="relative font-sans">
        <LeagueOrTeamWrapper
          title={league.name}
          logo={league.logo}
          id={league.id}
          seasons={league.seasons ?? []}
          sport="rugby"
          currSeason={season ?? "-"}
          fixtures={fixtures ?? []}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="w-full h-screen">
        <ErrorBoundary message={(error as Error).message} sport="rugby" />
      </div>
    );
  }
};

export default Page;
