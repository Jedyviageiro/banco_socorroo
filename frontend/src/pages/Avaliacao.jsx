import { useEffect, useMemo, useState } from 'react';
import { useToast } from '../components/useToast';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';

/* ─── icons ──────────────────────────────────────────────────────────────── */
const Icon = {
  Grid: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>),
  User: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  Activity: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>),
  Clipboard: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>),
  LogOut: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
  Heart: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>),
  ChevronLeft: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>),
  Bed: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>),
  Droplet: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>),
};

const NAV_ITEMS = [
  { label: 'Dashboard', icon: Icon.Grid,      path: '/dashboard' },
  { label: 'Pacientes', icon: Icon.User,      path: '/pacientes' },
  { label: 'Triagem',   icon: Icon.Activity,  path: '/triagens'  },
  { label: 'Avaliação', icon: Icon.Clipboard, path: '/avaliacoes'},
];

const TREATMENT_OPTIONS = [
  {
    key: 'internamento',
    label: 'Internamento',
    desc: 'Acompanhamento contínuo e admissão hospitalar.',
    Icon: Icon.Bed,
  },
  {
    key: 'endovenoso',
    label: 'Endovenoso',
    desc: 'Administração intravenosa e observação clínica.',
    Icon: Icon.Droplet,
  },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .av-root {
    --nav-w: 220px; --bg: #f7f8fa; --surface: #ffffff;
    --nav-bg: #0f1117; --nav-text: rgba(255,255,255,.55);
    --nav-hover: rgba(255,255,255,.08); --nav-active: #ffffff;
    --nav-active-bg: rgba(255,255,255,.1); --nav-active-bar: #3b82f6;
    --border: #e8eaed; --border-sm: #f0f2f5;
    --text-1: #0d1117; --text-2: #6e7787; --text-3: #a8b0bc;
    --accent: #2563eb; --accent-lt: #eff4ff; --accent-dk: #1d4ed8;
    --success: #16a34a; --success-lt: #f0fdf4;
    --danger: #dc2626; --danger-lt: #fef2f2;
    --radius: 10px; --radius-sm: 7px;
    font-family: 'DM Sans', sans-serif;
    display: flex; min-height: 100vh;
    background: var(--bg); color: var(--text-1);
  }

  /* ── nav (shared pattern) ── */
  .av-nav { width: var(--nav-w); background: var(--nav-bg); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; padding: 0 0 24px; }
  .av-nav-brand { padding: 24px 20px 20px; border-bottom: 1px solid rgba(255,255,255,.07); margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
  .av-nav-logo { width: 32px; height: 32px; border-radius: 8px; background: var(--accent); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
  .av-nav-brand-name { font-size: 14px; font-weight: 600; color: #fff; letter-spacing: -.2px; }
  .av-nav-brand-sub  { font-size: 10.5px; color: var(--nav-text); letter-spacing: .04em; }
  .av-nav-section { padding: 0 12px; flex: 1; }
  .av-nav-section-label { font-size: 9.5px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.25); padding: 12px 8px 6px; }
  .av-nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: var(--radius-sm); border: none; background: transparent; color: var(--nav-text); font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 400; cursor: pointer; width: 100%; text-align: left; transition: background .15s, color .15s; position: relative; margin-bottom: 2px; }
  .av-nav-item:hover { background: var(--nav-hover); color: rgba(255,255,255,.85); }
  .av-nav-item.active { background: var(--nav-active-bg); color: var(--nav-active); font-weight: 500; }
  .av-nav-item.active::before { content: ''; position: absolute; left: 0; top: 6px; bottom: 6px; width: 3px; border-radius: 0 2px 2px 0; background: var(--nav-active-bar); animation: av-selector-slide .28s ease-out; }
  @keyframes av-selector-slide { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .av-nav-icon { opacity: .7; flex-shrink: 0; }
  .av-nav-item.active .av-nav-icon { opacity: 1; }
  .av-nav-footer { padding: 0 12px; border-top: 1px solid rgba(255,255,255,.07); padding-top: 16px; }
  .av-nav-user { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: var(--radius-sm); margin-bottom: 4px; }
  .av-nav-avatar { width: 28px; height: 28px; border-radius: 6px; background: rgba(59,130,246,.3); color: #93c5fd; font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .av-nav-user-name { font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .av-nav-user-role { font-size: 10px; color: var(--nav-text); }
  .av-nav-logout { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: var(--radius-sm); border: none; background: transparent; color: rgba(255,255,255,.3); font-family: 'DM Sans', sans-serif; font-size: 12.5px; cursor: pointer; width: 100%; text-align: left; transition: color .15s, background .15s; }
  .av-nav-logout:hover { color: #f87171; background: rgba(248,113,113,.08); }

  /* ── main ── */
  .av-main { margin-left: var(--nav-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* ── topbar ── */
  .av-topbar { height: 60px; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 50; }
  .av-topbar-left { display: flex; flex-direction: column; gap: 1px; }
  .av-topbar-breadcrumb { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-3); }
  .av-topbar-sep { color: var(--border); }
  .av-topbar-title { font-size: 14px; font-weight: 600; color: var(--text-1); letter-spacing: -.2px; }
  .av-topbar-right { display: flex; align-items: center; gap: 8px; }
  .av-back-btn { display: flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface); font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500; color: var(--text-2); cursor: pointer; transition: border-color .15s, color .15s, background .15s; }
  .av-back-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-lt); }
  .av-chip { display: flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; background: var(--accent-lt); color: var(--accent); font-size: 11.5px; font-weight: 500; }
  .av-chip-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.85)} }

  /* ── content ── */
  .av-content { padding: 32px; flex: 1; display: flex; justify-content: center; }
  .av-grid { display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 808px; }

  /* ── card ── */
  .av-card { background: #0f1117; border: 1px solid #1d2230; border-radius: var(--radius); overflow: hidden; box-shadow: 0 16px 40px rgba(15,17,23,.18); }
  .av-card-body { padding: 28px; }

  /* ── form ── */
  .av-form { display: flex; flex-direction: column; gap: 20px; }
  .av-field { display: flex; flex-direction: column; gap: 6px; }
  .av-field-label { font-size: 11.5px; font-weight: 600; letter-spacing: .04em; color: rgba(255,255,255,.72); display: flex; align-items: center; gap: 5px; }
  .av-field-req { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); display: inline-block; }
  .av-field select, .av-field textarea { font-family: 'DM Sans', sans-serif; font-size: 13.5px; color: #f5f7fb; background: #161b25; border: 1px solid #262d3b; border-radius: var(--radius-sm); padding: 10px 14px; outline: none; width: 100%; transition: border-color .15s, box-shadow .15s, background .15s; -webkit-appearance: none; }
  .av-field select { min-height: 46px; font-weight: 500; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='%23d9e2f1' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; background-size: 13px; padding-right: 42px; }
  .av-field select:hover { border-color: #262d3b; background-color: #161b25; }
  .av-field select:focus { border-color: #262d3b; box-shadow: none; background: #161b25; outline: none; }
  .av-field textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.14); background: #1a2130; }
  .av-field select option { color: #111827; background: #ffffff; font-weight: 500; border-radius: 10px; }
  .av-field select option[value=""] { color: #374151; }
  .av-field textarea { resize: vertical; min-height: 120px; line-height: 1.6; }

  .av-divider { display: flex; align-items: center; gap: 10px; font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: rgba(255,255,255,.42); }
  .av-divider::before, .av-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.08); }

  /* ── treatment toggle ── */
  .av-treatment-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .av-treatment-option {
    display: flex; flex-direction: column; gap: 8px;
    padding: 14px 16px;
    border-radius: var(--radius-sm);
    border: 1.5px solid #262d3b;
    background: #161b25;
    cursor: pointer;
    transition: border-color .15s, background .15s, box-shadow .15s;
    text-align: left; font-family: inherit;
  }
  .av-treatment-option:hover { border-color: #4c5f8d; background: #1a2130; }
  .av-treatment-option.selected { border-color: var(--accent); background: #1a2130; box-shadow: 0 0 0 3px rgba(59,130,246,.12); }
  .av-treatment-option-top { display: flex; align-items: center; justify-content: space-between; }
  .av-treatment-icon { color: rgba(255,255,255,.45); transition: color .15s; }
  .av-treatment-option.selected .av-treatment-icon { color: var(--accent); }
  .av-treatment-radio { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid #3a4355; background: #0f1117; display: flex; align-items: center; justify-content: center; transition: border-color .15s; flex-shrink: 0; }
  .av-treatment-option.selected .av-treatment-radio { border-color: var(--accent); background: var(--accent); }
  .av-treatment-radio-dot { width: 6px; height: 6px; border-radius: 50%; background: #fff; opacity: 0; transition: opacity .15s; }
  .av-treatment-option.selected .av-treatment-radio-dot { opacity: 1; }
  .av-treatment-name { font-size: 13px; font-weight: 600; color: #f5f7fb; }
  .av-treatment-desc { font-size: 11.5px; color: rgba(255,255,255,.62); font-weight: 300; line-height: 1.5; }
  .av-treatment-option.selected .av-treatment-name { color: #dbe7ff; }

  /* ── alerts / submit ── */
  .av-submit { padding: 11px 24px; background: #3c3489; color: #fff; border: none; border-radius: var(--radius-sm); font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: background .15s, transform .1s, box-shadow .15s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .av-submit:hover:not(:disabled) { background: #322a77; box-shadow: 0 4px 16px rgba(60,52,137,.25); transform: translateY(-1px); }
  .av-submit:disabled { opacity: .55; cursor: not-allowed; }
  .av-spinner { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── sidebar ── */
  .av-sidebar { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
  @media (max-width: 720px) { .av-sidebar { grid-template-columns: 1fr; } }
  .av-side-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 22px; }
  .av-side-label { font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
  .av-patient-avatar { width: 40px; height: 40px; border-radius: 9px; background: var(--accent-lt); color: var(--accent); font-size: 15px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
  .av-patient-name { font-size: 14px; font-weight: 600; color: var(--text-1); letter-spacing: -.2px; margin-bottom: 8px; }
  .av-patient-name.empty { font-size: 13px; font-weight: 400; color: var(--text-3); margin-top: 8px; }
  .av-patient-meta { font-size: 12px; color: var(--text-2); font-weight: 300; }

  /* treatment summary card */
  .av-treatment-summary { display: flex; flex-direction: column; gap: 10px; }
  .av-treatment-summary-type { display: flex; align-items: center; gap: 10px; }
  .av-treatment-badge { width: 36px; height: 36px; border-radius: 8px; background: var(--accent-lt); color: var(--accent); display: flex; align-items: center; justify-content: center; }
  .av-treatment-badge-label { font-size: 15px; font-weight: 600; color: var(--text-1); letter-spacing: -.2px; }
  .av-treatment-badge-sub { font-size: 11.5px; color: var(--text-2); font-weight: 300; line-height: 1.5; margin-top: 2px; }
`;

function Avaliacao({ usuario, onLogout }) {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [pacientes, setPacientes]           = useState([]);
  const [isLoadingPacientes, setIsLoading]  = useState(true);
  const [form, setForm]                     = useState({ PacienteId: '', tipo: 'internamento', descricao: '' });
  const [uiState, setUiState]               = useState('idle');
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data } = await api.get('/pacientes');
        if (isMounted) setPacientes(data);
      } catch {
        if (isMounted) {
          toast.error('Não foi possível carregar os pacientes.', 'Carga falhou');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [toast]);

  const pacienteAtual = useMemo(
    () => pacientes.find((p) => String(p.id) === String(form.PacienteId)),
    [pacientes, form.PacienteId]
  );

  const handleLogout = () => { onLogout(); navigate('/', { replace: true }); };
  const handleChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const setTipo      = (tipo) => setForm((prev) => ({ ...prev, tipo }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setUiState('loading');
    try {
      await api.post('/avaliacoes', { ...form, PacienteId: Number(form.PacienteId) });
      setUiState('success');
      setForm({ PacienteId: '', tipo: 'internamento', descricao: '' });
      toast.success('Avaliação registada com sucesso.', 'Avaliação guardada');
    } catch (err) {
      setUiState('error');
      const message = err.response?.data?.erro || 'Não foi possível guardar a avaliação.';
      toast.error(message, 'Falha ao guardar');
    }
  };

  const displayName     = usuario?.nome || usuario?.username || 'Utilizador';
  const initials        = displayName.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  const firstName       = displayName.split(' ')[0];
  const patientInitials = pacienteAtual?.nome
    ? pacienteAtual.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : null;

  const selectedOption = TREATMENT_OPTIONS.find((o) => o.key === form.tipo);

  return (
    <div className="av-root">
      <style>{css}</style>

      {/* ── left nav ── */}
      <nav className="av-nav">
        <div className="av-nav-brand">
          <div className="av-nav-logo"><Icon.Heart /></div>
          <div>
            <div className="av-nav-brand-name">Banco de Socorro</div>
            <div className="av-nav-brand-sub">Sistema clínico</div>
          </div>
        </div>
        <div className="av-nav-section">
          <div className="av-nav-section-label">Módulos</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              className={`av-nav-item${location.pathname === item.path ? ' active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="av-nav-icon"><item.icon /></span>
              {item.label}
            </button>
          ))}
        </div>
        <div className="av-nav-footer">
          <div className="av-nav-user">
            <div className="av-nav-avatar">{initials}</div>
            <div>
              <div className="av-nav-user-name">{firstName}</div>
              <div className="av-nav-user-role">Médico / Enfermagem</div>
            </div>
          </div>
          <button className="av-nav-logout" onClick={handleLogout}>
            <Icon.LogOut /> Terminar sessão
          </button>
        </div>
      </nav>

      {/* ── main ── */}
      <div className="av-main">
        <header className="av-topbar">
          <div className="av-topbar-left">
            <div className="av-topbar-breadcrumb">
              <span>Banco de Socorro</span><span className="av-topbar-sep">/</span><span>Avaliação</span>
            </div>
            <div className="av-topbar-title">Avaliação de tratamento</div>
          </div>
          <div className="av-topbar-right">
            <button className="av-back-btn" onClick={() => navigate('/dashboard')}>
              <Icon.ChevronLeft /> Dashboard
            </button>
            <div className="av-chip"><span className="av-chip-dot" /> Sistema activo</div>
          </div>
        </header>

        <div className="av-content">
          <div className="av-grid">
            {/* form card */}
            <div className="av-card">
              <div className="av-card-body">
                <form className="av-form" onSubmit={handleSubmit}>

                  <div className="av-field">
                    <label className="av-field-label">Paciente <span className="av-field-req" /></label>
                    <select value={form.PacienteId} onChange={handleChange('PacienteId')} disabled={isLoadingPacientes} required>
                      <option value="">{isLoadingPacientes ? 'A carregar pacientes…' : 'Selecionar paciente'}</option>
                      {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                    </select>
                  </div>

                  <div className="av-divider">Tipo de tratamento</div>

                  <div className="av-treatment-grid">
                    {TREATMENT_OPTIONS.map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        className={`av-treatment-option${form.tipo === opt.key ? ' selected' : ''}`}
                        onClick={() => setTipo(opt.key)}
                      >
                        <div className="av-treatment-option-top">
                          <span className="av-treatment-icon"><opt.Icon /></span>
                          <span className="av-treatment-radio">
                            <span className="av-treatment-radio-dot" />
                          </span>
                        </div>
                        <div className="av-treatment-name">{opt.label}</div>
                        <div className="av-treatment-desc">{opt.desc}</div>
                      </button>
                    ))}
                  </div>

                  <div className="av-divider">Justificação clínica</div>

                  <div className="av-field">
                    <label className="av-field-label">Descrição <span className="av-field-req" /></label>
                    <textarea
                      rows={6}
                      value={form.descricao}
                      onChange={handleChange('descricao')}
                      placeholder="Descreva a avaliação e a justificação para o tratamento escolhido…"
                      required
                    />
                  </div>

                  <button className="av-submit" type="submit" disabled={uiState === 'loading'}>
                    {uiState === 'loading' ? <><span className="av-spinner" /> A guardar…</> : '→ Guardar avaliação'}
                  </button>
                </form>
              </div>
            </div>

            {/* sidebar */}
            <div className="av-sidebar">
              {/* patient */}
              <div className="av-side-card">
                <div className="av-side-label">Paciente selecionado</div>
                {pacienteAtual ? (
                  <>
                    <div className="av-patient-avatar">{patientInitials}</div>
                    <div className="av-patient-name">{pacienteAtual.nome}</div>
                    <div className="av-patient-meta">
                      {pacienteAtual.telefone ? `Tel: ${pacienteAtual.telefone}` : 'Sem contacto registado'}
                    </div>
                  </>
                ) : (
                  <p className="av-patient-name empty">Nenhum paciente selecionado. Escolha um da lista.</p>
                )}
              </div>

              {/* treatment summary */}
              <div className="av-side-card">
                <div className="av-side-label">Tratamento escolhido</div>
                <div className="av-treatment-summary">
                  <div className="av-treatment-summary-type">
                    <div className="av-treatment-badge">
                      {selectedOption && <selectedOption.Icon />}
                    </div>
                    <div>
                      <div className="av-treatment-badge-label">{selectedOption?.label}</div>
                    </div>
                  </div>
                  <p className="av-treatment-badge-sub">{selectedOption?.desc}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Avaliacao;
