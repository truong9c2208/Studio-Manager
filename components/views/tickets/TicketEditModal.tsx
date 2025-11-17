import React, { useState, useEffect, useMemo } from 'react';
import type { Ticket, Employee, Note, Customer, Project, Invoice, Product, Licence, RefundRequest, Payment, Event, Voucher } from '../../../types';
import { CloseIcon } from '../../icons/CloseIcon';
import { ChatAltIcon } from '../../icons/ChatAltIcon';
import { CurrencyDollarIcon } from '../../icons/CurrencyDollarIcon';
import { AssigneeManager } from './AssigneeManager';
import { ProductSelectorModal } from './ProductSelectorModal';
import { PlusIcon } from '../../icons/PlusIcon';
import { ProductCard } from '../products/ProductCard';
import { CustomerInsightCard } from './CustomerInsightCard';
import { InvoicePreviewModal } from './InvoicePreviewModal';
import { DocumentTextIcon } from '../../icons/DocumentTextIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { RefundRequestModal } from './RefundRequestModal';
import { SparklesIcon } from '../../icons/SparklesIcon';
import { ReferralCodeInput } from '../../common/ReferralCodeInput';
import { EyeIcon } from '../../icons/EyeIcon';
import { ClipboardDocumentCheckIcon } from '../../icons/ClipboardDocumentCheckIcon';

interface TicketDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdateTicket: (ticket: Ticket) => Promise<void>;
    onProcessPayment: (ticketId: string, amount: number, type: 'Deposit' | 'Final Payment') => Promise<void>;
    onAddNote: (ticketId: string, note: Omit<Note, 'id'>) => Promise<void>;
    ticket: Ticket;
    allTickets: Ticket[];
    employees: Employee[];
    customers: Customer[];
    projects: Project[];
    invoices: Invoice[];
    products: Product[];
    licences: Licence[];
    events: Event[];
    currentUser: Employee;
    refundRequests: RefundRequest[];
    onAddRefundRequest: (request: Omit<RefundRequest, 'id' | 'createdAt' | 'status'>) => void;
    onViewInvoice: (invoiceId: string) => void;
}

const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
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
    return Math.floor(seconds) + " seconds ago";
};

const ActivityItem: React.FC<{ note: Note; author?: Employee, isCurrentUser: boolean }> = ({ note, author, isCurrentUser }) => {
    const isStaff = note.type === 'staff';
    const isSystem = note.type === 'system';
    
    if (isSystem) {
        return (
            <div className="flex justify-center my-2">
                <div className="text-xs text-text-secondary bg-secondary px-3 py-1 rounded-full">{note.content}</div>
            </div>
        )
    }

    return (
        <div className={`flex items-start space-x-3 w-full ${isCurrentUser && isStaff ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <img src={`https://i.pravatar.cc/32?u=${author?.id || 'system'}`} alt={author?.name} className="w-8 h-8 rounded-full" />
            <div className={`flex-1 ${isCurrentUser && isStaff ? 'text-right' : ''}`}>
                <div className={`p-3 rounded-lg inline-block max-w-sm ${isCurrentUser && isStaff ? 'bg-accent text-white' : 'bg-primary'}`}>
                    <p className="font-semibold text-sm">{author?.name || 'Unknown'}</p>
                    <p className="text-sm">{note.content}</p>
                </div>
                <p className="text-xs text-text-secondary mt-1 px-1">{timeSince(note.createdAt)}</p>
            </div>
        </div>
    );
};


export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ isOpen, onClose, onUpdateTicket, onProcessPayment, onAddNote, ticket, allTickets, employees, customers, projects, invoices, products, licences, events, currentUser, refundRequests, onAddRefundRequest, onViewInvoice }) => {
    const [formData, setFormData] = useState<Ticket>(ticket);
    const [newNote, setNewNote] = useState('');
    const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
    const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);
    const [customDeposit, setCustomDeposit] = useState('');
    const [referrerName, setReferrerName] = useState('');

    const [isUpdatingRequirement, setIsUpdatingRequirement] = useState(false);
    const [newRequirementText, setNewRequirementText] = useState('');
    const [createChangeRequest, setCreateChangeRequest] = useState(false);
    const [showRequirementHistory, setShowRequirementHistory] = useState(false);

    const [refundModalState, setRefundModalState] = useState<{ isOpen: boolean; paymentId: string; productName: string; }>({ isOpen: false, paymentId: '', productName: '' });

    useEffect(() => {
        setFormData(ticket);
        setCustomDeposit(ticket.depositAmount > 0 ? String(ticket.depositAmount) : '');
    }, [ticket, isOpen]);
    
    // --- Permissions ---
    const canEdit = useMemo(() => currentUser.systemRole === 'Admin' || ticket.ownerId === currentUser.id, [currentUser, ticket]);
    const canComment = useMemo(() => canEdit || ticket.assignees.some(a => a.employeeId === currentUser.id), [canEdit, ticket, currentUser]);
    const isAdmin = currentUser.systemRole === 'Admin';
    const customer = useMemo(() => customers.find(c => c.name === ticket.requesterName), [customers, ticket.requesterName]);

    // --- Financial Calculations ---
    const { subtotal, discountAmount, totalAmount, amountPaid, remainingBalance } = useMemo(() => {
        const relatedProducts = (formData.relatedProductIds || []).map(id => products.find(p => p.id === id)).filter((p): p is Product => Boolean(p));
        const subtotalCalc = relatedProducts.reduce((sum, p) => sum + p.price, 0) +
                           (formData.changeRequests || []).filter(cr => cr.status === 'Approved').reduce((sum, cr) => sum + cr.priceImpact, 0) +
                           (formData.additionalLineItems || []).reduce((sum, item) => sum + (Number(item.price) || 0), 0);

        let discountAmountCalc = 0;
        const activeVoucher = events.flatMap(e => e.vouchers || []).find(v => v.code === formData.discountCode);
        if (activeVoucher) {
            discountAmountCalc = activeVoucher.discountAmount;
        }

        const totalAmountCalc = Math.max(0, subtotalCalc - discountAmountCalc);
        const amountPaidCalc = formData.payments.reduce((sum, p) => sum + p.amount, 0);
        const remainingBalanceCalc = totalAmountCalc - amountPaidCalc;
        
        return { subtotal: subtotalCalc, discountAmount: discountAmountCalc, totalAmount: totalAmountCalc, amountPaid: amountPaidCalc, remainingBalance: remainingBalanceCalc };

    }, [formData, products, events]);
    
    const depositAmount = useMemo(() => parseFloat(customDeposit) || 0, [customDeposit]);

    // --- Smart Vouchers ---
    const applicableVouchers = useMemo(() => {
        const ticketDate = new Date(ticket.createdAt);
        return events
            .filter(event => {
                const startDate = new Date(event.startDate);
                const endDate = new Date(event.endDate);
                return ticketDate >= startDate && ticketDate <= endDate;
            })
            .flatMap(event => event.vouchers || [])
            .filter(voucher => {
                if (!voucher.applicableProductIds || voucher.applicableProductIds.length === 0) return true;
                return (ticket.relatedProductIds || []).some(pid => voucher.applicableProductIds!.includes(pid));
            });
    }, [events, ticket.createdAt, ticket.relatedProductIds]);

    // --- Referral Code ---
    useEffect(() => {
        if (formData.referralCode) {
            const referrer = employees.find(e => e.referralCode?.toUpperCase() === formData.referralCode?.toUpperCase());
            setReferrerName(referrer ? `Referred by: ${referrer.name}` : 'Invalid Code');
        } else {
            setReferrerName('');
        }
    }, [formData.referralCode, employees]);

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        onAddNote(ticket.id, {
            authorId: currentUser.id,
            content: newNote.trim(),
            createdAt: new Date().toISOString(),
            type: 'staff',
        });
        setNewNote('');
    };
    
    const handleSaveAndClose = () => {
        const finalData = { ...formData, subtotal, discountAmount, totalAmount, depositAmount };
        onUpdateTicket(finalData);
        onClose();
    };
    
    const handleAddLineItem = () => {
        const newItem = { id: `ALI-${Date.now()}`, description: '', price: 0 };
        setFormData(prev => ({ ...prev, additionalLineItems: [...(prev.additionalLineItems || []), newItem] }));
    };

    const handleLineItemChange = (index: number, field: 'description' | 'price', value: string | number) => {
        const items = [...(formData.additionalLineItems || [])];
        items[index] = { ...items[index], [field]: value };
        setFormData(prev => ({ ...prev, additionalLineItems: items }));
    };
    
    const handleRemoveLineItem = (id: string) => {
        setFormData(prev => ({ ...prev, additionalLineItems: (prev.additionalLineItems || []).filter(item => item.id !== id)}));
    };
    
    const handleSetDepositPercentage = (percentage: number) => {
        const newDepositAmount = totalAmount * (percentage / 100);
        setCustomDeposit(String(newDepositAmount.toFixed(2)));
    };

    const handlePayment = (type: 'Deposit' | 'Final Payment') => {
        const amountToPay = type === 'Deposit' ? depositAmount : remainingBalance;
        if (amountToPay <= 0) return;
        onProcessPayment(ticket.id, amountToPay, type);
    };

    const handleOpenRefundModal = (paymentId: string) => {
        setRefundModalState({ isOpen: true, paymentId, productName: ticket.title });
    };

    const handleSubmitRefund = (reason: string) => {
        if (!customer) return;
        const paymentToRefund = formData.payments.find(p => p.id === refundModalState.paymentId);
        if (!paymentToRefund) return;
        onAddRefundRequest({ customerId: customer.id, ticketId: ticket.id, paymentId: paymentToRefund.id, reason });
        setRefundModalState({ isOpen: false, paymentId: '', productName: '' });
    };

    const handleSaveRequirement = () => {
        if (!newRequirementText.trim()) return;
        const newReq = {
            id: `REQ-${Date.now()}`,
            content: newRequirementText.trim(),
            createdAt: new Date().toISOString(),
            authorId: currentUser.id
        };
        const updatedReqs = [...(formData.requirements || []), newReq];
        
        let updatedChangeReqs = formData.changeRequests || [];
        if (createChangeRequest) {
            const newChangeReq = {
                id: `CR-${Date.now()}`,
                description: `Requirement update on ${new Date().toLocaleDateString()}`,
                priceImpact: 0,
                status: 'Pending Approval' as const,
                createdAt: new Date().toISOString()
            };
            updatedChangeReqs = [...updatedChangeReqs, newChangeReq];
        }

        setFormData(prev => ({ ...prev, requirements: updatedReqs, changeRequests: updatedChangeReqs }));
        
        // Reset form
        setNewRequirementText('');
        setCreateChangeRequest(false);
        setIsUpdatingRequirement(false);
    };
    
    const latestRequirement = useMemo(() => {
        if (!formData.requirements || formData.requirements.length === 0) return null;
        return formData.requirements[formData.requirements.length - 1];
    }, [formData.requirements]);

    return (
        <>
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
                <div 
                    className={`fixed top-0 right-0 h-full bg-[#234C6A] w-full max-w-5xl shadow-xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b border-secondary">
                            <div>
                                <p className="text-xs text-text-secondary">#{ticket.id.split('-')[1]} • Created on {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                <h2 className="text-xl font-bold">{ticket.title}</h2>
                            </div>
                            <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-secondary">
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
                            {/* Left Sidebar */}
                            <div className="md:col-span-1 bg-secondary p-6 border-r border-primary space-y-6 overflow-y-auto">
                                {/* ... Details and Assignees sections are unchanged ... */}
                                <section>
                                    <h3 className="text-md font-semibold text-text-secondary mb-2">Details</h3>
                                    <div className="space-y-4 text-sm">
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1">Status</label>
                                            <select name="status" value={formData.status} onChange={(e) => setFormData(prev => ({...prev, status: e.target.value as Ticket['status']}))} disabled={!canEdit} className="w-full p-2 bg-primary border border-secondary rounded-md disabled:bg-slate-100 disabled:cursor-not-allowed">
                                                <option>Open</option><option>In Progress</option><option>Resolved</option><option>Closed</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1">Priority</label>
                                            <select name="priority" value={formData.priority} onChange={(e) => setFormData(prev => ({...prev, priority: e.target.value as Ticket['priority']}))} disabled={!canEdit} className="w-full p-2 bg-primary border border-secondary rounded-md disabled:bg-slate-100 disabled:cursor-not-allowed">
                                                <option>Low</option><option>Medium</option><option>High</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-text-secondary mb-1">Owner</label>
                                            <select name="ownerId" value={formData.ownerId} onChange={(e) => setFormData(prev => ({...prev, ownerId: e.target.value}))} disabled={!canEdit} className="w-full p-2 bg-primary border border-secondary rounded-md disabled:bg-slate-100 disabled:cursor-not-allowed">
                                                {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </section>
                                <section>
                                    <h3 className="text-md font-semibold text-text-secondary mb-2">Assignees</h3>
                                    <AssigneeManager 
                                        assignees={formData.assignees}
                                        onAssigneesChange={(assignees) => setFormData(prev => ({...prev, assignees}))}
                                        allEmployees={employees}
                                        disabled={!canEdit}
                                    />
                                </section>

                                <CustomerInsightCard 
                                    customer={customer} 
                                    allTickets={allTickets} 
                                    invoices={invoices} 
                                    isAdmin={isAdmin}
                                    allProducts={products}
                                    licences={licences}
                                    refundRequests={refundRequests}
                                    onInitiateRefund={()=>{}}
                                />
                            </div>

                            {/* Main Content */}
                            <div className="col-span-1 md:col-span-2 p-6 overflow-y-auto">
                                <section className="mb-6">
                                    <h3 className="text-lg font-semibold flex items-center text-text-primary mb-2"><ClipboardDocumentCheckIcon className="w-5 h-5 mr-2" /> Customer Requirements</h3>
                                    {latestRequirement ? (
                                        <div className="bg-primary border border-secondary rounded-lg p-4">
                                            <p className="text-sm whitespace-pre-wrap">{latestRequirement.content}</p>
                                            <div className="text-xs text-text-secondary mt-2 flex justify-between items-center">
                                                <span>Last updated by {employees.find(e => e.id === latestRequirement.authorId)?.name || 'Unknown'} on {new Date(latestRequirement.createdAt).toLocaleDateString()}</span>
                                                <div className="space-x-2">
                                                    <button onClick={() => setShowRequirementHistory(!showRequirementHistory)} className="font-semibold hover:underline">History ({formData.requirements?.length || 0})</button>
                                                    {canEdit && <button onClick={() => setIsUpdatingRequirement(true)} className="font-semibold hover:underline">Update</button>}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => setIsUpdatingRequirement(true)} className="w-full border-2 border-dashed border-secondary rounded-lg p-4 text-center text-text-secondary hover:bg-secondary">
                                            + Add customer requirements
                                        </button>
                                    )}

                                    {showRequirementHistory && (
                                        <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                                            {(formData.requirements || []).slice().reverse().map(req => (
                                                <div key={req.id} className="bg-secondary p-2 rounded-md">
                                                    <p className="text-sm whitespace-pre-wrap">{req.content}</p>
                                                    <p className="text-xs text-text-secondary mt-1">By {employees.find(e => e.id === req.authorId)?.name} on {new Date(req.createdAt).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {isUpdatingRequirement && (
                                        <div className="mt-2 bg-primary border border-secondary rounded-lg p-4">
                                            <textarea value={newRequirementText} onChange={e => setNewRequirementText(e.target.value)} placeholder="Describe the new or updated requirement..." rows={4} className="w-full p-2 bg-secondary border-secondary rounded-md" />
                                            <div className="mt-2 flex justify-between items-center">
                                                <label className="flex items-center space-x-2 text-sm">
                                                    <input type="checkbox" checked={createChangeRequest} onChange={e => setCreateChangeRequest(e.target.checked)} className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent" />
                                                    <span>Create Change Request for this update</span>
                                                </label>
                                                <div className="space-x-2">
                                                    <button onClick={() => setIsUpdatingRequirement(false)} className="text-sm font-semibold text-text-secondary hover:underline">Cancel</button>
                                                    <button onClick={handleSaveRequirement} className="px-3 py-1 bg-accent text-white rounded-md text-sm hover:bg-accent-hover">Save Requirement</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </section>
                                 
                                {applicableVouchers.length > 0 && (
                                    <section className="mb-6">
                                        <h3 className="text-lg font-semibold flex items-center text-text-primary mb-2"><SparklesIcon className="w-5 h-5 mr-2 text-accent" /> Promotions Available</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {applicableVouchers.map(v => {
                                                const isUsedUp = v.maxUses !== undefined && v.uses >= v.maxUses;
                                                return (
                                                <div key={v.id} className={`bg-primary border border-secondary rounded-lg p-3 flex items-center justify-between gap-4 ${isUsedUp ? 'opacity-50' : ''}`}>
                                                    <div>
                                                        <p className="font-bold font-mono text-accent">{v.code}</p>
                                                        <p className="text-xs text-text-secondary">{v.description}</p>
                                                        {v.maxUses !== undefined && (
                                                            <div className="text-xs text-text-secondary mt-1">Uses: {v.uses}/{v.maxUses}</div>
                                                        )}
                                                    </div>
                                                    <button onClick={() => setFormData(p => ({...p, discountCode: v.code}))} disabled={isUsedUp} className="p-1.5 bg-secondary hover:bg-accent hover:text-white rounded-full text-accent disabled:bg-gray-200 disabled:cursor-not-allowed" title="Apply Voucher">
                                                        <PlusIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )})}
                                        </div>
                                    </section>
                                )}

                                {/* Quoting and Payments */}
                                <section className="mb-6">
                                    <h3 className="text-lg font-semibold flex items-center text-text-primary mb-2"><CurrencyDollarIcon className="w-5 h-5 mr-2" /> Quoting &amp; Payments</h3>
                                    <div className="bg-primary border border-secondary rounded-lg">
                                        <div className="p-4 space-y-4">
                                            {/* ... Line Items ... */}
                                            <div>
                                                <h4 className="font-semibold text-md mb-2">Line Items</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                                                    {((formData.relatedProductIds || []).map(id => products.find(p => p.id === id)).filter(p => p)).map(product => (
                                                        <div key={product!.id} className="bg-secondary p-2 rounded-md flex items-start space-x-2 text-sm relative">
                                                            <img src={product!.image} alt={product!.name} className="w-12 h-12 object-cover rounded-md" />
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-text-primary">{product!.name}</p>
                                                                <p className="font-mono text-xs">${product!.price.toFixed(2)}</p>
                                                            </div>
                                                            {canEdit && (
                                                                <button
                                                                    onClick={() => setFormData(p => ({ ...p, relatedProductIds: p.relatedProductIds?.filter(id => id !== product!.id) }))}
                                                                    className="absolute top-1 right-1 p-0.5 text-text-secondary hover:text-danger bg-primary bg-opacity-50 rounded-full"
                                                                ><TrashIcon className="w-3 h-3"/></button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                {(formData.additionalLineItems || []).map((item, index) => (
                                                    <div key={item.id} className="flex items-center space-x-2 text-sm mb-1">
                                                        <input type="text" value={item.description} onChange={(e) => handleLineItemChange(index, 'description', e.target.value)} placeholder="Item description" className="flex-1 p-1 bg-secondary border-secondary rounded-md" disabled={!canEdit} />
                                                        <input type="number" value={item.price} onChange={(e) => handleLineItemChange(index, 'price', Number(e.target.value))} placeholder="0.00" className="w-24 p-1 bg-secondary border-secondary rounded-md font-mono" disabled={!canEdit} />
                                                        {canEdit && <button onClick={() => handleRemoveLineItem(item.id)} className="p-1 text-text-secondary hover:text-danger"><TrashIcon className="w-4 h-4" /></button>}
                                                    </div>
                                                ))}
                                                {canEdit && <div className="mt-2 space-x-4"><button onClick={() => setIsProductSelectorOpen(true)} className="text-sm text-accent hover:underline">Link Products</button><button onClick={handleAddLineItem} className="text-sm text-accent hover:underline flex items-center space-x-1"><PlusIcon className="w-4 h-4" /><span>Add Item</span></button></div>}
                                            </div>

                                            {/* Deposit, Discount, Referral */}
                                            <div className="border-t border-secondary pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-semibold text-md mb-2">Deposit</h4>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {[20, 50, 70].map(p => ( <button key={p} type="button" onClick={() => handleSetDepositPercentage(p)} disabled={!canEdit || amountPaid > 0} className={`px-3 py-1 text-sm rounded-md disabled:opacity-50 ${depositAmount === (totalAmount * p / 100) ? 'bg-accent text-white' : 'bg-primary border border-secondary'}`}> {p}% </button> ))}
                                                        <div className="flex items-center">
                                                            <input type="number" placeholder="Custom" value={customDeposit} onChange={(e) => setCustomDeposit(e.target.value)} disabled={!canEdit || amountPaid > 0} className="w-24 p-1 bg-secondary border-secondary rounded-md text-sm" />
                                                            <span className="ml-1 text-sm text-text-secondary">$</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="font-semibold text-sm mb-1 block">Discount Code</label>
                                                        <input type="text" placeholder="Enter code" value={formData.discountCode || ''} onChange={e => setFormData(p => ({...p, discountCode: e.target.value.toUpperCase()}))} disabled={!canEdit || amountPaid > 0} className="w-full p-2 bg-secondary border-secondary rounded-md text-sm" />
                                                    </div>
                                                     <div>
                                                        <label className="font-semibold text-sm mb-1 block">Referral Code</label>
                                                        <ReferralCodeInput
                                                            employees={employees}
                                                            value={formData.referralCode || ''}
                                                            onSelect={(code) => setFormData(prev => ({...prev, referralCode: code}))}
                                                            disabled={!canEdit}
                                                        />
                                                        {referrerName && <p className={`text-xs mt-1 ${referrerName === 'Invalid Code' ? 'text-danger' : 'text-success'}`}>{referrerName}</p>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Financial Summary */}
                                        <div className="bg-secondary p-4 rounded-b-lg space-y-4">
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">${subtotal.toFixed(2)}</span></div>
                                                {discountAmount > 0 && <div className="flex justify-between text-danger"><span>Discount ({formData.discountCode})</span><span className="font-mono">-${discountAmount.toFixed(2)}</span></div>}
                                                <div className="flex justify-between font-bold text-lg border-t border-slate-300 pt-1 mt-1"><span>Total Amount</span><span className="font-mono">${totalAmount.toFixed(2)}</span></div>
                                                {depositAmount > 0 && <div className="flex justify-between font-semibold"><span>Deposit Due</span><span className="font-mono">${depositAmount.toFixed(2)}</span></div>}
                                                <div className="flex justify-between text-success"><span>Amount Paid</span><span className="font-mono">${amountPaid.toFixed(2)}</span></div>
                                                <div className="flex justify-between font-bold text-lg border-t border-slate-300 pt-1 mt-1 text-warning"><span>Remaining Balance</span><span className="font-mono">${remainingBalance.toFixed(2)}</span></div>
                                            </div>
                                            
                                            {formData.payments.length > 0 && (
                                                <div className="border-t border-slate-300 pt-2">
                                                    <h4 className="font-semibold text-sm mb-1">Payment History</h4>
                                                    <div className="text-xs space-y-1">
                                                        {formData.payments.map(p => (
                                                            <div key={p.id} className="flex justify-between items-center bg-primary p-1.5 rounded">
                                                                <div><span className="font-semibold">{p.type}</span><span className="text-text-secondary ml-2">{new Date(p.date).toLocaleDateString()}</span></div>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="font-mono text-success">${p.amount.toFixed(2)}</span>
                                                                    <button onClick={() => onViewInvoice(p.invoiceId)} className="flex items-center space-x-1 text-accent hover:underline"><EyeIcon className="w-4 h-4" /><span>View</span></button>
                                                                    {formData.paymentStatus !== 'Refund Requested' && formData.paymentStatus !== 'Refunded' && <button onClick={() => handleOpenRefundModal(p.id)} className="text-accent hover:underline">Refund</button>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-2 justify-end">
                                                <button onClick={() => setIsInvoicePreviewOpen(true)} className="inline-flex items-center justify-center space-x-2 px-3 py-2 bg-white border border-secondary rounded-md hover:bg-slate-100 text-sm font-semibold"><DocumentTextIcon className="w-5 h-5" /><span>Export Invoice</span></button>
                                                {formData.paymentStatus === 'Unpaid' && canEdit && depositAmount > 0 && <button onClick={() => handlePayment('Deposit')} className="px-3 py-2 bg-blue-500 text-white rounded-md hover:opacity-90 text-sm font-semibold">Mark Deposit Paid</button>}
                                                {remainingBalance > 0 && canEdit && <button onClick={() => handlePayment('Final Payment')} className="px-3 py-2 bg-success text-white rounded-md hover:opacity-90 text-sm font-semibold">Mark as Fully Paid</button>}
                                                {remainingBalance <= 0 && formData.payments.length > 0 && <span className="px-3 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed text-sm font-semibold">Fully Paid</span>}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Activity / Chat */}
                                <section>
                                    <h3 className="text-lg font-semibold flex items-center text-text-primary mb-2"><ChatAltIcon className="w-5 h-5 mr-2" /> Activity</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3">
                                            <img src={`https://i.pravatar.cc/32?u=${currentUser.id}`} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                                            <div className="flex-1">
                                                <div className="bg-primary border border-secondary rounded-lg">
                                                    <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder={canComment ? "Add a note..." : "You don't have permission to comment."} rows={3} className="w-full p-2 bg-transparent focus:ring-0 border-0" disabled={!canComment} />
                                                </div>
                                                <div className="text-right mt-2">
                                                    <button onClick={handleAddNote} className="px-4 py-1.5 bg-accent text-white rounded-md text-sm hover:bg-accent-hover disabled:bg-gray-400" disabled={!canComment || !newNote.trim()}>Post Note</button>
                                                </div>
                                            </div>
                                        </div>
                                        {formData.notes?.map(note => {
                                            const author = employees.find(e => e.id === note.authorId);
                                            return <ActivityItem key={note.id} note={note} author={author} isCurrentUser={note.authorId === currentUser.id} />
                                        })}
                                    </div>
                                </section>
                            </div>
                        </div>
                        {/* Footer */}
                        {canEdit && (
                            <div className="p-4 bg-secondary border-t border-primary flex justify-end">
                                <button onClick={handleSaveAndClose} className="px-6 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save & Close</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <ProductSelectorModal 
                isOpen={isProductSelectorOpen}
                onClose={() => setIsProductSelectorOpen(false)}
                products={products}
                initialSelectedIds={formData.relatedProductIds || []}
                onSelect={(productIds) => setFormData(prev => ({...prev, relatedProductIds: productIds}))}
                isAdmin={isAdmin}
            />
             {isInvoicePreviewOpen && (
                <InvoicePreviewModal 
                    isOpen={isInvoicePreviewOpen}
                    onClose={() => setIsInvoicePreviewOpen(false)}
                    ticket={formData}
                    allProducts={products}
                    customer={customer}
                />
            )}
             {refundModalState.isOpen && (
                <RefundRequestModal 
                    isOpen={refundModalState.isOpen}
                    onClose={() => setRefundModalState({ isOpen: false, paymentId: '', productName: '' })}
                    onSubmit={handleSubmitRefund}
                    productName={refundModalState.productName}
                />
            )}
        </>
    );
};