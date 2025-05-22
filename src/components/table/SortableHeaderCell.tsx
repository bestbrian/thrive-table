import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Header, flexRender } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { User } from "../../lib/users";

interface SortableHeaderCellProps {
  header: Header<User, unknown>;
  width: number;
}

export function SortableHeaderCell({ header, width }: SortableHeaderCellProps) {
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
      className="font-semibold select-none flex items-center header-cell transition-colors duration-150 group font-jakarta text-white hover:bg-[#f7cee3] hover:text-[#674263]"
    >
      <div className="flex items-center gap-1 flex-grow">
        <div
          onClick={header.column.getToggleSortingHandler()}
          className="flex items-center gap-1 cursor-pointer px-4 py-2 w-full"
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          <span className="ml-1">
            {header.column.getIsSorted() === "asc" ? (
              <ArrowUp size={12} className="group-hover:text-[#674263]" />
            ) : header.column.getIsSorted() === "desc" ? (
              <ArrowDown size={12} className="group-hover:text-[#674263]" />
            ) : (
              <ArrowUpDown size={12} className="text-white/70 group-hover:text-[#674263]/70" />
            )}
          </span>
        </div>

        <div
          {...attributes}
          {...listeners}
          className="cursor-grab pl-2 pr-4 text-white/70 ml-auto group-hover:text-[#674263]/70"
          title="Drag to reorder"
        >
          ::
        </div>
      </div>
    </div>
  );
}
