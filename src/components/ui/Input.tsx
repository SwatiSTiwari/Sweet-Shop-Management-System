import React, { forwardRef } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, fullWidth = true, className = '', ...props }, ref) => {
    const inputClasses = `
      block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
      focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
      disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
      transition-colors duration-200
      ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
      ${Icon ? 'pl-10' : ''}
      ${className}
    `.trim();

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);