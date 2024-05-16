import { format } from "date-fns";
import Link from "next/link";
import React, { ReactNode } from "react";

import ImageWithFallback from "@/components/ImageWithFallback";
import DetailedFixtureScore from "@/components/ui/DetailedFixtureScore";
import { sports } from "@/lib/constants";
import { cn, getFixtureData } from "@/lib/utils";
import { getFixtureById } from "@/services/getFixtures";
import { Sports, type Team } from "@/types/general";

type Props = {
  children: ReactNode;
  params: { fixtureId: string; sport: Sports };
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

    console.log(data.success);

    return (
      <div className="flex flex-col h-screen font-sans">
        <div className="sticky top-0 z-20 flex flex-col gap-3 p-3 pb-0 bg-secondary/30 lg:gap-6 lg:px-6 lg:pb-0 lg:pt-6">
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
            <div className="grid items-center justify-between gap-6 py-2 lg:py-4 grid-cols-fixture">
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
            <DetailedFixtureScore fixture={data.success} />
          </div>
        </div>
        {children}
      </div>
    );
  }
};

export default FixtureLayout;
