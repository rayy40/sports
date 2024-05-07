"use client";

import { AllSportsFixtures, Sports } from "@/types/general";
import { forwardRef, useEffect, useMemo } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { Table, TableBody, TableCell, TableRow } from "./Shadcn/table";
import { cn, getBaseUrl, getFixtureData, getTabs } from "@/lib/utils";
import ImageWithFallback from "../ImageWithFallback";
import { shortStatusMap } from "@/lib/constants";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

type Props = {
  sport: Sports;
  leagues?: string[];
  fixtures?: AllSportsFixtures[];
};

type TeamInfoProps = {
  id: number;
  isWinner: boolean;
  name: string;
  logo: string;
  isHome: boolean;
  tab: string;
  sport: Sports;
};

type TeamScoreProps = {
  isWinner: boolean;
  score: number;
};

const TeamInfo = ({
  id,
  isWinner,
  isHome,
  name,
  logo,
  sport,
  tab,
}: TeamInfoProps) => {
  return (
    <div
      className={cn("flex items-center gap-1 lg:gap-3", {
        "justify-start": isHome,
        "justify-end": !isHome,
      })}
    >
      <p
        className={cn("text-sm text-right lg:text-[1.075rem]", {
          "text-primary-foreground": isWinner,
          "text-secondary-foreground": !isWinner,
          "order-2": isHome,
          "order-1": !isHome,
        })}
      >
        {name}
      </p>
      <Link href={`/${sport}/fixture/${id}/${tab}`}>
        <ImageWithFallback
          className={cn("w-[25px] lg:w-[40px]", {
            "order-1": isHome,
            "order-2": !isHome,
          })}
          src={logo}
          alt={`${name}-logo`}
        />
      </Link>
    </div>
  );
};

const TeamScore = ({ isWinner, score }: TeamScoreProps) => {
  return (
    <p
      className={cn("text-lg lg:text-xl", {
        "text-primary-foreground": isWinner,
        "text-secondary-foreground": !isWinner,
      })}
    >
      {score}
    </p>
  );
};

const FixturesTable = ({ fixtures, sport, leagues }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const team = searchParams.get("team");
  const league = searchParams.get("league");

  useEffect(() => {
    if (window !== undefined && leagues) {
      const baseURl = getBaseUrl(pathname);
      localStorage.setItem(`${baseURl}-leagues`, JSON.stringify(leagues));
    }
  }, [pathname, leagues]);

  const filteredFixtures = useMemo(() => {
    if (!team && !status) return fixtures;
    if (!fixtures || fixtures.length === 0) return [];

    const filtered = fixtures.filter((fixture) => {
      const { fixtureStatus, homeTeam, awayTeam, fixtureLeague } =
        getFixtureData(fixture);
      if (!(team || league) && status) {
        const detailedStatus = shortStatusMap[status];
        return detailedStatus.includes(fixtureStatus.short.toString());
      } else if (team && !status) {
        return (
          homeTeam.name.toLowerCase().includes(team.toLowerCase()) ||
          awayTeam.name.toLowerCase().includes(team.toLowerCase())
        );
      } else if (league && !status) {
        return fixtureLeague.name.toLowerCase() === league.toLowerCase();
      } else if (team && status) {
        const detailedStatus = shortStatusMap[status];
        return (
          detailedStatus.includes(fixtureStatus.short.toString()) &&
          (homeTeam.name.toLowerCase().includes(team.toLowerCase()) ||
            awayTeam.name.toLowerCase().includes(team.toLowerCase()))
        );
      } else if (league && status) {
        const detailedStatus = shortStatusMap[status];
        return (
          detailedStatus.includes(fixtureStatus.short.toString()) &&
          fixtureLeague.name.toLowerCase() === league.toLowerCase()
        );
      }
    });

    return filtered;
  }, [team, league, status, fixtures]);

  const tab = getTabs(sport)[0].toLowerCase().replaceAll(" ", "-");

  if (!filteredFixtures || filteredFixtures.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        No fixtures available.
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto scroll-smooth">
      <TableVirtuoso<AllSportsFixtures>
        style={{ height: "100%" }}
        totalCount={filteredFixtures.length}
        components={{
          Table: ({ style, ...props }) => {
            return <Table {...props} />;
          },
          // eslint-disable-next-line react/display-name
          TableBody: forwardRef(({ style, ...props }, ref) => {
            return <TableBody {...props} ref={ref} />;
          }),
          TableRow: (props) => {
            const index = props["data-index"];
            const fixture = filteredFixtures[index];
            const {
              fixtureId,
              homeTeam,
              awayTeam,
              isAwayTeamWinner,
              isHomeTeamWinner,
              homeTeamScore,
              awayTeamScore,
            } = getFixtureData(fixture);
            return (
              <TableRow {...props} className="hover:bg-secondary/80">
                <TableCell className="pl-4 py-4 max-w-[200px]">
                  <TeamInfo
                    id={fixtureId}
                    name={homeTeam.name}
                    logo={homeTeam.logo}
                    isWinner={Boolean(isHomeTeamWinner)}
                    sport={sport}
                    tab={tab}
                    isHome={true}
                  />
                </TableCell>
                <TableCell className="flex items-center justify-center gap-3 py-4 lg:gap-6">
                  {homeTeamScore && (
                    <TeamScore
                      score={homeTeamScore}
                      isWinner={Boolean(isHomeTeamWinner)}
                    />
                  )}
                  <span>-</span>
                  {awayTeamScore && (
                    <TeamScore
                      score={awayTeamScore}
                      isWinner={Boolean(isAwayTeamWinner)}
                    />
                  )}
                </TableCell>
                <TableCell className="py-4 max-w-[200px] pr-4">
                  <TeamInfo
                    id={fixtureId}
                    name={awayTeam.name}
                    logo={awayTeam.logo}
                    isWinner={Boolean(isAwayTeamWinner)}
                    sport={sport}
                    tab={tab}
                    isHome={false}
                  />
                </TableCell>
              </TableRow>
            );
          },
        }}
      />
    </div>
  );
};

export default FixturesTable;
