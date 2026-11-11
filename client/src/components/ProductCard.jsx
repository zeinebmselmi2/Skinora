import { useState } from 'react';
import { Link } from 'react-router-dom';

export const formatPrice = (price) => {
  const value = Number(price);
  if (Number.isNaN(value)) return '';
  return `${value.toFixed(2).replace('.', ',')} €`;
};

function ProductCard({ product, canDelete, onDelete }) {
  const [broken, setBroken] = useState(false);
  const showImage = product.imageUrl && !broken;

  return (
    <article className="card">
      <Link to={`/produits/${product._id}`} className="card-media">
        {showImage ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            onError={() => setBroken(true)}
          />
        ) : (
          <div className="card-placeholder">
            <span>{product.title?.charAt(0) || 'S'}</span>
          </div>
        )}
      </Link>

      <div className="card-body">
        <p className="card-cat">{product.category?.name || 'Sans catégorie'}</p>
        <h3>
          <Link to={`/produits/${product._id}`}>{product.title}</Link>
        </h3>
        <p className="card-desc">{product.description}</p>
        <div className="card-foot">
          <strong>{formatPrice(product.price)}</strong>
          <span>par {product.author?.name || 'Auteur'}</span>
        </div>
        {canDelete && (
          <button type="button" className="btn btn-ghost" onClick={() => onDelete(product._id)}>
            Supprimer
          </button>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
