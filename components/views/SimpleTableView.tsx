import React from 'react';
import { Card } from '../common/Card';
import { Table, type Column } from '../common/Table';

interface SimpleTableViewProps {
  title: string;
}

// A generic component for simple table views with placeholder data
export const SimpleTableView: React.FC<SimpleTableViewProps> = ({ title }) => {
    const placeholderData = [
        { id: '1', name: `Sample ${title} Item 1`, status: 'Active', date: '2024-07-29' },
        { id: '2', name: `Sample ${title} Item 2`, status: 'Inactive', date: '2024-07-28' },
        { id: '3', name: `Sample ${title} Item 3`, status: 'Active', date: '2024-07-27' },
    ];

    const columns: Column<typeof placeholderData[0]>[] = [
        { header: 'Name', accessor: 'name' },
        { header: 'Status', accessor: 'status' },
        { header: 'Date', accessor: 'date' },
    ];

  return (
    <div className="p-8">
        <Card title={`Manage ${title}`}>
             <div className="-m-6">
                <Table columns={columns} data={placeholderData} />
             </div>
        </Card>
    </div>
  );
};