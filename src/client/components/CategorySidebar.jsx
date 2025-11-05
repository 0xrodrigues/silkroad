function CategorySidebar({ categories, selectedCategory, onSelectCategory }) {
  return (
    <aside className="hidden lg:block">
      <div className="glass p-4 sticky top-20">
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>
          Categorias
        </h2>
        <nav className="space-y-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedCategory 
                ? 'font-medium' 
                : 'hover:bg-black/5'
            }`}
            style={{ 
              color: !selectedCategory ? 'var(--primary)' : 'var(--muted)',
              background: !selectedCategory ? 'rgba(0, 200, 83, 0.1)' : 'transparent'
            }}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => onSelectCategory(category.name)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                selectedCategory === category.name 
                  ? 'font-medium' 
                  : 'hover:bg-black/5'
              }`}
              style={{ 
                color: selectedCategory === category.name ? 'var(--primary)' : 'var(--muted)',
                background: selectedCategory === category.name ? 'rgba(0, 200, 83, 0.1)' : 'transparent'
              }}
            >
              <span>{category.name}</span>
              <span className="text-xs opacity-60">{category.count}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default CategorySidebar;
