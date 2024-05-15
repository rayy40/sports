import { BaseballScores } from "@/types/baseball";
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

export const BaseballFixtureScore = ({
  fixture,
}: {
  fixture?: Games<BaseballScores>;
}) => {
  if (!fixture) return;

  const getFirstName = (key: "home" | "away") => {
    return fixture?.teams[key].name.split(" ")[0];
  };
  return (
    <div className="flex flex-col px-2 border-t border-t-secondary justify-between items-start">
      <Table className="pointer-events-none">
        <TableHeader>
          <TableHead className="px-2 lg:px-4">Team</TableHead>
          {Object.keys(fixture.scores.home.innings)
            .filter((_, index) => index < 9)
            .map((inning) => (
              <TableHead className="text-center px-2 lg:px-4" key={inning}>
                {inning}
              </TableHead>
            ))}
          <TableHead className="text-center font-bold px-2 lg:px-4">
            R
          </TableHead>
          <TableHead className="text-center font-bold px-2 lg:px-4">
            H
          </TableHead>
          <TableHead className="text-center font-bold px-2 lg:px-4">
            E
          </TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{getFirstName("home")}</TableCell>
            {Object.values(fixture.scores.home.innings)
              .filter((_, index) => index < 9)
              .map((value, index) => (
                <TableCell className="text-center" key={index}>
                  {value ?? "-"}
                </TableCell>
              ))}
            <TableCell className="text-center font-bold">
              {fixture.scores.home.total ?? "-"}
            </TableCell>
            <TableCell className="text-center font-bold">
              {fixture.scores.home.hits ?? "-"}
            </TableCell>
            <TableCell className="text-center font-bold">
              {fixture.scores.home.errors ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{getFirstName("away")}</TableCell>
            {Object.values(fixture.scores.away.innings)
              .filter((_, index) => index < 9)
              .map((value, index) => (
                <TableCell className="text-center" key={index}>
                  {value ?? "-"}
                </TableCell>
              ))}
            <TableCell className="text-center font-bold">
              {fixture.scores.away.total ?? "-"}
            </TableCell>
            <TableCell className="text-center font-bold">
              {fixture.scores.away.hits ?? "-"}
            </TableCell>
            <TableCell className="text-center font-bold">
              {fixture.scores.away.errors ?? "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
