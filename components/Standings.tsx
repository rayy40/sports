import { StandingsEntity, StandingsReponse } from "@/lib/types";
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
  data?: StandingsReponse[] | null;
};

const STable = ({ standing }: { standing: StandingsEntity[] }) => {
  const standingsTable = useReactTable({
    data: standing ?? [],
    columns: standingsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table className="border-b">
      <TableHeader>
        {standingsTable?.getHeaderGroups().map((headerGroup) => (
          <TableRow
            className="sticky top-0 z-10 shadow-sm pointer-events-none bg-background"
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
  );
};

const Standings = ({ data }: Props) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p>No Standings found.</p>
      </div>
    );
  }

  return (
    <div className="h-full space-y-4 overflow-y-auto">
      {data?.length > 1 ? (
        data?.map((d) => (
          <div key={d.league.id}>
            <p className="font-medium text-[1.125rem] p-6 pl-9 border-b">
              {d.league.name}
            </p>
            {d.league.standings?.[0] ? (
              <STable standing={d.league.standings?.[0]} />
            ) : (
              <p>No standings found.</p>
            )}
          </div>
        ))
      ) : (
        <div key={data?.[0]?.league.id}>
          <p className="font-medium text-[1.125rem] p-6 pl-9 border-b">
            {data?.[0]?.league.name}
          </p>
          {data?.[0]?.league.standings?.[0] ? (
            <STable standing={data?.[0]?.league.standings?.[0]} />
          ) : (
            <p>No standings found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Standings;
