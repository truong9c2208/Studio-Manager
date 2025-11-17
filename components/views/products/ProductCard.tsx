import React from 'react';
import type { Product, ProductCategory } from '../../../types';
import { Badge } from '../../common/Badge';

interface ProductCardProps {
  product: Product;
  category: ProductCategory | undefined;
  onClick: () => void;
  isSelected: boolean;
  onCheckboxChange: (checked: boolean) => void;
  isAdmin: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, category, onClick, isSelected, onCheckboxChange, isAdmin }) => {
  return (
    <div
      className={`bg-secondary rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden border-2 relative ${
        isSelected ? 'border-accent scale-105' : 'border-transparent'
      }`}
    >
      {isAdmin && (
        <div className="absolute top-2 left-2 z-10" onClick={(e) => e.stopPropagation()}>
           <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onCheckboxChange(e.target.checked)}
            className="h-5 w-5 text-accent border-gray-300 rounded focus:ring-accent"
          />
        </div>
      )}

      <div onClick={onClick} className="cursor-pointer h-full flex flex-col">
        <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            <h3 className="font-bold text-lg text-text-primary">{product.name}</h3>
            <div className="mt-1">
              {product.stock === 0 ? (
                <Badge text="Out of Stock" color="danger" size="sm" />
              ) : product.stock < 10 ? (
                <Badge text={`Low Stock (${product.stock})`} color="warning" size="sm" />
              ) : (
                <Badge text="In Stock" color="success" size="sm" />
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Badge text={category?.name || 'Uncategorized'} color="info" size="sm" />
            <span className="font-bold text-lg text-accent">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};