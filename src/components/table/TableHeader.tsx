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
  arrayMove,
} from "@dnd-kit/sortable";
import { HeaderGroup } from "@tanstack/react-table";
import { User } from "../../lib/users";
import { SortableHeaderCell } from "./SortableHeaderCell";

interface TableHeaderProps {
  headerGroups: HeaderGroup<User>[];
  columnWidths: Record<string, number>;
  setColumnOrder: (updater: (old: string[]) => string[]) => void;
}

export function TableHeader({ headerGroups, columnWidths, setColumnOrder }: TableHeaderProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div className="overflow-x-auto">
      <div className="mx-2 mt-2 mb-4 bg-[#674263] rounded-lg overflow-hidden" style={{ display: 'flex', width: 'calc(100% - 16px)' }}>
        {headerGroups.map(headerGroup => (
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
  );
}
