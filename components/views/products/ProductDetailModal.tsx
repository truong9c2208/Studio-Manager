import React, { useMemo } from 'react';
import type { Product, ProductCategory, Invoice } from '../../../types';
import { Badge } from '../../common/Badge';
import { PencilIcon } from '../../icons/PencilIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { CheckCircleIcon } from '../../icons/CheckCircleIcon';
import { ArchiveBoxIcon } from '../../icons/ArchiveBoxIcon';
import { DollarSignIcon } from '../../icons/DollarSignIcon';
import { Table, type Column } from '../../common/Table';
import { CloseIcon } from '../../icons/CloseIcon';

interface ProductDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    category: ProductCategory | undefined;
    invoices: Invoice[];
    onEdit: (product: Product) => void;
    onDelete: (productIds: string[]) => void;
    isAdmin: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, onClose, product, category, invoices, onEdit, onDelete, isAdmin }) => {
    
    const salesHistory = useMemo(() => {
        return invoices
            .filter(inv => inv.status === 'Paid' && inv.products?.some(p => p.productId === product.id))
            .map(inv => {
                const productItem = inv.products!.find(p => p.productId === product.id)!;
                return {
                    // FIX: Add 'id' property for the Table component's key requirement.
                    id: inv.id,
                    invoiceId: inv.id,
                    customer: inv.customer,
                    date: inv.invoiceDate,
                    quantity: productItem.quantity,
                    total: productItem.price * productItem.quantity,
                };
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [invoices, product.id]);

    const salesColumns: Column<typeof salesHistory[0]>[] = [
        { header: 'Invoice ID', accessor: 'invoiceId' },
        { header: 'Customer', accessor: 'customer' },
        { header: 'Date', accessor: 'date' },
        { header: 'Quantity', accessor: 'quantity' },
        { header: 'Total', accessor: 'total', cell: item => `$${item.total.toFixed(2)}` },
    ];
    
    const handleEditClick = () => {
        onClose(); // Close this modal
        onEdit(product); // Open the edit modal
    };
    
    const handleDeleteClick = () => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
            onDelete([product.id]);
            onClose();
        }
    }
    
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div 
                className="bg-primary rounded-lg shadow-xl w-full m-4 max-w-4xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-secondary">
                  <h2 className="text-xl font-semibold">Product Details</h2>
                  <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                    <CloseIcon className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                    <header className="flex items-start space-x-6">
                        <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-lg flex-shrink-0" />
                        <div className="flex-grow">
                            <h2 className="text-3xl font-bold">{product.name}</h2>
                            <p className="text-sm font-mono text-text-secondary mt-1">SKU: {product.sku}</p>
                            <div className="mt-2">
                                <Badge text={category?.name || 'Uncategorized'} color="info" />
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {product.tags.map(tag => <Badge key={tag} text={tag} color="primary" size="sm" />)}
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center p-3 bg-secondary rounded-lg">
                            <DollarSignIcon className="w-6 h-6 mr-3 text-accent" />
                            <div>
                                <p className="text-text-secondary">Price</p>
                                <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-secondary rounded-lg">
                            <ArchiveBoxIcon className="w-6 h-6 mr-3 text-accent" />
                            <div>
                                <p className="text-text-secondary">Stock</p>
                                <p className="font-bold text-lg">{product.stock} units</p>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-secondary rounded-lg">
                            <CheckCircleIcon className="w-6 h-6 mr-3 text-accent" />
                            <div>
                                <p className="text-text-secondary">Status</p>
                                <p className="font-bold text-lg">
                                    {product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? 'Low Stock' : 'In Stock'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <section>
                        <h3 className="font-semibold text-lg mb-2">Description</h3>
                        <p className="text-text-secondary">{product.description}</p>
                    </section>
                    
                    <section>
                        <h3 className="font-semibold text-lg mb-2">Recent Sales</h3>
                        <div className="max-h-60 overflow-y-auto border border-secondary rounded-lg">
                        <Table columns={salesColumns} data={salesHistory} />
                        </div>
                    </section>
                </div>

                {/* Footer for Actions */}
                <div className="flex justify-between items-center p-4 bg-secondary border-t border-primary rounded-b-lg">
                    {isAdmin ? (
                        <button 
                            onClick={handleDeleteClick} 
                            className="flex items-center space-x-2 text-sm font-semibold text-danger hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
                        >
                            <TrashIcon className="w-4 h-4" />
                            <span>Delete Product</span>
                        </button>
                    ) : (
                        <div></div> // Placeholder for alignment
                    )}
                    <div className="flex items-center space-x-3">
                         <button 
                            onClick={onClose} 
                            className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-slate-200 text-sm font-semibold"
                        >
                            Close
                        </button>
                        {isAdmin && (
                            <button 
                                onClick={handleEditClick} 
                                className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover text-sm font-semibold"
                            >
                                <PencilIcon className="w-4 h-4" />
                                <span>Edit</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};