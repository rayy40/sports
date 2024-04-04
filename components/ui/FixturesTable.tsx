import { useRef } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Shadcn/table";
import { Fixtures } from "@/lib/types";
import { flexRender, Row, Table as TableProp } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

type Props = {
  table: TableProp<Fixtures>;
  rows: Row<Fixtures>[];
};

const FixturesTable = ({ rows, table }: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 90,
    overscan: 5,
  });

  if (!rows.length) {
    return (
      <div className="w-full h-[calc(100vh-480px)] flex items-center text-primary-foreground/90 justify-center">
        No fixtures available
      </div>
    );
  }

  return (
    <div ref={parentRef} className="h-[calc(100vh-480px)] overflow-y-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <Table>
          <TableHeader className="relative">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="bg-primary border-b-border/40 sticky top-0 left-0 z-50 shadow-sm w-full"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      style={{
                        width:
                          header.column.getSize() !== 0
                            ? header.column.getSize()
                            : undefined,
                      }}
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {flexRender(
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
            {virtualizer.getVirtualItems().map((virtualRow, index) => {
              const row = rows[virtualRow.index] as Row<Fixtures>;
              return (
                <TableRow
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${
                      virtualRow.start - index * virtualRow.size
                    }px)`,
                  }}
                  className="border-none cursor-pointer transition-colors hover:bg-secondary/50 rounded-md"
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell
                        style={{
                          width:
                            cell.column.getSize() !== 0
                              ? cell.column.getSize()
                              : undefined,
                        }}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FixturesTable;
