
import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import type { Product, ProductCategory } from '../../../types';
import { TagInput } from '../../common/TagInput';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Product) => void;
    product: Product | null;
    categories: ProductCategory[];
}

const getEmptyProduct = (): Omit<Product, 'id' | 'createdAt'> => ({
    name: '',
    sku: `SKU-${Date.now().toString().slice(-6)}`,
    categoryId: '',
    price: 0,
    description: '',
    image: 'https://i.imgur.com/s6m8k2x.png',
    stock: 0,
    tags: [],
});

export const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSave, product, categories }) => {
    const [formData, setFormData] = useState(getEmptyProduct());

    useEffect(() => {
        if (isOpen) {
            if (product) {
                const { id, createdAt, ...rest } = product;
                setFormData(rest);
            } else {
                setFormData(getEmptyProduct());
            }
        }
    }, [product, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productToSave: Product = {
            ...formData,
            id: product?.id || `PROD-${Date.now()}`,
            createdAt: product?.createdAt || new Date().toISOString(),
        };
        onSave(productToSave);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Edit Product' : 'Add New Product'} size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
                    <InputField label="SKU" name="sku" value={formData.sku} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Description</label>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} required />
                    <InputField label="Stock Quantity" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
                    <SelectField label="Category" name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                        <option value="" disabled>Select a category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </SelectField>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Tags</label>
                    <TagInput 
                        tags={formData.tags}
                        onTagsChange={(tags) => setFormData(p => ({...p, tags: tags}))}
                        placeholder="Add product tags (e.g., security, pvp)"
                    />
                </div>
                <InputField label="Image URL" name="image" value={formData.image} onChange={handleChange} />

                <div className="pt-4 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-primary border border-secondary rounded-md hover:bg-secondary">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent-hover">Save Product</button>
                </div>
            </form>
        </Modal>
    );
};

const InputField: React.FC<any> = ({ label, name, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>
        <input id={name} name={name} {...props} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md" />
    </div>
);

const SelectField: React.FC<any> = ({ label, name, children, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-text-secondary">{label}</label>
        <select id={name} name={name} {...props} className="w-full mt-1 p-2 bg-primary border border-secondary rounded-md">
            {children}
        </select>
    </div>
);
