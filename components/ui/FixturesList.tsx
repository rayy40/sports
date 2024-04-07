import { Fixtures } from "@/lib/types";
import { Row, Table as TableProp, flexRender } from "@tanstack/react-table";
import { TableBody, Table, TableRow, TableCell } from "./Shadcn/table";
import Link from "next/link";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

type Props = {
  table: TableProp<Fixtures>;
  rows: Row<Fixtures>[];
};

const FixturesList = ({ table, rows }: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72.5,
    overscan: 5,
  });

  if (!rows.length) {
    return (
      <div className="w-full h-full text-[1rem] flex items-center text-primary-foreground/90 justify-center">
        No fixtures available
      </div>
    );
  }

  return (
    <div ref={parentRef} className="overflow-y-auto h-[calc(100vh-150px)]">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <Table>
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
                  className="hover:bg-secondary/80 cursor-pointer"
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
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
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FixturesList;
