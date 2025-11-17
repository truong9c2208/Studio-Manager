import React, { useState, useMemo } from 'react';
import type { Ticket, Employee, Customer, Project, Invoice, Product, Licence, RefundRequest, Note, Event } from '../../types';
import { TicketKanbanBoard } from './tickets/TicketKanbanBoard';
import { TicketDetailModal } from './tickets/TicketEditModal';
import { GridIcon } from '../icons/GridIcon';
import { TableIcon } from '../icons/TableIcon';

interface TicketsViewProps {
    tickets: Ticket[];
    employees: Employee[];
    customers: Customer[];
    projects: Project[];
    invoices: Invoice[];
    products: Product[];
    licences: Licence[];
    events: Event[];
    onUpdateTicket: (ticket: Ticket) => Promise<void>;
    onProcessPayment: (ticketId: string, amount: number, type: 'Deposit' | 'Final Payment') => Promise<void>;
    onAddNote: (ticketId: string, note: Omit<Note, 'id'>) => Promise<void>;
    currentUser: Employee;
    refundRequests: RefundRequest[];
    onAddRefundRequest: (request: Omit<RefundRequest, 'id' | 'createdAt' | 'status'>) => void;
    onViewInvoice: (invoiceId: string) => void;
}

const TicketStatusCard: React.FC<{ title: string; count: number; color: string }> = ({ title, count, color }) => (
    <div className="bg-secondary p-4 rounded-lg shadow-md">
        <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${color}`}>
                <span className="text-white font-bold text-lg">{count}</span>
            </div>
            <div>
                <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">{title}</h3>
            </div>
        </div>
    </div>
);

export const TicketsView: React.FC<TicketsViewProps> = ({ tickets, employees, customers, projects, invoices, products, licences, events, onUpdateTicket, onProcessPayment, onAddNote, currentUser, refundRequests, onAddRefundRequest, onViewInvoice }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [showAllClosed, setShowAllClosed] = useState(false);
    const [activeTab, setActiveTab] = useState<'my' | 'all'>(currentUser.systemRole === 'Admin' ? 'all' : 'my');
    
    const ticketsToShow = useMemo(() => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const baseTickets = tickets.filter(ticket => {
            const searchMatch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                ticket.requesterName.toLowerCase().includes(searchQuery.toLowerCase());

            const closedFilterMatch = ticket.status !== 'Closed' || showAllClosed || new Date(ticket.updatedAt) > sevenDaysAgo;
            
            return searchMatch && closedFilterMatch;
        });

        if (activeTab === 'my') {
            return baseTickets.filter(ticket => 
                ticket.ownerId === currentUser.id || ticket.assignees.some(a => a.employeeId === currentUser.id)
            );
        }

        return baseTickets; // for 'all' tab

    }, [tickets, searchQuery, showAllClosed, activeTab, currentUser]);

    const statusCounts = useMemo(() => {
        const counts: Record<Ticket['status'], number> = { 'Open': 0, 'In Progress': 0, 'Resolved': 0, 'Closed': 0 };
        tickets.forEach(ticket => { // Count from all tickets, not filtered ones
            counts[ticket.status]++;
        });
        return counts;
    }, [tickets]);

    const handleTicketDrop = (ticketId: string, newStatus: Ticket['status']) => {
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket && ticket.status !== newStatus) {
            onUpdateTicket({ ...ticket, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] });
        }
    };
    
    const handleCloseModal = () => {
        setSelectedTicket(null);
    };

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Ticket Manager</h1>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <TicketStatusCard title="Open" count={statusCounts.Open} color="bg-info" />
                <TicketStatusCard title="In Progress" count={statusCounts['In Progress']} color="bg-warning" />
                <TicketStatusCard title="Resolved" count={statusCounts.Resolved} color="bg-success" />
                <TicketStatusCard title="Closed" count={statusCounts.Closed} color="bg-gray-400" />
            </section>
            
            <div className="border-b border-secondary">
                <nav className="-mb-px flex space-x-6">
                     {currentUser.systemRole === 'Admin' && (
                        <button 
                            onClick={() => setActiveTab('all')}
                            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'all' 
                                ? 'border-accent text-accent' 
                                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                            }`}
                        >
                            All Tickets
                        </button>
                    )}
                    <button 
                        onClick={() => setActiveTab('my')}
                        className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === 'my' 
                            ? 'border-accent text-accent' 
                            : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                        }`}
                    >
                        My Tickets
                    </button>
                </nav>
            </div>

            <div className="flex justify-between items-center">
                <div className="w-1/3">
                     <input 
                        type="search"
                        placeholder="Search tickets by title, ID, or requester..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 bg-primary border border-secondary rounded-md"
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 text-sm text-text-secondary">
                        <input
                            type="checkbox"
                            checked={showAllClosed}
                            onChange={(e) => setShowAllClosed(e.target.checked)}
                            className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent"
                        />
                        <span>Show all closed tickets</span>
                    </label>
                    <div className="flex items-center bg-primary p-1 rounded-md">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-accent text-white' : 'hover:bg-secondary'}`}>
                            <GridIcon className="w-5 h-5" />
                        </button>
                         <button onClick={() => setViewMode('table')} className={`p-2 rounded ${viewMode === 'table' ? 'bg-accent text-white' : 'hover:bg-secondary'}`}>
                            <TableIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'grid' ? (
                <TicketKanbanBoard 
                    tickets={ticketsToShow}
                    employees={employees}
                    customers={customers}
                    onTicketClick={setSelectedTicket}
                    onTicketDrop={handleTicketDrop}
                    currentUser={currentUser}
                />
            ) : (
                <div className="bg-secondary p-8 rounded-lg text-center">
                    <h3 className="text-lg font-semibold">Table View</h3>
                    <p className="text-text-secondary">Table view is under construction.</p>
                </div>
            )}
            
            {selectedTicket && (
                <TicketDetailModal 
                    isOpen={!!selectedTicket}
                    onClose={handleCloseModal}
                    onUpdateTicket={onUpdateTicket}
                    onProcessPayment={onProcessPayment}
                    onAddNote={onAddNote}
                    ticket={selectedTicket}
                    allTickets={tickets}
                    employees={employees}
                    customers={customers}
                    projects={projects}
                    invoices={invoices}
                    products={products}
                    licences={licences}
                    events={events}
                    currentUser={currentUser}
                    refundRequests={refundRequests}
                    onAddRefundRequest={onAddRefundRequest}
                    onViewInvoice={onViewInvoice}
                />
            )}
        </div>
    );
};
