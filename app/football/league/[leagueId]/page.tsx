import { Leagues } from "@/types/football";
import { getFixturesByLeagueIdAndSeason, getLeagueById } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import ErrorBoundary from "@/components/Error";
import NotFound from "@/components/ui/NotFound";
import { cache } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Football",
  description: "Show various data for football.",
};

const getLeague = cache(async (id: number) => {
  return await getLeagueById(id, "football");
});

const getFixture = cache(async (id: number, season: string) => {
  return await getFixturesByLeagueIdAndSeason(id, season, "football");
});

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);

  try {
    const league = (await getLeague(leagueId)) as Leagues;

    if (!league) {
      return <NotFound type="league" sport="football" />;
    }

    const season =
      league.seasons?.[league.seasons?.length - 1]?.year.toString();

    if (!season) {
      return <NotFound type="season" sport="football" />;
    }

    const fixtures = await getFixture(leagueId, season);

    return (
      <div className="relative font-sans">
        <LeagueOrTeamWrapper
          title={league.league.name}
          logo={league.league.logo}
          id={league.league.id}
          seasons={league.seasons ?? []}
          sport="football"
          currSeason={season ?? "-"}
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
