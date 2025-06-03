import { useState } from 'react';
import { SortingState } from '@tanstack/react-table';

export function useTableSorting(initialSorting: SortingState = []) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  
  return {
    sorting,
    setSorting,
  };
}
