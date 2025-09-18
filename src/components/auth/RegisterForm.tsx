import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { apiService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as 'admin' | 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.register(
        formData.email,
        formData.password,
        formData.role
      );
      login(response.user, response.token);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        type="email"
        label="Email Address"
        icon={Mail}
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        required
        disabled={loading}
        autoComplete="email"
      />

      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          label="Password"
          icon={Lock}
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          required
          disabled={loading}
          autoComplete="new-password"
        />
        <button
          type="button"
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <Input
        type={showPassword ? 'text' : 'password'}
        label="Confirm Password"
        icon={Lock}
        value={formData.confirmPassword}
        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
        required
        disabled={loading}
        autoComplete="new-password"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="customer"
              checked={formData.role === 'customer'}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'customer' }))}
              className="mr-2 text-orange-500 focus:ring-orange-500"
            />
            <User size={16} className="mr-2" />
            Customer
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={formData.role === 'admin'}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' }))}
              className="mr-2 text-orange-500 focus:ring-orange-500"
            />
            <User size={16} className="mr-2" />
            Administrator
          </label>
        </div>
      </div>

      <Button
        type="submit"
        loading={loading}
        fullWidth
        className="mt-6"
      >
        Create Account
      </Button>

      {onSwitchToLogin && (
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            Sign in
          </button>
        </p>
      )}
    </form>
  );
};