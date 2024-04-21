import React from "react";
import { NBAStandings } from "@/types/basketball";
import {
  AllSportsStandings,
  Sports,
  Standings as TStandings,
} from "@/types/general";
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
  return data && "position" in data?.[0];
}

function isAFLStandingsResponse(
  data: any
): data is AustralianFootballStandings[] {
  return data && "last_5" in data?.[0];
}

type Props = {
  standing: (
    | TStandings[]
    | NBAStandings
    | StandingsReponse
    | AustralianFootballStandings
  )[];
  sport: Sports;
};

type STableProps = {
  standing: AllSportsStandings[];
  sport: Sports;
  isAdditionalFootballColumnVisible: boolean;
  isAdditionalNonFootballColumnVisible: boolean;
  isAdditionalAFLColumnVisible?: boolean;
  isAdditionalNBAColumnVisible?: boolean;
};
const STable = ({
  standing,
  sport,
  isAdditionalFootballColumnVisible,
  isAdditionalNonFootballColumnVisible,
  isAdditionalAFLColumnVisible = false,
  isAdditionalNBAColumnVisible = false,
}: STableProps) => {
  const standingsTable = useReactTable({
    data: standing ?? [],
    columns: standingsColumns<AllSportsStandings>(sport),
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility: {
        goalsFor: isAdditionalFootballColumnVisible,
        goalsAgainst: isAdditionalFootballColumnVisible,
        goalsDiff: isAdditionalFootballColumnVisible,
        drawn:
          isAdditionalFootballColumnVisible || isAdditionalAFLColumnVisible,
        winPercentage:
          isAdditionalNonFootballColumnVisible && !isAdditionalAFLColumnVisible,
        lostPercentage:
          isAdditionalNonFootballColumnVisible && !isAdditionalAFLColumnVisible,
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
  )[],
  sport: Sports
) => {
  if ("conference" in data?.[0]) {
    const standingsData = groupStandingsByProperty<NBAStandings>(
      data as NBAStandings[],
      (t) => t.division.name
    );
    return Object.keys(standingsData).map((key, index) => (
      <div key={index}>
        <p className="capitalize font-medium text-[1.125rem] p-6 pl-9 border-b">
          {key}
        </p>
        <STable
          sport={sport}
          standing={standingsData[key]}
          isAdditionalFootballColumnVisible={false}
          isAdditionalNonFootballColumnVisible={true}
          isAdditionalNBAColumnVisible={true}
        />
      </div>
    ));
  } else if (isAFLStandingsResponse(data)) {
    return (
      <STable
        sport={sport}
        standing={data}
        isAdditionalFootballColumnVisible={false}
        isAdditionalNonFootballColumnVisible={true}
        isAdditionalAFLColumnVisible={true}
      />
    );
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
                sport={sport}
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
            sport={sport}
            standing={standingsData[key]}
            isAdditionalFootballColumnVisible={false}
            isAdditionalNonFootballColumnVisible={true}
          />
        </div>
      ));
    }
  });
};

const Standings = ({ standing, sport }: Props) => {
  return (
    <div className="h-full overflow-y-auto">
      {renderStandingsByLeague(standing, sport)}
    </div>
  );
};

export default Standings;
