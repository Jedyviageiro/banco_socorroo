import { useNavigate, useLocation } from 'react-router-dom';

/* ─── icons (inline SVG to avoid deps) ──────────────────────────────────── */
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
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Heart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Stethoscope: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
      <circle cx="20" cy="10" r="2"/>
    </svg>
  ),
  Pill: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
      <line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/>
    </svg>
  ),
};

/* ─── nav items ──────────────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: 'Dashboard',  icon: Icon.Grid,      path: '/dashboard' },
  { label: 'Pacientes',  icon: Icon.User,       path: '/pacientes' },
  { label: 'Triagem',    icon: Icon.Activity,   path: '/triagens'  },
  { label: 'Avaliação',  icon: Icon.Clipboard,  path: '/avaliacoes'},
];

/* ─── flow cards ─────────────────────────────────────────────────────────── */
const FLOWS = [
  {
    index: '01',
    title: 'Cadastro de Pacientes',
    description: 'Registe novos pacientes e inicie o atendimento preenchendo os dados clínicos de entrada.',
    path: '/pacientes',
    icon: Icon.User,
    accent: true,
  },
  {
    index: '02',
    title: 'Registo de Triagem',
    description: 'Lance temperatura, pressão e sintomas para documentar a observação inicial.',
    path: '/triagens',
    icon: Icon.Stethoscope,
  },
  {
    index: '03',
    title: 'Avaliação de Tratamento',
    description: 'Decida entre internamento e endovenoso e registe a justificação clínica da decisão.',
    path: '/avaliacoes',
    icon: Icon.Pill,
  },
];

/* ─── stat strip ─────────────────────────────────────────────────────────── */
const STATS = [
  { label: 'Pacientes hoje',    value: '—' },
  { label: 'Triagens abertas',  value: '—' },
  { label: 'Em tratamento',     value: '—' },
  { label: 'Alta hoje',         value: '—' },
];

/* ─── styles ─────────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .db-root {
    --nav-w:     220px;
    --bg:        #f7f8fa;
    --surface:   #ffffff;
    --nav-bg:    #0f1117;
    --nav-text:  rgba(255,255,255,.55);
    --nav-hover: rgba(255,255,255,.08);
    --nav-active:#ffffff;
    --nav-active-bg: rgba(255,255,255,.1);
    --nav-active-bar: #3b82f6;
    --border:    #e8eaed;
    --border-sm: #f0f2f5;
    --text-1:    #0d1117;
    --text-2:    #6e7787;
    --text-3:    #a8b0bc;
    --accent:    #2563eb;
    --accent-lt: #eff4ff;
    --accent-dk: #1d4ed8;
    --radius:    10px;
    --radius-sm: 7px;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text-1);
  }

  /* ── left nav ── */
  .db-nav {
    width: var(--nav-w);
    background: var(--nav-bg);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
    padding: 0 0 24px;
  }

  .db-nav-brand {
    padding: 24px 20px 20px;
    border-bottom: 1px solid rgba(255,255,255,.07);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .db-nav-logo {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    color: #fff;
    font-size: 15px;
    flex-shrink: 0;
  }
  .db-nav-brand-text {}
  .db-nav-brand-name {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    letter-spacing: -.2px;
    line-height: 1.2;
  }
  .db-nav-brand-sub {
    font-size: 10.5px;
    color: var(--nav-text);
    font-weight: 400;
    letter-spacing: .04em;
  }

  .db-nav-section {
    padding: 0 12px;
    flex: 1;
  }
  .db-nav-section-label {
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: rgba(255,255,255,.25);
    padding: 12px 8px 6px;
  }

  .db-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: var(--radius-sm);
    border: none;
    background: transparent;
    color: var(--nav-text);
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 400;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: background .15s, color .15s;
    position: relative;
    margin-bottom: 2px;
    letter-spacing: -.1px;
  }
  .db-nav-item:hover {
    background: var(--nav-hover);
    color: rgba(255,255,255,.85);
  }
  .db-nav-item.active {
    background: var(--nav-active-bg);
    color: var(--nav-active);
    font-weight: 500;
  }
  .db-nav-item.active::before {
    content: '';
    position: absolute;
    left: 0; top: 6px; bottom: 6px;
    width: 3px;
    border-radius: 0 2px 2px 0;
    background: var(--nav-active-bar);
    animation: db-selector-slide .28s ease-out;
  }
  @keyframes db-selector-slide {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .db-nav-icon { opacity: .7; flex-shrink: 0; }
  .db-nav-item.active .db-nav-icon { opacity: 1; }

  .db-nav-footer {
    padding: 0 12px;
    border-top: 1px solid rgba(255,255,255,.07);
    padding-top: 16px;
  }
  .db-nav-user {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: var(--radius-sm);
    margin-bottom: 4px;
  }
  .db-nav-avatar {
    width: 28px; height: 28px;
    border-radius: 6px;
    background: rgba(59,130,246,.3);
    color: #93c5fd;
    font-size: 11px;
    font-weight: 600;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    letter-spacing: -.3px;
  }
  .db-nav-user-name {
    font-size: 12.5px;
    font-weight: 500;
    color: rgba(255,255,255,.8);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .db-nav-user-role {
    font-size: 10px;
    color: var(--nav-text);
    font-weight: 400;
  }
  .db-nav-logout {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: var(--radius-sm);
    border: none;
    background: transparent;
    color: rgba(255,255,255,.3);
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: color .15s, background .15s;
  }
  .db-nav-logout:hover {
    color: #f87171;
    background: rgba(248,113,113,.08);
  }

  /* ── main ── */
  .db-main {
    margin-left: var(--nav-w);
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* ── topbar ── */
  .db-topbar {
    height: 60px;
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
  .db-topbar-left {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .db-topbar-breadcrumb {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: var(--text-3);
    font-weight: 400;
  }
  .db-topbar-breadcrumb-sep { color: var(--border); }
  .db-topbar-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-1);
    letter-spacing: -.2px;
  }
  .db-topbar-right {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .db-chip {
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
  .db-chip-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: .4; transform: scale(.85); }
  }

  /* ── page content ── */
  .db-content {
    padding: 32px;
    flex: 1;
  }

  /* ── page header ── */
  .db-page-header {
    margin-bottom: 28px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
  }
  .db-page-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 6px;
  }
  .db-page-title {
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -.5px;
    color: var(--text-1);
    line-height: 1.2;
  }
  .db-page-sub {
    font-size: 13.5px;
    color: var(--text-2);
    margin-top: 5px;
    font-weight: 300;
    line-height: 1.5;
  }
  .db-page-sub strong { color: var(--text-1); font-weight: 500; }

  /* ── stat strip ── */
  .db-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }
  .db-stat {
    background: #0f1117;
    border: 1px solid #1d2230;
    border-radius: var(--radius);
    padding: 18px 20px;
    box-shadow: 0 16px 40px rgba(15,17,23,.12);
  }
  .db-stat-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: .04em;
    color: rgba(255,255,255,.42);
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .db-stat-value {
    font-family: 'DM Mono', monospace;
    font-size: 26px;
    font-weight: 500;
    color: #f5f7fb;
    letter-spacing: -.5px;
    line-height: 1;
  }
  .db-stat-value.dash { color: rgba(255,255,255,.4); font-size: 20px; }

  /* ── section header ── */
  .db-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .db-section-title {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--text-3);
  }

  /* ── flow cards ── */
  .db-flows {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin-bottom: 24px;
  }

  .db-flow-card {
    background: #0f1117;
    border: 1px solid #1d2230;
    border-radius: var(--radius);
    padding: 24px;
    cursor: pointer;
    transition: box-shadow .2s, border-color .2s, transform .15s, background .2s;
    display: flex;
    flex-direction: column;
    gap: 14px;
    text-align: left;
    font-family: inherit;
    position: relative;
    overflow: hidden;
  }
  .db-flow-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: transparent;
    transition: background .2s;
  }
  .db-flow-card:hover {
    box-shadow: 0 10px 28px rgba(15,17,23,.22);
    border-color: #2d3648;
    transform: translateY(-1px);
  }
  .db-flow-card:hover::before { background: var(--accent); }
  .db-flow-card.accent {
    background: #121a2b;
    border-color: #3553a4;
  }
  .db-flow-card.accent::before { background: #3b82f6; }
  .db-flow-card.accent:hover {
    background: #15203a;
    border-color: #4672d3;
    box-shadow: 0 10px 28px rgba(26,40,78,.32);
  }

  .db-flow-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    background: #161b25;
    color: #8ea7ff;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .db-flow-card.accent .db-flow-icon {
    background: rgba(59,130,246,.18);
    color: #dbe7ff;
  }

  .db-flow-index {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    color: rgba(255,255,255,.38);
    letter-spacing: .08em;
  }
  .db-flow-card.accent .db-flow-index { color: rgba(255,255,255,.5); }

  .db-flow-title {
    font-size: 14px;
    font-weight: 600;
    color: #f5f7fb;
    letter-spacing: -.2px;
    margin-bottom: 4px;
  }
  .db-flow-card.accent .db-flow-title { color: #f5f7fb; }

  .db-flow-desc {
    font-size: 12.5px;
    color: rgba(255,255,255,.62);
    font-weight: 300;
    line-height: 1.6;
    flex: 1;
  }
  .db-flow-card.accent .db-flow-desc { color: rgba(255,255,255,.68); }

  .db-flow-cta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #8ea7ff;
    letter-spacing: .01em;
  }
  .db-flow-card.accent .db-flow-cta { color: rgba(255,255,255,.9); }
  .db-flow-cta-arrow { transition: transform .15s; }
  .db-flow-card:hover .db-flow-cta-arrow { transform: translateX(3px); }

  /* ── quick access ── */
  .db-quick {
    background: #0f1117;
    border: 1px solid #1d2230;
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: 0 16px 40px rgba(15,17,23,.12);
  }
  .db-quick-header {
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255,255,255,.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .db-quick-title {
    font-size: 13px;
    font-weight: 600;
    color: #f5f7fb;
    letter-spacing: -.1px;
  }
  .db-quick-body {
    padding: 12px 10px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .db-quick-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    border: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #f5f7fb;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: background .15s;
    font-weight: 400;
  }
  .db-quick-item:hover { background: #161b25; }
  .db-quick-icon {
    width: 30px; height: 30px;
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .db-quick-icon.blue  { background: #161b25; color: #8ea7ff; }
  .db-quick-icon.green { background: #14231a; color: #4ade80; }
  .db-quick-icon.amber { background: #2a2112; color: #fbbf24; }
  .db-quick-item-label { flex: 1; font-weight: 500; }
  .db-quick-item-meta  { font-size: 11px; color: rgba(255,255,255,.4); }

  /* ── bottom grid ── */
  .db-bottom-grid {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 14px;
    margin-top: 14px;
  }

  /* ── info panel ── */
  .db-info-panel {
    background: #0f1117;
    border: 1px solid #1d2230;
    border-radius: var(--radius);
    padding: 24px;
    box-shadow: 0 16px 40px rgba(15,17,23,.12);
  }
  .db-info-title {
    font-size: 13px;
    font-weight: 600;
    color: #f5f7fb;
    margin-bottom: 14px;
    letter-spacing: -.1px;
  }
  .db-info-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 0;
    border-top: 1px solid rgba(255,255,255,.06);
  }
  .db-info-item:first-of-type { border-top: none; }
  .db-info-num {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    color: rgba(255,255,255,.38);
    padding-top: 2px;
    flex-shrink: 0;
    width: 20px;
  }
  .db-info-text {}
  .db-info-item-title { font-size: 13px; font-weight: 500; color: #f5f7fb; margin-bottom: 2px; }
  .db-info-item-desc  { font-size: 12px; color: rgba(255,255,255,.62); font-weight: 300; line-height: 1.5; }

  /* ── help card ── */
  .db-help-card {
    background: var(--nav-bg);
    border-radius: var(--radius);
    padding: 24px;
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .db-help-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: rgba(255,255,255,.35);
  }
  .db-help-title {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -.2px;
    line-height: 1.35;
  }
  .db-help-desc {
    font-size: 12.5px;
    color: rgba(255,255,255,.5);
    font-weight: 300;
    line-height: 1.6;
    flex: 1;
  }
  .db-help-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 9px 14px;
    border-radius: var(--radius-sm);
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.1);
    color: rgba(255,255,255,.85);
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    transition: background .15s;
    align-self: flex-start;
  }
  .db-help-btn:hover { background: rgba(255,255,255,.16); }
`;

/* ─── component ──────────────────────────────────────────────────────────── */
function Dashboard({ usuario, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { onLogout(); navigate('/', { replace: true }); };

  const initials = (usuario?.nome || usuario?.username || 'U')
    .split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();

  const displayName = usuario?.nome || usuario?.username || 'Utilizador';
  const firstName = displayName.split(' ')[0];

  return (
    <div className="db-root">
      <style>{css}</style>

      {/* ── left nav ── */}
      <nav className="db-nav">
        <div className="db-nav-brand">
          <div className="db-nav-logo">
            <Icon.Heart />
          </div>
          <div className="db-nav-brand-text">
            <div className="db-nav-brand-name">Banco de Socorro</div>
            <div className="db-nav-brand-sub">Sistema clínico</div>
          </div>
        </div>

        <div className="db-nav-section">
          <div className="db-nav-section-label">Módulos</div>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`db-nav-item${isActive ? ' active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="db-nav-icon"><item.icon /></span>
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="db-nav-footer">
          <div className="db-nav-user">
            <div className="db-nav-avatar">{initials}</div>
            <div>
              <div className="db-nav-user-name">{firstName}</div>
              <div className="db-nav-user-role">Enfermagem</div>
            </div>
          </div>
          <button className="db-nav-logout" onClick={handleLogout}>
            <Icon.LogOut /> Terminar sessão
          </button>
        </div>
      </nav>

      {/* ── main ── */}
      <div className="db-main">

        {/* topbar */}
        <header className="db-topbar">
          <div className="db-topbar-left">
            <div className="db-topbar-breadcrumb">
              <span>Banco de Socorro</span>
              <span className="db-topbar-breadcrumb-sep">/</span>
              <span>Dashboard</span>
            </div>
            <div className="db-topbar-title">Visão geral</div>
          </div>
          <div className="db-topbar-right">
            <div className="db-chip">
              <span className="db-chip-dot" />
              Sistema activo
            </div>
          </div>
        </header>

        {/* content */}
        <div className="db-content">

          {/* page header */}
          <div className="db-page-header">
            <div>
              <div className="db-page-eyebrow">Dashboard</div>
              <h1 className="db-page-title">Bom dia, {firstName}.</h1>
              <p className="db-page-sub">
                Centro clínico de admissão, triagem e tratamento pediátrico.<br />
                Escolha um módulo para iniciar o atendimento.
              </p>
            </div>
          </div>

          {/* stat strip */}
          <div className="db-stats">
            {STATS.map((s) => (
              <div key={s.label} className="db-stat">
                <div className="db-stat-label">{s.label}</div>
                <div className={`db-stat-value${s.value === '—' ? ' dash' : ''}`}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* flows */}
          <div className="db-section-header">
            <span className="db-section-title">Fluxos principais</span>
          </div>
          <div className="db-flows">
            {FLOWS.map((f) => (
              <button
                key={f.path}
                className={`db-flow-card${f.accent ? ' accent' : ''}`}
                onClick={() => navigate(f.path)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div className="db-flow-icon"><f.icon /></div>
                  <span className="db-flow-index">{f.index}</span>
                </div>
                <div>
                  <div className="db-flow-title">{f.title}</div>
                  <div className="db-flow-desc">{f.description}</div>
                </div>
                <div className="db-flow-cta">
                  Abrir módulo <span className="db-flow-cta-arrow"><Icon.ArrowRight /></span>
                </div>
              </button>
            ))}
          </div>

          {/* bottom grid */}
          <div className="db-bottom-grid">

            {/* quick access */}
            <div className="db-quick">
              <div className="db-quick-header">
                <span className="db-quick-title">Acesso rápido</span>
              </div>
              <div className="db-quick-body">
                {[
                  { label: 'Registar novo paciente',    meta: 'Pacientes →', path: '/pacientes',  color: 'blue',  Icon: Icon.User       },
                  { label: 'Lançar dados de triagem',   meta: 'Triagem →',   path: '/triagens',   color: 'green', Icon: Icon.Activity   },
                  { label: 'Avaliar tratamento',         meta: 'Avaliação →', path: '/avaliacoes', color: 'amber', Icon: Icon.Clipboard  },
                ].map((item) => (
                  <button key={item.path} className="db-quick-item" onClick={() => navigate(item.path)}>
                    <div className={`db-quick-icon ${item.color}`}><item.Icon /></div>
                    <span className="db-quick-item-label">{item.label}</span>
                    <span className="db-quick-item-meta">{item.meta}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* help */}
            <div className="db-help-card">
              <div className="db-help-label">Sobre o sistema</div>
              <div className="db-help-title">Banco de Socorro</div>
              <div className="db-help-desc">
                Sistema clínico para admissão, triagem e avaliação de tratamento.
              </div>
              <button className="db-help-btn" onClick={() => navigate('/pacientes')}>
                Iniciar atendimento <Icon.ArrowRight />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
