import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../components/useToast';
import api from '../services/api';

const Icon = {
  Grid: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>),
  User: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  Activity: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>),
  Clipboard: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>),
  Flask: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V2"/><path d="M8.5 2h7"/><path d="M14 9.3 19.74 19a2 2 0 0 1-1.72 3H5.98a2 2 0 0 1-1.72-3L10 9.3"/><path d="M6 16h12"/></svg>),
  Droplet: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>),
  LogOut: () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
  ChevronLeft: () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>),
  Heart: () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>),
};

const NAV_ITEMS = [
  { label: 'Dashboard', icon: Icon.Grid, path: '/dashboard' },
  { label: 'Pacientes', icon: Icon.User, path: '/pacientes' },
  { label: 'Triagem', icon: Icon.Activity, path: '/triagens' },
  { label: 'Avaliação', icon: Icon.Clipboard, path: '/avaliacoes' },
  { label: 'Laboratório', icon: Icon.Flask, path: '/laboratorio-principal' },
  { label: 'Banco de Sangue', icon: Icon.Droplet, path: '/banco-de-sangue' },
];

const COMPONENTES = ['Concentrado Eritrocitário', 'Plasma Fresco', 'Plaquetas', 'Sangue total'];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  .bs-root { --nav-w:220px; --bg:#f7f8fa; --surface:#fff; --nav-bg:#0f1117; --nav-text:rgba(255,255,255,.55); --nav-hover:rgba(255,255,255,.08); --nav-active:#fff; --nav-active-bg:rgba(255,255,255,.1); --nav-active-bar:#3b82f6; --border:#e8eaed; --text-1:#0d1117; --text-2:#6e7787; --text-3:#a8b0bc; --accent:#2563eb; --accent-lt:#eff4ff; --radius:10px; --radius-sm:7px; font-family:'DM Sans',sans-serif; display:flex; min-height:100vh; background:var(--bg); color:var(--text-1); }
  .bs-nav { width:var(--nav-w); background:var(--nav-bg); display:flex; flex-direction:column; position:fixed; top:0; left:0; bottom:0; padding:0 0 24px; }
  .bs-nav-brand { padding:24px 20px 20px; border-bottom:1px solid rgba(255,255,255,.07); margin-bottom:8px; display:flex; align-items:center; gap:10px; }
  .bs-nav-logo { width:32px; height:32px; border-radius:8px; background:var(--accent); display:flex; align-items:center; justify-content:center; color:#fff; }
  .bs-nav-brand-name { font-size:14px; font-weight:600; color:#fff; }
  .bs-nav-brand-sub { font-size:10.5px; color:var(--nav-text); letter-spacing:.04em; }
  .bs-nav-section { padding:0 12px; flex:1; }
  .bs-nav-section-label { font-size:9.5px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.25); padding:12px 8px 6px; }
  .bs-nav-item { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:var(--radius-sm); border:none; background:transparent; color:var(--nav-text); font:400 13.5px 'DM Sans',sans-serif; cursor:pointer; width:100%; text-align:left; position:relative; margin-bottom:2px; }
  .bs-nav-item:hover { background:var(--nav-hover); color:rgba(255,255,255,.85); }
  .bs-nav-item.active { background:var(--nav-active-bg); color:var(--nav-active); font-weight:500; }
  .bs-nav-item.active::before { content:''; position:absolute; left:0; top:6px; bottom:6px; width:3px; border-radius:0 2px 2px 0; background:var(--nav-active-bar); }
  .bs-nav-footer { padding:0 12px; border-top:1px solid rgba(255,255,255,.07); padding-top:16px; }
  .bs-nav-user { display:flex; align-items:center; gap:10px; padding:8px 10px; margin-bottom:4px; }
  .bs-nav-avatar { width:28px; height:28px; border-radius:6px; background:rgba(59,130,246,.3); color:#93c5fd; font-size:11px; font-weight:600; display:flex; align-items:center; justify-content:center; }
  .bs-nav-user-name { font-size:12.5px; font-weight:500; color:rgba(255,255,255,.8); }
  .bs-nav-user-role { font-size:10px; color:var(--nav-text); }
  .bs-nav-logout { display:flex; align-items:center; gap:8px; padding:8px 10px; border:none; background:transparent; color:rgba(255,255,255,.3); font:400 12.5px 'DM Sans',sans-serif; cursor:pointer; width:100%; text-align:left; border-radius:var(--radius-sm); }
  .bs-main { margin-left:var(--nav-w); flex:1; display:flex; flex-direction:column; min-height:100vh; }
  .bs-topbar { height:60px; background:var(--surface); border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; padding:0 32px; position:sticky; top:0; z-index:50; }
  .bs-topbar-breadcrumb { display:flex; align-items:center; gap:5px; font-size:11px; color:var(--text-3); }
  .bs-topbar-title { font-size:14px; font-weight:600; }
  .bs-back-btn { display:flex; align-items:center; gap:5px; padding:6px 12px; border-radius:var(--radius-sm); border:1px solid var(--border); background:#fff; font:500 12.5px 'DM Sans',sans-serif; color:var(--text-2); cursor:pointer; }
  .bs-chip { display:flex; align-items:center; gap:6px; padding:5px 12px; border-radius:20px; background:var(--accent-lt); color:var(--accent); font-size:11.5px; font-weight:500; }
  .bs-chip-dot { width:6px; height:6px; border-radius:50%; background:var(--accent); }
  .bs-content { padding:32px; flex:1; display:flex; justify-content:center; }
  .bs-grid { display:grid; grid-template-columns:minmax(0,1.35fr) minmax(320px,.9fr); gap:20px; width:100%; max-width:1260px; align-items:start; }
  .bs-card { background:#0f1117; border:1px solid #1d2230; border-radius:var(--radius); box-shadow:0 16px 40px rgba(15,17,23,.18); }
  .bs-card-body { padding:28px; }
  .bs-form { display:flex; flex-direction:column; gap:18px; }
  .bs-field { display:flex; flex-direction:column; gap:6px; }
  .bs-field-label { font-size:11.5px; font-weight:600; letter-spacing:.04em; color:rgba(255,255,255,.72); }
  .bs-field input, .bs-field select, .bs-field textarea { width:100%; border:1px solid #262d3b; border-radius:var(--radius-sm); background:#161b25; color:#f5f7fb; padding:10px 14px; font:500 13.5px 'DM Sans',sans-serif; outline:none; }
  .bs-field textarea { resize:vertical; min-height:120px; line-height:1.6; }
  .bs-field-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .bs-divider { display:flex; align-items:center; gap:10px; font-size:10px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,.42); }
  .bs-divider::before, .bs-divider::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.08); }
  .bs-submit { padding:11px 24px; background:#3c3489; color:#fff; border:none; border-radius:var(--radius-sm); font:600 13.5px 'DM Sans',sans-serif; cursor:pointer; }
  .bs-submit:disabled { opacity:.55; cursor:not-allowed; }
  .bs-side-stack { display:flex; flex-direction:column; gap:14px; }
  .bs-side-card { background:#fff; border:1px solid var(--border); border-radius:var(--radius); padding:20px 22px; }
  .bs-side-label { font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); margin-bottom:12px; }
  .bs-checklist { display:flex; flex-direction:column; gap:10px; }
  .bs-check { padding:12px 14px; border-radius:12px; background:#f8fafc; border:1px solid #edf2f7; font-size:12.5px; color:#475569; line-height:1.55; }
  .bs-list { display:flex; flex-direction:column; gap:10px; }
  .bs-list-item { padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #edf2f7; }
  .bs-list-top { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:6px; }
  .bs-list-title { font-size:13.5px; font-weight:600; color:#0f172a; }
  .bs-list-meta { font-size:12px; color:#64748b; line-height:1.55; }
  .bs-badge { padding:4px 10px; border-radius:999px; background:#e0f2fe; color:#0369a1; font-size:11px; font-weight:600; }
  .bs-badge.warn { background:#fef3c7; color:#92400e; }
  .bs-badge.critical { background:#fee2e2; color:#b91c1c; }
  .bs-kpi-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .bs-kpi { padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #edf2f7; }
  .bs-kpi-value { font-size:22px; font-weight:600; color:#0f172a; }
  .bs-kpi-label { font-size:12px; color:#64748b; margin-top:4px; }
  @media (max-width:1080px) { .bs-grid { grid-template-columns:1fr; } }
  @media (max-width:720px) { .bs-field-row, .bs-kpi-grid { grid-template-columns:1fr; } .bs-content { padding:20px; } .bs-topbar { padding:0 20px; } }
`;

function BancoSangue({ usuario, onLogout }) {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [pacientes, setPacientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    PacienteId: '',
    tipoSolicitacao: 'tipagem',
    componente: 'Concentrado Eritrocitário',
    grupoSanguineo: '',
    unidades: 1,
    urgencia: 'moderada',
    justificacaoClinica: '',
  });

  const loadData = async () => {
    try {
      const [{ data: pacientesData }, { data: pedidosData }] = await Promise.all([
        api.get('/pacientes'),
        api.get('/banco-sangue/pedidos'),
      ]);
      setPacientes(pacientesData);
      setPedidos(pedidosData);
    } catch {
      toast.error('Não foi possível carregar os dados do banco de sangue.', 'Carga falhou');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => { onLogout(); navigate('/', { replace: true }); };
  const handleChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const pacienteAtual = useMemo(
    () => pacientes.find((item) => String(item.id) === String(form.PacienteId)),
    [pacientes, form.PacienteId]
  );

  const stats = useMemo(() => ({
    total: pedidos.length,
    criticos: pedidos.filter((item) => item.urgencia === 'critica').length,
    prontos: pedidos.filter((item) => item.estado === 'pronto').length,
    pendentes: pedidos.filter((item) => item.estado === 'pendente').length,
  }), [pedidos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/banco-sangue/pedidos', {
        ...form,
        PacienteId: Number(form.PacienteId),
        unidades: Number(form.unidades),
      });
      toast.success('Pedido do banco de sangue registado.', 'Banco de Sangue');
      setForm({
        PacienteId: '',
        tipoSolicitacao: 'tipagem',
        componente: 'Concentrado Eritrocitário',
        grupoSanguineo: '',
        unidades: 1,
        urgencia: 'moderada',
        justificacaoClinica: '',
      });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.erro || 'Não foi possível guardar o pedido.', 'Falha ao guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = usuario?.nome || usuario?.username || 'Utilizador';
  const initials = displayName.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();
  const firstName = displayName.split(' ')[0];

  return (
    <div className="bs-root">
      <style>{css}</style>

      <nav className="bs-nav">
        <div className="bs-nav-brand">
          <div className="bs-nav-logo"><Icon.Heart /></div>
          <div>
            <div className="bs-nav-brand-name">Banco de Socorro</div>
            <div className="bs-nav-brand-sub">Sistema clínico</div>
          </div>
        </div>
        <div className="bs-nav-section">
          <div className="bs-nav-section-label">Módulos</div>
          {NAV_ITEMS.map((item) => (
            <button key={item.path} className={`bs-nav-item${location.pathname === item.path ? ' active' : ''}`} onClick={() => navigate(item.path)}>
              <item.icon /> {item.label}
            </button>
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
          <button className="bs-nav-logout" onClick={handleLogout}><Icon.LogOut /> Terminar sessão</button>
        </div>
      </nav>

      <div className="bs-main">
        <header className="bs-topbar">
          <div>
            <div className="bs-topbar-breadcrumb"><span>Banco de Socorro</span><span>/</span><span>Banco de Sangue</span></div>
            <div className="bs-topbar-title">Gestão de hemocomponentes</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="bs-back-btn" onClick={() => navigate('/dashboard')}><Icon.ChevronLeft /> Dashboard</button>
            <div className="bs-chip"><span className="bs-chip-dot" /> Em operação</div>
          </div>
        </header>

        <div className="bs-content">
          <div className="bs-grid">
            <div className="bs-card">
              <div className="bs-card-body">
                <form className="bs-form" onSubmit={handleSubmit}>
                  <div className="bs-divider">Nova solicitação</div>

                  <div className="bs-field">
                    <label className="bs-field-label">Paciente</label>
                    <select value={form.PacienteId} onChange={handleChange('PacienteId')} required disabled={isLoading}>
                      <option value="">{isLoading ? 'A carregar pacientes…' : 'Selecionar paciente'}</option>
                      {pacientes.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
                    </select>
                  </div>

                  <div className="bs-field-row">
                    <div className="bs-field">
                      <label className="bs-field-label">Tipo de solicitação</label>
                      <select value={form.tipoSolicitacao} onChange={handleChange('tipoSolicitacao')} required>
                        <option value="tipagem">Tipagem sanguínea</option>
                        <option value="prova_compatibilidade">Prova de compatibilidade</option>
                        <option value="reserva">Reserva de componente</option>
                        <option value="transfusao">Transfusão</option>
                      </select>
                    </div>
                    <div className="bs-field">
                      <label className="bs-field-label">Componente</label>
                      <select value={form.componente} onChange={handleChange('componente')} required>
                        {COMPONENTES.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="bs-field-row">
                    <div className="bs-field">
                      <label className="bs-field-label">Grupo sanguíneo</label>
                      <input value={form.grupoSanguineo} onChange={handleChange('grupoSanguineo')} placeholder="Ex.: O+" />
                    </div>
                    <div className="bs-field">
                      <label className="bs-field-label">Unidades</label>
                      <input type="number" min="1" max="8" value={form.unidades} onChange={handleChange('unidades')} required />
                    </div>
                  </div>

                  <div className="bs-field">
                    <label className="bs-field-label">Urgência</label>
                    <select value={form.urgencia} onChange={handleChange('urgencia')} required>
                      <option value="baixa">Baixa</option>
                      <option value="moderada">Moderada</option>
                      <option value="alta">Alta</option>
                      <option value="critica">Crítica</option>
                    </select>
                  </div>

                  <div className="bs-field">
                    <label className="bs-field-label">Justificação clínica</label>
                    <textarea value={form.justificacaoClinica} onChange={handleChange('justificacaoClinica')} placeholder="Descreva o motivo da solicitação, risco clínico e contexto transfusional." required />
                  </div>

                  <button className="bs-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'A guardar…' : 'Guardar solicitação'}
                  </button>
                </form>
              </div>
            </div>

            <div className="bs-side-stack">
              <div className="bs-side-card">
                <div className="bs-side-label">Monitorização</div>
                <div className="bs-kpi-grid">
                  <div className="bs-kpi"><div className="bs-kpi-value">{stats.total}</div><div className="bs-kpi-label">Solicitações</div></div>
                  <div className="bs-kpi"><div className="bs-kpi-value">{stats.criticos}</div><div className="bs-kpi-label">Críticas</div></div>
                  <div className="bs-kpi"><div className="bs-kpi-value">{stats.prontos}</div><div className="bs-kpi-label">Prontas</div></div>
                  <div className="bs-kpi"><div className="bs-kpi-value">{stats.pendentes}</div><div className="bs-kpi-label">Pendentes</div></div>
                </div>
              </div>

              <div className="bs-side-card">
                <div className="bs-side-label">Checklist de segurança</div>
                <div className="bs-checklist">
                  <div className="bs-check">Confirmar identificação do paciente antes de libertar qualquer hemocomponente.</div>
                  <div className="bs-check">Verificar grupo/Rh e compatibilidade sempre que a solicitação envolver transfusão.</div>
                  <div className="bs-check">Priorizar imediatamente pedidos críticos e manter contacto com a equipa assistencial.</div>
                </div>
              </div>

              <div className="bs-side-card">
                <div className="bs-side-label">Pedidos recentes</div>
                <div className="bs-list">
                  {pedidos.length ? pedidos.slice(0, 5).map((pedido) => (
                    <div key={pedido.id} className="bs-list-item">
                      <div className="bs-list-top">
                        <div className="bs-list-title">{pedido.Paciente?.nome || 'Paciente'} · {pedido.componente}</div>
                        <span className={`bs-badge${pedido.urgencia === 'critica' ? ' critical' : pedido.urgencia === 'alta' ? ' warn' : ''}`}>{pedido.urgencia}</span>
                      </div>
                      <div className="bs-list-meta">{pedido.tipoSolicitacao.replace('_', ' ')} · {pedido.unidades} unidade(s) · Estado: {pedido.estado}</div>
                    </div>
                  )) : (
                    <div className="bs-list-meta">Ainda não existem solicitações para o banco de sangue.</div>
                  )}
                </div>
              </div>

              <div className="bs-side-card">
                <div className="bs-side-label">Paciente selecionado</div>
                {pacienteAtual ? (
                  <div className="bs-list-item">
                    <div className="bs-list-title">{pacienteAtual.nome}</div>
                    <div className="bs-list-meta">
                      {pacienteAtual.idade ? `${pacienteAtual.idade} anos` : 'Idade não registada'} · {pacienteAtual.sexo || 'Sexo não registado'}
                    </div>
                  </div>
                ) : (
                  <div className="bs-list-meta">Selecione um paciente para iniciar a solicitação transfusional.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BancoSangue;
