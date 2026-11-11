
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import Message from '../components/Message';
import ProductCard from '../components/ProductCard';
import {
  productsStart,
  productsSuccess,
  productsFail,
  productDeleted,
  clearProductMessages
} from '../redux/productSlice';
import { categoriesStart, categoriesSuccess, categoriesFail } from '../redux/categorySlice';

function Products() {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const selected = params.get('categorie') || 'toutes';
  const { user } = useSelector((state) => state.auth);
  const { items, loading, error, success } = useSelector((state) => state.products);
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
        const message = err.response?.data?.message || 'Impossible de charger les produits.';
        dispatch(productsFail(message));
        dispatch(categoriesFail(message));
      }
    };

    load();
    return () => dispatch(clearProductMessages());
  }, [dispatch]);

  const visible = selected === 'toutes'
    ? items
    : items.filter((product) => product.category?._id === selected);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Supprimer ce produit ?');
    if (!confirmed) return;

    try {
      await api.delete(`/api/products/${id}`);
      dispatch(productDeleted(id));
    } catch (err) {
      dispatch(productsFail(err.response?.data?.message || 'Suppression impossible.'));
    }
  };

  return (
    <section className="page">
      <div className="section-head">
        <h1>Catalogue</h1>
        <p>
          {user
            ? `Session ouverte : ${user.name}. Vous pouvez ajouter un soin et supprimer les vôtres.`
            : 'Mode visiteur : consultation en lecture seule.'}
        </p>
      </div>

      <div className="filters">
        <button
          type="button"
          className={selected === 'toutes' ? 'chip active' : 'chip'}
          onClick={() => setParams({})}
        >
          Toutes
        </button>

        {categories.map((category) => (
          <button
            key={category._id}
            type="button"
            className={selected === category._id ? 'chip active' : 'chip'}
            onClick={() => setParams({ categorie: category._id })}
          >
            {category.name}
          </button>
        ))}
      </div>

      <Message loading={loading} error={error} success={success} />

      {!loading && visible.length === 0 && !error && (
        <p className="empty">Aucun produit dans cette sélection.</p>
      )}

      <div className="product-grid">
        {visible.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            canDelete={user && product.author?._id === user._id}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </section>
  );
}

export default Products;
