import React from "react";
import { NBAStandings } from "@/types/basketball";
import { AllSportsStandings, Standings as TStandings } from "@/types/general";
import { StandingsReponse } from "@/types/football";
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
import { AustralianFootballStandings } from "@/types/australian-football";

function isStandingsResponse(data: any): data is StandingsReponse {
  return data && data.league && Array.isArray(data.league.standings);
}

function isOtherSportStandingsResponse(data: any): data is TStandings[] {
  return data && data?.[0]?.position;
}

type Props = {
  standing: (
    | TStandings[]
    | NBAStandings
    | StandingsReponse
    | AustralianFootballStandings
  )[];
};

type STableProps = {
  standing: AllSportsStandings[];
  isAdditionalFootballColumnVisible: boolean;
  isAdditionalNonFootballColumnVisible: boolean;
  isAdditionalNBAColumnVisible?: boolean;
};

const Standings = ({ standing }: Props) => {
  const STable = ({
    standing,
    isAdditionalFootballColumnVisible,
    isAdditionalNonFootballColumnVisible,
    isAdditionalNBAColumnVisible = false,
  }: STableProps) => {
    const standingsTable = useReactTable({
      data: standing ?? [],
      columns: standingsColumns<AllSportsStandings>(),
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

  const renderStandingsByLeague = (
    data: (
      | TStandings[]
      | StandingsReponse
      | NBAStandings
      | AustralianFootballStandings
    )[]
  ) => {
    console.log(data);
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
      } else if (isOtherSportStandingsResponse(d)) {
        const standingsData = groupStandingsByProperty<TStandings>(
          d as TStandings[],
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
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      {renderStandingsByLeague(standing)}
    </div>
  );
};

export default Standings;
