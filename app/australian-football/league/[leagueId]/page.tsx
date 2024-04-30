import { getLeagueById } from "@/services/api";
import { getFixturesByLeagueIdAndSeason } from "@/services/api";
import LeagueOrTeamWrapper from "@/components/LeagueOrTeamWrapper";
import { AustralianFootballLeagueOrTeamInfo } from "@/types/australian-football";
import NotFound from "@/components/ui/NotFound";
import ErrorBoundary from "@/components/Error";
import { cache } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AFL",
  description: "Show various data for AFL.",
};

export const getLeague = cache(async (id: number) => {
  return await getLeagueById(id, "australian-football");
});

export const getFixture = cache(async (id: number, season: string) => {
  return await getFixturesByLeagueIdAndSeason(
    id,
    season,
    "australian-football"
  );
});

const Page = async ({ params }: { params: { leagueId: string } }) => {
  const leagueId = parseInt(params.leagueId);

  try {
    const league = (await getLeague(
      leagueId
    )) as AustralianFootballLeagueOrTeamInfo[];
    if (!league) {
      return <NotFound type="league" sport="australian-football" />;
    }
    const seasonsList = league.map((league) => league.season);
    const currSeason = seasonsList[seasonsList.length - 1].toString();

    const fixtures = await getFixture(leagueId, currSeason);

    return (
      <div className="relative font-sans">
        <LeagueOrTeamWrapper
          title={league[league.length - 1].name}
          logo={league[league.length - 1].logo}
          id={1}
          seasons={seasonsList}
          sport="australian-football"
          currSeason={currSeason}
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
