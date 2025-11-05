import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import NewProduct from './pages/NewProduct';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products/:id" element={<ProductPage />} />
      <Route path="/sell/new" element={<NewProduct />} />
      <Route path="/checkout/:id" element={<Checkout />} />
    </Routes>
  );
}

export default App;
