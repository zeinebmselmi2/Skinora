import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import Message from '../components/Message';
import { categoriesStart, categoriesSuccess, categoriesFail } from '../redux/categorySlice';
import {
  productsStart,
  productCreated,
  productsFail,
  clearProductMessages
} from '../redux/productSlice';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  imageUrl: '',
  category: ''
};

function AddProduct() {
  const [form, setForm] = useState(emptyForm);
  const { user } = useSelector((state) => state.auth);
  const { items: categories, error: categoryError } = useSelector((state) => state.categories);
  const { loading, error, success } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      dispatch(categoriesStart());
      try {
        const { data } = await api.get('/api/categories');
        dispatch(categoriesSuccess(data));
      } catch (err) {
        dispatch(categoriesFail(err.response?.data?.message || 'Catégories indisponibles.'));
      }
    };

    load();
    return () => dispatch(clearProductMessages());
  }, [dispatch]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(productsStart());
    try {
      const { data } = await api.post('/api/products', {
        ...form,
        price: Number(form.price)
      });
      dispatch(productCreated(data));
      navigate(`/produits/${data._id}`);
    } catch (err) {
      dispatch(productsFail(err.response?.data?.message || 'Ajout impossible.'));
    }
  };

  if (!user) {
    return (
      <section className="page">
        <div className="form-card">
          <h1>Ajouter un produit</h1>
          <p>Cette action est réservée aux utilisateurs connectés. En mode visiteur, le catalogue reste en lecture seule.</p>
          <Link to="/connexion" className="btn">Se connecter</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page auth-page">
      <form className="form-card" onSubmit={onSubmit}>
        <p className="eyebrow">Nouveau soin</p>
        <h1>Ajouter un produit</h1>
        <p className="muted">L’image est facultative : collez simplement une URL si vous en avez une.</p>
        <Message loading={loading} error={error || categoryError} success={success} />

        <label htmlFor="title">Titre</label>
        <input id="title" name="title" value={form.title} onChange={onChange} required />

        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows="4" value={form.description} onChange={onChange} required />

        <label htmlFor="price">Prix (€)</label>
        <input id="price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange} required />

        <label htmlFor="category">Catégorie</label>
        <select id="category" name="category" value={form.category} onChange={onChange} required>
          <option value="">Choisir une catégorie</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <label htmlFor="imageUrl">URL de l’image (facultatif)</label>
        <input id="imageUrl" name="imageUrl" type="url" value={form.imageUrl} onChange={onChange} placeholder="https://..." />

        <button className="btn" type="submit" disabled={loading}>Publier le produit</button>
      </form>
    </section>
  );
}

export default AddProduct;
