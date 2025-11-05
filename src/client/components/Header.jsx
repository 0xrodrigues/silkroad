import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ onSearch }) {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b border-black/5" style={{ background: 'rgba(251, 251, 253, 0.8)' }}>
      <div className="container-silk h-16 flex items-center justify-between gap-6">
        {/* Logo com glitch effect */}
        <Link to="/" className="font-mono text-lg font-semibold tracking-wide flex items-center gap-2">
          <span className="glitch" data-text="Silk Road">Silk Road</span>
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-[15px]" style={{ color: 'var(--muted)' }}>
          <Link to="/" className="hover:text-[var(--text)] transition-colors">
            Produtos
          </Link>
          <Link to="/sell/new" className="hover:text-[var(--text)] transition-colors">
            Vender
          </Link>
          <a href="#" className="hover:text-[var(--text)] transition-colors">
            Ajuda
          </a>
          <a href="#" className="font-medium hover:text-[var(--text)] transition-colors">
            Carrinho
          </a>
        </nav>

        {/* Campo de busca */}
        <form onSubmit={handleSubmit} className="relative flex-1 max-w-md">
          <svg 
            className="absolute left-3 top-2.5 h-5 w-5 pointer-events-none" 
            style={{ color: 'var(--muted)' }}
            viewBox="0 0 24 24" 
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
          </svg>
          <input
            type="text"
            name="search"
            placeholder="Buscar produtos..."
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full glass px-4 py-2 pl-10 text-[15px] outline-none focus:ring-2 transition-all"
            style={{ color: 'var(--text)' }}
          />
        </form>
      </div>
    </header>
  );
}

export default Header;
