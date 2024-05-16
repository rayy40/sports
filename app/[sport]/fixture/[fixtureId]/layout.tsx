import React, { ReactNode } from "react";

import ImageWithFallback from "@/components/ImageWithFallback";
import { sports } from "@/lib/constants";
import {
  AllSportsFixtures,
  Games,
  GamesWithPeriodsAndEvents,
  Sports,
  Team,
  isAFLFixture,
  isBaseballFixture,
  isBasketballFixture,
  isFootballDetailedFixture,
  isHockeyOrRugbyFixture,
  isNFLFixture,
} from "@/types/general";
import { AustralianFootballGames as AFLGames } from "@/types/australian-football";
import { getFixtureById } from "@/services/getFixtures";
import { cn, getFixtureData } from "@/lib/utils";
import { format } from "date-fns";
import { Timeline } from "@/types/football";
import Link from "next/link";
import FootballFixtureScore from "@/components/ui/FootballFixtureScore";
import { BaseballFixtureScore } from "@/components/ui/BaseballFixtureScore";
import { BaseballScores } from "@/types/baseball";
import { BasketballScores } from "@/types/basketball";
import { BasketballFixtureScore } from "@/components/ui/BasketballFixtureScore";
import { HockeyFixtureScore } from "@/components/ui/HockeyFixtureScore";
import AmericanFixtureScore from "@/components/ui/AmericanFixtureScore";
import { NFLGames } from "@/types/american-football";
import AustralianFixtureScore from "@/components/ui/AustralianFixtureScore";

type Props = {
  children: ReactNode;
  params: { fixtureId: string; sport: Sports };
};
interface DetailedScoreProps {
  sport: Sports;
  homeTeam?: number;
  fixture?: AllSportsFixtures;
  events?: Timeline[];
}

const DetailedScore = ({
  sport,
  events,
  fixture,
  homeTeam,
}: DetailedScoreProps) => {
  switch (sport) {
    case "football":
      return <FootballFixtureScore events={events} homeTeam={homeTeam} />;
    case "baseball":
      return (
        <BaseballFixtureScore fixture={fixture as Games<BaseballScores>} />
      );
    case "basketball":
      return (
        <BasketballFixtureScore fixture={fixture as Games<BasketballScores>} />
      );
    case "hockey":
      return (
        <HockeyFixtureScore
          fixture={fixture as GamesWithPeriodsAndEvents<number>}
        />
      );
    case "american-football":
      return <AmericanFixtureScore fixture={fixture as NFLGames} />;
    case "australian-football":
      return <AustralianFixtureScore fixture={fixture as AFLGames} />;
    default:
      return;
  }
};

const Score = ({
  isWinner,
  score,
}: {
  isWinner: boolean;
  score?: number | null;
}) => {
  return (
    <p
      className={cn({
        "text-secondary-foreground": isWinner,
        "text-foreground": !isWinner,
      })}
    >
      {score ?? ""}
    </p>
  );
};

const Team = ({
  team,
  sport,
  isAway = false,
}: {
  team: Team;
  sport: Sports;
  isAway?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-start gap-2 lg:flex-row lg:gap-4",
        {
          "lg:flex-row-reverse": isAway,
        }
      )}
    >
      <Link prefetch={true} href={`/${sport}/team/${team.id}/fixtures`}>
        <ImageWithFallback
          className="w-[40px] lg:w-[70px]"
          src={team.logo}
          alt={`${team.name}-logo`}
        />
      </Link>
      <Link prefetch={true} href={`/${sport}/team/${team.id}/fixtures`}>
        <h3 className="text-[1rem] text-center font-medium lg:text-lg">
          {team.name}
        </h3>
      </Link>
    </div>
  );
};

const FixtureLayout = async ({ children, params }: Props) => {
  if (!sports.includes(params.sport)) {
    throw new Error("Unrecognized sport.");
  }

  const fixtureId = params.fixtureId;

  const data = await getFixtureById(fixtureId, params.sport);

  if (data.error) {
    throw new Error(data.error);
  }

  if (data.success) {
    const fixture = getFixtureData(data.success);

    return (
      <div className="flex flex-col h-screen font-sans">
        <div className="sticky bg-secondary/30 top-0 z-20 flex flex-col gap-3 p-3 pb-0 lg:gap-6 lg:px-6 lg:pb-0 lg:pt-6">
          <div className="flex flex-col gap-6 w-full max-w-[1000px] mx-auto">
            <div className="flex items-start justify-between">
              <p className="text-sm">
                {format(fixture.fixtureDate, "EEEE, do MMMM")}
              </p>
              <Link
                prefetch={true}
                href={`/${params.sport}/league/${fixture.fixtureLeague.id}/fixtures`}
                className="text-sm underline-hover"
              >
                {fixture.fixtureLeague.name}
              </Link>
            </div>
            <div className="grid py-2 lg:py-4 grid-cols-fixture justify-between items-center gap-6">
              <Team team={fixture.homeTeam} sport={params.sport} />
              <div className="flex items-center justify-between gap-1 text-lg font-medium lg:gap-3 lg:text-2xl">
                <Score
                  isWinner={Boolean(fixture.isHomeTeamWinner)}
                  score={fixture.homeTeamScore}
                />
                <span>-</span>
                <Score
                  isWinner={Boolean(fixture.isAwayTeamWinner)}
                  score={fixture.awayTeamScore}
                />
              </div>
              <Team
                team={fixture.awayTeam}
                sport={params.sport}
                isAway={true}
              />
            </div>
            {isFootballDetailedFixture(data.success) && (
              <DetailedScore
                sport={params.sport}
                events={data.success.events}
                homeTeam={fixture.homeTeam.id}
              />
            )}
            {isBaseballFixture(data.success) && (
              <DetailedScore sport={params.sport} fixture={data.success} />
            )}
            {isBasketballFixture(data.success) && (
              <DetailedScore sport={params.sport} fixture={data.success} />
            )}
            {isHockeyOrRugbyFixture(data.success) && (
              <DetailedScore sport={params.sport} fixture={data.success} />
            )}
            {isNFLFixture(data.success) && (
              <DetailedScore sport={params.sport} fixture={data.success} />
            )}
            {isAFLFixture(data.success) && (
              <DetailedScore sport={params.sport} fixture={data.success} />
            )}
          </div>
        </div>
        {children}
      </div>
    );
  }
};

export default FixtureLayout;
