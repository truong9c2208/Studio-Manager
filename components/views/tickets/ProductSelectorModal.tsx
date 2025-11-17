import React, { useState, useMemo, useEffect } from 'react';
import type { Product } from '../../../types';
import { Modal } from '../../common/Modal';
import { ProductCard } from '../products/ProductCard';

interface ProductSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (productIds: string[]) => void;
    products: Product[];
    initialSelectedIds: string[];
    isAdmin: boolean;
}

export const ProductSelectorModal: React.FC<ProductSelectorModalProps> = ({ isOpen, onClose, onSelect, products, initialSelectedIds, isAdmin }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

    useEffect(() => {
        if (isOpen) {
            setSelectedIds(initialSelectedIds);
        }
    }, [isOpen, initialSelectedIds]);

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    const handleToggleSelect = (productId: string) => {
        setSelectedIds(prev => 
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    };

    const handleConfirm = () => {
        onSelect(selectedIds);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Select a Product" size="xl">
            <div className="space-y-4">
                <input 
                    type="search"
                    placeholder="Search products by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-primary border border-secondary rounded-md"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
                    {filteredProducts.map(product => (
                        <ProductCard 
                            key={product.id}
                            product={product}
                            // FIX: Pass category as undefined since it's not available here.
                            category={undefined}
                            onClick={() => handleToggleSelect(product.id)}
                            // FIX: The prop is 'isSelected', not 'selected'.
                            isSelected={selectedIds.includes(product.id)}
                            // FIX: Pass onCheckboxChange to handle selection from the checkbox.
                            onCheckboxChange={(checked) => {
                                if (checked) {
                                    setSelectedIds(prev => [...prev, product.id]);
                                } else {
                                    setSelectedIds(prev => prev.filter(id => id !== product.id));
                                }
                            }}
                            isAdmin={isAdmin}
                        />
                    ))}
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                    <button type="button" onClick={handleConfirm} className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">
                        Link {selectedIds.length} Product(s)
                    </button>
                </div>
            </div>
        </Modal>
    );
};