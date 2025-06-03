import { ColumnDef } from "@tanstack/react-table";

/**
 * Configuration for column sizing
 */
export interface ColumnSizeConfig {
  /**
   * Defines the relative proportions for different column size categories
   */
  columnProportions: Record<string, number>;
  
  /**
   * Maps column IDs to size categories
   */
  columnSizeMap: Record<string, string>;
}

/**
 * Props for the table component
 */
export interface TableProps<T> {
  /**
   * Data to be displayed in the table
   */
  data: T[];
  
  /**
   * Column definitions for the table
   */
  columns: ColumnDef<T>[];
}
