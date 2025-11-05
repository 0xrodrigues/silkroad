import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import api from '../services/api';

const CATEGORIES = [
  'Eletrônicos',
  'Cursos Digitais',
  'Moda e Estilo',
  'Colecionáveis',
  'Arte e Design',
  'Livros e Mídia',
  'Serviços',
  'Outros'
];

const CURRENCIES = [
  { code: 'BRL', symbol: 'R$', name: 'Real', min: 0.01, step: 0.01, decimals: 2 },
  { code: 'USD', symbol: '$', name: 'Dólar', min: 0.01, step: 0.01, decimals: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', min: 0.01, step: 0.01, decimals: 2 },
  { code: 'BTC', symbol: '₿', name: 'Bitcoin', min: 0.00000001, step: 0.00000001, decimals: 8 },
  { code: 'ETH', symbol: 'Ξ', name: 'Ethereum', min: 0.000001, step: 0.000001, decimals: 6 },
];

function NewProduct() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sellerId, setSellerId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'BRL',
    category: '',
    isDigital: false,
    quantity: 1,
    tags: '',
    imageUrls: ''
  });

  useEffect(() => {
    // Buscar produtos existentes para pegar um sellerId válido
    const fetchSellerId = async () => {
      try {
        const products = await api.getProducts();
        if (products && products.length > 0) {
          setSellerId(products[0].sellerId);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchSellerId();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    // Permite valores vazios ou números válidos
    if (value === '' || !isNaN(value)) {
      setFormData(prev => ({
        ...prev,
        price: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!sellerId) {
      setError('Não foi possível obter o ID do vendedor. Tente novamente.');
      return;
    }

    // Validar preço mínimo baseado na moeda
    const priceValue = parseFloat(formData.price);
    if (isNaN(priceValue) || priceValue < selectedCurrency.min) {
      setError(`O preço deve ser no mínimo ${selectedCurrency.min} ${selectedCurrency.code}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const tags = formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      const images = formData.imageUrls
        ? formData.imageUrls.split(',').map(url => url.trim()).filter(Boolean)
        : ['https://via.placeholder.com/400?text=Produto'];

      const payload = {
        title: formData.title,
        description: formData.description,
        sellerId: sellerId,
        price: parseFloat(formData.price),
        currency: formData.currency,
        tags,
        category: formData.category,
        status: 'ACTIVE',
        images,
        quantity: parseInt(formData.quantity),
        isDigital: formData.isDigital,
        deliveryMethod: formData.isDigital ? 1 : 2, // 1 = DIGITAL_LINK, 2 = PHYSICAL_SHIPPING
        estimatedDelivery: formData.isDigital ? 0 : null,
      };

      await api.createProduct(payload);
      navigate('/');
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.message || 'Erro ao criar produto. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  const selectedCurrency = CURRENCIES.find(c => c.code === formData.currency) || CURRENCIES[0];
  const currencySymbol = selectedCurrency.symbol;

  // Formatar número sem notação científica
  const formatNumber = (num) => {
    return num.toFixed(selectedCurrency.decimals);
  };

  return (
    <>
      <Header />
      
      <main className="container-silk py-8">
        <div className="max-w-3xl mx-auto">
          <div className="glass p-8">
            <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text)' }}>
              Novo Produto
            </h1>

            {error && (
              <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(229, 57, 53, 0.1)', color: 'var(--danger)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Título *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full glass px-4 py-2 text-[15px] outline-none focus:ring-2 transition-all"
                  style={{ color: 'var(--text)' }}
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Descrição *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full glass px-4 py-2 text-[15px] outline-none focus:ring-2 transition-all resize-none"
                  style={{ color: 'var(--text)' }}
                  required
                />
              </div>

              {/* Preço e Moeda */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                    Preço *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-mono" style={{ color: 'var(--muted)' }}>
                      {currencySymbol}
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      name="price"
                      value={formData.price}
                      onChange={handlePriceChange}
                      className="w-full glass px-4 py-2 pl-10 text-[15px] outline-none focus:ring-2 transition-all font-mono"
                      style={{ color: 'var(--text)' }}
                      placeholder={`Ex: ${formatNumber(selectedCurrency.min)}`}
                      pattern="[0-9]*[.,]?[0-9]*"
                      required
                    />
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                    Valor mínimo: {formatNumber(selectedCurrency.min)} {selectedCurrency.code}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                    Moeda *
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full glass px-4 py-2 text-[15px] outline-none focus:ring-2 transition-all"
                    style={{ color: 'var(--text)' }}
                    required
                  >
                    {CURRENCIES.map(curr => (
                      <option key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Categoria *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full glass px-4 py-2 text-[15px] outline-none focus:ring-2 transition-all"
                  style={{ color: 'var(--text)' }}
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Quantidade e Digital */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                    Quantidade
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    className="w-full glass px-4 py-2 text-[15px] outline-none focus:ring-2 transition-all"
                    style={{ color: 'var(--text)' }}
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isDigital"
                      checked={formData.isDigital}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                    <span className="text-sm" style={{ color: 'var(--text)' }}>
                      Produto Digital
                    </span>
                  </label>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="ex: eletrônico, novo, promoção"
                  className="w-full glass px-4 py-2 text-[15px] outline-none focus:ring-2 transition-all"
                  style={{ color: 'var(--text)' }}
                />
              </div>

              {/* URLs de Imagens */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  URLs das Imagens (separadas por vírgula)
                </label>
                <input
                  type="text"
                  name="imageUrls"
                  value={formData.imageUrls}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/imagem1.jpg, https://exemplo.com/imagem2.jpg"
                  className="w-full glass px-4 py-2 text-[15px] outline-none focus:ring-2 transition-all"
                  style={{ color: 'var(--text)' }}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                  Se deixar em branco, será usada uma imagem placeholder
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
                  style={{ background: 'var(--primary)' }}
                >
                  {isSubmitting ? 'Publicando...' : 'Publicar Produto'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-3 rounded-xl font-semibold transition-all hover:bg-black/5"
                  style={{ color: 'var(--muted)' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export default NewProduct;
