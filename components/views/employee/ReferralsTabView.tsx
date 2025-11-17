
import React, { useMemo } from 'react';
import type { Employee, Ticket } from '../../../types';
import { Card } from '../../common/Card';
import { Table, type Column } from '../../common/Table';

interface ReferralsTabViewProps {
    employee: Employee;
    allTickets: Ticket[];
}

const COMMISSION_RATE = 0.05; // 5% commission

export const ReferralsTabView: React.FC<ReferralsTabViewProps> = ({ employee, allTickets }) => {
    
    const referredTickets = useMemo(() => {
        if (!employee.referralCode) return [];
        return allTickets.filter(ticket => 
            ticket.referralCode?.toUpperCase() === employee.referralCode?.toUpperCase() &&
            ticket.paymentStatus === 'Fully Paid'
        );
    }, [employee.referralCode, allTickets]);

    const stats = useMemo(() => {
        const totalReferrals = referredTickets.length;
        const totalCommission = referredTickets.reduce((sum, ticket) => {
            return sum + (ticket.totalAmount * COMMISSION_RATE);
        }, 0);
        return { totalReferrals, totalCommission };
    }, [referredTickets]);

    type ReferredTicketRow = Ticket & { commission: number };

    const tableData: ReferredTicketRow[] = referredTickets.map(ticket => ({
        ...ticket,
        commission: ticket.totalAmount * COMMISSION_RATE,
    }));

    const columns: Column<ReferredTicketRow>[] = [
        { header: 'Ticket ID', accessor: 'id', cell: (t) => `#${t.id.split('-')[1]}` },
        { header: 'Customer', accessor: 'requesterName' },
        { header: 'Date Closed', accessor: 'updatedAt' },
        { 
            header: 'Total Amount', 
            accessor: 'totalAmount',
            cell: (t) => `$${t.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
        },
        { 
            header: 'Commission (5%)', 
            accessor: 'commission',
            cell: (t) => <span className="font-semibold text-success">${t.commission.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        },
    ];

    if (!employee.referralCode) {
        return (
            <Card title="Referrals">
                <p className="text-center text-text-secondary py-8">This employee does not have a referral code assigned.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Total Referrals" value={stats.totalReferrals.toString()} />
                <Card title="Total Commission Earned" value={`$${stats.totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
            </section>
            <Card title="Referred Tickets (Fully Paid)">
                <div className="-m-6">
                    {tableData.length > 0 ? (
                        <Table columns={columns} data={tableData} />
                    ) : (
                        <p className="text-center text-text-secondary p-8">No fully paid tickets have used this referral code yet.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};
