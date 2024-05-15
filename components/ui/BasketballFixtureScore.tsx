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

  const getFirstName = (key: "home" | "away") => {
    return fixture?.teams[key].name.split(" ")[0];
  };
  return (
    <div className="flex flex-col px-2 border-t border-t-secondary justify-between items-start">
      <Table className="pointer-events-none">
        <TableHeader>
          <TableHead className="px-2 lg:px-4">Team</TableHead>
          {Object.keys(fixture.scores.home)
            .filter((_, index) => index < 4)
            .map((quarter) => (
              <TableHead
                className="capitalize text-center px-2 lg:px-4"
                key={quarter}
              >
                {quarter.split("")[0] + quarter.split("_")[1]}
              </TableHead>
            ))}
          <TableHead className="text-center font-bold px-2 lg:px-4">
            Total
          </TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{getFirstName("home")}</TableCell>
            {Object.values(fixture.scores.home)
              .filter((_, index) => index < 4)
              .map((value, index) => (
                <TableCell className="text-center" key={index}>
                  {value ?? "-"}
                </TableCell>
              ))}
            <TableCell className="font-bold text-center">
              {fixture.scores.home.total ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{getFirstName("away")}</TableCell>
            {Object.values(fixture.scores.away)
              .filter((_, index) => index < 4)
              .map((value, index) => (
                <TableCell className="text-center" key={index}>
                  {value ?? "-"}
                </TableCell>
              ))}
            <TableCell className="font-bold text-center">
              {fixture.scores.away.total ?? "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
