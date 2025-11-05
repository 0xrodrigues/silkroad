import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import api from '../services/api';

function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProduct(id);
      setProduct(data);
      
      // Increment view count
      await api.incrementView(id).catch(err => console.error('Failed to increment view:', err));
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = () => {
    navigate(`/checkout/${id}`);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container-silk py-8">
          <div className="text-center p-10">
            <p className="animate-pulse-subtle" style={{ color: 'var(--muted)' }}>
              Carregando produto...
            </p>
          </div>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="container-silk py-8">
          <div className="text-center p-10">
            <p style={{ color: 'var(--muted)' }}>Produto não encontrado.</p>
            <Link to="/" className="text-sm mt-4 inline-block" style={{ color: 'var(--primary)' }}>
              Voltar para home
            </Link>
          </div>
        </main>
      </>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/600?text=Produto'];

  return (
    <>
      <Header />
      
      <main className="container-silk py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Galeria de imagens */}
            <div>
              <div className="glass p-4 mb-4">
                <img
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full aspect-square object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600?text=Produto';
                  }}
                />
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`glass p-2 flex-shrink-0 transition-all ${
                        selectedImage === idx ? 'ring-2' : ''
                      }`}
                      style={{ '--tw-ring-color': 'var(--primary)' }}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/80?text=Img';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações do produto */}
            <div>
              <div className="glass p-6">
                <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text)' }}>
                  {product.title}
                </h1>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl font-mono font-bold" style={{ color: 'var(--primary)' }}>
                    {formatPrice(product.price)} {product.currency}
                  </span>
                  {product.isDigital && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--secondary)', color: 'white' }}>
                      Digital
                    </span>
                  )}
                </div>

                <div className="mb-6 space-y-3 text-sm" style={{ color: 'var(--muted)' }}>
                  {product.category && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium" style={{ color: 'var(--text)' }}>Categoria:</span>
                      <span>{product.category}</span>
                    </div>
                  )}
                  {product.quantity && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium" style={{ color: 'var(--text)' }}>Estoque:</span>
                      <span>{product.quantity} unidades</span>
                    </div>
                  )}
                  {product.viewCount !== undefined && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium" style={{ color: 'var(--text)' }}>Visualizações:</span>
                      <span>{product.viewCount}</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>
                    Descrição
                  </h2>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--muted)' }}>
                    {product.description}
                  </p>
                </div>

                {product.tags && product.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-xs"
                          style={{ background: 'rgba(0, 200, 83, 0.1)', color: 'var(--primary)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:brightness-110"
                  style={{ background: 'var(--primary)' }}
                >
                  Comprar Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default ProductPage;
