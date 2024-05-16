import React from "react";

import { HomeOrAway1, NFLScores } from "@/types/american-football";
import { AustralianFootballScores as AFLScores } from "@/types/australian-football";
import { BaseballScores, InningsScore } from "@/types/baseball";
import { BasketballScores } from "@/types/basketball";
import { Timeline } from "@/types/football";
import {
  AllSportsFixtures,
  isAFLFixture,
  isBaseballFixture,
  isBasketballFixture,
  isFootballDetailedFixture,
  isHockeyFixture,
  isNFLFixture,
  isRugbyFixture,
  Scores,
  Teams,
} from "@/types/general";
import { Periods as HockeyPeriods } from "@/types/hockey";
import { Periods as RugbyPeriods } from "@/types/rugby";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Shadcn/table";

const getFirstName = (team: string) => {
  return team?.split(" ")[0] ?? "-";
};

const FootballFixtureScore = ({
  homePlayers,
  awayPlayers,
}: {
  homePlayers: Timeline[];
  awayPlayers: Timeline[];
}) => {
  return (
    <div className="flex items-start justify-between px-2 text-xs lg:text-sm">
      <div className="flex flex-col items-start">
        {homePlayers?.map((event, index) => (
          <p key={index} className="capitalize">
            {event.player.name}
            <span className="ml-3 font-medium text-secondary-foreground">
              {event.time.elapsed}&#39;
              {event.time.extra && `+ ${event.time.extra}'`}
            </span>
          </p>
        ))}
      </div>
      <div className="flex flex-col items-end">
        {awayPlayers?.map((event, index) => (
          <p key={index} className="capitalize">
            {event.player.name}
            <span className="ml-3 font-medium text-secondary-foreground">
              {event.time.elapsed}&#39;{" "}
              {event.time.extra && `+ ${event.time.extra}'`}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
};

const BaseballFixtureScore = ({
  scores,
  teams,
}: {
  scores: Scores<BaseballScores>;
  teams: Teams;
}) => {
  const renderInnings = (inningScores: InningsScore) => {
    return Object.values(inningScores)
      .filter((_, index) => index < 9)
      .map((value, index) => (
        <TableCell className="text-center" key={index}>
          {value ?? "-"}
        </TableCell>
      ));
  };

  return (
    <div className="flex flex-col items-start justify-between px-2 border-t border-t-secondary">
      <Table className="pointer-events-none">
        <TableHeader>
          <TableHead className="px-2 lg:px-4">Team</TableHead>
          {Array.from({ length: 9 }).map((_, index) => (
            <TableHead
              className="px-2 text-center capitalize lg:px-4"
              key={index}
            >
              {index + 1}
            </TableHead>
          ))}
          <TableHead className="px-2 font-bold text-center lg:px-4">
            R
          </TableHead>
          <TableHead className="px-2 font-bold text-center lg:px-4">
            H
          </TableHead>
          <TableHead className="px-2 font-bold text-center lg:px-4">
            E
          </TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{getFirstName(teams.home.name)}</TableCell>
            {renderInnings(scores.home.innings)}
            <TableCell className="font-bold text-center">
              {scores.home.total ?? "-"}
            </TableCell>
            <TableCell className="font-bold text-center">
              {scores.home.hits ?? "-"}
            </TableCell>
            <TableCell className="font-bold text-center">
              {scores.home.errors ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{getFirstName(teams.away.name)}</TableCell>
            {renderInnings(scores.away.innings)}
            <TableCell className="font-bold text-center">
              {scores.away.total ?? "-"}
            </TableCell>
            <TableCell className="font-bold text-center">
              {scores.away.hits ?? "-"}
            </TableCell>
            <TableCell className="font-bold text-center">
              {scores.away.errors ?? "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

const BasketballFixtureScore = ({
  scores,
  teams,
}: {
  scores: Scores<BasketballScores>;
  teams: Teams;
}) => {
  const renderQuarters = (teamScores: BasketballScores) => {
    return Object.values(teamScores)
      .filter((_, index) => index < 4)
      .map((value, index) => (
        <TableCell className="text-center" key={index}>
          {value ?? "-"}
        </TableCell>
      ));
  };

  return (
    <div className="flex flex-col items-start justify-between px-2 border-t border-t-secondary">
      <Table className="pointer-events-none">
        <TableHeader>
          <TableHead className="px-2 lg:px-4">Team</TableHead>
          {Array.from({ length: 4 }).map((_, index) => (
            <TableHead
              className="px-2 text-center capitalize lg:px-4"
              key={index}
            >
              Q{index + 1}
            </TableHead>
          ))}
          <TableHead className="px-2 font-bold text-center lg:px-4">
            Total
          </TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{getFirstName(teams.home.name)}</TableCell>
            {renderQuarters(scores.home)}
            <TableCell className="font-bold text-center">
              {scores.home.total ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{getFirstName(teams.home.name)}</TableCell>
            {renderQuarters(scores.away)}
            <TableCell className="font-bold text-center">
              {scores.away.total ?? "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

const HockeyFixtureScore = ({
  periods,
  scores,
  teams,
}: {
  periods: HockeyPeriods;
  scores: Scores<number | null>;
  teams: Teams;
}) => {
  const renderPeriods = (teamId: number) => {
    const periodsToShow = Object.values(periods).slice(0, 3);

    return periodsToShow.map((value, index) => (
      <TableCell className="text-center" key={index}>
        {value?.split("-")[teamId] ?? "-"}
      </TableCell>
    ));
  };

  return (
    <div className="flex flex-col items-start justify-between px-2 border-t border-t-secondary">
      <Table className="pointer-events-none">
        <TableHeader>
          <TableHead className="px-2 lg:px-4">Team</TableHead>
          {Array.from({ length: 3 }).map((_, index) => (
            <TableHead
              className="px-2 text-center capitalize lg:px-4"
              key={index}
            >
              P{index + 1}
            </TableHead>
          ))}
          {periods.overtime && (
            <TableHead className="px-2 text-center lg:px-4">OT</TableHead>
          )}
          <TableHead className="px-2 font-bold text-center lg:px-4">
            Total
          </TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{getFirstName(teams.home.name)}</TableCell>
            {renderPeriods(0)}
            {periods.overtime && (
              <TableCell className="text-center">
                {periods.overtime.split("-")[0] ?? "-"}
              </TableCell>
            )}
            <TableCell className="font-bold text-center">
              {scores.home ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{getFirstName(teams.away.name)}</TableCell>
            {renderPeriods(1)}
            {periods.overtime && (
              <TableCell className="text-center">
                {periods.overtime.split("-")[1] ?? "-"}
              </TableCell>
            )}
            <TableCell className="font-bold text-center">
              {scores.away ?? "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

const RugbyFixtureScore = ({
  teams,
  periods,
  scores,
}: {
  teams: Teams;
  scores: Scores<number | null>;
  periods: RugbyPeriods;
}) => {
  const renderPeriods = (teamScores: RugbyPeriods, team: "home" | "away") => {
    return Object.values(teamScores).map((value, index) => (
      <TableCell className="text-center" key={index}>
        {value[team] ?? "-"}
      </TableCell>
    ));
  };

  return (
    <div className="flex flex-col items-start justify-between px-2 border-t border-t-secondary">
      <Table className="pointer-events-none">
        <TableHeader>
          <TableHead className="px-2 lg:px-4">Team</TableHead>
          {Array.from({ length: 2 }).map((_, index) => (
            <TableHead
              className="px-2 text-center capitalize lg:px-4"
              key={index}
            >
              P{index + 1}
            </TableHead>
          ))}
          <TableHead className="px-2 text-center lg:px-4">OT1</TableHead>
          <TableHead className="px-2 text-center lg:px-4">OT2</TableHead>
          <TableHead className="px-2 font-bold text-center lg:px-4">
            Total
          </TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{getFirstName(teams.home.name)}</TableCell>
            {renderPeriods(periods, "home")}
            <TableCell className="font-bold text-center">
              {scores.home ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{getFirstName(teams.away.name)}</TableCell>
            {renderPeriods(periods, "away")}
            <TableCell className="font-bold text-center">
              {scores.away ?? "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

const NFLFixtureScore = ({
  teams,
  scores,
}: {
  teams: Teams;
  scores: NFLScores;
}) => {
  const renderPeriods = (teamScores: HomeOrAway1) => {
    const periodsToShow = Object.values(teamScores).slice(0, 3);

    return periodsToShow.map((value, index) => (
      <TableCell className="text-center" key={index}>
        {value ?? "-"}
      </TableCell>
    ));
  };

  return (
    <div className="flex flex-col items-start justify-between px-2 border-t border-t-secondary">
      <Table className="pointer-events-none">
        <TableHeader>
          <TableHead className="px-2 lg:px-4">Team</TableHead>
          {Array.from({ length: 3 }).map((_, index) => (
            <TableHead
              className="px-2 text-center capitalize lg:px-4"
              key={index}
            >
              Q{index + 1}
            </TableHead>
          ))}
          {scores.home.overtime && (
            <TableHead className="px-2 text-center lg:px-4">OT</TableHead>
          )}
          <TableHead className="px-2 font-bold text-center lg:px-4">
            Total
          </TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{getFirstName(teams.home.name)}</TableCell>
            {renderPeriods(scores.home)}
            {scores.home.overtime && (
              <TableCell className="text-center">
                {scores.home.overtime ?? "-"}
              </TableCell>
            )}
            <TableCell className="font-bold text-center">
              {scores.home.total ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{getFirstName(teams.away.name)}</TableCell>
            {renderPeriods(scores.away)}
            {scores.away.overtime && (
              <TableCell className="text-center">
                {scores.away.overtime ?? "-"}
              </TableCell>
            )}
            <TableCell className="font-bold text-center">
              {scores.away.total ?? "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

const AFLFixtureScore = ({
  teams,
  scores,
}: {
  teams: Teams;
  scores: { home: AFLScores; away: AFLScores };
}) => {
  const renderPeriods = (teamScores: AFLScores) => {
    const periodsToShow = Object.values(teamScores);

    return periodsToShow
      .filter((_, index) => index > 0)
      .map((value, index) => (
        <TableCell className="text-center" key={index}>
          {value ?? "-"}
        </TableCell>
      ));
  };

  const header = ["G", "B", "PSG", "PSB"];

  return (
    <div className="flex flex-col items-start justify-between px-2 border-t border-t-secondary">
      <Table className="pointer-events-none">
        <TableHeader>
          <TableHead className="px-2 capitalize lg:px-4">Team</TableHead>
          {header.map((h) => (
            <TableHead className="px-2 text-center capitalize lg:px-4" key={h}>
              {h}
            </TableHead>
          ))}
          <TableHead className="px-2 font-bold text-center lg:px-4">
            Total
          </TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{getFirstName(teams.home.name)}</TableCell>
            {renderPeriods(scores.home)}
            <TableCell className="font-bold text-center">
              {scores.home.score ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{getFirstName(teams.away.name)}</TableCell>
            {renderPeriods(scores.away)}
            <TableCell className="font-bold text-center">
              {scores.away.score ?? "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

const DetailedFixtureScore = ({ fixture }: { fixture: AllSportsFixtures }) => {
  if (isFootballDetailedFixture(fixture)) {
    const homeTeam = fixture.teams.home.id;
    const homePlayers = fixture?.events?.filter(
      (event) =>
        event.team.id === homeTeam && event.type.toLowerCase() === "goal"
    );
    const awayPlayers = fixture?.events?.filter(
      (event) =>
        event.team.id !== homeTeam && event.type.toLowerCase() === "goal"
    );
    return (
      <FootballFixtureScore
        homePlayers={homePlayers}
        awayPlayers={awayPlayers}
      />
    );
  }

  if (isBaseballFixture(fixture)) {
    const { teams, scores } = fixture;

    return <BaseballFixtureScore scores={scores} teams={teams} />;
  }

  if (isBasketballFixture(fixture)) {
    const { teams, scores } = fixture;

    return <BasketballFixtureScore scores={scores} teams={teams} />;
  }

  if (isHockeyFixture(fixture)) {
    const { teams, scores, periods } = fixture;

    return (
      <HockeyFixtureScore teams={teams} scores={scores} periods={periods} />
    );
  }

  if (isRugbyFixture(fixture)) {
    const { teams, scores, periods } = fixture;

    return (
      <RugbyFixtureScore teams={teams} scores={scores} periods={periods} />
    );
  }

  if (isAFLFixture(fixture)) {
    const { teams, scores } = fixture;
    return <AFLFixtureScore teams={teams} scores={scores} />;
  }

  if (isNFLFixture(fixture)) {
    const { teams, scores } = fixture;
    return <NFLFixtureScore teams={teams} scores={scores} />;
  }
};

export default DetailedFixtureScore;
