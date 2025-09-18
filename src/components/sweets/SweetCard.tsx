import React, { useState } from 'react';
import { ShoppingCart, Package, DollarSign, Eye } from 'lucide-react';
import { Sweet } from '../../types';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/api';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase?: (sweet: Sweet) => void;
  onUpdate?: () => void;
  onEdit?: (sweet: Sweet) => void;
}

export const SweetCard: React.FC<SweetCardProps> = ({ 
  sweet, 
  onPurchase, 
  onUpdate,
  onEdit 
}) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handlePurchase = async () => {
    if (!isAuthenticated || sweet.quantity < quantity) return;

    setLoading(true);
    try {
      await apiService.purchaseSweet(sweet.id, { quantity });
      onPurchase?.(sweet);
      onUpdate?.();
    } catch (error) {
      console.error('Purchase failed:', error);
      alert(error instanceof Error ? error.message : 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const maxQuantity = Math.min(10, sweet.quantity); // Limit purchase to 10 or available stock

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200">
      <div className="relative">
        {sweet.image_url ? (
          <img
            src={sweet.image_url}
            alt={sweet.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center">
            <Package className="h-16 w-16 text-gray-400" />
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${sweet.quantity > 10 ? 'bg-green-100 text-green-800' : 
              sweet.quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-red-100 text-red-800'}
          `}>
            {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 truncate">{sweet.name}</h3>
          <span className="flex items-center text-green-600 font-bold">
            <DollarSign size={16} />
            {sweet.price.toFixed(2)}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-2">{sweet.category}</p>
        
        {sweet.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{sweet.description}</p>
        )}

        <div className="space-y-2">
          {isAuthenticated && sweet.quantity > 0 && (
            <div className="flex items-center space-x-2">
              <label htmlFor={`quantity-${sweet.id}`} className="text-sm font-medium text-gray-700">
                Qty:
              </label>
              <select
                id={`quantity-${sweet.id}`}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={loading}
              >
                {Array.from({ length: maxQuantity }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-2">
            {isAuthenticated ? (
              <Button
                onClick={handlePurchase}
                disabled={sweet.quantity === 0 || loading}
                loading={loading}
                icon={ShoppingCart}
                size="sm"
                fullWidth
              >
                {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                icon={Eye}
                fullWidth
                disabled
              >
                Login to Purchase
              </Button>
            )}

            {isAdmin && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onEdit?.(sweet)}
                className="px-3"
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};