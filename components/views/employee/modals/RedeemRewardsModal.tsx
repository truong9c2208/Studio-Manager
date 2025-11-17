import React from 'react';
import { Modal } from '../../../common/Modal';
import { GiftIcon } from '../../../icons/GiftIcon';

interface RedeemRewardsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRedeem: (rewardId: string, cost: number) => void;
    currentBalance: number;
}

const availableRewards = [
    { id: 'gift-card-25', name: '$25 Amazon Gift Card', cost: 2500 },
    { id: 'gift-card-50', name: '$50 Amazon Gift Card', cost: 5000 },
    { id: 'swag-pack', name: 'Company Swag Pack', cost: 3000 },
    { id: 'day-off', name: 'Extra Day Off', cost: 10000 },
];

export const RedeemRewardsModal: React.FC<RedeemRewardsModalProps> = ({ isOpen, onClose, onRedeem, currentBalance }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Redeem Rewards">
            <div className="space-y-4">
                <p className="text-sm">Your current balance is <span className="font-bold text-accent">{currentBalance.toLocaleString()} points</span>.</p>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {availableRewards.map(reward => {
                        const canAfford = currentBalance >= reward.cost;
                        return (
                             <div key={reward.id} className={`flex items-center justify-between p-3 bg-secondary rounded-lg ${!canAfford ? 'opacity-50' : ''}`}>
                                <div className="flex items-center space-x-3">
                                    <GiftIcon className="w-6 h-6 text-accent" />
                                    <div>
                                        <p className="font-semibold">{reward.name}</p>
                                        <p className="text-xs text-text-secondary">{reward.cost.toLocaleString()} points</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onRedeem(reward.name, reward.cost)}
                                    disabled={!canAfford}
                                    className="px-3 py-1 bg-accent text-white rounded-md text-sm font-semibold hover:bg-accent-hover disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Redeem
                                </button>
                            </div>
                        )
                    })}
                </div>
                 <div className="pt-4 flex justify-end">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Close</button>
                </div>
            </div>
        </Modal>
    );
};