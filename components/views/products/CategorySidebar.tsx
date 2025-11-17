import React, { useState } from 'react';
import type { ProductCategory } from '../../../types';
import { PlusIcon } from '../../icons/PlusIcon';
import { PencilIcon } from '../../icons/PencilIcon';
import { TrashIcon } from '../../icons/TrashIcon';

interface CategorySidebarProps {
  categories: ProductCategory[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  onSaveCategory: (category: ProductCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
  isAdmin: boolean;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories, selectedCategoryId, onSelectCategory, onSaveCategory, onDeleteCategory, isAdmin }) => {
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleStartEdit = (category: ProductCategory) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setNewCategoryName('');
  };

  const handleSave = () => {
    if (editingCategory && newCategoryName.trim()) {
      onSaveCategory({ ...editingCategory, name: newCategoryName.trim() });
    }
    handleCancelEdit();
  };
  
  const handleAddNew = () => {
    const newName = prompt("Enter new category name:");
    if (newName && newName.trim()) {
        onSaveCategory({ id: `CAT-${Date.now()}`, name: newName.trim() });
    }
  };
  
  const handleDelete = (category: ProductCategory) => {
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"? This cannot be undone.`)) {
        onDeleteCategory(category.id);
    }
  };


  return (
    <aside className="w-64 bg-secondary p-6 flex-shrink-0 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Categories</h2>
        {isAdmin && (
          <button onClick={handleAddNew} className="p-2 text-text-secondary hover:text-accent hover:bg-primary rounded-full">
              <PlusIcon className="w-5 h-5"/>
          </button>
        )}
      </div>
      <nav className="flex-grow">
        <ul>
          <li>
            <button
              onClick={() => onSelectCategory('all')}
              className={`w-full text-left p-3 my-1 rounded-lg transition-colors font-semibold ${
                selectedCategoryId === 'all'
                  ? 'bg-accent text-white'
                  : 'text-text-secondary hover:bg-primary hover:text-text-primary'
              }`}
            >
              All Products
            </button>
          </li>
          {categories.map(category => (
            <li key={category.id} className="group relative">
              {editingCategory?.id === category.id ? (
                <div className="my-1">
                    <input 
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="w-full p-2 text-sm rounded-md border-accent"
                        autoFocus
                    />
                    <div className="flex justify-end space-x-1 mt-1">
                        <button onClick={handleCancelEdit} className="text-xs font-semibold px-2 py-1 rounded hover:bg-primary">Cancel</button>
                        <button onClick={handleSave} className="text-xs font-semibold px-2 py-1 rounded bg-accent text-white hover:bg-accent-hover">Save</button>
                    </div>
                </div>
              ) : (
                <button
                  onClick={() => onSelectCategory(category.id)}
                  className={`w-full text-left p-3 my-1 rounded-lg transition-colors font-semibold ${
                    selectedCategoryId === category.id
                      ? 'bg-accent text-white'
                      : 'text-text-secondary hover:bg-primary hover:text-text-primary'
                  }`}
                >
                  {category.name}
                </button>
              )}
              {isAdmin && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-inherit">
                   <button onClick={() => handleStartEdit(category)} className="p-1.5 hover:bg-slate-300 rounded-full"><PencilIcon className="w-4 h-4" /></button>
                   <button onClick={() => handleDelete(category)} className="p-1.5 hover:bg-slate-300 rounded-full text-danger"><TrashIcon className="w-4 h-4" /></button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};