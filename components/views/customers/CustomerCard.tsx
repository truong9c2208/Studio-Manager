import React from 'react';
import type { Customer } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';
import { StarIcon } from '../../icons/StarIcon';
import { CurrencyDollarIcon } from '../../icons/CurrencyDollarIcon';
import { TicketsIcon } from '../../icons/TicketsIcon';

interface CustomerCardProps {
    customer: Customer;
    totalSpend: number;
    ticketCount: number;
    avgRating: number;
    onClick: () => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer, totalSpend, ticketCount, avgRating, onClick }) => {
    const { t } = useTranslation();
    return (
        <div onClick={onClick} className="bg-[#1B3C53] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-accent">
            <div className="flex items-center space-x-4">
                <img src={`https://i.pravatar.cc/64?u=${customer.id}`} alt={customer.name} className="w-16 h-16 rounded-full" />
                <div>
                    <h3 className="font-bold text-lg text-[#F2F2F2]">{customer.name}</h3>
                    <p className="text-sm text-[#F2F2F2]">{customer.company}</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-primary grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                    <p className="text-xs text-[#F2F2F2] font-semibold uppercase">{t('customers_ltv')}</p>
                    <p className="font-bold text-lg text-[#F2F2F2] flex items-center justify-center space-x-1">
                        <CurrencyDollarIcon className="w-4 h-4 text-green-500" />
                        <span>{Math.round(totalSpend).toLocaleString()}</span>
                    </p>
                </div>
                <div>
                    <p className="text-xs text-[#F2F2F2] font-semibold uppercase">{t('nav_tickets')}</p>
                    <p className="font-bold text-lg text-[#F2F2F2] flex items-center justify-center space-x-1">
                        <TicketsIcon className="w-4 h-4 text-blue-500" />
                        <span>{ticketCount}</span>
                    </p>
                </div>
                <div>
                    <p className="text-xs text-[#F2F2F2] font-semibold uppercase">{t('customers_avg_rating')}</p>
                    <p className="font-bold text-lg text-[#F2F2F2] flex items-center justify-center space-x-1">
                        <StarIcon className="w-4 h-4 text-yellow-400" />
                        <span>{avgRating > 0 ? avgRating.toFixed(1) : 'N/A'}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};