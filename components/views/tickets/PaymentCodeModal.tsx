import React from 'react';
import { Modal } from '../../common/Modal';
import { QrCodeIcon } from '../../icons/QrCodeIcon';
import { ClipboardListIcon } from '../../icons/ClipboardListIcon';

interface PaymentCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    ticketId: string;
    amount: number;
}

export const PaymentCodeModal: React.FC<PaymentCodeModalProps> = ({ isOpen, onClose, ticketId, amount }) => {
    const paymentCode = `PAY-${ticketId.split('-')[1]}-${Date.now().toString().slice(-4)}`;
    
    const handleCopy = () => {
        navigator.clipboard.writeText(paymentCode);
        // Optionally show a toast notification
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Generate Payment Code">
            <div className="text-center space-y-4">
                <p>Scan the QR code or use the payment code below to complete the transaction.</p>
                <div className="p-4 bg-white inline-block border rounded-lg">
                   {/* This is a placeholder for a real QR code */}
                   <QrCodeIcon className="w-48 h-48 mx-auto text-text-primary" />
                </div>
                <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-sm text-text-secondary">Amount Due</p>
                    <p className="text-2xl font-bold">${amount.toLocaleString()}</p>
                </div>
                 <div className="flex items-center justify-center p-3 bg-secondary rounded-lg space-x-4">
                    <p className="font-mono text-lg font-semibold">{paymentCode}</p>
                    <button onClick={handleCopy} className="p-2 hover:bg-primary rounded-full" title="Copy code">
                        <ClipboardListIcon className="w-5 h-5" />
                    </button>
                </div>
                <button onClick={onClose} className="w-full mt-4 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">
                    Done
                </button>
            </div>
        </Modal>
    );
};
