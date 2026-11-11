import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import Message from '../components/Message';
import ProductCard from '../components/ProductCard';
import { productsStart, productsSuccess, productsFail } from '../redux/productSlice';
import { categoriesStart, categoriesSuccess, categoriesFail } from '../redux/categorySlice';

function Home() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);

  useEffect(() => {
    const load = async () => {
      dispatch(productsStart());
      dispatch(categoriesStart());
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/api/products'),
          api.get('/api/categories')
        ]);
        dispatch(productsSuccess(productsRes.data));
        dispatch(categoriesSuccess(categoriesRes.data));
      } catch (err) {
        const message = err.response?.data?.message || 'Impossible de charger le catalogue.';
        dispatch(productsFail(message));
        dispatch(categoriesFail(message));
      }
    };

    load();
  }, [dispatch]);

  return (
    <div>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Beauty & Skincare</p>
          <h1>Une routine douce, pensée pour votre peau.</h1>
          <p>
            Skinora réunit des soins du visage, du corps, des protections solaires
            et des soins capillaires dans un catalogue simple et élégant.
          </p>
          <div className="hero-actions">
            <Link to="/produits" className="btn">Voir le catalogue</Link>
            <Link to="/categories" className="btn btn-light">Les catégories</Link>
          </div>
        </div>
        <div className="hero-panel" aria-hidden="true">
          <div className="orb orb-a" />
          <div className="orb orb-b" />
          <p>Éclat · Douceur · Soin</p>
        </div>
      </section>

      <section className="page">
        <div className="section-head">
          <h2>Quatre univers de soin</h2>
          <p>Choisissez une catégorie pour filtrer le catalogue.</p>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/produits?categorie=${category._id}`}
              className="category-tile"
            >
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>

        <div className="section-head">
          <h2>Derniers soins ajoutés</h2>
        </div>
        <Message loading={loading} error={error} />
        {!loading && items.length === 0 && !error && (
          <p className="empty">Aucun produit pour le moment. Connectez-vous pour en ajouter un.</p>
        )}
        <div className="product-grid">
          {items.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
