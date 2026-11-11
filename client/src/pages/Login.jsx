import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import Message from '../components/Message';
import { authStart, authSuccess, authFail, clearAuthMessages } from '../redux/authSlice';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
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
      const { data } = await api.post('/api/auth/login', form);
      localStorage.setItem('user', JSON.stringify(data));
      dispatch(authSuccess({ user: data, message: 'Connexion réussie.' }));
      navigate('/produits');
    } catch (err) {
      dispatch(authFail(err.response?.data?.message || 'Connexion impossible.'));
    }
  };

  return (
    <section className="page auth-page">
      <form className="form-card" onSubmit={onSubmit}>
        <p className="eyebrow">Espace membre</p>
        <h1>Connexion</h1>
        <p className="muted">Accédez à l’ajout et à la gestion de vos produits.</p>
        <Message loading={loading} error={error} success={success} />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />

        <label htmlFor="password">Mot de passe</label>
        <input id="password" name="password" type="password" value={form.password} onChange={onChange} required />

        <button className="btn" type="submit" disabled={loading}>Se connecter</button>
        <p className="form-switch">
          Pas encore de compte ? <Link to="/inscription">Créer un compte</Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
