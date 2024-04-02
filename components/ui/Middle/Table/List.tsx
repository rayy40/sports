import { Fixtures } from "@/lib/types";
import { Row, flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Table, TableCell, TableRow, TableBody } from "../../table";
import { useRef } from "react";

type Props = {
  fixtures: Fixtures[];
  rows: Row<Fixtures>[];
};

const List = ({ fixtures, rows }: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 90,
    overscan: 5,
  });

  if (!fixtures.length) {
    return (
      <div className="w-full h-full flex items-center text-primary-foreground/90 justify-center">
        No fixtures available
      </div>
    );
  }

  return (
    <div ref={parentRef} className="h-[calc(100vh-480px)] overflow-y-auto">
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
                  className="border-none cursor-pointer transition-colors hover:bg-secondary/40 rounded-md"
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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

export default List;
