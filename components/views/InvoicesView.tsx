

import React, { useState, useMemo } from 'react';
import { Card } from '../common/Card';
import { Table, type Column } from '../common/Table';
import { Badge } from '../common/Badge';
import type { Invoice, Ticket, Employee, Customer } from '../../types';
import { mockCustomers } from '../../data/mockData';

interface InvoicesViewProps {
    invoices: Invoice[];
    tickets: Ticket[];
    onUpdateInvoice: (invoice: Invoice) => void;
    onViewInvoice: (invoiceId: string) => void;
    currentUser: Employee;
}

const StatCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
    <div className={`bg-secondary p-4 rounded-lg shadow-md border-l-4 ${color}`}>
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">{title}</h3>
        <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
    </div>
);

export const InvoicesView: React.FC<InvoicesViewProps> = ({ invoices, tickets, onUpdateInvoice, onViewInvoice, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | Invoice['status']>('all');
    const isAdmin = currentUser.systemRole === 'Admin';

    const invoiceData = useMemo(() => {
        return invoices.map(invoice => {
            const ticket = tickets.find(t => t.id === invoice.ticketId);
            const customerObj = ticket ? mockCustomers.find(c => c.name === ticket.requesterName) : undefined;
            return {
                ...invoice,
                customerObj,
                ticketTitle: ticket?.title || 'N/A',
                customerName: customerObj?.name || invoice.customer,
            };
        });
    }, [invoices, tickets]);

    const filteredInvoices = useMemo(() => {
        return invoiceData.filter(invoice => {
            const searchMatch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                invoice.ticketTitle.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = statusFilter === 'all' || invoice.status === statusFilter;
            return searchMatch && statusMatch;
        });
    }, [invoiceData, searchTerm, statusFilter]);

    const stats = useMemo(() => {
        const paid = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
        const pending = invoices.filter(i => i.status === 'Pending').reduce((sum, i) => sum + i.amount, 0);
        const overdue = invoices.filter(i => i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);
        return { paid, pending, overdue };
    }, [invoices]);

    const columns: Column<typeof filteredInvoices[0]>[] = [
        { header: 'Invoice ID', accessor: 'id', cell: (inv) => <span className="font-mono">{inv.id}</span> },
        { 
            header: 'Customer', 
            accessor: 'customerName',
            cell: (inv) => (
                <span>{isAdmin ? inv.customerName : (inv.customerObj ? `ID: ${inv.customerObj.id}` : 'N/A')}</span>
            )
        },
        { header: 'Ticket', accessor: 'ticketTitle', cell: (inv) => <span className="text-sm truncate">{inv.ticketTitle}</span> },
        { 
            header: 'Amount',
            accessor: 'amount',
            cell: (invoice) => `$${invoice.amount.toLocaleString()}`
        },
        { 
            header: 'Status', 
            accessor: 'status',
            cell: (invoice) => {
                const statusMap = {
                    'Paid': 'success',
                    'Pending': 'warning',
                    'Overdue': 'danger',
                } as const;
                return <Badge text={invoice.status} color={statusMap[invoice.status]} size="sm" />;
            }
        },
        { header: 'Invoice Date', accessor: 'invoiceDate' },
        { header: 'Due Date', accessor: 'dueDate' },
    ];

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Invoice Management</h1>

            {isAdmin && (
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Paid" value={`$${stats.paid.toLocaleString()}`} color="border-success" />
                    <StatCard title="Pending" value={`$${stats.pending.toLocaleString()}`} color="border-warning" />
                    <StatCard title="Overdue" value={`$${stats.overdue.toLocaleString()}`} color="border-danger" />
                </section>
            )}

            <Card>
                <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 -mt-4 -mx-6 mb-4 bg-secondary border-b border-primary">
                    <input
                        type="text"
                        placeholder="Search by ID, customer, or ticket..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full sm:w-1/3 p-2 bg-primary border border-secondary rounded-md"
                    />
                    <div className="flex items-center space-x-2">
                        {(['all', 'Paid', 'Pending', 'Overdue'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 text-sm font-semibold rounded-md ${statusFilter === status ? 'bg-accent text-white' : 'bg-primary hover:bg-slate-200'}`}
                            >
                                {status === 'all' ? 'All' : status}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="-m-6">
                    <Table columns={columns} data={filteredInvoices} onRowClick={(invoice) => onViewInvoice(invoice.id)} />
                </div>
            </Card>
        </div>
    );
};