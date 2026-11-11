import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import Message from '../components/Message';
import { formatPrice } from '../components/ProductCard';
import {
  productsStart,
  productSuccess,
  productsFail,
  productDeleted
} from '../redux/productSlice';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { current, loading, error } = useSelector((state) => state.products);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    const load = async () => {
      dispatch(productsStart());
      try {
        const { data } = await api.get(`/api/products/${id}`);
        dispatch(productSuccess(data));
      } catch (err) {
        dispatch(productsFail(err.response?.data?.message || 'Produit introuvable.'));
      }
    };

    load();
  }, [dispatch, id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Supprimer ce produit ?');
    if (!confirmed) return;

    try {
      await api.delete(`/api/products/${id}`);
      dispatch(productDeleted(id));
      navigate('/produits');
    } catch (err) {
      dispatch(productsFail(err.response?.data?.message || 'Suppression impossible.'));
    }
  };

  const product = current && current._id === id ? current : null;
  const isOwner = user && product?.author?._id === user._id;
  const showImage = product?.imageUrl && !broken;

  return (
    <section className="page">
      <Link to="/produits" className="back-link">Retour au catalogue</Link>
      <Message loading={loading} error={error} />

      {product && !loading && (
        <article className="detail">
          <div className="detail-media">
            {showImage ? (
              <img src={product.imageUrl} alt={product.title} onError={() => setBroken(true)} />
            ) : (
              <div className="card-placeholder large">
                <span>{product.title.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className="detail-body">
            <p className="card-cat">{product.category?.name || 'Sans catégorie'}</p>
            <h1>{product.title}</h1>
            <p className="price">{formatPrice(product.price)}</p>
            <p>{product.description}</p>
            {product.category?.description && (
              <p className="muted">{product.category.description}</p>
            )}
            <p className="author-line">
              Ajouté par <strong>{product.author?.name || 'Auteur inconnu'}</strong>
            </p>
            {isOwner && (
              <button type="button" className="btn btn-ghost" onClick={handleDelete}>
                Supprimer mon produit
              </button>
            )}
            {!user && <p className="muted">Mode visiteur : la suppression est réservée à l’auteur connecté.</p>}
          </div>
        </article>
      )}
    </section>
  );
}

export default ProductDetail;
