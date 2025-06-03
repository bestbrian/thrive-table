import { useState } from 'react';
import { ColumnDef, AccessorKeyColumnDef } from '@tanstack/react-table';

export function useColumnReordering<T extends object>(columns: ColumnDef<T>[]) {
  const [columnOrder, setColumnOrder] = useState(() =>
    columns.map((col) => {
      if (col.id) return col.id;
      
      if ('accessorKey' in col) {
        const typedCol = col as AccessorKeyColumnDef<T, string>;
        if (typeof typedCol.accessorKey === 'string') {
          return typedCol.accessorKey;
        }
      }
      
      return `col-${Math.random().toString(36).substring(2, 9)}`;
    })
  );
  
  return {
    columnOrder,
    setColumnOrder,
  };
}
