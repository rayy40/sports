import { format } from "date-fns";
import Link from "next/link";
import React from "react";
import ImageWithFallback from "../ImageWithFallback";
import { Sports, Status } from "@/types/general";
import { Status as FootballStatus } from "@/types/football";
import { NBAStatus } from "@/types/basketball";
import { getTabs } from "@/lib/utils";

type StatusCollections = Status | NBAStatus | FootballStatus;

type Fixture = {
  fixtureDate: string;
  fixtureId: number;
  fixtureRound: string | number | null;
  homeTeam: {
    logo: string;
    name: string;
  };
  awayTeam: {
    logo: string;
    name: string;
  };
  fixtureStatus: StatusCollections;
  homeTeamScore?: number | null;
  awayTeamScore?: number | null;
};

type Props = {
  sport: Sports;
  fixture: Fixture;
};

const BoxFixture = ({ sport, fixture }: Props) => {
  const {
    homeTeam,
    awayTeam,
    homeTeamScore,
    awayTeamScore,
    fixtureDate: date,
    fixtureId: id,
    fixtureRound: round,
    fixtureStatus: status,
  } = fixture;
  const isHomeLoser =
    homeTeamScore && awayTeamScore && homeTeamScore < awayTeamScore;
  const isAwayLoser =
    homeTeamScore && awayTeamScore && homeTeamScore > awayTeamScore;

  const renderStatus = (status: StatusCollections) => {
    const { short: shortStatus } = status;
    const timer =
      "timer" in status
        ? status.timer
        : "elapsed" in status
        ? status.elapsed
        : "clock" in status
        ? status.clock
        : status.short;
    switch (shortStatus) {
      case "FT":
      case "AET":
      case "PEN":
        return "Full Time";
      case "NS":
        return "";
      case "TBD":
        return "TBD";
      default:
        return timer ? `${timer}'` : "";
    }
  };

  const tab = getTabs(sport)[0].toLowerCase().replaceAll(" ", "-");

  return (
    <Link prefetch={true} href={`/${sport}/fixture/${id}/${tab}`}>
      <div className="border relative h-[160px] lg:h-[200px] border-secondary hover:border-secondary-foreground/30 transition-colors cursor-pointer rounded-sm p-5 lg:p-6 space-y-5 lg:space-y-6 shadow-sm">
        <div className="flex min-h-[10px] lg:min-h-[20px] text-secondary-foreground text-sm items-center justify-between">
          <p className="whitespace-nowrap max-w-[80%] text-ellipsis overflow-hidden">
            {round}
          </p>
          <span className="-mr-1 whitespace-nowrap">
            {renderStatus(status)}
          </span>
        </div>
        <div className="flex flex-col justify-end gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ImageWithFallback
                className="w-8 lg:w-10"
                src={homeTeam.logo}
                alt={`${homeTeam.name}-logo`}
              />
              <h3
                className={`${
                  isHomeLoser ? "opacity-60" : "opacity-100"
                } font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[70%]`}
              >
                {homeTeam.name}
              </h3>
            </div>
            <p className={isHomeLoser ? "opacity-60" : "opacity-100"}>
              {homeTeamScore}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ImageWithFallback
                className="w-8 lg:w-10"
                src={awayTeam.logo}
                alt={`${awayTeam.name}-logo`}
              />
              <h3
                className={`${
                  isAwayLoser ? "opacity-60" : "opacity-100"
                } font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[70%]`}
              >
                {awayTeam.name}
              </h3>
            </div>
            <p className={isAwayLoser ? "opacity-60" : "opacity-100"}>
              {awayTeamScore}
            </p>
          </div>
          {status.short === "NS" && (
            <div className="absolute right-0 flex items-center justify-center h-full px-4 -translate-y-1/2 border-l bg-background top-1/2">
              <span className="text-sm text-secondary-foreground">
                {format(date, "HH:mm")}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BoxFixture;
