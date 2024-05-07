import React from "react";
import { NBAStandings } from "@/types/basketball";
import {
  GamesStats,
  Sports,
  Standings as TStandings,
  Team,
  WithoutStandingEntity,
} from "@/types/general";
import { StandingsEntity, StandingsReponse } from "@/types/football";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Shadcn/table";
import { GroupedData, cn, groupStandingsByProperty } from "@/lib/utils";
import { AustralianFootballStandings as AFLStandings } from "@/types/australian-football";
import { NFLStandings } from "@/types/american-football";
import ImageWithFallback from "./ImageWithFallback";
import Link from "next/link";
import NotFound from "./NotFound";

function isFootballStandingsResponse(data: any): data is StandingsReponse {
  return data && data.league && Array.isArray(data.league.standings);
}

function isOtherSportStandingsResponse(data: any): data is TStandings[] {
  return data && "position" in data?.[0];
}

function isAFLStandingsResponse(data: any): data is AFLStandings[] {
  return data && "last_5" in data?.[0];
}

function isNFLStandingsResponse(data: any): data is NFLStandings[] {
  return data && "ncaa_conference" in data?.[0];
}

function isNBAStandingsResponse(data: any): data is NBAStandings[] {
  return data && "tieBreakerPoints" in data?.[0];
}

type Props = {
  standing?: (WithoutStandingEntity | TStandings[])[];
  sport: Sports;
};

const nflHeaders = [
  "rank",
  "team",
  "win",
  "lost",
  "streak",
  "records (Home)",
  "records (Road)",
  "points Diff",
  "points",
];
const aflHeaders = [
  "rank",
  "team",
  "played",
  "win",
  "drawn",
  "lost",
  "points",
  "form",
];
const footballHeaders = [
  "rank",
  "team",
  "played",
  "win",
  "drawn",
  "lost",
  "GF",
  "GA",
  "GD",
  "points",
  "form",
];
const generalHeaders = [
  "rank",
  "team",
  "played",
  "win",
  "win (in  %)",
  "lost",
  "lost (in %)",
  "points",
  "form",
];

const StandingHeader = ({ title }: { title: string }) => {
  return (
    <p className="capitalize sticky  font-medium text-sm lg:text-[1.125rem] p-3 py-5 lg:p-6 pl-6 lg:pl-9 border-b">
      {title}
    </p>
  );
};

const StandingTeam = ({ team, sport }: { team: Team; sport: Sports }) => {
  return (
    <Link href={`/${sport}/team/${team.id}`}>
      <div className="flex items-center gap-1 lg:gap-3">
        <ImageWithFallback
          className="w-[25px] lg:w-[40px]"
          src={team.logo}
          alt={`${team.name}-logo`}
        />
        <p className="text-sm lg:text-[1rem]">{team.name}</p>
      </div>
    </Link>
  );
};

const StandingForm = ({ form }: { form: string | null }) => {
  return (
    <div className="flex items-center justify-center gap-1">
      {form
        ? form
            .slice(0, 5)
            .split("")
            .map((char, index) => (
              <div
                className={cn("rounded-full size-5 bg-gray-500", {
                  "bg-green-500": char === "W",
                  "bg-red-500": char === "L",
                  "bg-gray-500": char === "D",
                })}
                key={index}
              ></div>
            ))
        : "-"}
    </div>
  );
};

const StandingTableHeader = ({ headers }: { headers: string[] }) => {
  return (
    <TableHeader className="sticky top-0 z-10 shadow-sm pointer-events-none bg-background">
      {headers.map((head, index) => (
        <TableHead
          className={cn("text-center capitalize bg-background", {
            "text-left sticky min-w-[40px] left-0": index === 0,
            "min-w-[160px] text-left sticky z-20 left-[70px] -ml-2":
              index === 1,
          })}
          key={index}
        >
          {head}
        </TableHead>
      ))}
    </TableHeader>
  );
};

const NFLStandings = ({
  standings,
  sport,
}: {
  standings: GroupedData<NFLStandings>;
  sport: Sports;
}) => {
  return Object.keys(standings).map((key, index) => (
    <div key={index}>
      <StandingHeader title={key} />
      <Table>
        <StandingTableHeader headers={nflHeaders} />
        <TableBody className="w-full overflow-x-auto">
          {standings[key].map((item, index) => (
            <TableRow className="text-center" key={index}>
              <TableCell className="sticky left-0 pl-6 text-left lg:left-6 bg-background">
                {item.position}
              </TableCell>
              <TableCell className="sticky left-[70px] bg-background">
                <StandingTeam team={item.team} sport={sport} />
              </TableCell>
              <TableCell>{item.won}</TableCell>
              <TableCell>{item.lost}</TableCell>
              <TableCell>{item.streak}</TableCell>
              <TableCell>{item.records.home}</TableCell>
              <TableCell>{item.records.road}</TableCell>
              <TableCell>{item.points.difference}</TableCell>
              <TableCell>{item.points.for + item.points.against}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ));
};

const AFLStandings = ({
  standings,
  sport,
}: {
  standings: AFLStandings[];
  sport: Sports;
}) => {
  return (
    <Table>
      <StandingTableHeader headers={aflHeaders} />
      <TableBody className="w-full overflow-x-auto">
        {standings.map((item, index) => (
          <TableRow className="text-center" key={index}>
            <TableCell className="sticky left-0 pl-6 text-left lg:left-6 bg-background">
              {item.position}
            </TableCell>
            <TableCell className="sticky left-[70px] bg-background">
              <StandingTeam team={item.team} sport={sport} />
            </TableCell>
            <TableCell>{item.games.played}</TableCell>
            <TableCell>{item.games.win}</TableCell>
            <TableCell>{item.games.drawn}</TableCell>
            <TableCell>{item.games.lost}</TableCell>
            <TableCell>{item.pts}</TableCell>
            <TableCell>
              <StandingForm form={item.last_5} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const FootballStandings = ({
  standings,
  sport,
}: {
  standings: StandingsEntity[] | null;
  sport: Sports;
}) => {
  if (!standings) return null;
  return (
    <Table className="w-full border-b">
      <StandingTableHeader headers={footballHeaders} />
      <TableBody className="w-full overflow-x-auto">
        {standings.map((item, index) => (
          <TableRow className="text-center" key={index}>
            <TableCell className="sticky left-0 pl-6 text-left lg:left-6 bg-background">
              {item.rank}
            </TableCell>
            <TableCell className="sticky left-[70px] bg-background">
              <StandingTeam team={item.team} sport={sport} />
            </TableCell>
            <TableCell>{item.all.played}</TableCell>
            <TableCell>{item.all.win}</TableCell>
            <TableCell>{item.all.draw}</TableCell>
            <TableCell>{item.all.lose}</TableCell>
            <TableCell>{item.all.goals.for}</TableCell>
            <TableCell>{item.all.goals.against}</TableCell>
            <TableCell>{item.goalsDiff}</TableCell>
            <TableCell>{item.points}</TableCell>
            <TableCell>
              <StandingForm form={item.form} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const GeneralStandings = ({
  standings,
  sport,
}: {
  standings: GroupedData<TStandings<GamesStats>>;
  sport: Sports;
}) => {
  return Object.keys(standings).map((key, index) => (
    <div key={index}>
      <StandingHeader title={key} />
      <Table>
        <StandingTableHeader headers={generalHeaders} />
        <TableBody className="w-full overflow-x-auto">
          {standings[key].map((item, index) => (
            <TableRow className="text-center" key={index}>
              <TableCell className="sticky left-0 pl-6 text-left lg:left-6 bg-background">
                {item.position}
              </TableCell>
              <TableCell className="sticky left-[70px] bg-background">
                <StandingTeam team={item.team} sport={sport} />
              </TableCell>
              <TableCell>{item.games.played}</TableCell>
              <TableCell>{item.games.win.total}</TableCell>
              <TableCell>{item.games.win.percentage}</TableCell>
              <TableCell>{item.games.lose.total}</TableCell>
              <TableCell>{item.games.lose.percentage}</TableCell>
              <TableCell>
                {typeof item.points === "number"
                  ? item.points
                  : item.points.for + item.points.against}
              </TableCell>
              <TableCell>
                <StandingForm form={item.form} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ));
};

const Standings = ({ standing, sport }: Props) => {
  if (!standing) return <NotFound type="standings" />;

  if (isNFLStandingsResponse(standing)) {
    const data = groupStandingsByProperty(standing, (t) => t.division);
    if (Object.keys(standing).length === 0)
      return <NotFound type="standings" />;
    return <NFLStandings standings={data} sport={sport} />;
  }

  if (isNBAStandingsResponse(standing)) {
    const data = groupStandingsByProperty(standing, (t) => t.division.name);
    //Component for NBAStandings
  }

  if (isAFLStandingsResponse(standing)) {
    if (standing.length === 0) return <NotFound type="standings" />;
    return <AFLStandings standings={standing} sport={sport} />;
  }

  return (
    <div className="h-full">
      {standing.map((data, index) => {
        if (isFootballStandingsResponse(data)) {
          return (
            <div key={index}>
              {standing.length > 1 && (
                <StandingHeader title={data.league.name} />
              )}
              {!data.league.standings ||
                (data.league.standings.length === 0 && (
                  <NotFound type="standings" />
                ))}
              {data.league.standings?.filter(Boolean).map((standing, index) => (
                <div key={index}>
                  <StandingHeader title={standing?.[0].group ?? ""} />
                  <FootballStandings standings={standing} sport={sport} />
                </div>
              ))}
            </div>
          );
        } else if (isOtherSportStandingsResponse(data)) {
          const standingsData = groupStandingsByProperty(
            data,
            (t) => t.group.name
          );
          if (Object.keys(standingsData).length === 0)
            return <NotFound key={index} type="standings" />;
          return (
            <GeneralStandings
              key={index}
              standings={standingsData}
              sport={sport}
            />
          );
        }
      })}
    </div>
  );
};

export default Standings;
