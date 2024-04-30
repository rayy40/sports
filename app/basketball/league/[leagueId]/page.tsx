import { League, Seasons } from "@/types/general";
import { getLeagueById } from "@/services/api";
import { getFixturesByLeagueIdAndSeason } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import { getNBASeasons } from "@/services/api";
import ErrorBoundary from "@/components/Error";
import NotFound from "@/components/ui/NotFound";
import { cache } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Basketball",
  description: "Show various data for basketball.",
};

const getLeague = cache(async (id: number) => {
  return await getLeagueById(id, "basketball");
});

const getFixture = cache(async (id: number, season: string) => {
  return await getFixturesByLeagueIdAndSeason(id, season, "basketball");
});

const getSeasons = cache(async () => {
  return await getNBASeasons();
});

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);

  try {
    const league = (await getLeague(leagueId)) as League<Seasons[]>;
    let nbaSeasons: number[] | null | undefined = undefined;

    if (!league) {
      return <NotFound type="league" sport="basketball" />;
    }

    if (leagueId === 12) {
      nbaSeasons = await getSeasons();
    }

    const season = !nbaSeasons
      ? league?.seasons[league?.seasons?.length - 1]?.season
      : nbaSeasons?.[nbaSeasons?.length - 1]?.toString();

    const fixtures = await getFixture(leagueId, season);

    return (
      <div className="relative font-sans">
        <LeagueOrTeamWrapper
          title={league.name}
          logo={league.logo}
          id={league.id}
          seasons={nbaSeasons ?? league.seasons}
          sport="basketball"
          currSeason={season ?? "-"}
          fixtures={fixtures ?? []}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="w-full h-screen">
        <ErrorBoundary message={(error as Error).message} sport="hockey" />
      </div>
    );
  }
};

export default Page;
