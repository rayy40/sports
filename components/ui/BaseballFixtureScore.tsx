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
  console.log(fixture);
  if (!fixture) return;

  const getLastName = (key: "home" | "away") => {
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
              <TableHead className="px-2 lg:px-4" key={inning}>
                {inning}
              </TableHead>
            ))}
          <TableHead className="px-2 lg:px-4">R</TableHead>
          <TableHead className="px-2 lg:px-4">H</TableHead>
          <TableHead className="px-2 lg:px-4">E</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{getLastName("home")}</TableCell>
            {Object.values(fixture.scores.home.innings)
              .filter((_, index) => index < 9)
              .map((value, index) => (
                <TableCell key={index}>{value ?? "-"}</TableCell>
              ))}
            <TableCell>{fixture.scores.home.total ?? "-"}</TableCell>
            <TableCell>{fixture.scores.home.hits ?? "-"}</TableCell>
            <TableCell>{fixture.scores.home.errors ?? "-"}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{getLastName("away")}</TableCell>
            {Object.values(fixture.scores.away.innings)
              .filter((_, index) => index < 9)
              .map((value, index) => (
                <TableCell key={index}>{value ?? "-"}</TableCell>
              ))}
            <TableCell>{fixture.scores.away.total ?? "-"}</TableCell>
            <TableCell>{fixture.scores.away.hits ?? "-"}</TableCell>
            <TableCell>{fixture.scores.away.errors ?? "-"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
