import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Header } from './components/layout/Header';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { SweetCard } from './components/sweets/SweetCard';
import { SearchFiltersComponent } from './components/sweets/SearchFilters';
import { SweetForm } from './components/sweets/SweetForm';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Sweet, SearchFilters } from './types';
import { apiService } from './services/api';

function AppContent() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>({});
  
  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [showSweetForm, setShowSweetForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

  const loadSweets = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSweets(filters);
      setSweets(response.sweets);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(response.sweets.map(sweet => sweet.category)));
      setCategories(uniqueCategories.sort());
    } catch (error) {
      console.error('Error loading sweets:', error);
      setSweets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSweets();
  }, [filters]);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    loadSweets();
  };

  const handleSweetSubmit = async (sweetData: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingSweet) {
        await apiService.updateSweet(editingSweet.id, sweetData);
      } else {
        await apiService.createSweet(sweetData);
      }
      await loadSweets();
      setShowSweetForm(false);
      setEditingSweet(null);
    } catch (error) {
      console.error('Error saving sweet:', error);
      throw error;
    }
  };

  const handleEditSweet = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setShowSweetForm(true);
  };

  const handleAddSweet = () => {
    setEditingSweet(null);
    setShowSweetForm(true);
  };

  const handlePurchase = () => {
    loadSweets(); // Refresh to show updated quantities
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading sweet treats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthClick={() => setShowAuthModal(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Our Sweet Collection</h2>
              <p className="text-gray-600 mt-2">
                Discover delicious treats for every occasion
              </p>
            </div>
            
            {isAdmin && (
              <Button
                onClick={handleAddSweet}
                icon={Plus}
                variant="primary"
              >
                Add Sweet
              </Button>
            )}
          </div>

          <SearchFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            categories={categories}
            loading={loading}
          />
        </div>

        {sweets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sweets found</h3>
            <p className="text-gray-500">
              {Object.values(filters).some(v => v !== undefined && v !== '') 
                ? 'Try adjusting your search filters'
                : 'Check back soon for new sweet treats!'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map(sweet => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                onPurchase={handlePurchase}
                onUpdate={loadSweets}
                onEdit={handleEditSweet}
              />
            ))}
          </div>
        )}
      </main>

      {/* Auth Modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={authMode === 'login' ? 'Sign In' : 'Create Account'}
      >
        {authMode === 'login' ? (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onSwitchToRegister={() => setAuthMode('register')}
          />
        ) : (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
      </Modal>

      {/* Sweet Form Modal */}
      {isAdmin && (
        <SweetForm
          sweet={editingSweet}
          isOpen={showSweetForm}
          onClose={() => {
            setShowSweetForm(false);
            setEditingSweet(null);
          }}
          onSubmit={handleSweetSubmit}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;