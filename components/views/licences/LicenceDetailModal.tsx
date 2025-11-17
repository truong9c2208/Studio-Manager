import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import type { Licence, Customer, Product, Employee, Ticket, LicenceActivity } from '../../../types';
import { Badge } from '../../common/Badge';
import { InformationCircleIcon } from '../../icons/InformationCircleIcon';
import { HistoryIcon } from '../../icons/HistoryIcon';
import { PencilIcon } from '../../icons/PencilIcon';

interface LicenceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    licence: Licence;
    customers: Customer[];
    products: Product[];
    employees: Employee[];
    tickets: Ticket[];
    activity: LicenceActivity[];
    onEdit: (licence: Licence) => void;
}

type Tab = 'details' | 'activity';

export const LicenceDetailModal: React.FC<LicenceDetailModalProps> = ({ isOpen, onClose, licence, customers, products, employees, tickets, activity, onEdit }) => {
    const [activeTab, setActiveTab] = useState<Tab>('details');
    
    const product = products.find(p => p.id === licence.productId);
    const customer = customers.find(c => c.id === licence.customerId);
    const linkedTickets = tickets.filter(t => t.relatedLicenceId === licence.id);

    const timeSince = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "just now";
    };

    const handleEditClick = () => {
        onClose();
        onEdit(licence);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Licence Details`} size="xl">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-xl font-bold font-mono text-accent">{licence.key}</h2>
                    <p className="text-sm text-text-secondary">For {product?.name || 'Unknown Product'}</p>
                </div>
                <button onClick={handleEditClick} className="flex items-center space-x-2 bg-primary border border-secondary text-text-primary px-3 py-1.5 rounded-md hover:bg-secondary text-sm">
                    <PencilIcon className="w-4 h-4" />
                    <span>Edit Licence</span>
                </button>
            </div>
             <div className="border-b border-secondary mb-4">
                <nav className="-mb-px flex space-x-6">
                    <button onClick={() => setActiveTab('details')} className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'details' ? 'border-accent text-accent' : 'border-transparent text-text-secondary'}`}>
                        <InformationCircleIcon className="w-5 h-5"/><span>Details</span>
                    </button>
                    <button onClick={() => setActiveTab('activity')} className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === 'activity' ? 'border-accent text-accent' : 'border-transparent text-text-secondary'}`}>
                        <HistoryIcon className="w-5 h-5"/><span>Activity Log</span>
                    </button>
                </nav>
            </div>

            {activeTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Licence Information</h3>
                        <ul className="text-sm space-y-2 bg-secondary p-4 rounded-md">
                            <li className="flex justify-between"><span>Customer:</span> <span className="font-semibold">{customer?.name || 'N/A'}</span></li>
                            <li className="flex justify-between"><span>Company:</span> <span className="font-semibold">{customer?.company || 'N/A'}</span></li>
                            <li className="flex justify-between"><span>Product:</span> <span className="font-semibold">{product?.name || 'N/A'}</span></li>
                            <li className="flex justify-between"><span>Start Date:</span> <span className="font-semibold">{licence.startDate}</span></li>
                            <li className="flex justify-between"><span>Expires:</span> <span className="font-semibold">{licence.expires}</span></li>
                            <li className="flex justify-between"><span>Status:</span> <Badge text={licence.status} color={licence.status === 'Active' ? 'success' : (licence.status === 'Revoked' ? 'primary' : 'danger')} /></li>
                        </ul>
                    </div>
                     <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Linked Tickets</h3>
                        <div className="bg-secondary p-4 rounded-md space-y-2 max-h-60 overflow-y-auto">
                            {linkedTickets.length > 0 ? linkedTickets.map(ticket => (
                                <div key={ticket.id} className="bg-primary p-2 rounded-md">
                                    <p className="font-semibold text-sm truncate">{ticket.title}</p>
                                    <div className="flex justify-between items-center text-xs text-text-secondary">
                                        <span>#{ticket.id}</span>
                                        <Badge text={ticket.status} color={ticket.status === 'Closed' ? 'primary' : 'success'} size="sm"/>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-center text-text-secondary py-4">No tickets linked to this licence.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'activity' && (
                 <div>
                    <h3 className="font-semibold text-lg mb-2">Activity History</h3>
                    <div className="bg-secondary p-4 rounded-md max-h-80 overflow-y-auto">
                        {activity.length > 0 ? (
                            <ol className="relative border-l border-primary ml-2">
                                {activity.map(item => {
                                    const actor = employees.find(e => e.id === item.actorId);
                                    return (
                                        <li key={item.id} className="mb-6 ml-6">
                                            <span className="absolute flex items-center justify-center w-6 h-6 bg-accent rounded-full -left-3 ring-4 ring-secondary">
                                                <img src={`https://i.pravatar.cc/24?u=${actor?.id || 'system'}`} alt={actor?.name || 'System'} className="w-full h-full rounded-full object-cover"/>
                                            </span>
                                            <h4 className="font-semibold">{item.action}</h4>
                                            <p className="text-sm text-text-secondary">{item.details}</p>
                                            <p className="text-xs text-text-secondary mt-1">{actor?.name || 'System'} • {timeSince(item.timestamp)}</p>
                                        </li>
                                    )
                                })}
                           </ol>
                        ) : (
                            <p className="text-sm text-center text-text-secondary py-4">No activity history for this licence.</p>
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
};
