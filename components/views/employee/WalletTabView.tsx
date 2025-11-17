import React, { useMemo, useState } from 'react';
import type { Employee, WalletTransaction, Ticket, Achievement } from '../../../types';
import { Card } from '../../common/Card';
import { Table, type Column } from '../../common/Table';
import { Badge } from '../../common/Badge';
import { RequestWithdrawalModal } from './modals/RequestWithdrawalModal';
import { RedeemRewardsModal } from './modals/RedeemRewardsModal';
import { AddTransactionModal } from './modals/AddTransactionModal';
import { ClipboardDocumentIcon } from '../../icons/ClipboardDocumentIcon';
import { CheckCircleIcon } from '../../icons/CheckCircleIcon';
import { AchievementsSection } from './achievements/AchievementsSection';
import { AwardAchievementModal } from './modals/AwardAchievementModal';

interface WalletTabViewProps {
    employee: Employee;
    isMyProfile: boolean;
    isAdmin: boolean;
    allTickets: Ticket[];
    allAchievements: Achievement[];
    onRequestWithdrawal?: (employeeId: string, amount: number, method: string) => void;
    onRedeemReward?: (employeeId: string, rewardId: string, cost: number) => void;
    onAddTransaction?: (employeeId: string, transaction: Omit<WalletTransaction, 'id' | 'date'>) => void;
    onAwardAchievement?: (employeeId: string, achievementId: string) => void;
}

const StatCard: React.FC<{ title: string; value: string; isPoints?: boolean }> = ({ title, value, isPoints = false }) => (
    <div className="bg-primary p-4 rounded-lg shadow-sm border border-secondary">
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold text-text-primary mt-1">
            {value}
            {isPoints && <span className="text-lg text-accent ml-1">points</span>}
        </p>
    </div>
);

export const WalletTabView: React.FC<WalletTabViewProps> = (props) => {
    const { 
        employee, isMyProfile, isAdmin, allTickets, allAchievements,
        onRequestWithdrawal, onRedeemReward, onAddTransaction, onAwardAchievement
    } = props;

    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
    const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
    const [isAddTxnModalOpen, setIsAddTxnModalOpen] = useState(false);
    const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // --- Wallet Logic ---
    const lifetimeEarnings = useMemo(() => {
        return employee.wallet.transactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);
    }, [employee.wallet.transactions]);

    const handleWithdrawalRequest = (amount: number, method: string) => {
        onRequestWithdrawal?.(employee.id, amount, method);
        setIsWithdrawalModalOpen(false);
    };
    
    const handleRedeem = (rewardId: string, cost: number) => {
        onRedeemReward?.(employee.id, rewardId, cost);
        setIsRedeemModalOpen(false);
    };

    const handleAddTxn = (transaction: Omit<WalletTransaction, 'id' | 'date'>) => {
        onAddTransaction?.(employee.id, transaction);
        setIsAddTxnModalOpen(false);
    }
    
    const handleAward = (achievementId: string) => {
        onAwardAchievement?.(employee.id, achievementId);
        setIsAwardModalOpen(false);
    };

    // --- Referral Logic ---
    const COMMISSION_RATE = 0.05; // 5% commission

    const referredTickets = useMemo(() => {
        if (!employee.referralCode) return [];
        return allTickets.filter(ticket => 
            ticket.referralCode?.toUpperCase() === employee.referralCode?.toUpperCase() &&
            ticket.paymentStatus === 'Fully Paid'
        );
    }, [employee.referralCode, allTickets]);

    const referralStats = useMemo(() => {
        const totalReferrals = referredTickets.length;
        const totalCommission = referredTickets.reduce((sum, ticket) => {
            return sum + (ticket.totalAmount * COMMISSION_RATE);
        }, 0);
        return { totalReferrals, totalCommission };
    }, [referredTickets]);

    type ReferredTicketRow = Ticket & { commission: number };

    const referralTableData: ReferredTicketRow[] = referredTickets.map(ticket => ({
        ...ticket,
        commission: ticket.totalAmount * COMMISSION_RATE,
    }));

    const referralColumns: Column<ReferredTicketRow>[] = [
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
        
    const handleCopyReferral = () => {
        if (employee.referralCode) {
            navigator.clipboard.writeText(employee.referralCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const transactionColumns: Column<WalletTransaction>[] = [
        { header: 'Date', accessor: 'date', cell: (item) => new Date(item.date).toLocaleDateString() },
        { header: 'Description', accessor: 'description' },
        { 
            header: 'Type', 
            accessor: 'type',
            cell: (item) => {
                const colorMap = {
                    bonus: 'success',
                    commission: 'info',
                    redemption: 'warning',
                    withdrawal: 'danger',
                    adjustment: 'primary',
                } as const;
                return <Badge text={item.type} color={colorMap[item.type]} size="sm" />;
            }
        },
        { 
            header: 'Amount', 
            accessor: 'amount',
            cell: (item) => (
                <span className={`font-semibold ${item.amount > 0 ? 'text-success' : 'text-danger'}`}>
                    {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}
                </span>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Current Balance" value={employee.wallet.balance.toLocaleString()} isPoints />
                <StatCard title="Lifetime Earnings" value={lifetimeEarnings.toLocaleString()} isPoints />
            </section>

            <div className="flex items-center space-x-2">
                {isMyProfile && (
                    <>
                        <button onClick={() => setIsWithdrawalModalOpen(true)} className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover text-sm font-semibold">Request Withdrawal</button>
                        <button onClick={() => setIsRedeemModalOpen(true)} className="px-4 py-2 bg-secondary border border-primary rounded-md hover:bg-primary text-sm font-semibold">Redeem Rewards</button>
                    </>
                )}
                {isAdmin && !isMyProfile && (
                     <button onClick={() => setIsAddTxnModalOpen(true)} className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover text-sm font-semibold">Add Transaction</button>
                )}
            </div>

            <AchievementsSection 
                employee={employee}
                allAchievements={allAchievements}
                isAdmin={isAdmin}
                isMyProfile={isMyProfile}
                onAwardClick={() => setIsAwardModalOpen(true)}
            />

            {employee.referralCode && (
                <Card title="Referral Program">
                    <div className="flex items-center justify-between mb-4 bg-primary p-3 rounded-md">
                        <div>
                            <p className="text-sm font-semibold text-text-secondary">Your Referral Code</p>
                            <p className="font-mono text-lg font-bold text-accent">{employee.referralCode}</p>
                        </div>
                        <button onClick={handleCopyReferral} className="flex items-center space-x-2 text-sm font-semibold bg-secondary px-3 py-2 rounded-md hover:bg-slate-200">
                            {copied ? <CheckCircleIcon className="w-5 h-5 text-success" /> : <ClipboardDocumentIcon className="w-5 h-5" />}
                            <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-secondary p-3 rounded-lg text-center">
                            <p className="text-2xl font-bold">{referralStats.totalReferrals}</p>
                            <p className="text-xs text-text-secondary uppercase">Successful Referrals</p>
                        </div>
                        <div className="bg-secondary p-3 rounded-lg text-center">
                            <p className="text-2xl font-bold">${referralStats.totalCommission.toFixed(2)}</p>
                            <p className="text-xs text-text-secondary uppercase">Commission Earned</p>
                        </div>
                    </div>
                    <h4 className="font-semibold text-text-secondary mb-2">Referred & Paid Tickets</h4>
                    <div className="max-h-60 overflow-y-auto border border-primary rounded-lg">
                        {referralTableData.length > 0 ? (
                           <Table columns={referralColumns} data={referralTableData} />
                        ) : (
                           <p className="text-center text-text-secondary p-4 text-sm">No fully paid tickets have used this referral code yet.</p>
                        )}
                    </div>
                </Card>
            )}
            
            <Card title="Transaction History">
                <div className="-m-6">
                    <Table columns={transactionColumns} data={[...employee.wallet.transactions].reverse()} />
                </div>
            </Card>

            <RequestWithdrawalModal 
                isOpen={isWithdrawalModalOpen}
                onClose={() => setIsWithdrawalModalOpen(false)}
                onConfirm={handleWithdrawalRequest}
                maxAmount={employee.wallet.balance}
            />
            <RedeemRewardsModal
                isOpen={isRedeemModalOpen}
                onClose={() => setIsRedeemModalOpen(false)}
                onRedeem={handleRedeem}
                currentBalance={employee.wallet.balance}
            />
            <AddTransactionModal 
                isOpen={isAddTxnModalOpen}
                onClose={() => setIsAddTxnModalOpen(false)}
                onSave={handleAddTxn}
            />
             <AwardAchievementModal
                isOpen={isAwardModalOpen}
                onClose={() => setIsAwardModalOpen(false)}
                onAward={handleAward}
                allAchievements={allAchievements}
                employeeAchievements={employee.achievements}
            />
        </div>
    );
};