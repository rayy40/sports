import { Games } from "@/types/general";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Shadcn/table";
import { BasketballScores } from "@/types/basketball";

export const BasketballFixtureScore = ({
  fixture,
}: {
  fixture?: Games<BasketballScores>;
}) => {
  if (!fixture) return;

  const { teams, scores } = fixture;

  const getFirstName = (key: "home" | "away") => {
    return teams[key]?.name?.split(" ")[0] ?? "";
  };

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
    <div className="flex flex-col px-2 border-t border-t-secondary justify-between items-start">
      <Table className="pointer-events-none">
        <TableHeader>
          <TableHead className="px-2 lg:px-4">Team</TableHead>
          {Array.from({ length: 4 }).map((_, index) => (
            <TableHead
              className="capitalize text-center px-2 lg:px-4"
              key={index}
            >
              Q{index + 1}
            </TableHead>
          ))}
          <TableHead className="text-center font-bold px-2 lg:px-4">
            Total
          </TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{getFirstName("home")}</TableCell>
            {renderQuarters(scores.home)}
            <TableCell className="font-bold text-center">
              {scores.home.total ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{getFirstName("away")}</TableCell>
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
