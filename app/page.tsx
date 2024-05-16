import { format } from "date-fns";
import Link from "next/link";
import BoxFixture from "@/components/ui/BoxFixture";
import { getFixtureData } from "@/lib/utils";
import { getFeaturedFixtures } from "@/services/getFixtures";
import MobileFilter from "@/components/MobileFilter";
import { Sports } from "@/types/general";

const Page = async () => {
  const date = new Date();
  const today = format(date, "yyyy-MM-dd");
  const previousYear = (date.getFullYear() - 1).toString();
  const currentYear = date.getFullYear().toString();

  const mlbPromise = getFeaturedFixtures(today, currentYear, "baseball", "1");
  const nbaPromise = getFeaturedFixtures(
    today,
    currentYear,
    "basketball",
    "12"
  );
  const premierLeaguePromise = getFeaturedFixtures(
    today,
    previousYear,
    "football",
    "39"
  );
  const laligaPromise = getFeaturedFixtures(
    today,
    previousYear,
    "football",
    "140"
  );
  const nflPromise = getFeaturedFixtures(
    today,
    currentYear,
    "american-football"
  );
  const aflPromise = getFeaturedFixtures(
    today,
    previousYear,
    "australian-football"
  );

  const [
    nbaFixtures,
    mlbFixtures,
    premierLeagueFixtures,
    laligaFixtures,
    aflFixtures,
    nflFixtures,
  ] = await Promise.allSettled([
    nbaPromise,
    mlbPromise,
    premierLeaguePromise,
    laligaPromise,
    aflPromise,
    nflPromise,
  ]);

  const nba =
    nbaFixtures.status === "fulfilled" ? nbaFixtures.value : undefined;
  const mlb =
    mlbFixtures.status === "fulfilled" ? mlbFixtures.value : undefined;
  const afl =
    aflFixtures.status === "fulfilled" ? aflFixtures.value : undefined;
  const nfl =
    nflFixtures.status === "fulfilled" ? nflFixtures.value : undefined;
  const laliga =
    laligaFixtures.status === "fulfilled" ? laligaFixtures.value : undefined;
  const premierLeague =
    premierLeagueFixtures.status === "fulfilled"
      ? premierLeagueFixtures.value
      : undefined;

  const featuredFixtures = [
    {
      name: "NBA",
      id: 12,
      sport: "basketball",
      fixtures: nba,
    },
    {
      name: "Premier League",
      id: 39,
      sport: "football",
      fixtures: premierLeague,
    },
    {
      name: "MLB",
      id: 1,
      sport: "baseball",
      fixtures: mlb,
    },
    {
      name: "Laliga",
      id: 140,
      sport: "football",
      fixtures: laliga,
    },
    {
      name: "AFL",
      id: 1,
      sport: "australian-football",
      fixtures: afl,
    },
    {
      name: "NFL",
      id: 1,
      sport: "american-football",
      fixtures: nfl,
    },
  ];

  return (
    <main className="flex flex-col w-full h-screen p-3 pt-0 overflow-y-auto font-sans lg:p-4">
      <div className="sticky top-0 left-0 z-10 flex items-center justify-between w-full pt-3 border-b shadow-sm bg-background lg:hidden">
        <p className="items-end hidden pl-3 text-lg font-medium lg:block">
          Scores
        </p>
        <MobileFilter tabs={[]} isHome={true} labels={[]} isFixture={false} />
      </div>
      {featuredFixtures
        .filter(
          (league) =>
            league.fixtures &&
            league.fixtures.success &&
            league.fixtures.success.length > 0
        )
        .map((league, index) => (
          <div
            key={index}
            className="w-full px-1 py-10 space-y-4 border-b lg:px-4"
          >
            <div className="flex items-center justify-between w-full px-1 py-2 rounded-sm bg-secondary/70">
              <Link
                prefetch={true}
                href={`/${league.sport}/league/${league.id}/fixtures`}
                className="text-sm lg:text-[1rem] font-medium p-1 opacity-90 hover:opacity-100 transition-opacity"
              >
                {league.name}
              </Link>
              <Link
                prefetch={true}
                href={`/${league.sport}/league/${league.id}/fixtures`}
                className="mr-2 text-xs lg:text-sm text-secondary-foreground underline-hover"
              >
                See more
              </Link>
            </div>
            <div className="grid gap-6 grid-cols-fixtures">
              {league.fixtures?.success?.map((fixture) => (
                <BoxFixture
                  key={getFixtureData(fixture).fixtureId}
                  sport={league.sport as Sports}
                  fixture={getFixtureData(fixture)}
                />
              ))}
            </div>
          </div>
        ))}
    </main>
  );
};

export default Page;
