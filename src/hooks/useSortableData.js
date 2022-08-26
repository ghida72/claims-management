import { useState, useMemo } from "react";
const useSortableData = (items) => {
  const [sortConfig, setSortConfig] = useState(null);
  const sortedItems = useMemo(() => {
    let result = [...items];
    if (sortConfig !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }

        return 0;
      });
    }
    return result;
  }, [items, sortConfig]);
  const requestSort = (key, sortDirection) => {
    let direction = sortDirection === "asc" ? "ascending" : "descending";

    // if (
    //   sortConfig &&
    //   sortConfig.key === key &&
    //   sortConfig.direction === "ascending"
    // ) {
    //   direction = "descending";
    // }
    setSortConfig({ key, direction });
  };
  return { sortedItems, requestSort, sortConfig };
};

export default useSortableData;
