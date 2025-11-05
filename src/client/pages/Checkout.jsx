import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import api from '../services/api';

function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    quantity: 1,
    paymentMethod: 'PIX',
    shippingAddress: '',
    notes: ''
  });

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Produto não encontrado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!product.isDigital && !formData.shippingAddress) {
      setError('Endereço de entrega é obrigatório para produtos físicos');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        productId: product.productId,
        buyerId: '9ade7b3e-e2e6-4a3b-b79b-62f6d855adf6', // TODO: Get from auth
        sellerId: product.sellerId,
        quantity: parseInt(formData.quantity),
        price: product.price * parseInt(formData.quantity),
        paymentMethod: formData.paymentMethod,
        shippingAddress: formData.shippingAddress || null,
        notes: formData.notes || null
      };

      await api.createOrder(orderData);
      
      alert('Pedido realizado com sucesso!');
      navigate('/');
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.message || 'Erro ao criar pedido. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container-silk py-8">
          <div className="text-center p-10">
            <p className="animate-pulse-subtle" style={{ color: 'var(--muted)' }}>
              Carregando...
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
            <p style={{ color: 'var(--muted)' }}>{error || 'Produto não encontrado'}</p>
          </div>
        </main>
      </>
    );
  }

  const totalPrice = product.price * parseInt(formData.quantity);

  return (
    <>
      <Header />
      
      <main className="container-silk py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text)' }}>
            Finalizar Compra
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulário */}
            <div className="lg:col-span-2">
              <div className="glass p-6">
                {error && (
                  <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(229, 57, 53, 0.1)', color: 'var(--danger)' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Quantidade */}
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
                      max={product.quantity}
                      className="w-full glass px-4 py-2 text-[15px] outline-none focus:ring-2 transition-all"
                      style={{ color: 'var(--text)' }}
                      required
                    />
                  </div>

                  {/* Método de Pagamento */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                      Método de Pagamento
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full glass px-4 py-2 text-[15px] outline-none focus:ring-2 transition-all"
                      style={{ color: 'var(--text)' }}
                      required
                    >
                      <option value="PIX">PIX</option>
                      <option value="CREDIT_CARD">Cartão de Crédito</option>
                      <option value="CRYPTO">Criptomoeda</option>
                      <option value="BOLETO">Boleto</option>
                    </select>
                  </div>

                  {/* Endereço de Entrega */}
                  {!product.isDigital && (
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                        Endereço de Entrega *
                      </label>
                      <textarea
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                        rows={3}
                        className="w-full glass px-4 py-2 text-[15px] outline-none focus:ring-2 transition-all resize-none"
                        style={{ color: 'var(--text)' }}
                        required={!product.isDigital}
                      />
                    </div>
                  )}

                  {/* Observações */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                      Observações
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full glass px-4 py-2 text-[15px] outline-none focus:ring-2 transition-all resize-none"
                      style={{ color: 'var(--text)' }}
                      placeholder="Informações adicionais sobre o pedido..."
                    />
                  </div>

                  {/* Botões */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
                      style={{ background: 'var(--primary)' }}
                    >
                      {isSubmitting ? 'Processando...' : 'Confirmar Pedido'}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/products/${id}`)}
                      className="px-6 py-3 rounded-xl font-semibold transition-all hover:bg-black/5"
                      style={{ color: 'var(--muted)' }}
                    >
                      Voltar
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Resumo do Pedido */}
            <div>
              <div className="glass p-6 sticky top-20">
                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
                  Resumo do Pedido
                </h2>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/80'}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=Produto';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-2" style={{ color: 'var(--text)' }}>
                        {product.title}
                      </h3>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                        {formatPrice(product.price)} {product.currency}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4" style={{ borderColor: 'var(--glass-stroke)' }}>
                    <div className="flex justify-between text-sm mb-2">
                      <span style={{ color: 'var(--muted)' }}>Quantidade:</span>
                      <span style={{ color: 'var(--text)' }}>{formData.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span style={{ color: 'var(--muted)' }}>Subtotal:</span>
                      <span style={{ color: 'var(--text)' }}>
                        {formatPrice(totalPrice)} {product.currency}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4" style={{ borderColor: 'var(--glass-stroke)' }}>
                    <div className="flex justify-between font-semibold text-lg">
                      <span style={{ color: 'var(--text)' }}>Total:</span>
                      <span style={{ color: 'var(--primary)' }}>
                        {formatPrice(totalPrice)} {product.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Checkout;
