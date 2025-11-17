
import React, { useMemo } from 'react';
import { Modal } from '../../common/Modal';
import type { Ticket, Product, Customer } from '../../../types';
import { DownloadIcon } from '../../icons/DownloadIcon';

interface InvoicePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: Ticket;
    allProducts: Product[];
    customer: Customer | undefined;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({ isOpen, onClose, ticket, allProducts, customer }) => {
    
    const lineItems = useMemo(() => {
        const productItems = (ticket.relatedProductIds || [])
            .map(id => allProducts.find(p => p.id === id))
            .filter((p): p is Product => Boolean(p))
            .map(p => ({ description: p.name, price: p.price }));

        const changeRequestItems = (ticket.changeRequests || [])
            .filter(cr => cr.status === 'Approved')
            .map(cr => ({ description: `Change Request: ${cr.description}`, price: cr.priceImpact }));
            
        const additionalItems = (ticket.additionalLineItems || [])
            .map(item => ({ description: item.description, price: item.price }));
            
        return [...productItems, ...changeRequestItems, ...additionalItems];
    }, [ticket, allProducts]);

    const { subtotal, discountAmount, totalAmount, payments } = ticket;
    const amountPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const amountDue = totalAmount - amountPaid;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Invoice for Ticket #${ticket.id.split('-')[1]}`} size="xl">
            <div id="invoice-content" className="p-2 sm:p-6 bg-white text-text-primary font-sans">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <header className="flex justify-between items-center pb-6 border-b border-gray-200">
                        <div>
                            <h1 className="text-4xl font-bold text-accent">INVOICE</h1>
                            <p className="text-sm text-gray-500 mt-1">Invoice #: {ticket.id.replace('TKT', 'INV')}</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-semibold">Corelinks Studio</h2>
                            <p className="text-sm text-gray-500">123 Main St, Techville, CA 90210</p>
                            <p className="text-sm text-gray-500">contact@corelinks.studio</p>
                        </div>
                    </header>
                    
                    {/* Billing Info */}
                    <section className="grid grid-cols-2 sm:grid-cols-3 gap-6 my-8">
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Billed To</h3>
                            <p className="font-bold">{customer?.name || ticket.requesterName}</p>
                            {customer && <p className="text-sm text-gray-600">{customer.company}</p>}
                            {customer && <p className="text-sm text-gray-600">{customer.email}</p>}
                        </div>
                         <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Invoice Date</h3>
                            <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                        </div>
                         <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Payment Status</h3>
                            <p className={`font-semibold px-2 py-1 inline-block rounded-md text-sm ${
                                ticket.paymentStatus === 'Fully Paid' ? 'bg-green-100 text-green-800' :
                                ticket.paymentStatus === 'Deposit Paid' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>{ticket.paymentStatus}</p>
                        </div>
                    </section>

                    {/* Line Items Table */}
                    <section>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {lineItems.map((item, index) => (
                                    <tr key={index}>
                                        <td className="p-3">{item.description}</td>
                                        <td className="p-3 text-right font-mono">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                ))}
                                {lineItems.length === 0 && (
                                    <tr>
                                        <td className="p-3">General Services</td>
                                        <td className="p-3 text-right font-mono">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </section>
                    
                    {/* Totals Section */}
                    <section className="flex justify-end mt-8">
                        <div className="w-full max-w-sm space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-mono">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                             {discountAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Discount ({ticket.discountCode})</span>
                                    <span className="font-mono text-red-500">-${discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                             )}
                            <div className="flex justify-between text-sm font-semibold">
                                <span className="text-gray-600">Total</span>
                                <span className="font-mono">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                             <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Amount Paid</span>
                                <span className="font-mono">-${amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 mt-3">
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Amount Due</span>
                                    <span className="text-accent font-mono">${amountDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="text-center mt-12 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">Thank you for your business!</p>
                    </footer>
                </div>
            </div>
            <div className="p-4 bg-secondary flex justify-end space-x-2 border-t border-primary">
                <button type="button" onClick={handlePrint} className="flex items-center space-x-2 px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-slate-200">
                    <DownloadIcon className="w-5 h-5" />
                    <span>Print / Save PDF</span>
                </button>
                <button type="button" onClick={onClose} className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Close</button>
            </div>
        </Modal>
    );
};
