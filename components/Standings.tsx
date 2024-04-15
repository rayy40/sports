import React from "react";
import {
  Standings as BasketballStandings,
  NBAGames,
  NBAStandings,
} from "@/types/basketball";
import { StandingsEntity, StandingsReponse } from "@/types/football";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { standingsColumns } from "@/components/Table/standingsColumns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/Shadcn/table";
import { groupStandingsByProperty } from "@/lib/utils";

function isStandingsResponse(data: any): data is StandingsReponse {
  return data && data.league && Array.isArray(data.league.standings);
}

type Props<T extends BasketballStandings | StandingsReponse | NBAStandings> = {
  standing: T[];
};

type STableProps<
  T extends BasketballStandings | StandingsEntity | NBAStandings
> = {
  standing: T[];
  isAdditionalFootballColumnVisible: boolean;
  isAdditionalNonFootballColumnVisible: boolean;
  isAdditionalNBAColumnVisible?: boolean;
};

const Standings = <
  T extends BasketballStandings | StandingsReponse | NBAStandings
>({
  standing,
}: Props<T>) => {
  if (!standing) {
    return <div>No Standings found.</div>;
  }

  const STable = <
    T extends BasketballStandings | StandingsEntity | NBAStandings
  >({
    standing,
    isAdditionalFootballColumnVisible,
    isAdditionalNonFootballColumnVisible,
    isAdditionalNBAColumnVisible = false,
  }: STableProps<T>) => {
    const standingsTable = useReactTable({
      data: standing ?? [],
      columns: standingsColumns<T>(),
      getCoreRowModel: getCoreRowModel(),
      state: {
        columnVisibility: {
          goalsFor: isAdditionalFootballColumnVisible,
          goalsAgainst: isAdditionalFootballColumnVisible,
          goalsDiff: isAdditionalFootballColumnVisible,
          drawn: isAdditionalFootballColumnVisible,
          winPercentage: isAdditionalNonFootballColumnVisible,
          lostPercentage: isAdditionalNonFootballColumnVisible,
          streak: isAdditionalNBAColumnVisible,
          gamesBehind: isAdditionalNBAColumnVisible,
          lastTenWin: isAdditionalNBAColumnVisible,
          lastTenLoss: isAdditionalNBAColumnVisible,
          played: !isAdditionalNBAColumnVisible,
          points: !isAdditionalNBAColumnVisible,
          form: !isAdditionalNBAColumnVisible,
        },
      },
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

  const renderStandingsByLeague = (data: T[]) => {
    if ("conference" in data?.[0]) {
      const standingsData = groupStandingsByProperty<NBAStandings>(
        data as NBAStandings[],
        (t) => t.conference.name
      );
      return Object.keys(standingsData).map((key, index) => (
        <div key={index}>
          <p className="capitalize font-medium text-[1.125rem] p-6 pl-9 border-b">
            {key}
          </p>
          <STable
            standing={standingsData[key]}
            isAdditionalFootballColumnVisible={false}
            isAdditionalNonFootballColumnVisible={true}
            isAdditionalNBAColumnVisible={true}
          />
        </div>
      ));
    }
    if ("position" in data?.[0]) {
      const standingsData = groupStandingsByProperty(
        data as BasketballStandings[],
        (t) => t.group.name
      );
      return Object.keys(standingsData).map((key, index) => (
        <div key={index}>
          <p className="capitalize font-medium text-[1.125rem] p-6 pl-9 border-b">
            {key}
          </p>
          <STable
            standing={standingsData[key]}
            isAdditionalFootballColumnVisible={false}
            isAdditionalNonFootballColumnVisible={true}
          />
        </div>
      ));
    }
    return data.map((d, index) => {
      if (isStandingsResponse(d)) {
        return (
          <div key={d.league.id}>
            {data.length > 1 && (
              <p className="capitalize font-medium text-[1.125rem] p-6 pl-9 border-b">
                {d.league.name}
              </p>
            )}
            {d.league.standings?.filter(Boolean).map((standing, index) => (
              <div key={index}>
                <p className="capitalize font-medium text-[1.125rem] p-6 pl-9 border-b">
                  {standing?.[0].group}
                </p>
                <STable
                  standing={standing!}
                  isAdditionalFootballColumnVisible={true}
                  isAdditionalNonFootballColumnVisible={false}
                />
              </div>
            ))}
          </div>
        );
      }
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      {renderStandingsByLeague(standing)}
    </div>
  );
};

export default Standings;
