import React, { useMemo } from 'react';
import type { Customer, Ticket, Invoice, Product, Licence, RefundRequest } from '../../../types';
import { Badge } from '../../common/Badge';
import { StarIcon } from '../../icons/StarIcon';
import { ReceiptRefundIcon } from '../../icons/ReceiptRefundIcon';

interface CustomerInsightCardProps {
    customer: Customer | undefined;
    allTickets: Ticket[];
    invoices: Invoice[];
    isAdmin: boolean;
    allProducts: Product[];
    licences: Licence[];
    refundRequests: RefundRequest[];
    onInitiateRefund: (invoiceId: string, productId: string, productName: string) => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
        ))}
    </div>
);

export const CustomerInsightCard: React.FC<CustomerInsightCardProps> = ({ customer, allTickets, invoices, isAdmin, allProducts, licences, refundRequests, onInitiateRefund }) => {

    const { customerTickets, averageRating, totalSpent, purchaseHistory } = useMemo(() => {
        if (!customer) return { customerTickets: [], averageRating: 0, totalSpent: 0, purchaseHistory: [] };

        const customerTickets = allTickets.filter(t => t.requesterName === customer.name);
        const ratedTickets = customerTickets.filter(t => typeof t.rating === 'number');
        const averageRating = ratedTickets.length > 0
            ? ratedTickets.reduce((sum, t) => sum + t.rating!, 0) / ratedTickets.length
            : 0;
            
        const customerInvoices = invoices.filter(i => i.customer === customer.company);
        const totalSpent = customerInvoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);

        const purchaseHistory = invoices
            .filter(i => i.customer === customer.company && i.status === 'Paid' && i.products)
            .flatMap(invoice => 
                invoice.products!.map(p => ({
                    ...p,
                    invoiceId: invoice.id,
                    purchaseDate: invoice.dueDate,
                    productDetails: allProducts.find(prod => prod.id === p.productId)
                }))
            )
            .filter(item => item.productDetails)
            .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());

        return { customerTickets, averageRating, totalSpent, purchaseHistory };
    }, [customer, allTickets, invoices, allProducts]);

    if (!customer) {
        return (
            <section>
                <h3 className="text-md font-semibold text-text-secondary mb-2">Customer Insight</h3>
                <div className="bg-primary p-3 rounded-lg text-sm text-text-secondary">No customer data available.</div>
            </section>
        );
    }

    const statusMap = {
        Pending: 'warning',
        Approved: 'success',
        Rejected: 'danger',
    } as const;

    return (
        <section>
            <h3 className="text-md font-semibold text-text-secondary mb-2">Customer Insight</h3>
            <div className="bg-primary p-4 rounded-lg space-y-3">
                <div>
                    <p className="font-bold">{isAdmin ? customer.name : `Customer ID: ${customer.id}`}</p>
                    {isAdmin && <p className="text-sm text-text-secondary">{customer.company} • {customer.email}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm pt-2 border-t border-secondary">
                    <div><span className="font-semibold">{customerTickets.length}</span> Total Tickets</div>
                    <div><span className="font-semibold">{customerTickets.filter(t => t.status !== 'Closed').length}</span> Open Tickets</div>
                    <div><span className="font-semibold">${totalSpent.toLocaleString()}</span> Total Spent</div>
                    <div className="flex items-center gap-1"><StarRating rating={averageRating} /> ({averageRating.toFixed(1)})</div>
                </div>

                <div className="pt-2 border-t border-secondary">
                    <h4 className="font-semibold text-text-secondary text-xs uppercase mb-2">Purchase History</h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 text-sm">
                        {purchaseHistory.length > 0 ? purchaseHistory.map(item => {
                            const licence = licences.find(l => l.customer === customer.company && l.product === item.productDetails!.name);
                            const existingRequest = refundRequests.find(req => req.customerId === customer.id && req.productId === item.productId && req.invoiceId === item.invoiceId);
                            
                            return (
                                <div key={`${item.invoiceId}-${item.productId}`} className="bg-secondary p-2 rounded-md">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">{item.productDetails!.name}</p>
                                            <p className="text-xs text-text-secondary">Purchased: {new Date(item.purchaseDate).toLocaleDateString()}</p>
                                            {licence && <p className="text-xs text-indigo-600 font-mono" title={`License Key: ${licence.key}`}>Key: {licence.key.substring(0, 14)}...</p>}
                                        </div>
                                         <div className="text-right flex-shrink-0">
                                            {existingRequest ? (
                                                <Badge text={`Refund ${existingRequest.status}`} color={statusMap[existingRequest.status]} size="sm" />
                                            ) : (
                                                <button 
                                                    onClick={() => onInitiateRefund(item.invoiceId, item.productId, item.productDetails!.name)}
                                                    className="text-xs font-semibold text-accent hover:underline flex items-center space-x-1"
                                                >
                                                    <ReceiptRefundIcon className="w-4 h-4" />
                                                    <span>Refund</span>
                                                </button>
                                            )}
                                         </div>
                                    </div>
                                </div>
                            )
                        }) : <p className="text-xs text-text-secondary text-center py-4">No purchase history found.</p>}
                    </div>
                </div>
            </div>
        </section>
    );
};