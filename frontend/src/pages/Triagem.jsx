import { useEffect, useMemo, useState } from 'react';
import { useToast } from '../components/useToast';
import { getClinicalRouting } from '../lib/clinicalRouting';
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
};

const NAV_ITEMS = [
  { label: 'Dashboard', icon: Icon.Grid,      path: '/dashboard' },
  { label: 'Pacientes', icon: Icon.User,      path: '/pacientes' },
  { label: 'Triagem',   icon: Icon.Activity,  path: '/triagens'  },
  { label: 'Avaliação', icon: Icon.Clipboard, path: '/avaliacoes'},
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .tr-root {
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

  .tr-nav { width: var(--nav-w); background: var(--nav-bg); display: flex; flex-direction: column; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100; padding: 0 0 24px; }
  .tr-nav-brand { padding: 24px 20px 20px; border-bottom: 1px solid rgba(255,255,255,.07); margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
  .tr-nav-logo { width: 32px; height: 32px; border-radius: 8px; background: var(--accent); display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
  .tr-nav-brand-name { font-size: 14px; font-weight: 600; color: #fff; letter-spacing: -.2px; }
  .tr-nav-brand-sub  { font-size: 10.5px; color: var(--nav-text); letter-spacing: .04em; }
  .tr-nav-section { padding: 0 12px; flex: 1; }
  .tr-nav-section-label { font-size: 9.5px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.25); padding: 12px 8px 6px; }
  .tr-nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: var(--radius-sm); border: none; background: transparent; color: var(--nav-text); font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 400; cursor: pointer; width: 100%; text-align: left; transition: background .15s, color .15s; position: relative; margin-bottom: 2px; }
  .tr-nav-item:hover { background: var(--nav-hover); color: rgba(255,255,255,.85); }
  .tr-nav-item.active { background: var(--nav-active-bg); color: var(--nav-active); font-weight: 500; }
  .tr-nav-item.active::before { content: ''; position: absolute; left: 0; top: 6px; bottom: 6px; width: 3px; border-radius: 0 2px 2px 0; background: var(--nav-active-bar); animation: tr-selector-slide .28s ease-out; }
  @keyframes tr-selector-slide { from { transform: translateY(-10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .tr-nav-icon { opacity: .7; flex-shrink: 0; }
  .tr-nav-item.active .tr-nav-icon { opacity: 1; }
  .tr-nav-footer { padding: 0 12px; border-top: 1px solid rgba(255,255,255,.07); padding-top: 16px; }
  .tr-nav-user { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: var(--radius-sm); margin-bottom: 4px; }
  .tr-nav-avatar { width: 28px; height: 28px; border-radius: 6px; background: rgba(59,130,246,.3); color: #93c5fd; font-size: 11px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .tr-nav-user-name { font-size: 12.5px; font-weight: 500; color: rgba(255,255,255,.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tr-nav-user-role { font-size: 10px; color: var(--nav-text); }
  .tr-nav-logout { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: var(--radius-sm); border: none; background: transparent; color: rgba(255,255,255,.3); font-family: 'DM Sans', sans-serif; font-size: 12.5px; cursor: pointer; width: 100%; text-align: left; transition: color .15s, background .15s; }
  .tr-nav-logout:hover { color: #f87171; background: rgba(248,113,113,.08); }

  .tr-main { margin-left: var(--nav-w); flex: 1; display: flex; flex-direction: column; min-height: 100vh; }

  .tr-topbar { height: 60px; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 32px; position: sticky; top: 0; z-index: 50; }
  .tr-topbar-left { display: flex; flex-direction: column; gap: 1px; }
  .tr-topbar-breadcrumb { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-3); }
  .tr-topbar-sep { color: var(--border); }
  .tr-topbar-title { font-size: 14px; font-weight: 600; color: var(--text-1); letter-spacing: -.2px; }
  .tr-topbar-right { display: flex; align-items: center; gap: 8px; }
  .tr-back-btn { display: flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface); font-family: 'DM Sans', sans-serif; font-size: 12.5px; font-weight: 500; color: var(--text-2); cursor: pointer; transition: border-color .15s, color .15s, background .15s; }
  .tr-back-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-lt); }
  .tr-chip { display: flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; background: var(--accent-lt); color: var(--accent); font-size: 11.5px; font-weight: 500; }
  .tr-chip-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.85)} }

  .tr-content { padding: 32px; flex: 1; display: flex; justify-content: center; }
  .tr-grid { display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 808px; }

  .tr-card { background: #0f1117; border: 1px solid #1d2230; border-radius: var(--radius); overflow: hidden; box-shadow: 0 16px 40px rgba(15,17,23,.18); }
  .tr-card-body { padding: 28px; }

  .tr-form { display: flex; flex-direction: column; gap: 18px; }
  .tr-field { display: flex; flex-direction: column; gap: 6px; }
  .tr-field-label { font-size: 11.5px; font-weight: 600; letter-spacing: .04em; color: rgba(255,255,255,.72); display: flex; align-items: center; gap: 5px; }
  .tr-field-req { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); display: inline-block; }
  .tr-field select, .tr-field input, .tr-field textarea { font-family: 'DM Sans', sans-serif; font-size: 13.5px; color: #f5f7fb; background: #161b25; border: 1px solid #262d3b; border-radius: var(--radius-sm); padding: 10px 14px; outline: none; width: 100%; transition: border-color .15s, box-shadow .15s, background .15s; -webkit-appearance: none; }
  .tr-field select { min-height: 46px; font-weight: 500; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='%23d9e2f1' stroke-width='2.3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; background-size: 13px; padding-right: 42px; }
  .tr-field select:hover { border-color: #262d3b; background-color: #161b25; }
  .tr-field select:focus { border-color: #262d3b; box-shadow: none; background: #161b25; outline: none; }
  .tr-field input:focus, .tr-field textarea:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.14); background: #1a2130; }
  .tr-field select option { color: #111827; background: #ffffff; font-weight: 500; border-radius: 10px; }
  .tr-field select option[value=""] { color: #374151; }
  .tr-field textarea { resize: vertical; min-height: 110px; line-height: 1.6; }
  .tr-field input[type="number"] { font-family: 'DM Mono', monospace; font-size: 13px; }
  .tr-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .tr-divider { display: flex; align-items: center; gap: 10px; font-size: 10px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: rgba(255,255,255,.42); }
  .tr-divider::before, .tr-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,.08); }

  .tr-submit { padding: 11px 24px; background: #3c3489; color: #fff; border: none; border-radius: var(--radius-sm); font-family: 'DM Sans', sans-serif; font-size: 13.5px; font-weight: 600; cursor: pointer; transition: background .15s, transform .1s, box-shadow .15s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .tr-submit:hover:not(:disabled) { background: #322a77; box-shadow: 0 4px 16px rgba(60,52,137,.25); transform: translateY(-1px); }
  .tr-submit:disabled { opacity: .55; cursor: not-allowed; }
  .tr-spinner { width: 13px; height: 13px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .tr-sidebar { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
  @media (max-width: 720px) { .tr-sidebar { grid-template-columns: 1fr; } }
  .tr-side-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 22px; }
  .tr-side-label { font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--accent); margin-bottom: 12px; }
  .tr-patient-avatar { width: 40px; height: 40px; border-radius: 9px; background: var(--accent-lt); color: var(--accent); font-size: 15px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
  .tr-patient-name { font-size: 14px; font-weight: 600; color: var(--text-1); letter-spacing: -.2px; margin-bottom: 10px; }
  .tr-patient-name.empty { font-size: 13px; font-weight: 400; color: var(--text-3); margin-top: 8px; }
  .tr-detail-sep { display: flex; align-items: center; gap: 8px; font-size: 9.5px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--text-3); margin: 10px 0; }
  .tr-detail-sep::before, .tr-detail-sep::after { content: ''; flex: 1; height: 1px; background: var(--border-sm); }
  .tr-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .tr-detail-item-label { font-size: 10px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--text-3); margin-bottom: 2px; }
  .tr-detail-item-value { font-size: 13px; font-weight: 500; color: var(--text-1); }
  .tr-status-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .tr-status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-3); position: relative; }
  .tr-status-dot.active { background: var(--success); }
  .tr-status-dot.active::after { content: ''; position: absolute; inset: -3px; border-radius: 50%; background: rgba(22,163,74,.2); animation: pulse 1.8s ease-in-out infinite; }
  .tr-status-label { font-size: 13px; font-weight: 600; color: var(--text-1); }
  .tr-status-desc { font-size: 12px; color: var(--text-2); font-weight: 300; line-height: 1.55; }
  .tr-route-card { background: #ffffff; border: 1px solid var(--border); border-radius: var(--radius); padding: 20px 22px; }
  .tr-route-label { font-size: 10px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--accent); margin-bottom: 10px; }
  .tr-route-dept { font-size: 16px; font-weight: 600; color: var(--text-1); margin-bottom: 8px; letter-spacing: -.2px; }
  .tr-route-summary { font-size: 12.5px; color: var(--text-2); line-height: 1.55; margin-bottom: 10px; }
  .tr-route-diagnosis { font-size: 14px; font-weight: 600; color: var(--text-1); margin-bottom: 8px; letter-spacing: -.2px; }
  .tr-route-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
  .tr-route-chip { padding: 5px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; background: var(--accent-lt); color: var(--accent); }
  .tr-route-chip.neutral { background: #f3f4f6; color: #4b5563; }
  .tr-route-reason { font-size: 12px; color: var(--text-2); line-height: 1.55; }
`;

function Triagem({ usuario, onLogout }) {
  const toast = useToast();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [pacientes, setPacientes] = useState([]);
  const [isLoadingPacientes, setIsLoadingPacientes] = useState(true);
  const [form, setForm]     = useState({
    PacienteId: '',
    temperatura: '',
    pressao: '',
    saturacaoOxigenio: '',
    frequenciaCardiaca: '',
    frequenciaRespiratoria: '',
    nivelDor: '',
    estadoGeral: 'estavel',
    sintomas: '',
  });
  const [uiState, setUiState] = useState('idle');
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
        if (isMounted) setIsLoadingPacientes(false);
      }
    })();
    return () => { isMounted = false; };
  }, [toast]);

  const pacienteAtual = useMemo(
    () => pacientes.find((p) => String(p.id) === String(form.PacienteId)),
    [pacientes, form.PacienteId]
  );
  const encaminhamento = useMemo(() => getClinicalRouting(form), [form]);

  const handleLogout   = () => { onLogout(); navigate('/', { replace: true }); };
  const handleChange   = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const handleSubmit   = async (e) => {
    e.preventDefault(); setUiState('loading');
    try {
      await api.post('/triagens', {
        ...form,
        PacienteId: Number(form.PacienteId),
        temperatura: Number(form.temperatura),
        saturacaoOxigenio: Number(form.saturacaoOxigenio),
        frequenciaCardiaca: Number(form.frequenciaCardiaca),
        frequenciaRespiratoria: Number(form.frequenciaRespiratoria),
        nivelDor: Number(form.nivelDor),
      });
      setUiState('success');
      setForm({
        PacienteId: '',
        temperatura: '',
        pressao: '',
        saturacaoOxigenio: '',
        frequenciaCardiaca: '',
        frequenciaRespiratoria: '',
        nivelDor: '',
        estadoGeral: 'estavel',
        sintomas: '',
      });
      toast.success(`Encaminhamento sugerido: ${encaminhamento.department.label}.`, 'Triagem guardada');
    } catch (err) {
      setUiState('error');
      const message = err.response?.data?.erro || 'Não foi possível guardar a triagem.';
      toast.error(message, 'Falha ao guardar');
    }
  };

  const displayName     = usuario?.nome || usuario?.username || 'Utilizador';
  const initials        = displayName.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  const firstName       = displayName.split(' ')[0];
  const patientInitials = pacienteAtual?.nome
    ? pacienteAtual.nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : null;

  return (
    <div className="tr-root">
      <style>{css}</style>

      {/* ── left nav ── */}
      <nav className="tr-nav">
        <div className="tr-nav-brand">
          <div className="tr-nav-logo"><Icon.Heart /></div>
          <div>
            <div className="tr-nav-brand-name">Banco de Socorro</div>
            <div className="tr-nav-brand-sub">Sistema clínico</div>
          </div>
        </div>
        <div className="tr-nav-section">
          <div className="tr-nav-section-label">Módulos</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              className={`tr-nav-item${location.pathname === item.path ? ' active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="tr-nav-icon"><item.icon /></span>
              {item.label}
            </button>
          ))}
        </div>
        <div className="tr-nav-footer">
          <div className="tr-nav-user">
            <div className="tr-nav-avatar">{initials}</div>
            <div>
              <div className="tr-nav-user-name">{firstName}</div>
              <div className="tr-nav-user-role">Enfermagem</div>
            </div>
          </div>
          <button className="tr-nav-logout" onClick={handleLogout}>
            <Icon.LogOut /> Terminar sessão
          </button>
        </div>
      </nav>

      {/* ── main ── */}
      <div className="tr-main">
        <header className="tr-topbar">
          <div className="tr-topbar-left">
            <div className="tr-topbar-breadcrumb">
              <span>Banco de Socorro</span><span className="tr-topbar-sep">/</span><span>Triagem</span>
            </div>
            <div className="tr-topbar-title">Registo de triagem</div>
          </div>
          <div className="tr-topbar-right">
            <button className="tr-back-btn" onClick={() => navigate('/dashboard')}>
              <Icon.ChevronLeft /> Dashboard
            </button>
            <div className="tr-chip"><span className="tr-chip-dot" /> Sistema activo</div>
          </div>
        </header>

        <div className="tr-content">
          <div className="tr-grid">
            {/* form card */}
            <div className="tr-card">
              <div className="tr-card-body">
                <form className="tr-form" onSubmit={handleSubmit}>
                  <div className="tr-field">
                    <label className="tr-field-label">Paciente <span className="tr-field-req" /></label>
                    <select value={form.PacienteId} onChange={handleChange('PacienteId')} disabled={isLoadingPacientes} required>
                      <option value="">{isLoadingPacientes ? 'A carregar pacientes…' : 'Selecionar paciente'}</option>
                      {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                    </select>
                  </div>

                  <div className="tr-divider">Sinais vitais</div>

                  <div className="tr-field-row">
                    <div className="tr-field">
                      <label className="tr-field-label">Temperatura (°C) <span className="tr-field-req" /></label>
                      <input type="number" step="0.1" value={form.temperatura} onChange={handleChange('temperatura')} placeholder="37.4" required />
                    </div>
                    <div className="tr-field">
                      <label className="tr-field-label">Pressão arterial <span className="tr-field-req" /></label>
                      <input type="text" value={form.pressao} onChange={handleChange('pressao')} placeholder="110/70" required />
                    </div>
                  </div>

                  <div className="tr-field-row">
                    <div className="tr-field">
                      <label className="tr-field-label">Saturação O2 (%) <span className="tr-field-req" /></label>
                      <input type="number" min="50" max="100" value={form.saturacaoOxigenio} onChange={handleChange('saturacaoOxigenio')} placeholder="98" required />
                    </div>
                    <div className="tr-field">
                      <label className="tr-field-label">Freq. cardíaca (bpm) <span className="tr-field-req" /></label>
                      <input type="number" min="40" max="220" value={form.frequenciaCardiaca} onChange={handleChange('frequenciaCardiaca')} placeholder="96" required />
                    </div>
                  </div>

                  <div className="tr-field-row">
                    <div className="tr-field">
                      <label className="tr-field-label">Freq. respiratória <span className="tr-field-req" /></label>
                      <input type="number" min="8" max="60" value={form.frequenciaRespiratoria} onChange={handleChange('frequenciaRespiratoria')} placeholder="22" required />
                    </div>
                    <div className="tr-field">
                      <label className="tr-field-label">Nível de dor (0-10) <span className="tr-field-req" /></label>
                      <input type="number" min="0" max="10" value={form.nivelDor} onChange={handleChange('nivelDor')} placeholder="4" required />
                    </div>
                  </div>

                  <div className="tr-field">
                    <label className="tr-field-label">Estado geral <span className="tr-field-req" /></label>
                    <select value={form.estadoGeral} onChange={handleChange('estadoGeral')} required>
                      <option value="estavel">Estável</option>
                      <option value="debilitado">Debilitado</option>
                      <option value="critico">Crítico</option>
                    </select>
                  </div>

                  <div className="tr-divider">Observação</div>

                  <div className="tr-field">
                    <label className="tr-field-label">Sintomas observados <span className="tr-field-req" /></label>
                    <textarea rows={5} value={form.sintomas} onChange={handleChange('sintomas')} placeholder="Descreva os sintomas observados…" required />
                  </div>

                  <button className="tr-submit" type="submit" disabled={uiState === 'loading'}>
                    {uiState === 'loading' ? <><span className="tr-spinner" /> A guardar…</> : '→ Guardar triagem'}
                  </button>
                </form>
              </div>
            </div>

            {/* sidebar */}
            <div className="tr-sidebar">
              <div className="tr-route-card">
                <div className="tr-route-label">Encaminhamento sugerido</div>
                <div className="tr-route-dept">{encaminhamento.department.label}</div>
                <div className="tr-route-diagnosis">{encaminhamento.diagnosis}</div>
                <div className="tr-route-summary">{encaminhamento.department.summary}</div>
                <div className="tr-route-meta">
                  <span className="tr-route-chip">Confiança {encaminhamento.confidence}</span>
                  <span className="tr-route-chip">Prioridade {encaminhamento.priority}</span>
                  {encaminhamento.matchedKeywords.length ? (
                    encaminhamento.matchedKeywords.slice(0, 2).map((keyword) => (
                      <span key={keyword} className="tr-route-chip neutral">{keyword}</span>
                    ))
                  ) : (
                    <span className="tr-route-chip neutral">Sem palavras-chave fortes</span>
                  )}
                </div>
                <p className="tr-route-reason">{encaminhamento.reason}</p>
              </div>

              <div className="tr-side-card">
                <div className="tr-side-label">Paciente selecionado</div>
                {pacienteAtual ? (
                  <>
                    <div className="tr-patient-avatar">{patientInitials}</div>
                    <div className="tr-patient-name">{pacienteAtual.nome}</div>
                    <div className="tr-detail-sep">Detalhes</div>
                    <div className="tr-detail-grid">
                      <div>
                        <div className="tr-detail-item-label">Idade</div>
                        <div className="tr-detail-item-value">{pacienteAtual.idade ? `${pacienteAtual.idade} anos` : '—'}</div>
                      </div>
                      <div>
                        <div className="tr-detail-item-label">Sexo</div>
                        <div className="tr-detail-item-value">{pacienteAtual.sexo || '—'}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="tr-patient-name empty">Nenhum paciente selecionado. Escolha um da lista.</p>
                )}
              </div>

              <div className="tr-side-card">
                <div className="tr-side-label">Estado</div>
                <div className="tr-status-row">
                  <span className={`tr-status-dot${uiState === 'success' ? ' active' : ''}`} />
                  <span className="tr-status-label">{uiState === 'success' ? 'Triagem registada' : 'Pronto para registar'}</span>
                </div>
                <p className="tr-status-desc">
                  {uiState === 'success'
                    ? 'Os dados foram guardados com sucesso e estão prontos para a próxima etapa.'
                    : 'Preencha os sinais vitais e os sintomas para guardar a triagem.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Triagem;
