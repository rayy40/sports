import { PlayerStats } from "@/types/football";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import React from "react";
import { topScoreColumns } from "../Table/topScorersColumns";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "./Shadcn/table";
import { topAssistColumns } from "../Table/topAssistColumns";

type Props = {
  data: PlayerStats[];
  stat: string;
};

const PlayerStats = ({ data, stat }: Props) => {
  const selectColumns = (stat: string) => {
    switch (stat) {
      case "top assists":
        return topAssistColumns;
      default:
        return topScoreColumns;
    }
  };

  const playerStatsTable = useReactTable({
    data: data ?? [],
    columns: selectColumns(stat),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="h-full overflow-y-auto">
      <Table>
        <TableHeader>
          {playerStatsTable?.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className="sticky top-0 z-10 shadow-sm pointer-events-none bg-background"
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="first:w-[100px] [&:nth-child(2)]:min-w-[200px] [&:not(:first-child,:nth-child(2))]:text-center first:pl-9"
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {playerStatsTable?.getRowModel().rows?.map((row) => {
            return (
              <TableRow
                className="cursor-pointer hover:bg-secondary/80"
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PlayerStats;
