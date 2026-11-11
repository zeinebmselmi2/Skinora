import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';

function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch(logout());
    closeMenu();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          Skinora
          <span>Beauty & Skincare</span>
        </Link>

        <button
          className="menu-btn"
          type="button"
          aria-label="Ouvrir le menu"
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={open ? 'nav-links open' : 'nav-links'}>
          <Link to="/" onClick={closeMenu}>Accueil</Link>
          <Link to="/produits" onClick={closeMenu}>Produits</Link>
          <Link to="/categories" onClick={closeMenu}>Catégories</Link>

          {user ? (
            <>
              <Link to="/ajouter" className="nav-cta" onClick={closeMenu}>
                Ajouter
              </Link>
              <span className="nav-user">{user.name}</span>
              <button type="button" className="link-btn" onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/connexion" onClick={closeMenu}>Connexion</Link>
              <Link to="/inscription" className="nav-cta" onClick={closeMenu}>
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
