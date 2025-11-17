import React, { useState, useMemo, useEffect } from 'react';
import type { Product, ProductCategory, Invoice } from '../../../types';
import { CategorySidebar } from './CategorySidebar';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { ProductModal } from './ProductModal';
import { SearchIcon } from '../../icons/SearchIcon';
import { PlusIcon } from '../../icons/PlusIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { ExclamationTriangleIcon } from '../../icons/ExclamationTriangleIcon';
import { ArchiveBoxIcon } from '../../icons/ArchiveBoxIcon';
import { DollarSignIcon } from '../../icons/DollarSignIcon';
import { CategoryManagerView } from './CategoryManagerView';
import { ProductPerformanceChart } from './ProductPerformanceChart';
import { CategorySalesChart } from './CategorySalesChart';
import { SalesTrendChart } from './SalesTrendChart';
import { getProductPerformanceSummary } from '../../../services/api';
import { ChartBarIcon } from '../../icons/ChartBarIcon';
import { FolderIcon } from '../../icons/FolderIcon';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-[#1B3C53] p-4 rounded-lg shadow-md flex items-center space-x-4">
        <div className="p-3 rounded-full bg-indigo-100 text-accent">{icon}</div>
        <div>
            <h3 className="text-sm font-medium text-[#F2F2F2] uppercase tracking-wider">{title}</h3>
            <p className="text-2xl font-bold text-[#FFFFFF] mt-1">{value}</p>
        </div>
    </div>
);

interface ProductsViewProps {
    products: Product[];
    categories: ProductCategory[];
    invoices: Invoice[];
    onSaveProduct: (p: Product) => void;
    onSaveCategory: (c: ProductCategory) => void;
    onDeleteProducts: (ids: string[]) => void;
    onDeleteCategory: (id: string) => void;
    isAdmin: boolean;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ products, categories, invoices, onSaveProduct, onSaveCategory, onDeleteProducts, onDeleteCategory, isAdmin }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'products'>(isAdmin ? 'dashboard' : 'products');
    const [selectedCategoryId, setSelectedCategoryId] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [summary, setSummary] = useState('');

    const stats = useMemo(() => {
        const totalRevenue = invoices
            .filter(i => i.status === 'Paid')
            .reduce((sum, i) => sum + i.amount, 0);
        const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;
        return { totalRevenue, lowStockCount };
    }, [invoices, products]);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const categoryMatch = selectedCategoryId === 'all' || product.categoryId === selectedCategoryId;
            const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            return categoryMatch && searchMatch;
        });
    }, [products, selectedCategoryId, searchTerm]);

    const handleSelectProduct = (product: Product) => {
        setViewingProduct(product);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
    };
    
    const handleDeleteSelected = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedProductIds.length} selected products?`)) {
            onDeleteProducts(selectedProductIds);
            setSelectedProductIds([]);
        }
    }

    const handleSaveAndCloseModal = (product: Product) => {
        onSaveProduct(product);
        setEditingProduct(null);
    };

    const handleGenerateSummary = async () => {
        setIsSummaryLoading(true);
        const result = await getProductPerformanceSummary(products, invoices);
        setSummary(result);
        setIsSummaryLoading(false);
    };
    
    const toggleProductSelection = (productId: string, checked: boolean) => {
        setSelectedProductIds(prev => 
            checked ? [...prev, productId] : prev.filter(id => id !== productId)
        );
    };

    const renderMainContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                     <div className="space-y-6">
                        <section className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                            <StatCard title="Total Products" value={products.length.toString()} icon={<ArchiveBoxIcon className="w-6 h-6" />} />
                            {isAdmin && <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={<DollarSignIcon className="w-6 h-6" />} />}
                            <StatCard title="Low Stock Items" value={stats.lowStockCount.toString()} icon={<ExclamationTriangleIcon className="w-6 h-6" />} />
                        </section>
                        {isAdmin && (
                            <section>
                                <div className="bg-[#1B3C53] p-4 rounded-lg border border-primary">
                                    <h3 className="text-lg font-semibold mb-2 text-[#F2F2F2]">AI Performance Summary</h3>
                                    {summary ? (
                                        <p className="text-[#F2F2F2] whitespace-pre-wrap">{summary}</p>
                                    ) : (
                                        <p className="text-[#F2F2F2]">Click the button to generate an AI-powered summary of product performance.</p>
                                    )}
                                    <button onClick={handleGenerateSummary} disabled={isSummaryLoading} className="mt-2 px-3 py-1.5 text-sm bg-accent text-white rounded-md hover:bg-accent-hover disabled:bg-gray-400">
                                        {isSummaryLoading ? 'Generating...' : 'Generate Summary'}
                                    </button>
                                </div>
                            </section>
                        )}
                        <ProductPerformanceChart invoices={invoices} products={products} />
                        {isAdmin && <CategorySalesChart invoices={invoices} products={products} categories={categories} />}
                        {isAdmin && <SalesTrendChart invoices={invoices} products={products} />}
                     </div>
                );
            case 'products':
                return (
                    <div className="flex">
                        <CategorySidebar 
                            categories={categories}
                            selectedCategoryId={selectedCategoryId}
                            onSelectCategory={setSelectedCategoryId}
                            onSaveCategory={onSaveCategory}
                            onDeleteCategory={onDeleteCategory}
                            isAdmin={isAdmin}
                        />
                        <div className="flex-1 pl-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="relative w-1/2">
                                    <input type="search" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 pl-10 bg-primary border-secondary rounded-md" />
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                                </div>
                                {isAdmin && (
                                    <div className="flex items-center space-x-2">
                                        {selectedProductIds.length > 0 && (
                                            <button onClick={handleDeleteSelected} className="flex items-center space-x-2 bg-danger text-white px-4 py-2 rounded-md hover:opacity-90">
                                                <TrashIcon className="w-5 h-5" />
                                                <span>Delete ({selectedProductIds.length})</span>
                                            </button>
                                        )}
                                        <button onClick={() => setEditingProduct({} as Product)} className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover">
                                            <PlusIcon className="w-5 h-5" />
                                            <span>New Product</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map(p => (
                                    <ProductCard 
                                        key={p.id}
                                        product={p}
                                        category={categories.find(c => c.id === p.categoryId)}
                                        onClick={() => handleSelectProduct(p)}
                                        isSelected={selectedProductIds.includes(p.id)}
                                        onCheckboxChange={(checked) => toggleProductSelection(p.id, checked)}
                                        isAdmin={isAdmin}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: ChartBarIcon, adminOnly: false },
        { id: 'products', label: 'All Products', icon: ArchiveBoxIcon, adminOnly: false },
    ];

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold text-[#F2F2F2]">Product Management</h1>
            <div className="border-b border-secondary">
                <nav className="-mb-px flex space-x-6">
                    {tabs.filter(tab => !tab.adminOnly || isAdmin).map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                            className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                                activeTab === tab.id 
                                ? 'border-accent text-[#10b981]' 
                                : 'border-transparent text-[#F2F2F2]'
                            }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
            
            {renderMainContent()}

            {viewingProduct && (
                <ProductDetailModal 
                    isOpen={!!viewingProduct}
                    onClose={() => setViewingProduct(null)}
                    product={viewingProduct}
                    category={categories.find(c => c.id === viewingProduct.categoryId)}
                    invoices={invoices}
                    onEdit={handleEditProduct}
                    onDelete={onDeleteProducts}
                    isAdmin={isAdmin}
                />
            )}
             {editingProduct && (
                <ProductModal 
                    isOpen={!!editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSave={handleSaveAndCloseModal}
                    product={Object.keys(editingProduct).length === 0 ? null : editingProduct}
                    categories={categories}
                />
            )}
        </div>
    );
};