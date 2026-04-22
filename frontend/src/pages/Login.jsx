import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/useToast';
import api from '../services/api';
import { saveAuthSession } from '../services/auth';

/* ─────────────────────────────────────────────
   Styles — injected once into <head>
───────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  .login-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    font-family: 'DM Sans', system-ui, sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f7f6f3;
    padding: 1.5rem;
  }

  /* ── Card ── */
  .login-card {
    background: #ffffff;
    border-radius: 16px;
    border: 0.5px solid #e5e3de;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 400px;
  }

  /* ── Header ── */
  .login-title {
    font-size: 32px;
    font-weight: 600;
    color: #111110;
    letter-spacing: -0.5px;
    line-height: 1.1;
    margin-bottom: 4px;
  }

  .login-subtitle {
    font-size: 14px;
    color: #6b6966;
    margin-bottom: 1.75rem;
  }

  /* ── Google button ── */
  .login-google-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: #fff;
    border: 0.5px solid #d5d3ce;
    border-radius: 8px;
    padding: 11px 16px;
    font-size: 14px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-weight: 500;
    color: #1a1a1a;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    margin-bottom: 1.25rem;
  }

  .login-google-btn:hover {
    background: #f7f6f3;
    border-color: #b4b2a9;
  }

  /* Google G SVG */
  .login-google-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  /* ── Divider ── */
  .login-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1.25rem;
  }

  .login-divider-line {
    flex: 1;
    height: 0.5px;
    background: #e5e3de;
  }

  .login-divider-text {
    font-size: 12px;
    color: #b4b2a9;
    white-space: nowrap;
  }

  /* ── Form fields ── */
  .login-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 1rem;
  }

  .login-field-label {
    font-size: 13px;
    font-weight: 500;
    color: #2c2c2a;
  }

  .login-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .login-input {
    width: 100%;
    border: 0.5px solid #d5d3ce;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 14px;
    font-family: 'DM Sans', system-ui, sans-serif;
    color: #111110;
    background: #fff;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .login-input::placeholder { color: #b4b2a9; }

  .login-input:focus {
    border-color: #534AB7;
    box-shadow: 0 0 0 3px rgba(83,74,183,0.1);
  }

  .login-input.has-toggle { padding-right: 40px; }

  .login-eye-btn {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    color: #b4b2a9;
    display: flex;
    align-items: center;
    transition: color 0.15s;
  }

  .login-eye-btn:hover { color: #6b6966; }

  /* ── Remember / Forgot row ── */
  .login-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
    margin-top: -0.25rem;
  }

  .login-remember {
    display: flex;
    align-items: center;
    gap: 7px;
    cursor: pointer;
  }

  .login-checkbox {
    width: 15px;
    height: 15px;
    border: 0.5px solid #d5d3ce;
    border-radius: 4px;
    appearance: none;
    -webkit-appearance: none;
    background: #fff;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    position: relative;
    flex-shrink: 0;
  }

  .login-checkbox:checked {
    background: #534AB7;
    border-color: #534AB7;
  }

  .login-checkbox:checked::after {
    content: '';
    position: absolute;
    left: 4px;
    top: 1.5px;
    width: 5px;
    height: 8px;
    border: 1.5px solid #fff;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
  }

  .login-remember-label {
    font-size: 13px;
    color: #444441;
    user-select: none;
  }

  .login-forgot {
    font-size: 13px;
    font-weight: 500;
    color: #534AB7;
    text-decoration: none;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    font-family: 'DM Sans', system-ui, sans-serif;
    transition: opacity 0.15s;
  }

  .login-forgot:hover { opacity: 0.75; }

  /* ── Error ── */
  /* ── Submit ── */
  .login-submit {
    width: 100%;
    background: #534AB7;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 12px;
    font-size: 15px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 1.25rem;
  }

  .login-submit:hover:not(:disabled) { opacity: 0.88; }
  .login-submit:active:not(:disabled) { transform: scale(0.99); }
  .login-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  .login-spinner {
    width: 15px;
    height: 15px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: login-spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes login-spin { to { transform: rotate(360deg); } }

  /* ── Register link ── */
  .login-register {
    text-align: center;
    font-size: 13px;
    color: #6b6966;
  }

  .login-register a,
  .login-register button {
    color: #534AB7;
    font-weight: 500;
    text-decoration: none;
    background: none;
    border: none;
    padding: 0;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .login-register a:hover,
  .login-register button:hover { opacity: 0.75; }

  /* ── Hint box (default credentials) ── */
  .login-hint {
    margin-top: 1.5rem;
    background: #f7f6f3;
    border: 0.5px solid #e5e3de;
    border-radius: 8px;
    padding: 10px 14px;
    display: grid;
    grid-template-columns: auto 1fr auto 1fr;
    align-items: center;
    gap: 4px 10px;
    font-size: 12px;
  }

  .login-hint-key { color: #9e9b95; }
  .login-hint-val { font-weight: 500; color: #444441; font-family: 'DM Mono', monospace; }

  /* ── Dark mode ── */
  @media (prefers-color-scheme: dark) {
    .login-root { background: #1a1a18; }
    .login-card { background: #232320; border-color: #3a3835; }
    .login-title { color: #f0ede8; }
    .login-subtitle { color: #888780; }
    .login-google-btn { background: #2c2c2a; border-color: #4a4845; color: #f0ede8; }
    .login-google-btn:hover { background: #353532; }
    .login-input { background: #2c2c2a; border-color: #4a4845; color: #f0ede8; }
    .login-input:focus { border-color: #7F77DD; box-shadow: 0 0 0 3px rgba(127,119,221,0.15); }
    .login-checkbox { background: #2c2c2a; border-color: #4a4845; }
    .login-remember-label { color: #b4b2a9; }
    .login-hint { background: #2c2c2a; border-color: #3a3835; }
    .login-hint-val { color: #d3d1c7; }
    .login-register { color: #888780; }
    .login-field-label { color: #d3d1c7; }
  }
`;

let styleInjected = false;
function injectStyles() {
  if (styleInjected || typeof document === 'undefined') return;
  const tag = document.createElement('style');
  tag.textContent = CSS;
  document.head.appendChild(tag);
  styleInjected = true;
}

/* ── Google G logo ── */
function GoogleIcon() {
  return (
    <svg className="login-google-icon" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

/* ── Eye icons ── */
function EyeOpen() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" width="16" height="16">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/>
      <circle cx="8" cy="8" r="2"/>
    </svg>
  );
}

function EyeOff() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" width="16" height="16">
      <path d="M13.4 13.4L2.6 2.6M6.5 6.6a2 2 0 002.9 2.9"/>
      <path d="M4.2 4.3C2.6 5.3 1 8 1 8s2.5 5 7 5c1.4 0 2.7-.4 3.8-1.2M7 3.1C7.3 3 7.7 3 8 3c4.5 0 7 5 7 5s-.6 1.2-1.7 2.4"/>
    </svg>
  );
}

/* ── Arrow icon ── */
function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14">
      <line x1="3" y1="8" x2="13" y2="8"/>
      <polyline points="9,4 13,8 9,12"/>
    </svg>
  );
}

function getDefaultRouteForDepartment(departamento) {
  if (departamento === 'laboratorio_principal') {
    return '/laboratorio-principal';
  }

  if (departamento === 'banco_de_sangue') {
    return '/banco-de-sangue';
  }

  return '/dashboard';
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
function Login({ onLogin }) {
  injectStyles();

  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      const session = { token: data.token, usuario: data.usuario };
      saveAuthSession(session);
      onLogin(session);
      toast.success('Sessão iniciada com sucesso.', 'Login efectuado');
      navigate(getDefaultRouteForDepartment(data.usuario?.departamento), { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.erro || 'Não foi possível iniciar sessão.', 'Falha no login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-root">
      <div className="login-card">

        {/* Header */}
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">Olá, bem-vindo de volta</p>

        {/* Google button */}
        <button type="button" className="login-google-btn">
          <GoogleIcon />
          Entrar com Google
        </button>

        {/* Divider */}
        <div className="login-divider">
          <div className="login-divider-line" />
          <span className="login-divider-text">ou entre com email</span>
          <div className="login-divider-line" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Username field */}
          <div className="login-field">
            <span className="login-field-label">Username</span>
            <div className="login-input-wrap">
              <input
                className="login-input"
                type="text"
                value={form.username}
                onChange={handleChange('username')}
                placeholder="E.g. admin"
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="login-field">
            <span className="login-field-label">Password</span>
            <div className="login-input-wrap">
              <input
                className={`login-input has-toggle`}
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
                placeholder="Introduza a sua password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar password' : 'Mostrar password'}
              >
                {showPassword ? <EyeOpen /> : <EyeOff />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="login-meta">
            <label className="login-remember">
              <input
                type="checkbox"
                className="login-checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="login-remember-label">Lembrar-me</span>
            </label>
            <button type="button" className="login-forgot">
              Esqueceu a password?
            </button>
          </div>

          {/* Submit */}
          <button className="login-submit" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="login-spinner" />
                A entrar…
              </>
            ) : (
              <>
                Entrar no sistema
                <ArrowRight />
              </>
            )}
          </button>
        </form>

        {/* Register link */}
        <p className="login-register">
          Ainda não tem conta?{' '}
          <button type="button" onClick={() => navigate('/register')}>
            Criar uma conta ↗
          </button>
        </p>

        {/* Default credentials hint */}
        <div className="login-hint">
          <span className="login-hint-key">Utilizador</span>
          <span className="login-hint-val">admin</span>
          <span className="login-hint-key">Password</span>
          <span className="login-hint-val">Admin@123</span>
        </div>

      </div>
    </main>
  );
}

export default Login;
