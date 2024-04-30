import { getFixturesByLeagueIdAndSeason, getLeagueById } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import ErrorBoundary from "@/components/Error";
import NotFound from "@/components/ui/NotFound";
import { cache } from "react";
import { Leagues } from "@/types/football";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NFL",
  description: "Show various data for NFL.",
};

export const getLeague = cache(async (id: number) => {
  return await getLeagueById(id, "american-football");
});

export const getFixture = cache(async (id: number, season: string) => {
  return await getFixturesByLeagueIdAndSeason(id, season, "american-football");
});

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);

  try {
    const league = (await getLeague(leagueId)) as Leagues;

    if (!league) {
      return <NotFound type="league" sport="american-football" />;
    }

    const season = league?.seasons?.[0]?.year.toString();

    if (!season) {
      return <NotFound type="season" sport="american-football" />;
    }

    const fixtures = await getFixture(leagueId, season);

    return (
      <div className="relative font-sans">
        <LeagueOrTeamWrapper
          title={league.league.name}
          logo={league.league.logo}
          id={league.league.id}
          seasons={league.seasons ?? []}
          sport="american-football"
          currSeason={season ?? "-"}
          fixtures={fixtures ?? []}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="w-full h-screen">
        <ErrorBoundary
          message={(error as Error).message}
          sport="american-football"
        />
      </div>
    );
  }
};

export default Page;
