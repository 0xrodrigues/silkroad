import { Link } from 'react-router-dom';

function formatPrice(price) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function ProductCard({ product }) {
  const { productId, title, price, currency, images } = product;
  const image = images && images.length > 0 ? images[0] : '/placeholder.png';

  return (
    <Link to={`/products/${productId}`}>
      <article className="glass p-3 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
        {/* Imagem do produto */}
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-black/5">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400?text=Produto';
            }}
          />
        </div>

        {/* Informações do produto */}
        <div className="mt-3">
          <h3 
            className="text-base font-semibold tracking-tight line-clamp-2 min-h-[3rem]"
            style={{ color: 'var(--text)' }}
            title={title}
          >
            {title}
          </h3>
          
          {/* Preço com fonte mono */}
          <div className="mt-2 flex items-center justify-between">
            <span className="font-mono text-[15px]" style={{ color: 'var(--text)' }}>
              {formatPrice(price)} {currency}
            </span>
            <span 
              className="inline-flex items-center rounded-2xl px-3 py-1.5 text-sm font-medium text-white transition-all group-hover:brightness-110"
              style={{ background: 'var(--primary)' }}
            >
              Ver
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;
