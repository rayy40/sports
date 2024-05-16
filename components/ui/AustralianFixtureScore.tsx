import {
  AustralianFootballGames as AFLGames,
  AustralianFootballScores as AFLScores,
} from "@/types/australian-football";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Shadcn/table";

const AustralianFixtureScore = ({ fixture }: { fixture?: AFLGames }) => {
  if (!fixture) return;

  const { teams, scores } = fixture;

  const getFirstName = (key: "home" | "away") => {
    return teams[key]?.name?.split(" ")[0] ?? "-";
  };

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
    <div className="flex flex-col px-2 border-t border-t-secondary justify-between items-start">
      <Table className="pointer-events-none">
        <TableHeader>
          <TableHead className="capitalize px-2 lg:px-4">Team</TableHead>
          {header.map((h) => (
            <TableHead className="capitalize text-center px-2 lg:px-4" key={h}>
              {h}
            </TableHead>
          ))}
          <TableHead className="text-center px-2 lg:px-4 font-bold">
            Total
          </TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{getFirstName("home")}</TableCell>
            {renderPeriods(scores.home)}
            <TableCell className="text-center font-bold">
              {scores.home.score ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{getFirstName("away")}</TableCell>
            {renderPeriods(scores.away)}
            <TableCell className="text-center font-bold">
              {scores.away.score ?? "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default AustralianFixtureScore;
