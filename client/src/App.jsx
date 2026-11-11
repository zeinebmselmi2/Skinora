import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProduct from './pages/AddProduct';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produits" element={<Products />} />
          <Route path="/produits/:id" element={<ProductDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/ajouter" element={<AddProduct />} />
          <Route path="*" element={<p className="page empty">Page introuvable.</p>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
