import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import CategorySidebar from '../components/CategorySidebar';
import api from '../services/api';

function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (search = '') => {
    setIsLoading(true);
    try {
      const data = await api.getProducts(search);
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value) => {
    setQuery(value);
    loadProducts(value);
  };

  // Calcular categorias com contagem dinâmica
  const categories = useMemo(() => {
    if (!products.length) return [];
    
    const categoryMap = new Map();
    
    products.forEach((product) => {
      const category = product.category || 'Outros';
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [products]);

  // Filtrar produtos por categoria
  const filteredProducts = useMemo(() => {
    if (!products.length) return [];
    if (!selectedCategory) return products;
    
    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <>
      <Header onSearch={handleSearch} />
      
      <main className="container-silk py-8">
        {isLoading ? (
          <div className="text-center p-10">
            <p className="animate-pulse-subtle" style={{ color: 'var(--muted)' }}>
              Carregando produtos...
            </p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-[16rem_1fr] gap-8">
            {/* Sidebar desktop */}
            <CategorySidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Conteúdo principal */}
            <div>
              {/* Grid de produtos filtrados */}
              {filteredProducts.length > 0 ? (
                <ProductGrid products={filteredProducts} />
              ) : (
                <div className="text-center p-10">
                  <p style={{ color: 'var(--muted)' }}>
                    Nenhum produto encontrado nesta categoria.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center p-10">
            <p style={{ color: 'var(--muted)' }}>Nenhum produto encontrado.</p>
          </div>
        )}
      </main>
    </>
  );
}

export default Home;
