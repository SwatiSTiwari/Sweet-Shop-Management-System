import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { apiService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.login(formData.email, formData.password);
      login(response.user, response.token);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
          autoComplete="current-password"
        />
        <button
          type="button"
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <Button
        type="submit"
        loading={loading}
        fullWidth
        className="mt-6"
      >
        Sign In
      </Button>

      {onSwitchToRegister && (
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
          >
            Sign up
          </button>
        </p>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
        <p className="font-medium">Demo Accounts:</p>
        <p>Admin: admin@sweetshop.com / admin123</p>
        <p>Customer: customer@example.com / customer123</p>
      </div>
    </form>
  );
};