import React, { useState, useMemo } from 'react';
import type { ProductCategory, Product } from '../../../types';
import { Card } from '../../common/Card';
import { Table, type Column } from '../../common/Table';
import { PencilIcon } from '../../icons/PencilIcon';
import { TrashIcon } from '../../icons/TrashIcon';
import { PlusIcon } from '../../icons/PlusIcon';
import { Modal } from '../../common/Modal';

// CategoryModal is defined within this file for encapsulation
const CategoryModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (category: ProductCategory) => void;
    category: ProductCategory | null;
}> = ({ isOpen, onClose, onSave, category }) => {
    const [name, setName] = useState('');

    React.useEffect(() => {
        if (category) {
            setName(category.name);
        } else {
            setName('');
        }
    }, [category, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave({
                id: category?.id || `CAT-${Date.now()}`,
                name: name.trim(),
            });
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={category ? 'Edit Category' : 'Add New Category'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary">Category Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md"
                    />
                </div>
                <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-secondary rounded-md">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md">Save</button>
                </div>
            </form>
        </Modal>
    );
};


interface CategoryManagerViewProps {
    categories: ProductCategory[];
    products: Product[];
    onSaveCategory: (category: ProductCategory) => void;
    onDeleteCategory: (categoryId: string) => void;
}

export const CategoryManagerView: React.FC<CategoryManagerViewProps> = ({ categories, products, onSaveCategory, onDeleteCategory }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);

    const categoriesWithProductCount = useMemo(() => {
        return categories.map(category => ({
            ...category,
            productCount: products.filter(p => p.categoryId === category.id).length
        }));
    }, [categories, products]);

    const handleEdit = (category: ProductCategory) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleDelete = (category: ProductCategory) => {
        const hasProducts = products.some(p => p.categoryId === category.id);
        if (hasProducts) {
            alert(`Cannot delete category "${category.name}" as it still contains products. Please reassign or delete the products first.`);
            return;
        }
        if (window.confirm(`Are you sure you want to delete the category "${category.name}"? This cannot be undone.`)) {
            onDeleteCategory(category.id);
        }
    };

    const columns: Column<typeof categoriesWithProductCount[0]>[] = [
        { header: 'Category Name', accessor: 'name', cell: c => <span className="font-semibold">{c.name}</span> },
        { header: 'Category ID', accessor: 'id', cell: c => <span className="font-mono text-xs">{c.id}</span> },
        { header: 'Product Count', accessor: 'productCount' },
        {
            header: 'Actions',
            accessor: 'id',
            sortable: false,
            cell: (category) => (
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleEdit(category)} className="p-1.5 hover:bg-slate-200 rounded-full">
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(category)} className="p-1.5 hover:bg-slate-200 rounded-full text-danger">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <Card>
            <div className="flex justify-between items-center mb-4 -mt-2">
                <h2 className="text-2xl font-bold">Manage Categories</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover">
                    <PlusIcon className="w-5 h-5" />
                    <span>New Category</span>
                </button>
            </div>
            <div className="-m-6">
                <Table columns={columns} data={categoriesWithProductCount} />
            </div>
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={onSaveCategory}
                category={editingCategory}
            />
        </Card>
    );
};