"use client";

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useMemo } from "react";
import { User } from "../types/user";
import { TableProps } from "../types/table";

import { useTableSorting } from "../hooks/use-table-sorting";
import { useColumnReordering } from "../hooks/use-column-reordering";
import { useTableVirtualization } from "../hooks/use-table-virtualization";
import { useColumnSizing } from "../hooks/use-column-sizing";

import { formatDate } from "../utils/date";
import { TABLE } from "../utils/constants";

import { 
  TableHeader, 
  TableRow 
} from "./table";

export function UserTable({ data, columns: initialColumns }: TableProps<User>) {
  const columns = useMemo(() => {
    return initialColumns.map(column => {
      if ('accessorKey' in column && column.accessorKey === 'registeredDate') {
        return {
          ...column,
          cell: (info: { getValue: () => unknown }) => {
            const dateValue = info.getValue() as string;
            return formatDate(dateValue);
          }
        };
      }
      return column;
    });
  }, [initialColumns]);
  
  const { sorting, setSorting } = useTableSorting();
  const { columnOrder, setColumnOrder } = useColumnReordering<User>(columns);
  const { 
    tableContainerRef, 
    tableHeight, 
    rowVirtualizer, 
    isScrolled, 
    handleScroll 
  } = useTableVirtualization<User>(data, {
    rowHeight: TABLE.ROW_HEIGHT,
    overscan: TABLE.OVERSCAN
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnOrder,
    },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();
  
  const columnSizeConfig = {
    columnProportions: TABLE.COLUMN_SIZES,
    columnSizeMap: TABLE.COLUMN_SIZE_MAP
  };
  
  const columnWidths = useColumnSizing(table, columnSizeConfig);

  return (
    <div className="rounded-md h-full flex flex-col font-jakarta relative">
      <div className="flex flex-col h-full">
        <div className="w-full flex flex-col">
          <TableHeader 
            headerGroups={table.getHeaderGroups()} 
            columnWidths={columnWidths} 
            setColumnOrder={setColumnOrder} 
          />

          <div
            ref={tableContainerRef}
            className="overflow-auto flex-grow relative"
            style={{ height: `${tableHeight}px` }}
            onScroll={handleScroll}
          >
            <div 
              style={{ 
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative'
              }}
            >
              {rowVirtualizer.getVirtualItems().map(virtualRow => {
                const row = rows[virtualRow.index];
                return (
                  <TableRow
                    key={row.id}
                    row={row}
                    columnWidths={columnWidths}
                    virtualRowSize={virtualRow.size}
                    virtualRowStart={virtualRow.start}
                  />
                );
              })}
            </div>
          
            <div className="py-6 text-center text-gray-500 font-medium font-jakarta">
              All done!
            </div>
          </div>
          
          <div 
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none transition-opacity duration-300 z-10"
            style={{ 
              background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,1) 100%)',
              opacity: isScrolled ? 0 : 1
            }}
          />
        </div>
      </div>
    </div>
  );
}
