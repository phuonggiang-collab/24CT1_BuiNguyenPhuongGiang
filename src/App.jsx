import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { BannerSlider } from './components/home/BannerSlider';
import { CategoryGrid } from './components/home/CategoryGrid';
import { FlashSale } from './components/home/FlashSale';
import { FilterSidebar } from './components/home/FilterSidebar';
import { ProductGrid } from './components/home/ProductGrid';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { CartView } from './components/cart/CartView';
import { OrderManagement } from './components/order/OrderManagement';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileDrawer } from './components/auth/ProfileDrawer';
import { api } from './services/api';

const MainApp = () => {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'cart' | 'orders'
  const [categories, setCategories] = useState([]);
  const [flashProducts, setFlashProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [filterParams, setFilterParams] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load Categories and Flash Sale items
  useEffect(() => {
    api.getCategories().then(res => {
      if (res.success && res.categories) setCategories(res.categories);
    }).catch(console.error);

    api.getFlashSale().then(res => {
      if (res.success && res.products) setFlashProducts(res.products);
    }).catch(console.error);
  }, []);

  // Fetch product list or recommendations based on filters/category/search
  useEffect(() => {
    setLoading(true);
    if (searchQuery) {
      api.searchProducts(searchQuery).then(res => {
        if (res.success && res.products) setProducts(res.products);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else if (activeCategory === 'all' && !filterParams.min_price && !filterParams.rating) {
      // Smart recommendation algorithm on default landing
      api.getRecommendations().then(res => {
        if (res.success && res.products) {
          let list = [...res.products];
          if (sortBy === 'price_asc') list.sort((a, b) => a.sale_price - b.sale_price);
          else if (sortBy === 'price_desc') list.sort((a, b) => b.sale_price - a.sale_price);
          else if (sortBy === 'best_seller') list.sort((a, b) => b.sold_quantity - a.sold_quantity);
          else if (sortBy === 'newest') list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setProducts(list);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      const params = {
        category_id: activeCategory !== 'all' ? activeCategory : undefined,
        sort_by: sortBy,
        ...filterParams
      };
      api.getProducts(params).then(res => {
        if (res.success && res.products) setProducts(res.products);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [activeCategory, sortBy, filterParams, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentView('home');
  };

  const handleCategorySelect = (catId) => {
    setActiveCategory(catId);
    setSearchQuery('');
    setCurrentView('home');
  };

  const handleBannerClick = (category) => {
    if (category) {
      setActiveCategory(category);
    }
    setCurrentView('home');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        onSearch={handleSearch}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Main Body */}
      <main style={{ flex: 1 }}>
        {currentView === 'home' && (
          <div className="grape-container">
            {/* Banner Slider */}
            {!searchQuery && <BannerSlider onBannerClick={handleBannerClick} />}

            {/* Category Grid */}
            {!searchQuery && (
              <CategoryGrid
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={handleCategorySelect}
              />
            )}

            {/* Flash Sale Countdown Bar */}
            {!searchQuery && activeCategory === 'all' && (
              <FlashSale
                flashProducts={flashProducts}
                onSelectProduct={(id) => setSelectedProductId(id)}
              />
            )}

            {/* Shop Layout: Sidebar Filter & Products Grid */}
            <div className="grape-shop-layout">
              <FilterSidebar
                categories={categories}
                activeCategory={activeCategory}
                onSelectCategory={handleCategorySelect}
                onFilterChange={(newFilters) => setFilterParams(newFilters)}
              />

              <ProductGrid
                products={products}
                sortBy={sortBy}
                onSortChange={(sort) => setSortBy(sort)}
                onSelectProduct={(id) => setSelectedProductId(id)}
                title={
                  searchQuery
                    ? `KẾT QUẢ TÌM KIẾM: "${searchQuery}" (${products.length} sản phẩm)`
                    : activeCategory !== 'all'
                    ? `DANH MỤC: ${categories.find(c => c.id === activeCategory)?.name || 'Sản phẩm'} (${products.length})`
                    : 'GỢI Ý HÔM NAY - ĐỀ XUẤT DÀNH CHO BẠN 🍇'
                }
              />
            </div>
          </div>
        )}

        {currentView === 'cart' && (
          <CartView
            onBackToHome={() => setCurrentView('home')}
            onOrderSuccess={() => setCurrentView('orders')}
          />
        )}

        {currentView === 'orders' && (
          <OrderManagement
            onBackToHome={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      {selectedProductId && (
        <ProductDetailModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
          onBuyNow={() => {
            setSelectedProductId(null);
            setCurrentView('cart');
          }}
        />
      )}

      <AuthModal />
      <ProfileDrawer />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
