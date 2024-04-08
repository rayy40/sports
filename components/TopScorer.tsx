import { PlayerStats } from "@/lib/types";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import React from "react";
import { topScoreColumns } from "./Table/topScorersColumns";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from "./ui/Shadcn/table";

const TopScorer = ({ data }: { data: PlayerStats[] | null | undefined }) => {
  const topScorerTable = useReactTable({
    data: data ?? [],
    columns: topScoreColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {topScorerTable?.getHeaderGroups().map((headerGroup) => (
          <TableRow
            className="sticky top-[142.25px] shadow-sm pointer-events-none bg-background z-10"
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
        {topScorerTable?.getRowModel().rows?.map((row) => {
          return (
            <TableRow
              className="hover:bg-secondary/80 cursor-pointer"
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
  );
};

export default TopScorer;
