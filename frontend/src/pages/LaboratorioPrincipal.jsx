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

const LAB_NAV_ITEMS = [
  { label: 'Dashboard', icon: Icon.Grid, path: '/lab/dashboard' },
  { label: 'Pedidos de Exames', icon: Icon.Clipboard, path: '/lab/pedidos' },
  { label: 'Amostras', icon: Icon.Flask, path: '/lab/amostras' },
  { label: 'Processamento', icon: Icon.Activity, path: '/lab/processamento' },
  { label: 'Resultados', icon: Icon.Clipboard, path: '/lab/resultados' },
  { label: 'Validação', icon: Icon.User, path: '/lab/validacao' },
];

const EXAMES = ['Hemograma', 'Bioquímica', 'Urina Tipo II', 'Parasitológico', 'Malária', 'HIV', 'Função renal'];
const AMOSTRAS = ['Sangue', 'Urina', 'Fezes', 'Swab', 'Outro'];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .lab-root { --nav-w:220px; --bg:#f7f8fa; --surface:#fff; --nav-bg:#0f1117; --nav-text:rgba(255,255,255,.55); --nav-hover:rgba(255,255,255,.08); --nav-active:#fff; --nav-active-bg:rgba(255,255,255,.1); --nav-active-bar:#3b82f6; --border:#e8eaed; --text-1:#0d1117; --text-2:#6e7787; --text-3:#a8b0bc; --accent:#2563eb; --accent-lt:#eff4ff; --radius:10px; --radius-sm:7px; font-family:'DM Sans',sans-serif; display:flex; min-height:100vh; background:var(--bg); color:var(--text-1); }
  .lab-nav { width:var(--nav-w); background:var(--nav-bg); display:flex; flex-direction:column; position:fixed; top:0; left:0; bottom:0; padding:0 0 24px; }
  .lab-nav-brand { padding:24px 20px 20px; border-bottom:1px solid rgba(255,255,255,.07); margin-bottom:8px; display:flex; align-items:center; gap:10px; }
  .lab-nav-logo { width:32px; height:32px; border-radius:8px; background:var(--accent); display:flex; align-items:center; justify-content:center; color:#fff; }
  .lab-nav-brand-name { font-size:14px; font-weight:600; color:#fff; }
  .lab-nav-brand-sub { font-size:10.5px; color:var(--nav-text); letter-spacing:.04em; }
  .lab-nav-section { padding:0 12px; flex:1; }
  .lab-nav-section-label { font-size:9.5px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:rgba(255,255,255,.25); padding:12px 8px 6px; }
  .lab-nav-item { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:var(--radius-sm); border:none; background:transparent; color:var(--nav-text); font:400 13.5px 'DM Sans',sans-serif; cursor:pointer; width:100%; text-align:left; position:relative; margin-bottom:2px; transition:background .15s,color .15s; }
  .lab-nav-item:hover { background:var(--nav-hover); color:rgba(255,255,255,.85); }
  .lab-nav-item.active { background:var(--nav-active-bg); color:var(--nav-active); font-weight:500; }
  .lab-nav-item.active::before { content:''; position:absolute; left:0; top:6px; bottom:6px; width:3px; border-radius:0 2px 2px 0; background:var(--nav-active-bar); }
  .lab-nav-footer { padding:0 12px; border-top:1px solid rgba(255,255,255,.07); padding-top:16px; }
  .lab-nav-user { display:flex; align-items:center; gap:10px; padding:8px 10px; margin-bottom:4px; }
  .lab-nav-avatar { width:28px; height:28px; border-radius:6px; background:rgba(59,130,246,.3); color:#93c5fd; font-size:11px; font-weight:600; display:flex; align-items:center; justify-content:center; }
  .lab-nav-user-name { font-size:12.5px; font-weight:500; color:rgba(255,255,255,.8); }
  .lab-nav-user-role { font-size:10px; color:var(--nav-text); }
  .lab-nav-logout { display:flex; align-items:center; gap:8px; padding:8px 10px; border:none; background:transparent; color:rgba(255,255,255,.3); font:400 12.5px 'DM Sans',sans-serif; cursor:pointer; width:100%; text-align:left; border-radius:var(--radius-sm); }
  .lab-nav-logout:hover { color:#f87171; background:rgba(248,113,113,.08); }
  .lab-main { margin-left:var(--nav-w); flex:1; display:flex; flex-direction:column; min-height:100vh; }
  .lab-topbar { height:60px; background:var(--surface); border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; padding:0 32px; position:sticky; top:0; z-index:50; }
  .lab-topbar-breadcrumb { display:flex; align-items:center; gap:5px; font-size:11px; color:var(--text-3); }
  .lab-topbar-title { font-size:14px; font-weight:600; }
  .lab-topbar-right { display:flex; align-items:center; gap:8px; }
  .lab-back-btn { display:flex; align-items:center; gap:5px; padding:6px 12px; border-radius:var(--radius-sm); border:1px solid var(--border); background:#fff; font:500 12.5px 'DM Sans',sans-serif; color:var(--text-2); cursor:pointer; }
  .lab-chip { display:flex; align-items:center; gap:6px; padding:5px 12px; border-radius:20px; background:var(--accent-lt); color:var(--accent); font-size:11.5px; font-weight:500; }
  .lab-chip-dot { width:6px; height:6px; border-radius:50%; background:var(--accent); }
  .lab-content { padding:32px; flex:1; display:flex; justify-content:center; }
  .lab-grid { display:grid; grid-template-columns:minmax(0,1.4fr) minmax(320px,.9fr); gap:20px; width:100%; max-width:1260px; align-items:start; }
  .lab-card { background:#0f1117; border:1px solid #1d2230; border-radius:var(--radius); box-shadow:0 16px 40px rgba(15,17,23,.18); overflow:hidden; }
  .lab-card-body { padding:28px; }
  .lab-form { display:flex; flex-direction:column; gap:18px; }
  .lab-field { display:flex; flex-direction:column; gap:6px; }
  .lab-field-label { font-size:11.5px; font-weight:600; letter-spacing:.04em; color:rgba(255,255,255,.72); }
  .lab-field input, .lab-field select, .lab-field textarea { width:100%; border:1px solid #262d3b; border-radius:var(--radius-sm); background:#161b25; color:#f5f7fb; padding:10px 14px; font:500 13.5px 'DM Sans',sans-serif; outline:none; }
  .lab-field textarea { resize:vertical; min-height:120px; line-height:1.6; }
  .lab-field-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  .lab-divider { display:flex; align-items:center; gap:10px; font-size:10px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; color:rgba(255,255,255,.42); }
  .lab-divider::before, .lab-divider::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.08); }
  .lab-submit { padding:11px 24px; background:#3c3489; color:#fff; border:none; border-radius:var(--radius-sm); font:600 13.5px 'DM Sans',sans-serif; cursor:pointer; }
  .lab-submit:disabled { opacity:.55; cursor:not-allowed; }
  .lab-side-stack { display:flex; flex-direction:column; gap:14px; }
  .lab-side-card { background:#fff; border:1px solid var(--border); border-radius:var(--radius); padding:20px 22px; }
  .lab-side-label { font-size:10px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--accent); margin-bottom:12px; }
  .lab-kpi-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .lab-kpi { padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #edf2f7; }
  .lab-kpi-value { font-size:22px; font-weight:600; color:#0f172a; }
  .lab-kpi-label { font-size:12px; color:#64748b; margin-top:4px; }
  .lab-list { display:flex; flex-direction:column; gap:10px; }
  .lab-list-item { padding:14px; border-radius:12px; background:#f8fafc; border:1px solid #edf2f7; }
  .lab-list-top { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:6px; }
  .lab-list-title { font-size:13.5px; font-weight:600; color:#0f172a; }
  .lab-list-meta { font-size:12px; color:#64748b; line-height:1.55; }
  .lab-badge { padding:4px 10px; border-radius:999px; background:#e0f2fe; color:#0369a1; font-size:11px; font-weight:600; }
  .lab-badge.warn { background:#fef3c7; color:#92400e; }
  .lab-badge.critical { background:#fee2e2; color:#b91c1c; }
  @media (max-width: 1080px) { .lab-grid { grid-template-columns:1fr; } }
  @media (max-width: 720px) { .lab-field-row, .lab-kpi-grid { grid-template-columns:1fr; } .lab-content { padding:20px; } .lab-topbar { padding:0 20px; } }
`;

function LaboratorioPrincipal({ usuario, onLogout }) {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [pacientes, setPacientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    PacienteId: '',
    tipoExame: 'Hemograma',
    prioridade: 'rotina',
    amostra: 'Sangue',
    indicacaoClinica: '',
    resultadoResumo: '',
  });

  const loadData = async () => {
    try {
      const [{ data: pacientesData }, { data: pedidosData }] = await Promise.all([
        api.get('/pacientes'),
        api.get('/laboratorio/pedidos'),
      ]);
      setPacientes(pacientesData);
      setPedidos(pedidosData);
    } catch {
      toast.error('Não foi possível carregar os dados do laboratório.', 'Carga falhou');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const handleLogout = () => { onLogout(); navigate('/', { replace: true }); };

  const pacienteAtual = useMemo(
    () => pacientes.find((item) => String(item.id) === String(form.PacienteId)),
    [pacientes, form.PacienteId]
  );

  const statusCounts = useMemo(() => ({
    recebidos: pedidos.filter((item) => item.estado === 'recebido').length,
    urgentes: pedidos.filter((item) => item.prioridade !== 'rotina').length,
    concluidos: pedidos.filter((item) => item.estado === 'concluido').length,
    total: pedidos.length,
  }), [pedidos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/laboratorio/pedidos', {
        ...form,
        PacienteId: Number(form.PacienteId),
      });
      toast.success('Pedido laboratorial registado com sucesso.', 'Laboratório');
      setForm({
        PacienteId: '',
        tipoExame: 'Hemograma',
        prioridade: 'rotina',
        amostra: 'Sangue',
        indicacaoClinica: '',
        resultadoResumo: '',
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
    <div className="lab-root">
      <style>{css}</style>

      <nav className="lab-nav">
        <div className="lab-nav-brand">
          <div className="lab-nav-logo"><Icon.Heart /></div>
          <div>
            <div className="lab-nav-brand-name">Banco de Socorro</div>
            <div className="lab-nav-brand-sub">Sistema clínico</div>
          </div>
        </div>
        <div className="lab-nav-section">
          <div className="lab-nav-section-label">Módulos</div>
          {NAV_ITEMS.map((item) => (
            <button key={item.path} className={`lab-nav-item${location.pathname === item.path ? ' active' : ''}`} onClick={() => navigate(item.path)}>
              <item.icon /> {item.label}
            </button>
          ))}
        </div>
        <div className="lab-nav-footer">
          <div className="lab-nav-user">
            <div className="lab-nav-avatar">{initials}</div>
            <div>
              <div className="lab-nav-user-name">{firstName}</div>
              <div className="lab-nav-user-role">Laboratório Principal</div>
            </div>
          </div>
          <button className="lab-nav-logout" onClick={handleLogout}><Icon.LogOut /> Terminar sessão</button>
        </div>
      </nav>

      <div className="lab-main">
        <header className="lab-topbar">
          <div>
            <div className="lab-topbar-breadcrumb"><span>Banco de Socorro</span><span>/</span><span>Laboratório Principal</span></div>
            <div className="lab-topbar-title">Pedidos laboratoriais</div>
          </div>
          <div className="lab-topbar-right">
            <button className="lab-back-btn" onClick={() => navigate('/dashboard')}><Icon.ChevronLeft /> Dashboard</button>
            <div className="lab-chip"><span className="lab-chip-dot" /> Em operação</div>
          </div>
        </header>

        <div className="lab-content">
          <div className="lab-grid">
            <div className="lab-card">
              <div className="lab-card-body">
                <form className="lab-form" onSubmit={handleSubmit}>
                  <div className="lab-divider">Novo pedido</div>

                  <div className="lab-field">
                    <label className="lab-field-label">Paciente</label>
                    <select value={form.PacienteId} onChange={handleChange('PacienteId')} required disabled={isLoading}>
                      <option value="">{isLoading ? 'A carregar pacientes…' : 'Selecionar paciente'}</option>
                      {pacientes.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}
                    </select>
                  </div>

                  <div className="lab-field-row">
                    <div className="lab-field">
                      <label className="lab-field-label">Tipo de exame</label>
                      <select value={form.tipoExame} onChange={handleChange('tipoExame')} required>
                        {EXAMES.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                    <div className="lab-field">
                      <label className="lab-field-label">Tipo de amostra</label>
                      <select value={form.amostra} onChange={handleChange('amostra')} required>
                        {AMOSTRAS.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="lab-field-row">
                    <div className="lab-field">
                      <label className="lab-field-label">Prioridade</label>
                      <select value={form.prioridade} onChange={handleChange('prioridade')} required>
                        <option value="rotina">Rotina</option>
                        <option value="urgente">Urgente</option>
                        <option value="muito_urgente">Muito urgente</option>
                      </select>
                    </div>
                    <div className="lab-field">
                      <label className="lab-field-label">Resultado preliminar</label>
                      <input value={form.resultadoResumo} onChange={handleChange('resultadoResumo')} placeholder="Opcional para fase de testes" />
                    </div>
                  </div>

                  <div className="lab-field">
                    <label className="lab-field-label">Indicação clínica</label>
                    <textarea value={form.indicacaoClinica} onChange={handleChange('indicacaoClinica')} placeholder="Descreva o motivo do exame, suspeita diagnóstica e observações importantes." required />
                  </div>

                  <button className="lab-submit" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'A guardar…' : 'Guardar pedido laboratorial'}
                  </button>
                </form>
              </div>
            </div>

            <div className="lab-side-stack">
              <div className="lab-side-card">
                <div className="lab-side-label">Resumo operacional</div>
                <div className="lab-kpi-grid">
                  <div className="lab-kpi"><div className="lab-kpi-value">{statusCounts.total}</div><div className="lab-kpi-label">Pedidos recentes</div></div>
                  <div className="lab-kpi"><div className="lab-kpi-value">{statusCounts.recebidos}</div><div className="lab-kpi-label">A receber</div></div>
                  <div className="lab-kpi"><div className="lab-kpi-value">{statusCounts.urgentes}</div><div className="lab-kpi-label">Urgentes</div></div>
                  <div className="lab-kpi"><div className="lab-kpi-value">{statusCounts.concluidos}</div><div className="lab-kpi-label">Concluídos</div></div>
                </div>
              </div>

              <div className="lab-side-card">
                <div className="lab-side-label">Paciente selecionado</div>
                {pacienteAtual ? (
                  <div className="lab-list-item">
                    <div className="lab-list-title">{pacienteAtual.nome}</div>
                    <div className="lab-list-meta">
                      {pacienteAtual.idade ? `${pacienteAtual.idade} anos` : 'Idade não registada'} · {pacienteAtual.sexo || 'Sexo não registado'}
                    </div>
                  </div>
                ) : (
                  <div className="lab-list-meta">Selecione um paciente para preparar o exame e registar a indicação clínica.</div>
                )}
              </div>

              <div className="lab-side-card">
                <div className="lab-side-label">Últimos pedidos</div>
                <div className="lab-list">
                  {pedidos.length ? pedidos.slice(0, 5).map((pedido) => (
                    <div key={pedido.id} className="lab-list-item">
                      <div className="lab-list-top">
                        <div className="lab-list-title">{pedido.Paciente?.nome || 'Paciente'} · {pedido.tipoExame}</div>
                        <span className={`lab-badge${pedido.prioridade === 'muito_urgente' ? ' critical' : pedido.prioridade === 'urgente' ? ' warn' : ''}`}>{pedido.prioridade.replace('_', ' ')}</span>
                      </div>
                      <div className="lab-list-meta">Amostra: {pedido.amostra} · Estado: {pedido.estado.replace('_', ' ')}</div>
                    </div>
                  )) : (
                    <div className="lab-list-meta">Ainda não existem pedidos registados para o laboratório.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaboratorioPrincipal;
