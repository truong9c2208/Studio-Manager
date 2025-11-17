import React, { useMemo } from 'react';
import { Card } from '../common/Card';
import type { Customer, Invoice, Ticket } from '../../types';
import { mockCustomers } from '../../data/mockData';
import { useTranslation } from '../../hooks/useTranslation';
import { CustomerCard } from './customers/CustomerCard';

interface CustomersViewProps {
    onViewCustomer: (customerId: string) => void;
    invoices: Invoice[];
    tickets: Ticket[];
}

export const CustomersView: React.FC<CustomersViewProps> = ({ onViewCustomer, invoices, tickets }) => {
    const { t } = useTranslation();

    const customerData = useMemo(() => {
        return mockCustomers.map(customer => {
            const customerInvoices = invoices.filter(i => i.customer === customer.company && i.status === 'Paid');
            const totalSpend = customerInvoices.reduce((sum, i) => sum + i.amount, 0);

            const customerTickets = tickets.filter(t => t.requesterName === customer.name);
            const ticketCount = customerTickets.length;
            const ratedTickets = customerTickets.filter(t => typeof t.rating === 'number');
            const avgRating = ratedTickets.length > 0 ? ratedTickets.reduce((sum, t) => sum + t.rating!, 0) / ratedTickets.length : 0;
            
            return { customer, totalSpend, ticketCount, avgRating };
        });
    }, [invoices, tickets]);


    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-[#F2F2F2]">{t('customers_title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {customerData.map(data => (
                    <CustomerCard
                        key={data.customer.id}
                        customer={data.customer}
                        totalSpend={data.totalSpend}
                        ticketCount={data.ticketCount}
                        avgRating={data.avgRating}
                        onClick={() => onViewCustomer(data.customer.id)}
                    />
                ))}
            </div>
        </div>
    );
};