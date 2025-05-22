import { Row, flexRender } from "@tanstack/react-table";
import { User } from "../../lib/users";

interface TableRowProps {
  row: Row<User>;
  columnWidths: Record<string, number>;
  virtualRowSize: number;
  virtualRowStart: number;
}

export function TableRow({ row, columnWidths, virtualRowSize, virtualRowStart }: TableRowProps) {
  return (
    <div
      key={row.id}
      className="absolute hover:bg-[#f7cee3] w-full flex mx-2 rounded-lg transition-colors duration-150"
      style={{
        width: 'calc(100% - 16px)',
        height: `${virtualRowSize}px`,
        transform: `translateY(${virtualRowStart}px)`,
        marginBottom: '4px',
      }}
    >
      {row.getVisibleCells().map(cell => (
        <div
          key={cell.id}
          className="py-4 px-4 whitespace-nowrap scrollbar-hide cell-container font-jakarta"
          style={{ 
            width: `${columnWidths[cell.column.id]}%`,
            overflow: 'hidden',
            WebkitOverflowScrolling: 'touch'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.overflowX = 'auto';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.overflowX = 'hidden';
            e.currentTarget.removeAttribute('data-selecting');
          }}
          onMouseDown={(e) => {
            e.currentTarget.setAttribute('data-selecting', 'true');
          }}
          onMouseUp={(e) => {
            e.currentTarget.removeAttribute('data-selecting');
          }}
          onMouseMove={(e) => {
            const cell = e.currentTarget;
            
            if (cell.getAttribute('data-selecting') !== 'true') {
              return;
            }
            
            const mouseX = e.clientX - cell.getBoundingClientRect().left;
            const cellWidth = cell.offsetWidth;
            
            if (mouseX > cellWidth * 0.7 && cell.scrollWidth > cell.offsetWidth) {
              cell.scrollLeft += 5;
            } else if (mouseX < cellWidth * 0.3 && cell.scrollLeft > 0) {
              cell.scrollLeft -= 5;
            }
          }}
          onFocus={(e) => {
            e.currentTarget.style.overflowX = 'auto';
          }}
          onBlur={(e) => {
            e.currentTarget.style.overflowX = 'hidden';
          }}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      ))}
    </div>
  );
}
