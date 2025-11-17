import React from 'react';
import { Card } from '../../common/Card';
import { Table, type Column } from '../../common/Table';
import { DownloadIcon } from '../../icons/DownloadIcon';
import { UploadIcon } from '../../icons/UploadIcon';
import type { Document } from '../../../types';

interface ProjectDocumentsProps {
    documents: Document[];
}

export const ProjectDocuments: React.FC<ProjectDocumentsProps> = ({ documents }) => {
    const columns: Column<Document>[] = [
        { header: 'Name', accessor: 'name' },
        { header: 'Type', accessor: 'type' },
        { header: 'Date Added', accessor: 'added', cell: (item) => new Date(item.added).toLocaleDateString() },
        { 
            header: 'Actions', 
            accessor: 'link', 
            cell: (item) => (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline inline-flex items-center">
                    <DownloadIcon className="w-4 h-4 mr-1" />
                    Download
                </a>
            )
        },
    ];
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-[#F2F2F2]">Documents</h2>
                <button 
                    className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover"
                >
                    <UploadIcon className="w-5 h-5" />
                    <span>Upload File</span>
                </button>
            </div>
            <Card>
                <div className="-m-6">
                    <Table columns={columns} data={documents} />
                </div>
            </Card>
        </div>
    );
}