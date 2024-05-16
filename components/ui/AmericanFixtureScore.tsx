import { NFLGames, HomeOrAway1 as NFLScores } from "@/types/american-football";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Shadcn/table";

const AmericanFixtureScore = ({ fixture }: { fixture?: NFLGames }) => {
  if (!fixture) return;

  const { teams, scores } = fixture;

  const getFirstName = (key: "home" | "away") => {
    return teams[key]?.name?.split(" ")[0] ?? "-";
  };

  const renderPeriods = (teamScores: NFLScores) => {
    const periodsToShow = Object.values(teamScores).slice(0, 3);

    return periodsToShow.map((value, index) => (
      <TableCell className="text-center" key={index}>
        {value ?? "-"}
      </TableCell>
    ));
  };

  return (
    <div className="flex flex-col px-2 border-t border-t-secondary justify-between items-start">
      <Table className="pointer-events-none">
        <TableHeader>
          <TableHead className="px-2 lg:px-4">Team</TableHead>
          {Array.from({ length: 3 }).map((_, index) => (
            <TableHead
              className="capitalize text-center px-2 lg:px-4"
              key={index}
            >
              Q{index + 1}
            </TableHead>
          ))}
          {scores.home.overtime && (
            <TableHead className="text-center px-2 lg:px-4">OT</TableHead>
          )}
          <TableHead className="text-center font-bold px-2 lg:px-4">
            Total
          </TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{getFirstName("home")}</TableCell>
            {renderPeriods(scores.home)}
            {scores.home.overtime && (
              <TableCell className="text-center">
                {scores.home.overtime ?? "-"}
              </TableCell>
            )}
            <TableCell className="text-center font-bold">
              {scores.home.total ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{getFirstName("away")}</TableCell>
            {renderPeriods(scores.away)}
            {scores.away.overtime && (
              <TableCell className="text-center">
                {scores.away.overtime ?? "-"}
              </TableCell>
            )}
            <TableCell className="text-center font-bold">
              {scores.away.total ?? "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default AmericanFixtureScore;
