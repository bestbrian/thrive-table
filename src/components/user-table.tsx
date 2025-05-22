"use client";

// Add styles for table cells and scrolling behavior
const tableStyles = `
  /* Hide scrollbar for Chrome, Safari and Opera */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  /* Cell container styles */
  .cell-container {
    display: flex;
    align-items: center;
    position: relative;
    cursor: text;
  }
  
  /* Make text selection visible even when it extends beyond the cell */
  .cell-container::selection,
  .cell-container *::selection {
    background-color: rgba(59, 130, 246, 0.3);
  }
  
  /* Ensure the cell content takes full width for proper selection */
  .cell-container > * {
    min-width: 100%;
    overflow: visible;
  }
`;

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Header,
} from "@tanstack/react-table";

import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { User } from "../lib/users";

interface Props {
  data: User[];
  columns: ColumnDef<User>[];
}

export function UserTable({ data, columns }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnOrder, setColumnOrder] = useState(() =>
    columns.map((col) => col.id ?? col.accessorKey!.toString())
  );

  // References for virtualization
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [tableHeight, setTableHeight] = useState(500); // Default height

  // Update table height on mount and resize
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

  // Set up virtualizer
  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 35, // estimated row height
    overscan: 10, // number of items to render before/after visible area
  });

  // Define sensors outside of the render loop to avoid React Hook issues
  const sensors = useSensors(useSensor(PointerSensor));

  // Calculate relative column widths for better alignment
  const columnWidths: Record<string, number> = {};
  
  // Define relative proportions for different column types
  const columnProportions: Record<string, number> = {
    'name': 1.5,
    'email': 2,
    'role': 1.2,
    'status': 1,
    'default': 1.2
  };
  
  // Calculate total proportion
  let totalProportion = 0;
  table.getAllColumns().forEach(column => {
    const proportion = columnProportions[column.id] || columnProportions.default;
    totalProportion += proportion;
  });
  
  // Assign percentage-based widths
  table.getAllColumns().forEach(column => {
    const proportion = columnProportions[column.id] || columnProportions.default;
    const percentWidth = (proportion / totalProportion) * 100;
    columnWidths[column.id] = percentWidth;
  });

  return (
    <div className="rounded-md border border-gray-200 shadow-sm h-full flex flex-col">
      {/* Add the style tag to the DOM */}
      <style dangerouslySetInnerHTML={{ __html: tableStyles }} />
      {/* Main container */}
      <div className="flex flex-col h-full">
        {/* Synchronized scrolling container */}
        <div className="w-full flex flex-col">
          {/* Fixed header */}
          <div className="overflow-x-auto bg-gray-100 border-b border-gray-300">
            <div style={{ display: 'flex', width: '100%' }}>
              {table.getHeaderGroups().map(headerGroup => (
                <DndContext
                  key={headerGroup.id}
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={(event) => {
                    const { active, over } = event;
                    if (active.id !== over?.id) {
                      setColumnOrder((prev) => {
                        const oldIndex = prev.indexOf(active.id as string);
                        const newIndex = prev.indexOf(over?.id as string);
                        return arrayMove(prev, oldIndex, newIndex);
                      });
                    }
                  }}
                >
                  <SortableContext
                    items={headerGroup.headers.map((h) => h.column.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    <div style={{ display: 'flex', width: '100%' }}>
                      {headerGroup.headers.map(header => (
                        <SortableHeaderCell 
                          key={header.id} 
                          header={header} 
                          width={columnWidths[header.column.id]}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ))}
            </div>
          </div>

          {/* Virtualized rows */}
          <div
            ref={tableContainerRef}
            className="overflow-auto flex-grow"
            style={{ height: `${tableHeight}px` }}
            onScroll={(e) => {
              // Synchronize horizontal scrolling
              const target = e.target as HTMLDivElement;
              const headerContainer = target.previousElementSibling as HTMLDivElement;
              if (headerContainer) {
                headerContainer.scrollLeft = target.scrollLeft;
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
                  <div
                    key={row.id}
                    className="absolute hover:bg-gray-50 w-full flex"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <div
                        key={cell.id}
                        className="py-2 px-4 whitespace-nowrap hide-scrollbar cell-container"
                        style={{ 
                          width: `${columnWidths[cell.column.id]}%`,
                          overflow: 'hidden',  /* Default to hidden */
                          msOverflowStyle: 'none', /* Hide scrollbar in IE and Edge */
                          scrollbarWidth: 'none', /* Hide scrollbar in Firefox */
                          WebkitOverflowScrolling: 'touch' /* Smooth scrolling on iOS */
                        }}
                        onMouseEnter={(e) => {
                          // Show scrollbar on hover
                          e.currentTarget.style.overflowX = 'auto';
                        }}
                        onMouseLeave={(e) => {
                          // Hide scrollbar when not hovering and remove selecting state
                          e.currentTarget.style.overflowX = 'hidden';
                          e.currentTarget.removeAttribute('data-selecting');
                        }}
                        onMouseDown={(e) => {
                          // Set a data attribute to track that mouse is down in this cell
                          e.currentTarget.setAttribute('data-selecting', 'true');
                        }}
                        onMouseUp={(e) => {
                          // Remove the data attribute when mouse is released
                          e.currentTarget.removeAttribute('data-selecting');
                        }}
                        onMouseMove={(e) => {
                          // Get cell element
                          const cell = e.currentTarget;
                          
                          // Only scroll if we're actively selecting (mouse button is down)
                          if (cell.getAttribute('data-selecting') !== 'true') {
                            return;
                          }
                          
                          // Get mouse position relative to cell
                          const mouseX = e.clientX - cell.getBoundingClientRect().left;
                          // Get cell width
                          const cellWidth = cell.offsetWidth;
                          // Calculate scroll position based on mouse position
                          if (mouseX > cellWidth * 0.7 && cell.scrollWidth > cell.offsetWidth) {
                            // If mouse is in the right 30% of visible area and content is scrollable
                            // Scroll right gradually
                            cell.scrollLeft += 5;
                          } else if (mouseX < cellWidth * 0.3 && cell.scrollLeft > 0) {
                            // If mouse is in the left 30% of visible area and scrolled
                            // Scroll left gradually
                            cell.scrollLeft -= 5;
                          }
                        }}
                        onFocus={(e) => {
                          // Show scrollbar on focus (for keyboard navigation)
                          e.currentTarget.style.overflowX = 'auto';
                        }}
                        onBlur={(e) => {
                          // Hide scrollbar when not focused
                          e.currentTarget.style.overflowX = 'hidden';
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SortableHeaderCellProps {
  header: Header<User, unknown>;
  width: number;
}

function SortableHeaderCell({ header, width }: SortableHeaderCellProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: header.column.id,
    });

  const sortableStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: `${width}%`,
  };

  return (
    <div
      ref={setNodeRef}
      style={sortableStyles}
      className="px-4 py-2 font-semibold select-none bg-gray-100 border-r border-gray-200 flex items-center"
    >
      <div className="flex items-center gap-1 flex-grow">
        {/* Sorting area (clickable) */}
        <div
          onClick={header.column.getToggleSortingHandler()}
          className="flex items-center gap-1 cursor-pointer"
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          <span className="ml-1">
            {header.column.getIsSorted() === "asc" ? (
              <ArrowUp size={14} />
            ) : header.column.getIsSorted() === "desc" ? (
              <ArrowDown size={14} />
            ) : (
              <ArrowUpDown size={14} className="text-gray-400" />
            )}
          </span>
        </div>

        {/* Drag handle (separate from click) */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab pl-2 text-gray-400 ml-auto"
          title="Drag to reorder"
        >
          ::
        </div>
      </div>
    </div>
  );
}
