import { useState, useMemo } from "react";

const useSortableData = (items) => {
  const [sortConfig, setSortConfig] = useState(null);
  const sortedItems = useMemo(() => {
    let result = [...items];
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }

        return 0;
      });
    }
    return result;
  }, [items, sortConfig]);
  const requestSort = (key, direction) => {
    setSortConfig({ key, direction });
  };
  return { sortedItems, requestSort, sortConfig };
};

export default useSortableData;
