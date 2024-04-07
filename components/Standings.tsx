import { StandingsEntity } from "@/lib/types";
import React from "react";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  Table,
  TableCell,
} from "./ui/Shadcn/table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { standingsColumns } from "./Table/standingsColumns";

type Props = {
  data: {
    [groupName: string]: StandingsEntity[];
  };
};

const STable = ({ standing }: { standing: StandingsEntity[] }) => {
  const standingsTable = useReactTable({
    data: standing ?? [],
    columns: standingsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {standingsTable?.getHeaderGroups().map((headerGroup) => (
          <TableRow
            className="sticky top-[142.25px] shadow-sm pointer-events-none bg-background z-10"
            key={headerGroup.id}
          >
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  className="first:w-[100px] [&:not(:first-child,:nth-child(2))]:text-center first:pl-9"
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
        {standingsTable?.getRowModel().rows?.map((row) => {
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

const Standings = ({ data }: Props) => {
  return (
    <div className="space-y-4">
      {Object.keys(data).map((d, i) => (
        <div key={i}>
          <p className="font-medium text-[1.125rem] p-6 pl-9 border-b">{d}</p>
          <STable standing={data[d]} />
        </div>
      ))}
    </div>
  );
};

export default Standings;
