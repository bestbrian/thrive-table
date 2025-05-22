"use client";

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
} from "@tanstack/react-table";

import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
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

  return (
    <div className="overflow-auto rounded-md border border-gray-200 shadow-sm">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <DndContext
              key={headerGroup.id}
              sensors={useSensors(useSensor(PointerSensor))}
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
                <tr>
                  {headerGroup.headers.map((header) => (
                    <SortableHeader key={header.id} header={header} />
                  ))}
                </tr>
              </SortableContext>
            </DndContext>
          ))}
        </thead>

        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SortableHeader({ header }: { header: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: header.column.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className="px-4 py-2 font-semibold select-none bg-gray-100"
    >
      <div className="flex items-center gap-1">
        {/* Sorting area (clickable) */}
        <div
          onClick={header.column.getToggleSortingHandler()}
          className="flex items-center gap-1 cursor-pointer"
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          <span className="ml-1">
            {header.column.getIsSorted() === "asc" ? (
              <ArrowUp size={16} />
            ) : header.column.getIsSorted() === "desc" ? (
              <ArrowDown size={16} />
            ) : (
              <ArrowUpDown size={16} className="text-gray-400" />
            )}
          </span>
        </div>

        {/* Drag handle (separate from click) */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab pl-2 text-gray-400"
          title="Drag to reorder"
        >
          ::
        </div>
      </div>
    </th>
  );
}
