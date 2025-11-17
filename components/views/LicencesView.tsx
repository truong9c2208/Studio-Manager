

import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Table, type Column } from '../common/Table';
import { Badge } from '../common/Badge';
import type { Licence, Customer, Product, Employee, Ticket, LicenceActivity } from '../../types';
import { PlusIcon } from '../icons/PlusIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { LicenceModal } from './licences/LicenceModal';
import { KeyIcon } from '../icons/KeyIcon';
import { CopyIcon } from '../icons/CopyIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { DotsVerticalIcon } from '../icons/DotsVerticalIcon';
import { Dropdown, DropdownItem } from '../common/Dropdown';
import { DownloadIcon } from '../icons/DownloadIcon';
import { XCircleIcon } from '../icons/XCircleIcon';
import { LicenceDetailModal } from './licences/LicenceDetailModal';
import { HistoryIcon } from '../icons/HistoryIcon';
// FIX: Imported `PencilIcon` to resolve 'Cannot find name' error.
import { PencilIcon } from '../icons/PencilIcon';

interface LicencesViewProps {
    licences: Licence[];
    customers: Customer[];
    products: Product[];
    employees: Employee[];
    tickets: Ticket[];
    licenceActivity: LicenceActivity[];
    onSaveLicence: (licence: Licence) => void;
    onDeleteLicence: (licenceId: string) => void;
    onBulkUpdate: (licenceIds: string[], status: 'Revoked' | 'Active') => void;
}

const StatCard: React.FC<{ title: string; value: string | number; color: string; icon: React.ReactNode }> = ({ title, value, color, icon }) => (
    <div className="bg-secondary p-4 rounded-lg shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">{title}</h3>
            <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
        </div>
    </div>
);

type LicenceStatus = 'Active' | 'Expired' | 'Expiring Soon' | 'Revoked';

const exportToCsv = (filename: string, rows: any[], columns: Column<any>[]) => {
    const header = columns.map(c => c.header).join(',');
    const body = rows.map(row => {
        return columns.map(col => {
            let value = row[col.accessor as keyof typeof row];
            if (typeof value === 'object' && value !== null) {
                value = JSON.stringify(value);
            }
            return `"${String(value).replace(/"/g, '""')}"`;
        }).join(',');
    }).join('\n');

    const csvContent = `${header}\n${body}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const LicencesView: React.FC<LicencesViewProps> = ({ licences, customers, products, employees, tickets, licenceActivity, onSaveLicence, onDeleteLicence, onBulkUpdate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<LicenceStatus | 'all'>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingLicence, setEditingLicence] = useState<Licence | null>(null);
    const [selectedLicenceForDetail, setSelectedLicenceForDetail] = useState<Licence | null>(null);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [selectedLicences, setSelectedLicences] = useState<string[]>([]);

    const licenceDetails = useMemo(() => {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        return licences.map(licence => {
            const product = products.find(p => p.id === licence.productId);
            const customer = customers.find(c => c.id === licence.customerId);
            const expiresDate = new Date(licence.expires);

            let displayStatus: LicenceStatus = licence.status;
            if (licence.status === 'Active') {
                if (expiresDate < today) {
                    displayStatus = 'Expired';
                } else if (expiresDate <= thirtyDaysFromNow) {
                    displayStatus = 'Expiring Soon';
                }
            }

            return {
                ...licence,
                productName: product?.name || 'Unknown Product',
                customerName: customer?.name || 'Unknown Customer',
                displayStatus,
            };
        });
    }, [licences, products, customers]);

    const filteredLicences = useMemo(() => {
        return licenceDetails.filter(licence => {
            const searchMatch = licence.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                licence.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                licence.customerName.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = statusFilter === 'all' || licence.displayStatus === statusFilter;
            return searchMatch && statusMatch;
        });
    }, [licenceDetails, searchTerm, statusFilter]);
    
    const stats = useMemo(() => ({
        total: licenceDetails.length,
        active: licenceDetails.filter(l => l.displayStatus === 'Active').length,
        expiringSoon: licenceDetails.filter(l => l.displayStatus === 'Expiring Soon').length,
        expired: licenceDetails.filter(l => l.displayStatus === 'Expired' || l.displayStatus === 'Revoked').length,
    }), [licenceDetails]);


    const handleAddNew = () => {
        setEditingLicence(null);
        setIsModalOpen(true);
    };
    
    const handleEdit = (licence: Licence) => {
        setEditingLicence(licence);
        setIsModalOpen(true);
    };
    
    const handleViewDetails = (licence: Licence) => {
        setSelectedLicenceForDetail(licence);
        setIsDetailModalOpen(true);
    };

    const handleDelete = (licenceId: string) => {
        if (window.confirm("Are you sure you want to delete this licence? This action cannot be undone.")) {
            onDeleteLicence(licenceId);
        }
    };
    
    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedLicences.length} licences? This cannot be undone.`)) {
            selectedLicences.forEach(id => onDeleteLicence(id));
            setSelectedLicences([]);
        }
    };
    
    const handleBulkRevoke = () => {
         if (window.confirm(`Are you sure you want to revoke ${selectedLicences.length} licences?`)) {
            onBulkUpdate(selectedLicences, 'Revoked');
            setSelectedLicences([]);
        }
    }

    const handleCopyKey = (key: string) => {
        navigator.clipboard.writeText(key);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleExport = () => {
        exportToCsv(`licences-${new Date().toISOString().split('T')[0]}.csv`, filteredLicences, columns.filter(c => c.header !== 'Actions'));
    };

    const columns: Column<(typeof filteredLicences)[0]>[] = [
        { 
            header: 'Licence Key',
            accessor: 'key',
            cell: (item) => (
                <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm">{item.key}</span>
                    <button onClick={(e) => { e.stopPropagation(); handleCopyKey(item.key); }} className="text-text-secondary hover:text-accent">
                        {copiedKey === item.key ? <CheckCircleIcon className="w-4 h-4 text-success" /> : <CopyIcon className="w-4 h-4" />}
                    </button>
                </div>
            )
        },
        { header: 'Customer', accessor: 'customerName' },
        { header: 'Product', accessor: 'productName' },
        { header: 'Start Date', accessor: 'startDate' },
        { header: 'Expires', accessor: 'expires' },
        { 
            header: 'Status', 
            accessor: 'displayStatus',
            cell: (item) => {
                const colorMap: Record<LicenceStatus, 'success' | 'warning' | 'danger' | 'primary'> = {
                    'Active': 'success',
                    'Expiring Soon': 'warning',
                    'Expired': 'danger',
                    'Revoked': 'primary',
                };
                return <Badge text={item.displayStatus} color={colorMap[item.displayStatus]} size="sm" />;
            }
        },
        {
            header: 'Actions',
            accessor: 'id',
            sortable: false,
            cell: (item) => (
                 <div onClick={(e) => e.stopPropagation()}>
                    <Dropdown trigger={<button className="p-1 rounded-full hover:bg-slate-200"><DotsVerticalIcon className="w-5 h-5 text-text-secondary" /></button>}>
                        <DropdownItem onClick={() => handleEdit(item)}>
                            <PencilIcon className="w-4 h-4 mr-2" /> Edit
                        </DropdownItem>
                        <DropdownItem onClick={() => handleDelete(item.id)} className="text-danger hover:!bg-red-50">
                            <TrashIcon className="w-4 h-4 mr-2" /> Delete
                        </DropdownItem>
                    </Dropdown>
                 </div>
            )
        }
    ];

    return (
        <>
            <div className="p-8 space-y-6">
                <h1 className="text-3xl font-bold">Licence Management</h1>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Licences" value={stats.total} color="bg-indigo-100 text-accent" icon={<KeyIcon className="w-6 h-6" />} />
                    <StatCard title="Active" value={stats.active} color="bg-green-100 text-green-600" icon={<CheckCircleIcon className="w-6 h-6" />} />
                    <StatCard title="Expiring Soon" value={stats.expiringSoon} color="bg-amber-100 text-amber-600" icon={<HistoryIcon className="w-6 h-6" />} />
                    <StatCard title="Expired/Revoked" value={stats.expired} color="bg-red-100 text-red-600" icon={<TrashIcon className="w-6 h-6" />} />
                </section>

                <Card>
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 -mt-4 -mx-6 mb-4 bg-secondary border-b border-primary">
                        <div className="relative w-full sm:w-1/3">
                            <input
                                type="text"
                                placeholder="Search by key, product, customer..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full p-2 pl-10 bg-primary border border-secondary rounded-md"
                            />
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                        </div>
                        <div className="flex items-center space-x-2">
                            {(['all', 'Active', 'Expiring Soon', 'Expired', 'Revoked'] as const).map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1.5 text-sm font-semibold rounded-md ${statusFilter === status ? 'bg-accent text-white' : 'bg-primary hover:bg-slate-200'}`}
                                >
                                    {status === 'all' ? 'All' : status}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={handleExport} className="flex items-center space-x-2 bg-primary text-text-primary border border-secondary px-4 py-2 rounded-md hover:bg-slate-200">
                                <DownloadIcon className="w-5 h-5" />
                                <span>Export</span>
                            </button>
                            <button onClick={handleAddNew} className="flex-shrink-0 flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover">
                                <PlusIcon className="w-5 h-5" />
                                <span>New Licence</span>
                            </button>
                        </div>
                    </div>
                    
                    {selectedLicences.length > 0 && (
                        <div className="mb-4 bg-indigo-100 p-2 rounded-md flex justify-between items-center">
                            <span className="font-semibold text-sm text-accent">{selectedLicences.length} licence(s) selected</span>
                            <div className="flex items-center space-x-2">
                                <button onClick={handleBulkRevoke} className="text-sm font-semibold text-accent hover:underline">Revoke</button>
                                <button onClick={handleBulkDelete} className="text-sm font-semibold text-danger hover:underline">Delete</button>
                                <button onClick={() => setSelectedLicences([])}><XCircleIcon className="w-5 h-5 text-text-secondary hover:text-danger"/></button>
                            </div>
                        </div>
                    )}

                    <div className="-m-6">
                        <Table 
                            columns={columns} 
                            data={filteredLicences} 
                            onRowClick={handleViewDetails}
                            selection={selectedLicences}
                            onSelectionChange={setSelectedLicences}
                        />
                    </div>
                </Card>
            </div>
            <LicenceModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSaveLicence}
                licence={editingLicence}
                products={products}
                customers={customers}
            />
            {selectedLicenceForDetail && (
                <LicenceDetailModal 
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    licence={selectedLicenceForDetail}
                    customers={customers}
                    products={products}
                    employees={employees}
                    tickets={tickets}
                    activity={licenceActivity.filter(a => a.licenceId === selectedLicenceForDetail.id)}
                    onEdit={handleEdit}
                />
            )}
        </>
    );
};