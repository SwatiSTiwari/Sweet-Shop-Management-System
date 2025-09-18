import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { SearchFilters } from '../../types';

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  categories: string[];
  loading?: boolean;
}

export const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
  loading = false
}) => {
  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter size={20} className="text-gray-600 mr-2" />
          <h3 className="font-medium text-gray-900">Search & Filter</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            disabled={loading}
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="text"
          placeholder="Search sweets..."
          icon={Search}
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          disabled={loading}
        />

        <select
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
          value={filters.category || ''}
          onChange={(e) => onFiltersChange({ ...filters, category: e.target.value || undefined })}
          disabled={loading}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <Input
          type="number"
          placeholder="Min Price"
          step="0.01"
          min="0"
          value={filters.minPrice || ''}
          onChange={(e) => onFiltersChange({ 
            ...filters, 
            minPrice: e.target.value ? parseFloat(e.target.value) : undefined 
          })}
          disabled={loading}
        />

        <Input
          type="number"
          placeholder="Max Price"
          step="0.01"
          min="0"
          value={filters.maxPrice || ''}
          onChange={(e) => onFiltersChange({ 
            ...filters, 
            maxPrice: e.target.value ? parseFloat(e.target.value) : undefined 
          })}
          disabled={loading}
        />
      </div>
    </div>
  );
};