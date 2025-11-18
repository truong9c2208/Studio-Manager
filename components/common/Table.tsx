import React, { useMemo, useState, useEffect } from 'react';
import { SortIcon } from '../icons/SortIcon';
import { ArrowUpIcon } from '../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';

export interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  selection?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export const Table = <T extends { id: string | number }>({ columns, data, onRowClick, selection, onSelectionChange }: TableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'ascending' | 'descending' } | null>(null);

  const isSelectable = !!selection && !!onSelectionChange;
  const allOnPageSelected = isSelectable && data.length > 0 && selection.length === data.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onSelectionChange?.(data.map(item => String(item.id)));
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (!isSelectable) return;
    if (e.target.checked) {
      onSelectionChange([...selection, id]);
    } else {
      onSelectionChange(selection.filter(selectedId => selectedId !== id));
    }
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (typeof aValue !== 'string' && typeof aValue !== 'number' && typeof bValue !== 'string' && typeof bValue !== 'number') {
            return 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key: keyof T) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: keyof T) => {
    if (!sortConfig || sortConfig.key !== key) {
        return <SortIcon className="w-4 h-4 text-text-secondary" />;
    }
    if (sortConfig.direction === 'ascending') {
        return <ArrowUpIcon className="w-4 h-4 text-accent" />;
    }
    return <ArrowDownIcon className="w-4 h-4 text-accent" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-500/20">
          <tr>
            {isSelectable && (
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allOnPageSelected}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-[#FFFFFF] border-gray-300 rounded focus:ring-accent"
                />
              </th>
            )}
            {columns.map((column) => (
              <th key={String(column.accessor)} className="px-6 py-3 text-sm font-semibold text-[#F2F2F2] uppercase tracking-wider">
                {column.sortable === false ? (
                  <span>{column.header}</span>
                ) : (
                  <button onClick={() => requestSort(column.accessor)} className="flex items-center space-x-1 group">
                      <span>{column.header}</span>
                      {getSortIcon(column.accessor)}
                  </button>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary">
          {sortedData.map((item) => (
            <tr key={item.id} className={`${onRowClick ? 'cursor-pointer' : ''} ${isSelectable && selection.includes(String(item.id)) ? 'bg-indigo-50' : ''}`}>
              {isSelectable && (
                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selection.includes(String(item.id))}
                    onChange={(e) => handleSelectOne(e, String(item.id))}
                    className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent"
                  />
                </td>
              )}
              {columns.map((column, colIndex) => (
                <td 
                  key={String(column.accessor)} 
                  className="px-6 py-4 whitespace-nowrap text-[#F2F2F2]"
                  onClick={() => colIndex === 0 && onRowClick?.(item)} // Make only the first data cell clickable for detail view
                >
                    {column.cell ? column.cell(item) : String(item[column.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};