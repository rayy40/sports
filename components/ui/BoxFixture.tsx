import { format } from "date-fns";
import Link from "next/link";
import React from "react";
import ImageWithFallback from "../ImageWithFallback";
import { Sports, Status } from "@/types/general";
import { Status as FootballStatus } from "@/types/football";
import { NBAStatus } from "@/types/basketball";

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
  fixtureStatus: Status | NBAStatus | FootballStatus;
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

  const renderStatus = (status: Status | NBAStatus | FootballStatus) => {
    const { short: shortStatus } = status;
    const timer =
      "timer" in status
        ? status.timer
        : "elapsed" in status
        ? status.elapsed
        : status.clock;
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
  return (
    <Link href={`/${sport}/fixture/${id}`}>
      <div className="border relative h-[200px] border-secondary hover:border-secondary-foreground/30 transition-colors cursor-pointer rounded-sm p-6 space-y-6 shadow-sm">
        <div className="flex min-h-[20px] text-secondary-foreground text-sm items-center justify-between">
          <p className="whitespace-nowrap max-w-[80%] text-ellipsis overflow-hidden">
            {round}
          </p>
          <span className="whitespace-nowrap -mr-1">
            {renderStatus(status)}
          </span>
        </div>
        <div className="flex flex-col justify-end gap-3">
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <ImageWithFallback
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
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <ImageWithFallback
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
            <div className="absolute bg-background flex justify-center items-center border-l h-full right-0 px-4 top-1/2 -translate-y-1/2">
              <span className="text-secondary-foreground text-sm">
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
