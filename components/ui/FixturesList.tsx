import { Table as TableProp, flexRender } from "@tanstack/react-table";
import { TableBody, Table, TableRow, TableCell } from "./Shadcn/table";
import { forwardRef } from "react";
import { AllSportsFixtures } from "@/types/general";
import { TableVirtuoso } from "react-virtuoso";

type Props<T extends AllSportsFixtures> = {
  table: TableProp<T>;
};

const FixturesList = <T extends AllSportsFixtures>({ table }: Props<T>) => {
  const { getRowModel } = table;
  const rows = getRowModel().rows;

  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        No fixtures available.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <TableVirtuoso<AllSportsFixtures>
        style={{ height: "100%" }}
        totalCount={rows.length}
        components={{
          Table: ({ style, ...props }) => {
            return <Table {...props} />;
          },
          // eslint-disable-next-line react/display-name
          TableBody: forwardRef(({ style, ...props }, ref) => {
            return <TableBody {...props} ref={ref} />;
          }),
          TableRow: (props) => {
            const index = props["data-index"];
            const row = rows[index];
            return (
              <TableRow
                {...props}
                className="cursor-pointer hover:bg-secondary/80"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    className="p-4"
                    style={{
                      width:
                        cell.column.columnDef.size !== 0
                          ? cell.column.columnDef.size
                          : "auto",
                    }}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          },
        }}
      />
    </div>
  );
};

export default FixturesList;
