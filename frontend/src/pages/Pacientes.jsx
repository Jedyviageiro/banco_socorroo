import { useNavigate, useLocation } from 'react-router-dom';
import PacienteForm from '../components/PacienteForm';

/* ─── icons ──────────────────────────────────────────────────────────────── */
const Icon = {
  Grid: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Activity: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  Clipboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  ),
  LogOut: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Heart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
};

/* ─── nav items ──────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: 'Dashboard', icon: Icon.Grid,      path: '/dashboard' },
  { label: 'Pacientes', icon: Icon.User,      path: '/pacientes' },
  { label: 'Triagem',   icon: Icon.Activity,  path: '/triagens'  },
  { label: 'Avaliação', icon: Icon.Clipboard, path: '/avaliacoes'},
];

/* ─── styles ─────────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pac-root {
    --nav-w:          220px;
    --bg:             #f7f8fa;
    --surface:        #ffffff;
    --nav-bg:         #0f1117;
    --nav-text:       rgba(255,255,255,.55);
    --nav-hover:      rgba(255,255,255,.08);
    --nav-active:     #ffffff;
    --nav-active-bg:  rgba(255,255,255,.1);
    --nav-active-bar: #3b82f6;
    --border:         #e8eaed;
    --border-sm:      #f0f2f5;
    --text-1:         #0d1117;
    --text-2:         #6e7787;
    --text-3:         #a8b0bc;
    --accent:         #2563eb;
    --accent-lt:      #eff4ff;
    --accent-dk:      #1d4ed8;
    --radius:         10px;
    --radius-sm:      7px;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text-1);
  }

  /* ── left nav (identical to dashboard) ── */
  .pac-nav {
    width: var(--nav-w);
    background: var(--nav-bg);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
    padding: 0 0 24px;
  }
  .pac-nav-brand {
    padding: 24px 20px 20px;
    border-bottom: 1px solid rgba(255,255,255,.07);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .pac-nav-logo {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }
  .pac-nav-brand-name { font-size: 14px; font-weight: 600; color: #fff; letter-spacing: -.2px; line-height: 1.2; }
  .pac-nav-brand-sub  { font-size: 10.5px; color: var(--nav-text); font-weight: 400; letter-spacing: .04em; }

  .pac-nav-section { padding: 0 12px; flex: 1; }
  .pac-nav-section-label {
    font-size: 9.5px; font-weight: 600; letter-spacing: .1em;
    text-transform: uppercase; color: rgba(255,255,255,.25);
    padding: 12px 8px 6px;
  }
  .pac-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px;
    border-radius: var(--radius-sm);
    border: none; background: transparent;
    color: var(--nav-text);
    font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 400;
    cursor: pointer; width: 100%; text-align: left;
    transition: background .15s, color .15s;
    position: relative; margin-bottom: 2px; letter-spacing: -.1px;
  }
  .pac-nav-item:hover { background: var(--nav-hover); color: rgba(255,255,255,.85); }
  .pac-nav-item.active { background: var(--nav-active-bg); color: var(--nav-active); font-weight: 500; }
  .pac-nav-item.active::before {
    content: ''; position: absolute; left: 0; top: 6px; bottom: 6px;
    width: 3px; border-radius: 0 2px 2px 0; background: var(--nav-active-bar);
    animation: pac-selector-slide .28s ease-out;
  }
  @keyframes pac-selector-slide {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .pac-nav-icon { opacity: .7; flex-shrink: 0; }
  .pac-nav-item.active .pac-nav-icon { opacity: 1; }

  .pac-nav-footer {
    padding: 0 12px;
    border-top: 1px solid rgba(255,255,255,.07);
    padding-top: 16px;
  }
  .pac-nav-user {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px; border-radius: var(--radius-sm); margin-bottom: 4px;
  }
  .pac-nav-avatar {
    width: 28px; height: 28px; border-radius: 6px;
    background: rgba(59,130,246,.3); color: #93c5fd;
    font-size: 11px; font-weight: 600;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; letter-spacing: -.3px;
  }
  .pac-nav-user-name { font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pac-nav-user-role { font-size: 10px; color: var(--nav-text); font-weight: 400; }
  .pac-nav-logout {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 10px; border-radius: var(--radius-sm);
    border: none; background: transparent;
    color: rgba(255,255,255,.3);
    font-family: 'DM Sans', sans-serif; font-size: 12.5px;
    cursor: pointer; width: 100%; text-align: left;
    transition: color .15s, background .15s;
  }
  .pac-nav-logout:hover { color: #f87171; background: rgba(248,113,113,.08); }

  /* ── main ── */
  .pac-main {
    margin-left: var(--nav-w);
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* ── topbar ── */
  .pac-topbar {
    height: 60px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    position: sticky; top: 0; z-index: 50;
  }
  .pac-topbar-left { display: flex; flex-direction: column; gap: 1px; }
  .pac-topbar-breadcrumb {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: var(--text-3); font-weight: 400;
  }
  .pac-topbar-breadcrumb-sep { color: var(--border); }
  .pac-topbar-title { font-size: 14px; font-weight: 600; color: var(--text-1); letter-spacing: -.2px; }
  .pac-topbar-right { display: flex; align-items: center; gap: 8px; }

  .pac-back-btn {
    display: flex; align-items: center; gap: 5px;
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: var(--surface);
    font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500;
    color: var(--text-2); cursor: pointer;
    transition: border-color .15s, color .15s, background .15s;
  }
  .pac-back-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-lt); }

  .pac-chip {
    display: flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 20px;
    background: var(--accent-lt); color: var(--accent);
    font-size: 11.5px; font-weight: 500;
  }
  .pac-chip-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: .4; transform: scale(.85); }
  }

  /* ── content ── */
  .pac-content { padding: 32px; flex: 1; display: flex; justify-content: center; }

  /* ── page header ── */
  .pac-page-header { margin-bottom: 28px; }
  .pac-page-eyebrow {
    font-size: 11px; font-weight: 600; letter-spacing: .1em;
    text-transform: uppercase; color: var(--accent); margin-bottom: 6px;
  }
  .pac-page-title {
    font-size: 24px; font-weight: 600; letter-spacing: -.5px;
    color: var(--text-1); line-height: 1.2; margin-bottom: 5px;
  }
  .pac-page-sub {
    font-size: 13.5px; color: var(--text-2); font-weight: 300; line-height: 1.5;
  }
  .pac-page-sub strong { color: var(--text-1); font-weight: 500; }

  /* ── form wrapper ── */
  /* PacienteForm renders its own markup — we just give it a surface card to sit in */
  .pac-form-wrapper {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    width: 100%;
    max-width: 808px;
  }
  .pac-form-wrapper-header {
    padding: 18px 24px;
    border-bottom: 1px solid var(--border-sm);
    display: flex; align-items: center; justify-content: space-between;
  }
  .pac-form-wrapper-label {
    font-size: 10px; font-weight: 600; letter-spacing: .1em;
    text-transform: uppercase; color: var(--accent); margin-bottom: 3px;
  }
  .pac-form-wrapper-title { font-size: 14px; font-weight: 600; letter-spacing: -.2px; color: var(--text-1); }
  .pac-form-wrapper-body { padding: 18px 28px 28px; }
`;

/* ─── component ──────────────────────────────────────────────────────────── */
function Pacientes({ usuario, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { onLogout(); navigate('/', { replace: true }); };

  const displayName = usuario?.nome || usuario?.username || 'Utilizador';
  const initials = displayName.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  const firstName = displayName.split(' ')[0];

  return (
    <div className="pac-root">
      <style>{css}</style>

      {/* ── left nav ── */}
      <nav className="pac-nav">
        <div className="pac-nav-brand">
          <div className="pac-nav-logo"><Icon.Heart /></div>
          <div>
            <div className="pac-nav-brand-name">Banco de Socorro</div>
            <div className="pac-nav-brand-sub">Sistema clínico</div>
          </div>
        </div>

        <div className="pac-nav-section">
          <div className="pac-nav-section-label">Módulos</div>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`pac-nav-item${isActive ? ' active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="pac-nav-icon"><item.icon /></span>
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="pac-nav-footer">
          <div className="pac-nav-user">
            <div className="pac-nav-avatar">{initials}</div>
            <div>
              <div className="pac-nav-user-name">{firstName}</div>
              <div className="pac-nav-user-role">Enfermagem</div>
            </div>
          </div>
          <button className="pac-nav-logout" onClick={handleLogout}>
            <Icon.LogOut /> Terminar sessão
          </button>
        </div>
      </nav>

      {/* ── main ── */}
      <div className="pac-main">

        {/* topbar */}
        <header className="pac-topbar">
          <div className="pac-topbar-left">
            <div className="pac-topbar-breadcrumb">
              <span>Banco de Socorro</span>
              <span className="pac-topbar-breadcrumb-sep">/</span>
              <span>Admissao</span>
            </div>
            <div className="pac-topbar-title">Registo de pacientes</div>
          </div>
          <div className="pac-topbar-right">
            <button className="pac-back-btn" onClick={() => navigate('/dashboard')}>
              <Icon.ChevronLeft /> Dashboard
            </button>
            <div className="pac-chip">
              <span className="pac-chip-dot" />
              Sistema activo
            </div>
          </div>
        </header>

        {/* content */}
        <div className="pac-content">

          {/* form card */}
          <div className="pac-form-wrapper">
            <div className="pac-form-wrapper-body">
              <PacienteForm />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Pacientes;
