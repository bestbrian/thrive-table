"use client";

import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  AccessorKeyColumnDef,
} from "@tanstack/react-table";

import { useVirtualizer } from '@tanstack/react-virtual';
import { useState, useRef, useEffect, useMemo } from "react";
import { User } from "../lib/users";

import { 
  TableHeader, 
  TableRow, 
  useColumnSizing,
  ColumnSizeConfig 
} from "./table";

interface Props {
  data: User[];
  columns: ColumnDef<User>[];
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export function UserTable({ data, columns: initialColumns }: Props) {
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
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState(() =>
    columns.map((col) => {
      if (col.id) return col.id;
      
      if ('accessorKey' in col) {
        const typedCol = col as AccessorKeyColumnDef<User, string>;
        if (typeof typedCol.accessorKey === 'string') {
          return typedCol.accessorKey;
        }
      }
      
      return `col-${Math.random().toString(36).substring(2, 9)}`;
    })
  );
  
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [tableHeight, setTableHeight] = useState(500);
  const [isScrolled, setIsScrolled] = useState(false); 

  useEffect(() => {
    const updateTableHeight = () => {
      if (tableContainerRef.current) {
        setTableHeight(tableContainerRef.current.offsetHeight || 500);
      }
    };

    updateTableHeight();
    window.addEventListener('resize', updateTableHeight);
    return () => window.removeEventListener('resize', updateTableHeight);
  }, []);

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
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 56,
    overscan: 10, 
  });

  const columnSizeConfig: ColumnSizeConfig = {
    columnProportions: {
      'sm': 1,     
      'md': 1.5,     
      'lg': 3,     
      'xl': 4,     
      'default': 2 
    },
    columnSizeMap: {
      'dsr': 'sm',
      'firstName': 'md',
      'lastName': 'md',
      'city': 'md',
      'fullName': 'md',
      'registeredDate': 'md',
      'id': 'md'
    }
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
            onScroll={(e) => {
              const target = e.target as HTMLDivElement;
              const headerContainer = target.previousElementSibling as HTMLDivElement;
              if (headerContainer) {
                headerContainer.scrollLeft = target.scrollLeft;
              }
              
              if (target.scrollTop > 10 && !isScrolled) {
                setIsScrolled(true);
              } else if (target.scrollTop <= 10 && isScrolled) {
                setIsScrolled(false);
              }
            }}
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
