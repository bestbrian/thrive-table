import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useState, useEffect } from 'react';
import { TABLE } from '../utils/constants';

export function useTableVirtualization<T>(
  rows: T[],
  options?: {
    rowHeight?: number;
    overscan?: number;
  }
) {
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
  
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => options?.rowHeight || TABLE.ROW_HEIGHT,
    overscan: options?.overscan || TABLE.OVERSCAN,
  });
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
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
  };
  
  return {
    tableContainerRef,
    tableHeight,
    rowVirtualizer,
    isScrolled,
    handleScroll,
  };
}
