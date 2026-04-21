import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { saveAuthSession } from '../services/auth';

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', form);
      const session = { token: data.token, usuario: data.usuario };

      saveAuthSession(session);
      onLogin(session);
      navigate('/pacientes', { replace: true });
    } catch (err) {
      setError(err.response?.data?.erro || 'Nao foi possivel iniciar sessao.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-panel auth-panel-brand">
        <span className="auth-badge">Banco Socorro</span>
        <h1>Entre no sistema de registo de pacientes</h1>
        <p>
          O acesso agora comeca pela autenticacao. Depois do login, a equipa pode
          continuar a usar o fluxo de cadastro normalmente.
        </p>
        <div className="auth-feature-list">
          <div>
            <strong>Senha protegida</strong>
            <span>As passwords sao guardadas com hash no backend.</span>
          </div>
          <div>
            <strong>Entrada controlada</strong>
            <span>As rotas principais pedem autenticacao antes de responder.</span>
          </div>
        </div>
      </section>

      <section className="auth-panel auth-panel-form">
        <div className="auth-card">
          <p className="auth-eyebrow">Login</p>
          <h2>Bem-vindo de volta</h2>
          <p className="auth-copy">Use as credenciais do utilizador criado no servidor.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-field">
              <span>Username</span>
              <input
                type="text"
                value={form.username}
                onChange={handleChange('username')}
                placeholder="admin"
                autoComplete="username"
                required
              />
            </label>

            <label className="auth-field">
              <span>Password</span>
              <input
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                placeholder="Introduza a sua password"
                autoComplete="current-password"
                required
              />
            </label>

            {error ? <p className="auth-error">{error}</p> : null}

            <button className="auth-submit" type="submit" disabled={isLoading}>
              {isLoading ? 'A entrar...' : 'Entrar no sistema'}
            </button>
          </form>

          <div className="auth-help">
            <span>Utilizador padrao</span>
            <strong>admin</strong>
            <span>Password padrao</span>
            <strong>Admin@123</strong>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
