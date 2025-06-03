import { Table } from "@tanstack/react-table";
import { ColumnSizeConfig } from "../types/table";

export function useColumnSizing<T>(
  table: Table<T>,
  config: ColumnSizeConfig
): Record<string, number> {
  const { columnProportions, columnSizeMap } = config;
  const columnWidths: Record<string, number> = {};

  let totalProportion = 0;
  table.getVisibleLeafColumns().forEach(column => {
    const sizeCategory = columnSizeMap[column.id] || 'default';
    const proportion = columnProportions[sizeCategory] || columnProportions.default;
    totalProportion += proportion;
  });
  
  let remainingWidth = 100;
  const visibleColumns = table.getVisibleLeafColumns();
  
  visibleColumns.slice(0, -1).forEach(column => {
    const sizeCategory = columnSizeMap[column.id] || 'default';
    const proportion = columnProportions[sizeCategory] || columnProportions.default;
    const percentWidth = Math.floor((proportion / totalProportion) * 100 * 10) / 10
    columnWidths[column.id] = percentWidth;
    remainingWidth -= percentWidth;
  });
  
  if (visibleColumns.length > 0) {
    const lastColumn = visibleColumns[visibleColumns.length - 1];
    columnWidths[lastColumn.id] = Math.max(0.1, parseFloat(remainingWidth.toFixed(1)))
  }

  return columnWidths;
}
