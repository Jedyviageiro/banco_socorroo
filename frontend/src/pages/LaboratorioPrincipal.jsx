import { useCallback, useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../components/useToast';
import api from '../services/api';

const Icon = {
  Grid: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Activity: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Clipboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
  Flask: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v7.31" />
      <path d="M14 9.3V2" />
      <path d="M8.5 2h7" />
      <path d="M14 9.3 19.74 19a2 2 0 0 1-1.72 3H5.98a2 2 0 0 1-1.72-3L10 9.3" />
      <path d="M6 16h12" />
    </svg>
  ),
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
  Heart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  ),
  CheckCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
};

const LAB_NAV_ITEMS = [
  { label: 'Painel', icon: Icon.Grid, targetId: 'lab-top', to: '/laboratorio-principal#lab-top' },
  { label: 'Requisições', icon: Icon.Clipboard, targetId: 'lab-requisicoes' },
  { label: 'Coletas', icon: Icon.Flask, targetId: 'lab-coletas', to: '/laboratorio-principal#lab-coletas' },
  { label: 'Em Análise', icon: Icon.Activity, targetId: 'lab-analise' },
  { label: 'Resultados', icon: Icon.CheckCircle, targetId: 'lab-resultados', to: '/laboratorio-principal#lab-resultados' },
  { label: 'Validação', icon: Icon.User, targetId: 'lab-validacao' },
];

const LAB_SECTION_LINKS = LAB_NAV_ITEMS.map((item) => ({
  ...item,
  to: item.to || `/laboratorio-principal#${item.targetId}`,
}));

const EXAMES = [
  'Hemograma',
  'Bioquímica',
  'Urina Tipo II',
  'Parasitológico',
  'Malária',
  'HIV',
  'Função renal',
];

const AMOSTRAS = ['Sangue', 'Urina', 'Fezes', 'Swab', 'Outro'];

const ESTADOS_AMOSTRA = [
  { value: 'aguardando_coleta', label: 'Aguardando coleta' },
  { value: 'coletada', label: 'Coletada' },
  { value: 'em_analise', label: 'Em análise' },
  { value: 'concluido', label: 'Concluído' },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lab-root {
    --nav-w: 250px;
    --bg: #f4f7fb;
    --surface: #ffffff;
    --surface-2: #f8fafc;
    --nav-bg: #0b1020;
    --nav-text: rgba(255,255,255,.62);
    --nav-hover: rgba(255,255,255,.08);
    --nav-active: #ffffff;
    --nav-active-bg: rgba(59,130,246,.15);
    --nav-active-bar: #60a5fa;
    --border: #e5eaf2;
    --text-1: #0f172a;
    --text-2: #475569;
    --text-3: #94a3b8;
    --accent: #2563eb;
    --accent-soft: #eff6ff;
    --success: #16a34a;
    --success-soft: #dcfce7;
    --warn: #d97706;
    --warn-soft: #fef3c7;
    --danger: #dc2626;
    --danger-soft: #fee2e2;
    --radius: 16px;
    --radius-sm: 10px;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    min-height: 100vh;
    background:
      radial-gradient(circle at top right, rgba(37,99,235,.08), transparent 20%),
      linear-gradient(180deg, #f8fbff 0%, #f4f7fb 100%);
    color: var(--text-1);
  }

  .lab-nav {
    width: var(--nav-w);
    background: linear-gradient(180deg, #0b1020 0%, #10182d 100%);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    padding: 0 0 22px;
    border-right: 1px solid rgba(255,255,255,.05);
  }

  .lab-nav-brand {
    padding: 24px 20px 18px;
    border-bottom: 1px solid rgba(255,255,255,.07);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .lab-nav-logo {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 8px 20px rgba(37,99,235,.28);
  }

  .lab-nav-brand-name {
    font-size: 15px;
    font-weight: 700;
    color: #fff;
  }

  .lab-nav-brand-sub {
    font-size: 11px;
    color: var(--nav-text);
    letter-spacing: .04em;
  }

  .lab-nav-section {
    padding: 0 12px;
    flex: 1;
  }

  .lab-nav-section-label {
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: rgba(255,255,255,.28);
    padding: 12px 8px 8px;
  }

  .lab-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 12px;
    border-radius: 12px;
    border: none;
    background: transparent;
    color: var(--nav-text);
    font: 500 13.5px 'DM Sans', sans-serif;
    cursor: pointer;
    width: 100%;
    text-align: left;
    position: relative;
    margin-bottom: 4px;
    transition: background .18s, color .18s, transform .18s;
  }

  .lab-nav-item:hover {
    background: var(--nav-hover);
    color: rgba(255,255,255,.92);
    transform: translateX(2px);
  }

  .lab-nav-item.active {
    background: var(--nav-active-bg);
    color: var(--nav-active);
  }

  .lab-nav-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 7px;
    bottom: 7px;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: var(--nav-active-bar);
  }

  .lab-nav-footer {
    padding: 0 12px;
    border-top: 1px solid rgba(255,255,255,.07);
    padding-top: 16px;
  }

  .lab-nav-user {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    margin-bottom: 6px;
  }

  .lab-nav-avatar {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    background: rgba(96,165,250,.18);
    color: #bfdbfe;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lab-nav-user-name {
    font-size: 12.5px;
    font-weight: 600;
    color: rgba(255,255,255,.88);
  }

  .lab-nav-user-role {
    font-size: 10.5px;
    color: var(--nav-text);
  }

  .lab-nav-logout {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 10px;
    border: none;
    background: transparent;
    color: rgba(255,255,255,.35);
    font: 500 12.5px 'DM Sans', sans-serif;
    cursor: pointer;
    width: 100%;
    text-align: left;
    border-radius: 10px;
  }

  .lab-nav-logout:hover {
    color: #fca5a5;
    background: rgba(248,113,113,.08);
  }

  .lab-main {
    margin-left: var(--nav-w);
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .lab-topbar {
    min-height: 74px;
    background: rgba(255,255,255,.88);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .lab-topbar-breadcrumb {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text-3);
    margin-bottom: 4px;
  }

  .lab-topbar-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-1);
  }

  .lab-topbar-subtitle {
    font-size: 12px;
    color: var(--text-2);
    margin-top: 3px;
  }

  .lab-topbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .lab-back-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 9px 14px;
    border-radius: 11px;
    border: 1px solid var(--border);
    background: #fff;
    font: 600 12.5px 'DM Sans', sans-serif;
    color: var(--text-2);
    cursor: pointer;
  }

  .lab-back-btn:hover {
    border-color: #cfd8e3;
    background: #f8fafc;
  }

  .lab-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 12px;
    border-radius: 999px;
    font-size: 11.5px;
    font-weight: 600;
  }

  .lab-chip.blue {
    background: var(--accent-soft);
    color: var(--accent);
  }

  .lab-chip.red {
    background: var(--danger-soft);
    color: var(--danger);
  }

  .lab-chip-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
  }

  .lab-content {
    padding: 28px;
    flex: 1;
  }

  .lab-shell {
    max-width: 1380px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .lab-summary-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  .lab-summary-card {
    background: rgba(255,255,255,.88);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 18px;
    box-shadow: 0 10px 28px rgba(15,23,42,.05);
  }

  .lab-summary-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .lab-summary-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--text-3);
  }

  .lab-summary-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-1);
    line-height: 1;
  }

  .lab-summary-note {
    margin-top: 8px;
    font-size: 12px;
    color: var(--text-2);
  }

  .lab-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(330px, .95fr);
    gap: 18px;
    align-items: start;
  }

  .lab-card {
    background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
    border: 1px solid #1f2937;
    border-radius: 20px;
    box-shadow: 0 18px 40px rgba(15,23,42,.18);
    overflow: hidden;
  }

  .lab-card-header {
    padding: 22px 24px 14px;
    border-bottom: 1px solid rgba(255,255,255,.06);
  }

  .lab-card-kicker {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: rgba(191,219,254,.78);
    margin-bottom: 8px;
  }

  .lab-card-title {
    font-size: 18px;
    font-weight: 700;
    color: #f8fafc;
  }

  .lab-card-subtitle {
    font-size: 12.5px;
    color: rgba(255,255,255,.62);
    margin-top: 5px;
    line-height: 1.5;
  }

  .lab-card-body {
    padding: 24px;
  }

  .lab-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .lab-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }

  .lab-field-label {
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: .04em;
    color: rgba(255,255,255,.76);
  }

  .lab-field input,
  .lab-field select,
  .lab-field textarea {
    width: 100%;
    border: 1px solid #2a3444;
    border-radius: 12px;
    background: #111827;
    color: #f8fafc;
    padding: 11px 14px;
    font: 500 13.5px 'DM Sans', sans-serif;
    outline: none;
    transition: border-color .18s, box-shadow .18s, background .18s;
  }

  .lab-field input:focus,
  .lab-field select:focus,
  .lab-field textarea:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,.18);
    background: #131d2d;
  }

  .lab-field textarea {
    resize: vertical;
    min-height: 118px;
    line-height: 1.6;
  }

  .lab-field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .lab-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: rgba(255,255,255,.42);
  }

  .lab-divider::before,
  .lab-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,.08);
  }

  .lab-submit-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .lab-submit {
    padding: 12px 22px;
    background: linear-gradient(135deg, #2563eb, #4338ca);
    color: #fff;
    border: none;
    border-radius: 12px;
    font: 700 13.5px 'DM Sans', sans-serif;
    cursor: pointer;
    box-shadow: 0 10px 24px rgba(37,99,235,.28);
  }

  .lab-submit:disabled {
    opacity: .55;
    cursor: not-allowed;
    box-shadow: none;
  }

  .lab-helper-note {
    font-size: 12px;
    color: rgba(255,255,255,.58);
  }

  .lab-side-stack {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .lab-side-card {
    background: rgba(255,255,255,.92);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 18px 20px;
    box-shadow: 0 10px 28px rgba(15,23,42,.05);
  }

  .lab-side-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .11em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 12px;
  }

  .lab-kpi-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .lab-kpi {
    padding: 15px;
    border-radius: 14px;
    background: var(--surface-2);
    border: 1px solid #e8eef5;
  }

  .lab-kpi-value {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-1);
  }

  .lab-kpi-label {
    font-size: 12px;
    color: var(--text-2);
    margin-top: 4px;
  }

  .lab-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .lab-list-item {
    padding: 14px;
    border-radius: 14px;
    background: var(--surface-2);
    border: 1px solid #e8eef5;
  }

  .lab-list-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 6px;
  }

  .lab-list-title {
    font-size: 13.5px;
    font-weight: 700;
    color: var(--text-1);
  }

  .lab-list-meta {
    font-size: 12px;
    color: var(--text-2);
    line-height: 1.6;
  }

  .lab-list-divider {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px dashed #dbe4ee;
  }

  .lab-badge {
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
  }

  .lab-badge.neutral {
    background: #e0e7ff;
    color: #4338ca;
  }

  .lab-badge.warn {
    background: var(--warn-soft);
    color: var(--warn);
  }

  .lab-badge.critical {
    background: var(--danger-soft);
    color: var(--danger);
  }

  .lab-badge.success {
    background: var(--success-soft);
    color: var(--success);
  }

  .lab-actions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .lab-action-btn {
    padding: 12px 14px;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
    background: #fff;
    color: var(--text-1);
    font: 600 12.5px 'DM Sans', sans-serif;
    cursor: pointer;
    text-align: left;
  }

  .lab-action-btn:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  @media (max-width: 1180px) {
    .lab-summary-grid {
      grid-template-columns: 1fr 1fr;
    }

    .lab-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 760px) {
    .lab-field-row,
    .lab-kpi-grid,
    .lab-actions-grid,
    .lab-summary-grid {
      grid-template-columns: 1fr;
    }

    .lab-topbar {
      padding: 16px 20px;
      align-items: flex-start;
      gap: 14px;
      flex-direction: column;
      height: auto;
    }

    .lab-content {
      padding: 18px;
    }
  }
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
    estadoAmostra: 'aguardando_coleta',
    dataColheita: '',
    tecnicoResponsavel: '',
    indicacaoClinica: '',
    resultadoResumo: '',
  });

  const loadData = useCallback(async () => {
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
  }, [toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadData]);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const targetId = location.hash.replace('#', '');
    const timer = setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [location.hash]);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleLogout = () => {
    onLogout();
    navigate('/', { replace: true });
  };

  const handleSectionJump = (targetId) => {
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const pacienteAtual = useMemo(
    () => pacientes.find((item) => String(item.id) === String(form.PacienteId)),
    [pacientes, form.PacienteId]
  );

  const statusCounts = useMemo(() => ({
    total: pedidos.length,
    urgentes: pedidos.filter((item) => item.prioridade === 'urgente' || item.prioridade === 'muito_urgente').length,
    emAnalise: pedidos.filter((item) => item.estado === 'em_analise').length,
    aguardandoColeta: pedidos.filter((item) => item.estado === 'aguardando_coleta' || item.estadoAmostra === 'aguardando_coleta').length,
    concluidos: pedidos.filter((item) => item.estado === 'concluido').length,
  }), [pedidos]);

  const filaPrioritaria = useMemo(() => {
    return pedidos
      .filter((pedido) => pedido.prioridade === 'urgente' || pedido.prioridade === 'muito_urgente')
      .slice(0, 5);
  }, [pedidos]);

  const ultimosPedidos = useMemo(() => pedidos.slice(0, 5), [pedidos]);

  const getBadgeClass = (value, type = 'prioridade') => {
    if (type === 'estado') {
      if (value === 'concluido') return 'success';
      if (value === 'em_analise') return 'warn';
      return 'neutral';
    }

    if (value === 'muito_urgente') return 'critical';
    if (value === 'urgente') return 'warn';
    return 'neutral';
  };

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
        estadoAmostra: 'aguardando_coleta',
        dataColheita: '',
        tecnicoResponsavel: '',
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
          <div className="lab-nav-logo"><Icon.Flask /></div>
          <div>
            <div className="lab-nav-brand-name">Banco de Socorro</div>
            <div className="lab-nav-brand-sub">Estação Laboratorial</div>
          </div>
        </div>

        <div className="lab-nav-section">
          <div className="lab-nav-section-label">Estacao Laboratorial</div>
          {LAB_SECTION_LINKS.map((item) => (
            <NavLink
              key={item.targetId}
              to={item.to}
              className={`lab-nav-item${(location.hash || '#lab-top') === `#${item.targetId}` ? ' active' : ''}`}
            >
              <item.icon /> {item.label}
            </NavLink>
          ))}
        </div>

        <div className="lab-nav-footer">
          <div className="lab-nav-user">
            <div className="lab-nav-avatar">{initials}</div>
            <div>
              <div className="lab-nav-user-name">{firstName}</div>
              <div className="lab-nav-user-role">Técnico de Laboratório</div>
            </div>
          </div>
          <button className="lab-nav-logout" onClick={handleLogout}>
            <Icon.LogOut /> Terminar sessão
          </button>
        </div>
      </nav>

      <div className="lab-main">
        <header className="lab-topbar">
          <div>
            <div className="lab-topbar-breadcrumb">
              <span>Banco de Socorro</span>
              <span>/</span>
              <span>Laboratório</span>
              <span>/</span>
              <span>Painel Operacional</span>
            </div>
            <div className="lab-topbar-title">Painel de Operações Laboratoriais</div>
            <div className="lab-topbar-subtitle">
              Gestão de requisições, amostras, processamento e emissão de resultados.
            </div>
          </div>

          <div className="lab-topbar-right">
            <div className="lab-chip blue">
              <span className="lab-chip-dot" /> Em operação
            </div>
            <div className="lab-chip red">
              <span className="lab-chip-dot" /> {statusCounts.urgentes} urgentes
            </div>
            <button className="lab-back-btn" onClick={() => navigate('/dashboard')}>
              <Icon.ChevronLeft /> Dashboard
            </button>
          </div>
        </header>

        <div className="lab-content" id="lab-top">
          <div className="lab-shell">
            <section className="lab-summary-grid">
              <div className="lab-summary-card">
                <div className="lab-summary-head">
                  <div className="lab-summary-label">Pedidos do dia</div>
                  <Icon.Clipboard />
                </div>
                <div className="lab-summary-value">{statusCounts.total}</div>
                <div className="lab-summary-note">Total de requisições laboratoriais registadas.</div>
              </div>

              <div className="lab-summary-card">
                <div className="lab-summary-head">
                  <div className="lab-summary-label">Urgentes</div>
                  <Icon.Clock />
                </div>
                <div className="lab-summary-value">{statusCounts.urgentes}</div>
                <div className="lab-summary-note">Exames com prioridade elevada para resposta rápida.</div>
              </div>

              <div className="lab-summary-card">
                <div className="lab-summary-head">
                  <div className="lab-summary-label">Em análise</div>
                  <Icon.Activity />
                </div>
                <div className="lab-summary-value">{statusCounts.emAnalise}</div>
                <div className="lab-summary-note">Amostras que já entraram no processamento laboratorial.</div>
              </div>

              <div className="lab-summary-card">
                <div className="lab-summary-head">
                  <div className="lab-summary-label">Aguardando coleta</div>
                  <Icon.Flask />
                </div>
                <div className="lab-summary-value">{statusCounts.aguardandoColeta}</div>
                <div className="lab-summary-note">Pedidos ainda pendentes de colheita ou receção da amostra.</div>
              </div>
            </section>

            <div className="lab-grid">
              <div className="lab-card" id="lab-requisicoes">
                <div className="lab-card-header">
                  <div className="lab-card-kicker">Registo operacional</div>
                  <div className="lab-card-title">Nova requisição laboratorial</div>
                  <div className="lab-card-subtitle">
                    Preencha os dados essenciais do exame, da amostra e do responsável técnico para entrada no fluxo do laboratório.
                  </div>
                </div>

                <div className="lab-card-body">
                  <form className="lab-form" onSubmit={handleSubmit}>
                    <div className="lab-divider">Dados principais</div>

                    <div className="lab-field">
                      <label className="lab-field-label">Paciente</label>
                      <select value={form.PacienteId} onChange={handleChange('PacienteId')} required disabled={isLoading}>
                        <option value="">{isLoading ? 'A carregar pacientes…' : 'Selecionar paciente'}</option>
                        {pacientes.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.nome}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="lab-field-row">
                      <div className="lab-field">
                        <label className="lab-field-label">Tipo de exame</label>
                        <select value={form.tipoExame} onChange={handleChange('tipoExame')} required>
                          {EXAMES.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="lab-field">
                        <label className="lab-field-label">Tipo de amostra</label>
                        <select value={form.amostra} onChange={handleChange('amostra')} required>
                          {AMOSTRAS.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
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
                        <label className="lab-field-label">Estado da amostra</label>
                        <select value={form.estadoAmostra} onChange={handleChange('estadoAmostra')} required>
                          {ESTADOS_AMOSTRA.map((estado) => (
                            <option key={estado.value} value={estado.value}>
                              {estado.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="lab-field-row">
                      <div className="lab-field">
                        <label className="lab-field-label">Data/Hora da colheita</label>
                        <input
                          type="datetime-local"
                          value={form.dataColheita}
                          onChange={handleChange('dataColheita')}
                        />
                      </div>

                      <div className="lab-field">
                        <label className="lab-field-label">Técnico responsável</label>
                        <input
                          value={form.tecnicoResponsavel}
                          onChange={handleChange('tecnicoResponsavel')}
                          placeholder="Nome do técnico"
                        />
                      </div>
                    </div>

                    <div className="lab-divider">Informação clínica</div>

                    <div className="lab-field">
                      <label className="lab-field-label">Indicação clínica</label>
                      <textarea
                        value={form.indicacaoClinica}
                        onChange={handleChange('indicacaoClinica')}
                        placeholder="Descreva o motivo do exame, suspeita diagnóstica, contexto clínico e observações relevantes."
                        required
                      />
                    </div>

                    <div className="lab-field">
                      <label className="lab-field-label">Resultado preliminar</label>
                      <input
                        value={form.resultadoResumo}
                        onChange={handleChange('resultadoResumo')}
                        placeholder="Opcional para testes ou triagem interna"
                      />
                    </div>

                    <div className="lab-submit-row">
                      <button className="lab-submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'A guardar…' : 'Guardar requisição'}
                      </button>
                      <div className="lab-helper-note">
                        O pedido será enviado para a fila operacional do laboratório.
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="lab-side-stack">
                <div className="lab-side-card" id="lab-coletas">
                  <div className="lab-side-label">Resumo operacional</div>
                  <div className="lab-kpi-grid">
                    <div className="lab-kpi">
                      <div className="lab-kpi-value">{statusCounts.total}</div>
                      <div className="lab-kpi-label">Pedidos recentes</div>
                    </div>
                    <div className="lab-kpi">
                      <div className="lab-kpi-value">{statusCounts.urgentes}</div>
                      <div className="lab-kpi-label">Urgentes</div>
                    </div>
                    <div className="lab-kpi">
                      <div className="lab-kpi-value">{statusCounts.emAnalise}</div>
                      <div className="lab-kpi-label">Em análise</div>
                    </div>
                    <div className="lab-kpi">
                      <div className="lab-kpi-value">{statusCounts.concluidos}</div>
                      <div className="lab-kpi-label">Concluídos</div>
                    </div>
                  </div>
                </div>

                <div className="lab-side-card" id="lab-analise">
                  <div className="lab-side-label">Pedido em preparação</div>
                  {pacienteAtual ? (
                    <div className="lab-list-item">
                      <div className="lab-list-top">
                        <div className="lab-list-title">{pacienteAtual.nome}</div>
                        <span className={`lab-badge ${getBadgeClass(form.prioridade)}`}>
                          {form.prioridade.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="lab-list-meta">
                        {pacienteAtual.idade ? `${pacienteAtual.idade} anos` : 'Idade não registada'} ·{' '}
                        {pacienteAtual.sexo || 'Sexo não registado'}
                      </div>

                      <div className="lab-list-divider">
                        <div className="lab-list-meta">Exame: {form.tipoExame}</div>
                        <div className="lab-list-meta">Amostra: {form.amostra}</div>
                        <div className="lab-list-meta">
                          Estado: {ESTADOS_AMOSTRA.find((e) => e.value === form.estadoAmostra)?.label}
                        </div>
                        {form.tecnicoResponsavel && (
                          <div className="lab-list-meta">Técnico: {form.tecnicoResponsavel}</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="lab-list-meta">
                      Selecione um paciente para visualizar o pedido em preparação, a amostra e a prioridade.
                    </div>
                  )}
                </div>

                <div className="lab-side-card" id="lab-resultados">
                  <div className="lab-side-label">Fila prioritária</div>
                  <div className="lab-list">
                    {filaPrioritaria.length ? (
                      filaPrioritaria.map((pedido) => (
                        <div key={pedido.id} className="lab-list-item">
                          <div className="lab-list-top">
                            <div className="lab-list-title">
                              {pedido.Paciente?.nome || 'Paciente'} · {pedido.tipoExame}
                            </div>
                            <span className={`lab-badge ${getBadgeClass(pedido.prioridade)}`}>
                              {pedido.prioridade.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="lab-list-meta">
                            Amostra: {pedido.amostra} · Estado: {(pedido.estado || 'pendente').replace('_', ' ')}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="lab-list-meta">Nenhum exame urgente na fila neste momento.</div>
                    )}
                  </div>
                </div>

                <div className="lab-side-card" id="lab-validacao">
                  <div className="lab-side-label">Últimas requisições</div>
                  <div className="lab-list">
                    {ultimosPedidos.length ? (
                      ultimosPedidos.map((pedido) => (
                        <div key={pedido.id} className="lab-list-item">
                          <div className="lab-list-top">
                            <div className="lab-list-title">
                              {pedido.Paciente?.nome || 'Paciente'} · {pedido.tipoExame}
                            </div>
                            <span className={`lab-badge ${getBadgeClass(pedido.estado, 'estado')}`}>
                              {(pedido.estado || 'recebido').replace('_', ' ')}
                            </span>
                          </div>
                          <div className="lab-list-meta">
                            Prioridade: {pedido.prioridade.replace('_', ' ')} · Amostra: {pedido.amostra}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="lab-list-meta">
                        Ainda não existem requisições registadas para o laboratório.
                      </div>
                    )}
                  </div>
                </div>

                <div className="lab-side-card">
                  <div className="lab-side-label">Ações rápidas</div>
                  <div className="lab-actions-grid">
                    <button className="lab-action-btn" type="button" onClick={() => handleSectionJump('lab-coletas')}>
                      Registar coleta
                    </button>
                    <button className="lab-action-btn" type="button" onClick={() => handleSectionJump('lab-analise')}>
                      Marcar em análise
                    </button>
                    <button className="lab-action-btn" type="button" onClick={() => handleSectionJump('lab-resultados')}>
                      Inserir resultado
                    </button>
                    <button className="lab-action-btn" type="button" onClick={() => handleSectionJump('lab-validacao')}>
                      Validar exame
                    </button>
                  </div>
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
