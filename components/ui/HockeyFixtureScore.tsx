import { GamesWithPeriodsAndEvents } from "@/types/general";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Shadcn/table";

export const HockeyFixtureScore = ({
  fixture,
}: {
  fixture?: GamesWithPeriodsAndEvents<number>;
}) => {
  if (!fixture) return;

  const { teams, periods, scores } = fixture;

  const getFirstName = (key: "home" | "away") => {
    return teams[key]?.name?.split(" ")[0] ?? "-";
  };

  const renderPeriods = (teamId: number) => {
    const periodsToShow = Object.values(periods).slice(0, 3);

    return periodsToShow.map((value, index) => (
      <TableCell className="text-center" key={index}>
        {value?.split("-")[teamId] ?? "-"}
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
              P{index + 1}
            </TableHead>
          ))}
          {periods.overtime && (
            <TableHead className="text-center px-2 lg:px-4">OT</TableHead>
          )}
          <TableHead className="text-center font-bold px-2 lg:px-4">
            Total
          </TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{getFirstName("home")}</TableCell>
            {renderPeriods(0)}
            {periods.overtime && (
              <TableCell className="text-center">
                {periods.overtime.split("-")[0] ?? "-"}
              </TableCell>
            )}
            <TableCell className="text-center font-bold">
              {scores.home ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{getFirstName("away")}</TableCell>
            {renderPeriods(1)}
            {periods.overtime && (
              <TableCell className="text-center">
                {periods.overtime.split("-")[1] ?? "-"}
              </TableCell>
            )}
            <TableCell className="text-center font-bold">
              {scores.away ?? "-"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
