import React, { useMemo, useState } from 'react';
import { mockCustomers } from '../../data/mockData';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { Table, type Column } from '../common/Table';
import type { Customer, Invoice, Ticket } from '../../types';
import { getCustomerAnalysis } from '../../services/api';
import { SparklesIcon } from '../icons/SparklesIcon';
import { useTranslation } from '../../hooks/useTranslation';
import { StarIcon } from '../icons/StarIcon';
import { TicketsIcon } from '../icons/TicketsIcon';
import { CurrencyDollarIcon } from '../icons/CurrencyDollarIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { PhoneIcon } from '../icons/PhoneIcon';
import { LocationMarkerIcon } from '../icons/LocationMarkerIcon';
import { AtSymbolIcon } from '../icons/AtSymbolIcon';

interface CustomerDetailViewProps {
    customerId: string;
    onBack: () => void;
    invoices: Invoice[];
    tickets: Ticket[];
}

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-[#1B3C53] p-4 rounded-lg flex items-center space-x-3">
        <div className="p-2 bg-primary rounded-full">{icon}</div>
        <div>
            <p className="text-xs font-semibold text-[#F2F2F2] uppercase">{title}</p>
            <p className="font-bold text-xl text-[#FFFFFF]">{value}</p>
        </div>
    </div>
);


export const CustomerDetailView: React.FC<CustomerDetailViewProps> = ({ customerId, onBack, invoices, tickets }) => {
    const { t } = useTranslation();
    const customer = mockCustomers.find(c => c.id === customerId);
    
    const [analysis, setAnalysis] = useState('');
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

    const { customerInvoices, customerTickets, totalSpend, avgRating } = useMemo(() => {
        if (!customer) return { customerInvoices: [], customerTickets: [], totalSpend: 0, avgRating: 0 };
        
        const invoicesForCustomer = invoices.filter(i => i.customer === customer.company);
        const ticketsForCustomer = tickets.filter(t => t.requesterName === customer.name);
        const paidInvoices = invoicesForCustomer.filter(i => i.status === 'Paid');
        const totalSpendCalc = paidInvoices.reduce((sum, i) => sum + i.amount, 0);

        const ratedTickets = ticketsForCustomer.filter(t => typeof t.rating === 'number');
        const avgRatingCalc = ratedTickets.length > 0 ? ratedTickets.reduce((sum, t) => sum + t.rating!, 0) / ratedTickets.length : 0;

        return { customerInvoices: invoicesForCustomer, customerTickets: ticketsForCustomer, totalSpend: totalSpendCalc, avgRating: avgRatingCalc };
    }, [customer, invoices, tickets]);

    if (!customer) {
        return <div className="p-8">Customer not found.</div>;
    }
    
    const handleGenerateAnalysis = async () => {
        setIsLoadingAnalysis(true);
        setAnalysis('');
        try {
            const result = await getCustomerAnalysis(customer, customerInvoices, customerTickets);
            setAnalysis(result);
        } catch (error) {
            setAnalysis("Failed to generate analysis. Please try again.");
        } finally {
            setIsLoadingAnalysis(false);
        }
    };
    
    const invoiceColumns: Column<Invoice>[] = [
        { header: 'Invoice ID', accessor: 'id' },
        { header: 'Date', accessor: 'invoiceDate' },
        { header: 'Amount', accessor: 'amount', cell: (i) => `$${i.amount.toLocaleString()}` },
        { header: 'Status', accessor: 'status', cell: (i) => <Badge text={i.status} color={i.status === 'Paid' ? 'success' : (i.status === 'Overdue' ? 'danger' : 'warning')} /> },
    ];
    
    const ticketColumns: Column<Ticket>[] = [
        { header: 'Ticket ID', accessor: 'id' },
        { header: 'Title', accessor: 'title' },
        { header: 'Status', accessor: 'status' },
        { header: 'Priority', accessor: 'priority' },
        { header: 'Rating', accessor: 'rating', cell: (t) => t.rating ? `${t.rating}/5` : 'N/A' },
    ];

    return (
        <div className="p-8 space-y-6">
            <header>
                <button onClick={onBack} className="flex items-center space-x-2 text-[#F2F2F2] hover:text-text-primary mb-4">
                    <ChevronLeftIcon className="w-5 h-5" />
                    <span>Back to Customers</span>
                </button>
                 <div className="flex items-center space-x-4">
                    <img src={`https://i.pravatar.cc/80?u=${customer.id}`} alt={customer.name} className="w-20 h-20 rounded-full" />
                    <div>
                        <h1 className="text-3xl font-bold text-[#F2F2F2]">{customer.name}</h1>
                        <p className="text-[#FFFFFF]">{customer.company}</p>
                    </div>
                 </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title={t('customers_ltv')} value={`$${totalSpend.toLocaleString()}`} icon={<CurrencyDollarIcon className="w-6 h-6 text-success" />} />
                <StatCard title={t('customers_avg_rating')} value={avgRating.toFixed(1)} icon={<StarIcon className="w-6 h-6 text-yellow-400" />} />
                <StatCard title={t('customers_total_tickets')} value={String(customerTickets.length)} icon={<TicketsIcon className="w-6 h-6 text-info" />} />
                <StatCard title={t('customers_col_status')} value={customer.status} icon={customer.status === 'Active' ? <CheckCircleIcon className="w-6 h-6 text-success" /> : <div className="w-6 h-6 text-text-secondary">-</div>} />
            </section>
            
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <h3 className="text-lg font-bold mb-4 text-[#F2F2F2]">{t('customers_contact_info')}</h3>
                        <ul className="text-sm space-y-3">
                            <li className="flex items-center">
                                <AtSymbolIcon className="w-5 h-5 mr-3 text-[#F2F2F2]" />
                                <a href={`mailto:${customer.email}`} className="text-accent hover:underline break-all">{customer.email}</a>
                            </li>
                            {customer.phone && (
                                <li className="flex items-center">
                                    <PhoneIcon className="w-5 h-5 mr-3 text-[#F2F2F2]" />
                                    <a href={`tel:${customer.phone}`} className="text-accent hover:underline">{customer.phone}</a>
                                </li>
                            )}
                            {customer.address && (
                                <li className="flex items-start">
                                    <LocationMarkerIcon className="w-5 h-5 mr-3 text-[#F2F2F2] mt-0.5" />
                                    <span className="text-[#F2F2F2]">
                                        {customer.address.street}<br/>
                                        {customer.address.city}, {customer.address.state} {customer.address.zip}
                                    </span>
                                </li>
                            )}
                        </ul>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <h3 className="text-lg font-bold flex items-center mb-2 text-[#F2F2F2]">
                            <SparklesIcon className="w-5 h-5 mr-2 text-accent"/>
                            {t('customers_ai_analysis')}
                        </h3>
                        <div className="bg-secondary p-4 rounded-md min-h-[100px]">
                            {isLoadingAnalysis ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                                    <span className="ml-2 text-text-secondary">{t('customers_generating')}</span>
                                </div>
                            ) : (
                                <p className="text-text-secondary text-sm">{analysis || t('customers_analysis_placeholder')}</p>
                            )}
                        </div>
                        <div className="mt-3 text-right">
                            <button onClick={handleGenerateAnalysis} disabled={isLoadingAnalysis} className="px-4 py-2 bg-accent text-white rounded-md text-sm font-semibold hover:bg-accent-hover disabled:bg-gray-400">
                                {t('customers_generate_analysis')}
                            </button>
                        </div>
                    </Card>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title={t('customers_purchase_history')}>
                    <div className="-m-6 max-h-96 overflow-y-auto">
                        <Table columns={invoiceColumns} data={customerInvoices} />
                    </div>
                </Card>
                 <Card title={t('customers_ticket_history')}>
                    <div className="-m-6 max-h-96 overflow-y-auto">
                        <Table columns={ticketColumns} data={customerTickets} />
                    </div>
                </Card>
            </section>
        </div>
    );
};