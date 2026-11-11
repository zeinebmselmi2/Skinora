import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import Message from '../components/Message';
import { authStart, authSuccess, authFail, clearAuthMessages } from '../redux/authSlice';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { user, loading, error, success } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/produits');
    return () => dispatch(clearAuthMessages());
  }, [user, navigate, dispatch]);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(authStart());
    try {
      const { data } = await api.post('/api/auth/register', form);
      localStorage.setItem('user', JSON.stringify(data));
      dispatch(authSuccess({ user: data, message: 'Inscription réussie.' }));
      navigate('/produits');
    } catch (err) {
      dispatch(authFail(err.response?.data?.message || 'Inscription impossible.'));
    }
  };

  return (
    <section className="page auth-page">
      <form className="form-card" onSubmit={onSubmit}>
        <p className="eyebrow">Rejoindre Skinora</p>
        <h1>Inscription</h1>
        <p className="muted">Créez un compte pour publier vos propres soins.</p>
        <Message loading={loading} error={error} success={success} />

        <label htmlFor="name">Nom</label>
        <input id="name" name="name" type="text" value={form.name} onChange={onChange} required />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />

        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={6}
          value={form.password}
          onChange={onChange}
          required
        />

        <button className="btn" type="submit" disabled={loading}>Créer mon compte</button>
        <p className="form-switch">
          Déjà inscrite ? <Link to="/connexion">Se connecter</Link>
        </p>
      </form>
    </section>
  );
}

export default Register;
