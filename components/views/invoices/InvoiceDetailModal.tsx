
import React, { useMemo } from 'react';
import { Modal } from '../../common/Modal';
import type { Invoice, Ticket, Employee, Customer } from '../../../types';
import { Badge } from '../../common/Badge';
import { mockCustomers } from '../../../data/mockData';

interface InvoiceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoiceId: string;
    invoices: Invoice[];
    tickets: Ticket[];
    currentUser: Employee;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ isOpen, onClose, invoiceId, invoices, tickets, currentUser }) => {
    
    const invoice = useMemo(() => invoices.find(i => i.id === invoiceId), [invoices, invoiceId]);
    const ticket = useMemo(() => tickets.find(t => t.id === invoice?.ticketId), [tickets, invoice]);
    const customer = useMemo(() => {
        if (!ticket) return mockCustomers.find(c => c.company === invoice?.customer);
        return mockCustomers.find(c => c.name === ticket.requesterName);
    }, [invoice, ticket]);
    const isAdmin = currentUser.systemRole === 'Admin';

    if (!invoice) return null;

    const statusMap = {
        Paid: 'success',
        Pending: 'warning',
        Overdue: 'danger',
    } as const;
    
    const customerDisplayName = isAdmin ? (customer?.name || invoice.customer) : (customer ? `ID: ${customer.id}`: 'N/A');

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Invoice Details: ${invoice.id}`} size="lg">
            <div className="space-y-6">
                <section className="p-4 bg-secondary rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
                    <div>
                        <h3 className="text-xs font-semibold text-text-secondary uppercase">Status</h3>
                        <Badge text={invoice.status} color={statusMap[invoice.status]} size="md" />
                    </div>
                     <div>
                        <h3 className="text-xs font-semibold text-text-secondary uppercase">Amount</h3>
                        <p className="font-bold text-lg">${invoice.amount.toLocaleString()}</p>
                    </div>
                     <div>
                        <h3 className="text-xs font-semibold text-text-secondary uppercase">Invoice Date</h3>
                        <p className="font-semibold">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                    </div>
                     <div>
                        <h3 className="text-xs font-semibold text-text-secondary uppercase">Due Date</h3>
                        <p className="font-semibold">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                </section>

                <section>
                     <h3 className="text-md font-semibold text-text-secondary mb-2">Details</h3>
                     <div className="p-4 bg-secondary rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="font-semibold">Customer:</span>
                            <span>{customerDisplayName}</span>
                        </div>
                        {isAdmin && customer && (
                            <div className="flex justify-between"><span className="font-semibold">Contact:</span><span>{customer.company} ({customer.email})</span></div>
                        )}
                         <div className="flex justify-between">
                            <span className="font-semibold">Related Ticket:</span>
                            <span className="truncate">{ticket?.title || 'N/A'} (#{invoice.ticketId})</span>
                        </div>
                     </div>
                </section>
                
                 <section>
                    <h3 className="text-md font-semibold text-text-secondary mb-2">Line Items</h3>
                    <div className="p-4 bg-secondary rounded-lg">
                        <table className="w-full text-left text-sm">
                            <tbody>
                                {(invoice.products || []).map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-1">{item.description} (x{item.quantity})</td>
                                        <td className="py-1 text-right font-mono">${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                ))}
                                {(!invoice.products || invoice.products.length === 0) && (
                                     <tr>
                                        <td className="py-1">Payment for services</td>
                                        <td className="py-1 text-right font-mono">${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                )}
                            </tbody>
                             <tfoot className="border-t-2 border-slate-300 font-bold">
                                <tr>
                                    <td className="pt-2">Total</td>
                                    <td className="pt-2 text-right font-mono">${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                 </section>

                 <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Close</button>
                    <button type="button" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">
                        Take Action
                    </button>
                </div>
            </div>
        </Modal>
    );
};