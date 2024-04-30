import {
  getMLBFixtures,
  getNBAFixtures,
  getFeaturedFootballFixtures,
  getFixturesByDate,
} from "@/services/api";
import { format } from "date-fns";
import { cache } from "react";
import ErrorBoundary from "@/components/Error";
import Link from "next/link";
import BoxFixture from "@/components/ui/BoxFixture";
import { getFixtureData } from "@/lib/utils";
import MobileFilterWrapper from "@/components/ui/MobileFilterWrapper";

export const getNBAFeatuerdFixtures = cache(async (date: string) => {
  return await getNBAFixtures(date);
});

export const getMLBFeaturedFixtures = cache(async (date: string) => {
  return await getMLBFixtures(date);
});

export const getFootballFeaturedFixtures = cache(
  async (date: string, id: number) => {
    return await getFeaturedFootballFixtures(date, id);
  }
);

export const getAFLFeaturedFixtures = cache(async (date: string) => {
  return await getFixturesByDate(date, "australian-football");
});
export const getNFLFeaturedFixtures = cache(async (date: string) => {
  return await getFixturesByDate(date, "american-football");
});

export default async function Home() {
  const formattedDate = format(new Date(), "yyyy-MM-dd");
  try {
    const nba = getNBAFeatuerdFixtures(formattedDate);
    const mlb = getMLBFeaturedFixtures(formattedDate);
    const premierLeague = getFootballFeaturedFixtures(formattedDate, 39);
    const laliga = getFootballFeaturedFixtures(formattedDate, 140);
    const afl = getAFLFeaturedFixtures(formattedDate);
    const nfl = getNFLFeaturedFixtures(formattedDate);

    const [
      nbaFixtures,
      mlbFixtures,
      premierLeagueFixtures,
      laligaFixtures,
      aflFixtures,
      nflFixtures,
    ] = await Promise.all([nba, mlb, premierLeague, laliga, afl, nfl]);

    const featuredFixtures = [
      {
        name: "NBA",
        id: 12,
        sport: "basketball",
        fixtures: nbaFixtures,
      },
      {
        name: "Premier League",
        id: 39,
        sport: "football",
        fixtures: premierLeagueFixtures,
      },
      {
        name: "MLB",
        id: 1,
        sport: "baseball",
        fixtures: mlbFixtures,
      },
      {
        name: "Laliga",
        id: 140,
        sport: "football",
        fixtures: laligaFixtures,
      },
      {
        name: "AFL",
        id: 1,
        sport: "australian-football",
        fixtures: aflFixtures,
      },
      {
        name: "NFL",
        id: 1,
        sport: "american-football",
        fixtures: nflFixtures,
      },
    ];

    return (
      <main className="flex flex-col w-full h-screen p-3 pt-0 overflow-y-auto font-sans lg:p-6 lg:pt-6">
        <div className="sticky top-0 left-0 z-10 flex items-center justify-between w-full py-3 border-b shadow-sm bg-background lg:hidden">
          <p className="items-end pl-3 text-lg font-medium">Scores</p>
          <MobileFilterWrapper
            sport="football"
            isHome={false}
            isLeague={false}
            isTeam={false}
          />
        </div>
        {featuredFixtures
          .filter((league) => league.fixtures && league.fixtures?.length > 0)
          .map((league, index) => (
            <div
              key={index}
              className="w-full px-1 py-10 space-y-4 border-b first:pt-0 lg:px-6 lg:first:pt-6"
            >
              <div className="flex items-center justify-between w-full px-1 py-2 rounded-sm bg-secondary/70">
                <Link
                  className="text-[1rem] lg:text-lg font-medium p-1 opacity-90 hover:opacity-100 transition-opacity"
                  href={`/${league.sport}/league/${league.id}`}
                >
                  {league.name}
                </Link>
                <Link
                  href={`/${league.sport}/league/${league.id}`}
                  className="mr-2 text-sm text-secondary-foreground underline-hover"
                >
                  See more
                </Link>
              </div>
              <div className="grid gap-6 grid-cols-fixtures">
                {league.fixtures?.map((fixture) => (
                  <BoxFixture
                    key={getFixtureData(fixture).fixtureId}
                    sport={"football"}
                    fixture={getFixtureData(fixture)}
                  />
                ))}
              </div>
            </div>
          ))}
      </main>
    );
  } catch (error) {
    console.log(error);
    return (
      <div className="w-full h-screen">
        <ErrorBoundary message={(error as Error).message} />
      </div>
    );
  }
}
