import { NavLink, useNavigate } from 'react-router-dom';
import { BANCO_SANGUE_NAV_LINKS } from './constants';

const Icon = {
  Droplet: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  LogOut: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .bs-root {
    --nav-w: 220px;
    --bg: #f7f8fa;
    --surface: #ffffff;
    --nav-bg: #0f1117;
    --nav-text: rgba(255,255,255,.55);
    --nav-hover: rgba(255,255,255,.08);
    --nav-active: #ffffff;
    --nav-active-bg: rgba(255,255,255,.1);
    --nav-active-bar: #3b82f6;
    --border: #e8eaed;
    --text-1: #0d1117;
    --text-2: #6e7787;
    --text-3: #a8b0bc;
    --accent: #2563eb;
    --accent-lt: #eff4ff;
    --radius: 10px;
    --radius-sm: 7px;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text-1);
  }

  .bs-nav {
    width: var(--nav-w);
    background: var(--nav-bg);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    padding: 0 0 24px;
  }

  .bs-nav-brand {
    padding: 24px 20px 20px;
    border-bottom: 1px solid rgba(255,255,255,.07);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .bs-nav-logo {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }

  .bs-nav-brand-name { font-size: 14px; font-weight: 600; color: #fff; }
  .bs-nav-brand-sub { font-size: 10.5px; color: var(--nav-text); letter-spacing: .04em; }
  .bs-nav-section { padding: 0 12px; flex: 1; }
  .bs-nav-section-label { font-size: 9.5px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.25); padding: 12px 8px 6px; }

  .bs-nav-item {
    display: flex;
    align-items: center;
    padding: 9px 10px;
    border-radius: var(--radius-sm);
    color: var(--nav-text);
    text-decoration: none;
    font-size: 13.5px;
    font-weight: 400;
    position: relative;
    margin-bottom: 2px;
    transition: background .15s, color .15s;
  }

  .bs-nav-item:hover { background: var(--nav-hover); color: rgba(255,255,255,.85); }
  .bs-nav-item.active { background: var(--nav-active-bg); color: var(--nav-active); font-weight: 500; }
  .bs-nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 6px;
    bottom: 6px;
    width: 3px;
    border-radius: 0 2px 2px 0;
    background: var(--nav-active-bar);
  }

  .bs-nav-footer { padding: 0 12px; border-top: 1px solid rgba(255,255,255,.07); padding-top: 16px; }
  .bs-nav-user { display: flex; align-items: center; gap: 10px; padding: 8px 10px; margin-bottom: 4px; }
  .bs-nav-avatar {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    background: rgba(59,130,246,.3);
    color: #93c5fd;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bs-nav-user-name { font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,.8); }
  .bs-nav-user-role { font-size: 10px; color: var(--nav-text); }
  .bs-nav-logout {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: var(--radius-sm);
    border: none;
    background: transparent;
    color: rgba(255,255,255,.3);
    font: 400 12.5px 'DM Sans', sans-serif;
    cursor: pointer;
    width: 100%;
    text-align: left;
  }
  .bs-nav-logout:hover { color: #f87171; background: rgba(248,113,113,.08); }

  .bs-main { margin-left: var(--nav-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
  .bs-topbar {
    min-height: 60px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    position: sticky;
    top: 0;
    z-index: 50;
  }
  .bs-topbar-breadcrumb { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-3); }
  .bs-topbar-title { font-size: 14px; font-weight: 600; color: var(--text-1); }
  .bs-topbar-subtitle { font-size: 12px; color: var(--text-2); margin-top: 4px; }
  .bs-topbar-right { display: flex; align-items: center; gap: 8px; }
  .bs-back-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: #fff;
    font: 500 12.5px 'DM Sans', sans-serif;
    color: var(--text-2);
    cursor: pointer;
  }
  .bs-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border-radius: 20px;
    background: var(--accent-lt);
    color: var(--accent);
    font-size: 11.5px;
    font-weight: 500;
  }
  .bs-chip-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }
  .bs-content { padding: 32px; flex: 1; }
  .bs-shell { max-width: 1240px; margin: 0 auto; display: flex; flex-direction: column; gap: 18px; }

  .bs-summary-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
  .bs-summary-card, .bs-side-card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 18px 20px;
    box-shadow: 0 10px 28px rgba(15,23,42,.05);
  }
  .bs-summary-label, .bs-side-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 10px;
  }
  .bs-summary-value { font-size: 28px; font-weight: 700; color: var(--text-1); }
  .bs-summary-note, .bs-muted-copy { margin-top: 8px; font-size: 12px; color: var(--text-2); line-height: 1.6; }
  .bs-panel-grid { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(300px, .8fr); gap: 18px; align-items: start; }
  .bs-card {
    background: #0f1117;
    border: 1px solid #1d2230;
    border-radius: var(--radius);
    box-shadow: 0 16px 40px rgba(15,17,23,.18);
    overflow: hidden;
  }
  .bs-card-header { padding: 22px 24px 14px; border-bottom: 1px solid rgba(255,255,255,.06); }
  .bs-card-kicker {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: rgba(191,219,254,.78);
    margin-bottom: 8px;
  }
  .bs-card-title { font-size: 18px; font-weight: 700; color: #f8fafc; }
  .bs-card-subtitle { font-size: 12.5px; color: rgba(255,255,255,.62); margin-top: 5px; line-height: 1.5; }
  .bs-card-body { padding: 24px; }

  .bs-form { display: flex; flex-direction: column; gap: 18px; }
  .bs-field { display: flex; flex-direction: column; gap: 6px; }
  .bs-field-label { font-size: 11.5px; font-weight: 700; letter-spacing: .04em; color: rgba(255,255,255,.76); }
  .bs-field input, .bs-field select, .bs-field textarea {
    width: 100%;
    border: 1px solid #2a3444;
    border-radius: 12px;
    background: #111827;
    color: #f8fafc;
    padding: 11px 14px;
    font: 500 13.5px 'DM Sans', sans-serif;
  }
  .bs-field textarea { resize: vertical; min-height: 118px; line-height: 1.6; }
  .bs-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .bs-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: rgba(255,255,255,.42);
  }
  .bs-divider::before, .bs-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.08); }
  .bs-submit {
    padding: 12px 22px;
    background: linear-gradient(135deg, #2563eb, #4338ca);
    color: #fff;
    border: none;
    border-radius: 12px;
    font: 700 13.5px 'DM Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 10px 24px rgba(37,99,235,.28);
  }
  .bs-submit:disabled { opacity: .55; cursor: not-allowed; box-shadow: none; }

  .bs-list { display: flex; flex-direction: column; gap: 10px; }
  .bs-list-item { padding: 14px; border-radius: 14px; background: #f8fafc; border: 1px solid #e8eef5; }
  .bs-list-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 6px; }
  .bs-list-title { font-size: 13.5px; font-weight: 700; color: var(--text-1); }
  .bs-list-meta { font-size: 12px; color: var(--text-2); line-height: 1.6; }
  .bs-badge { padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; white-space: nowrap; background: #e0e7ff; color: #4338ca; }
  .bs-badge.warn { background: #fef3c7; color: #92400e; }
  .bs-badge.critical { background: #fef2f2; color: #dc2626; }
  .bs-stat-stack { display: flex; flex-direction: column; gap: 12px; }

  @media (max-width: 1080px) {
    .bs-summary-grid, .bs-panel-grid { grid-template-columns: 1fr; }
  }

  @media (max-width: 760px) {
    .bs-field-row { grid-template-columns: 1fr; }
    .bs-topbar { padding: 16px 20px; min-height: auto; flex-direction: column; align-items: flex-start; gap: 12px; }
    .bs-content { padding: 18px; }
  }
`;

function BancoSangueLayout({ usuario, onLogout, title, subtitle, children }) {
  const navigate = useNavigate();
  const displayName = usuario?.nome || usuario?.username || 'Utilizador';
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((name) => name[0])
    .join('')
    .toUpperCase();
  const firstName = displayName.split(' ')[0];

  const handleLogout = () => {
    onLogout();
    navigate('/', { replace: true });
  };

  return (
    <div className="bs-root">
      <style>{css}</style>

      <nav className="bs-nav">
        <div className="bs-nav-brand">
          <div className="bs-nav-logo">
            <Icon.Droplet />
          </div>
          <div>
            <div className="bs-nav-brand-name">Banco de Socorro</div>
            <div className="bs-nav-brand-sub">Banco de Sangue</div>
          </div>
        </div>

        <div className="bs-nav-section">
          <div className="bs-nav-section-label">Funcoes</div>
          {BANCO_SANGUE_NAV_LINKS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/banco-de-sangue'} className="bs-nav-item">
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="bs-nav-footer">
          <div className="bs-nav-user">
            <div className="bs-nav-avatar">{initials}</div>
            <div>
              <div className="bs-nav-user-name">{firstName}</div>
              <div className="bs-nav-user-role">Banco de Sangue</div>
            </div>
          </div>
          <button className="bs-nav-logout" onClick={handleLogout}>
            <Icon.LogOut /> Terminar sessao
          </button>
        </div>
      </nav>

      <div className="bs-main">
        <header className="bs-topbar">
          <div>
            <div className="bs-topbar-breadcrumb">
              <span>Banco de Socorro</span>
              <span>/</span>
              <span>Banco de Sangue</span>
            </div>
            <div className="bs-topbar-title">{title}</div>
            <div className="bs-topbar-subtitle">{subtitle}</div>
          </div>

          <div className="bs-topbar-right">
            <div className="bs-chip">
              <span className="bs-chip-dot" />
              Sistema activo
            </div>
            <button className="bs-back-btn" onClick={() => navigate('/dashboard')}>
              <Icon.ChevronLeft /> Dashboard
            </button>
          </div>
        </header>

        <div className="bs-content">
          <div className="bs-shell">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default BancoSangueLayout;
