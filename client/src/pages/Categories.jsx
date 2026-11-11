import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import Message from '../components/Message';
import { categoriesStart, categoriesSuccess, categoriesFail } from '../redux/categorySlice';

function Categories() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    const load = async () => {
      dispatch(categoriesStart());
      try {
        const { data } = await api.get('/api/categories');
        dispatch(categoriesSuccess(data));
      } catch (err) {
        dispatch(categoriesFail(err.response?.data?.message || 'Impossible de charger les catégories.'));
      }
    };

    load();
  }, [dispatch]);

  return (
    <section className="page">
      <div className="section-head">
        <h1>Catégories</h1>
        <p>Les quatre familles de soins proposées par Skinora.</p>
      </div>
      <Message loading={loading} error={error} />
      <div className="category-grid">
        {items.map((category) => (
          <Link
            key={category._id}
            to={`/produits?categorie=${category._id}`}
            className="category-tile"
          >
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            <span className="tile-link">Voir les produits</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Categories;
