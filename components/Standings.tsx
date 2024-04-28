import React from "react";
import { NBAStandings } from "@/types/basketball";
import {
  AllSportsStandings,
  Sports,
  Standings as TStandings,
  WithoutStandingEntity,
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
import { NFLStandings } from "@/types/american-football";

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

function isNFLStandingsResponse(data: any): data is NFLStandings[] {
  return data && "ncaa_conference" in data?.[0];
}

function isNBAStandingsResponse(data: any): data is NBAStandings[] {
  return data && "tieBreakerPoints" in data?.[0];
}

type Props = {
  standing: (WithoutStandingEntity | TStandings[])[];
  sport: Sports;
};

type STableProps = {
  standing: AllSportsStandings[];
  sport: Sports;
  isAdditionalFootballColumnVisible?: boolean;
  isAdditionalNonFootballColumnVisible?: boolean;
  isAdditionalNFLColumnVisible?: boolean;
  isAdditionalAFLColumnVisible?: boolean;
  isAdditionalNBAColumnVisible?: boolean;
};
const STable = ({
  standing,
  sport,
  isAdditionalFootballColumnVisible = false,
  isAdditionalNonFootballColumnVisible = false,
  isAdditionalAFLColumnVisible = false,
  isAdditionalNFLColumnVisible = false,
  isAdditionalNBAColumnVisible = false,
}: STableProps) => {
  const standingsTable = useReactTable({
    defaultColumn: {
      minSize: 0,
    },
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
          isAdditionalNonFootballColumnVisible &&
          !isAdditionalAFLColumnVisible &&
          !isAdditionalNFLColumnVisible,
        lostPercentage:
          isAdditionalNonFootballColumnVisible &&
          !isAdditionalAFLColumnVisible &&
          !isAdditionalNFLColumnVisible,
        streak: isAdditionalNBAColumnVisible || isAdditionalNFLColumnVisible,
        gamesBehind: isAdditionalNBAColumnVisible,
        lastTenWin: isAdditionalNBAColumnVisible,
        lastTenLoss: isAdditionalNBAColumnVisible,
        played: !isAdditionalNBAColumnVisible && !isAdditionalNFLColumnVisible,
        points: !isAdditionalNBAColumnVisible,
        pointsDiff: isAdditionalNFLColumnVisible,
        homeRecords: isAdditionalNFLColumnVisible,
        roadRecords: isAdditionalNFLColumnVisible,
        form: !isAdditionalNBAColumnVisible && !isAdditionalNFLColumnVisible,
      },
    },
  });

  return (
    <Table className="border-b overflow-x-auto w-full">
      <TableHeader>
        {standingsTable?.getHeaderGroups().map((headerGroup) => (
          <TableRow
            className="sticky top-0 z-10 shadow-sm pointer-events-none bg-background"
            key={headerGroup.id}
          >
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  className="first:sticky [&:nth-child(2)]:sticky first:left-0
                  [&:nth-child(2)]:left-[70px] bg-background first:w-[40px] [&:nth-child(2)]:-ml-2 lg:first:w-[100px] [&:not(:first-child,:nth-child(2))]:text-center first:pl-6 lg:first:pl-9"
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
                <TableCell
                  className="first:sticky [&:nth-child(2)]:sticky first:left-0
                [&:nth-child(2)]:left-[70px] bg-background"
                  style={{
                    minWidth:
                      cell.column.columnDef.minSize !== 0
                        ? cell.column.columnDef.minSize
                        : "auto",
                  }}
                  key={cell.id}
                >
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
  data: (WithoutStandingEntity | TStandings[])[],
  sport: Sports
) => {
  if (isNBAStandingsResponse(data)) {
    const standingsData = groupStandingsByProperty<NBAStandings>(
      data,
      (t) => t.division.name
    );
    return Object.keys(standingsData).map((key, index) => (
      <div key={index}>
        <p className="capitalize font-medium text-sm lg:text-[1.125rem] p-3 py-5 lg:p-6 pl-6 lg:pl-9 border-b">
          {key}
        </p>
        <STable
          sport={sport}
          standing={standingsData[key]}
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
        isAdditionalNonFootballColumnVisible={true}
        isAdditionalAFLColumnVisible={true}
      />
    );
  } else if (isNFLStandingsResponse(data)) {
    const standingsData = groupStandingsByProperty<NFLStandings>(
      data,
      (t) => t.division
    );
    return Object.keys(standingsData).map((key, index) => (
      <div key={index}>
        <p className="capitalize font-medium text-sm lg:text-[1.125rem] p-3 py-5 lg:p-6 pl-6 lg:pl-9 border-b">
          {key}
        </p>
        <STable
          sport={sport}
          standing={standingsData[key]}
          isAdditionalNonFootballColumnVisible={true}
          isAdditionalNFLColumnVisible={true}
        />
      </div>
    ));
  }
  return data.map((d, index) => {
    if (isStandingsResponse(d)) {
      return (
        <div key={d.league.id}>
          {data.length > 1 && (
            <p className="capitalize font-medium text-sm lg:text-[1.125rem] p-3 py-5 lg:p-6 pl-6 lg:pl-9 border-b">
              {d.league.name}
            </p>
          )}
          {d.league.standings?.filter(Boolean).map((standing, index) => (
            <div key={index}>
              <p className="capitalize font-medium text-sm lg:text-[1.125rem] p-3 py-5 lg:p-6 pl-6 lg:pl-9 border-b">
                {standing?.[0].group}
              </p>
              <STable
                sport={sport}
                standing={standing!}
                isAdditionalFootballColumnVisible={true}
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
          <p className="capitalize font-medium text-sm lg:text-[1.125rem] p-3 py-5 lg:p-6 pl-6 lg:pl-9 border-b">
            {key}
          </p>
          <STable
            sport={sport}
            standing={standingsData[key]}
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
