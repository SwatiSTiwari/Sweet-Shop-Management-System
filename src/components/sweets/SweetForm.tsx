import React, { useState, useEffect } from 'react';
import { Package, DollarSign, FileText, Image, Tag } from 'lucide-react';
import { Sweet } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface SweetFormProps {
  sweet?: Sweet | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sweetData: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  loading?: boolean;
}

export const SweetForm: React.FC<SweetFormProps> = ({
  sweet,
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    image_url: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price.toString(),
        quantity: sweet.quantity.toString(),
        description: sweet.description,
        image_url: sweet.image_url || ''
      });
    } else {
      setFormData({
        name: '',
        category: '',
        price: '',
        quantity: '',
        description: '',
        image_url: ''
      });
    }
    setErrors({});
  }, [sweet, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Sweet name is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Valid quantity is required';
    }

    if (formData.image_url && !isValidUrl(formData.image_url)) {
      newErrors.image_url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const sweetData = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      description: formData.description.trim(),
      image_url: formData.image_url.trim() || undefined
    };

    try {
      await onSubmit(sweetData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const categories = [
    'Chocolate',
    'Cakes',
    'Cookies',
    'Cupcakes',
    'Pastries',
    'Macarons',
    'Pies',
    'Fudge',
    'Muffins',
    'Candies',
    'Other'
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={sweet ? 'Edit Sweet' : 'Add New Sweet'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Sweet Name"
            icon={Package}
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            disabled={loading}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className={`
                  block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                  disabled:bg-gray-50 disabled:cursor-not-allowed
                  ${errors.category ? 'border-red-500' : ''}
                `}
                disabled={loading}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            min="0"
            icon={DollarSign}
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            error={errors.price}
            disabled={loading}
            required
          />

          <Input
            label="Quantity"
            type="number"
            min="0"
            icon={Package}
            value={formData.quantity}
            onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
            error={errors.quantity}
            disabled={loading}
            required
          />
        </div>

        <Input
          label="Image URL (optional)"
          type="url"
          icon={Image}
          value={formData.image_url}
          onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
          error={errors.image_url}
          disabled={loading}
          placeholder="https://example.com/image.jpg"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              placeholder="Describe this sweet..."
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            {sweet ? 'Update Sweet' : 'Add Sweet'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};