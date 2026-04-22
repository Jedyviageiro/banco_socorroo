import { useState } from 'react';
import { useToast } from './useToast';
import api from '../services/api';

/* ─────────────────────────────────────────────
   Inline styles — no Tailwind / CSS module needed.
   Uses a single <style> tag injected once via
   the StyleInjector helper at the bottom.
───────────────────────────────────────────── */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;1,9..40,400&display=swap');

  .pf-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .pf-root {
    font-family: 'DM Sans', system-ui, sans-serif;
    max-width: 760px;
    margin: 0 auto;
    padding: 2.5rem 1.25rem;
  }

  /* ── Step indicator ── */
  .pf-steps {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
  }

  .pf-step {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #9e9b95;
    font-weight: 400;
    white-space: nowrap;
  }

  .pf-step.active {
    color: #1a1a1a;
    font-weight: 500;
  }

  .pf-step.done {
    color: #6b6966;
  }

  .pf-step-num {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 0.5px solid #d5d3ce;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 500;
    background: #fff;
    color: #6b6966;
    flex-shrink: 0;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }

  .pf-step.active .pf-step-num {
    background: #3C3489;
    border-color: #3C3489;
    color: #fff;
  }

  .pf-step.done .pf-step-num {
    background: #eaf3de;
    border-color: transparent;
    color: #3b6d11;
    font-size: 13px;
  }

  .pf-step-line {
    flex: 1;
    height: 0.5px;
    background: #e5e3de;
    margin: 0 8px;
  }

  /* ── Card ── */
  .pf-card {
    background: #fff;
    border: 0.5px solid #e5e3de;
    border-radius: 12px;
    padding: 2rem;
  }

  .pf-section-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: #b4b2a9;
    margin-bottom: 1rem;
  }

  /* ── Fields ── */
  .pf-field {
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 0.5px solid #e5e3de;
    padding: 11px 0;
    transition: border-color 0.15s;
  }

  .pf-field:last-of-type {
    border-bottom: none;
  }

  .pf-field:focus-within {
    border-color: #888780;
  }

  .pf-field-icon {
    color: #b4b2a9;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .pf-label {
    font-size: 13px;
    color: #6b6966;
    min-width: 110px;
    font-weight: 500;
    flex-shrink: 0;
  }

  .pf-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 15px;
    font-family: 'DM Sans', system-ui, sans-serif;
    color: #1a1a1a;
    outline: none;
    padding: 0;
    min-width: 0;
  }

  .pf-input::placeholder {
    color: #c5c3bb;
    font-weight: 400;
  }

  .pf-select {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 15px;
    font-family: 'DM Sans', system-ui, sans-serif;
    color: #1a1a1a;
    outline: none;
    padding: 10px 40px 10px 0;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%233c3489' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 14px;
    border-radius: 10px;
    font-weight: 500;
    transition: background-color 0.15s;
  }

  .pf-select.placeholder {
    color: #8f8c86;
    font-weight: 400;
  }

  .pf-select:hover {
    background-color: transparent;
  }

  .pf-select:focus {
    box-shadow: none;
    outline: none;
  }

  .pf-select option {
    color: #111110;
    background: #ffffff;
    border-radius: 10px;
  }

  .pf-check {
    font-size: 13px;
    color: #3b6d11;
    opacity: 0;
    transition: opacity 0.2s;
    flex-shrink: 0;
  }

  .pf-check.visible {
    opacity: 1;
  }

  /* ── Footer ── */
  .pf-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.5rem;
  }

  .pf-hint {
    font-size: 12px;
    color: #b4b2a9;
  }

  /* ── Submit button ── */
  .pf-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #3C3489;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 11px 24px;
    font-size: 15px;
    font-family: 'DM Sans', system-ui, sans-serif;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    line-height: 1;
  }

  .pf-btn:hover:not(:disabled) { opacity: 0.88; }
  .pf-btn:active:not(:disabled) { transform: scale(0.98); }
  .pf-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  .pf-btn-loading {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: pf-spin 0.7s linear infinite;
  }

  @keyframes pf-spin { to { transform: rotate(360deg); } }

  /* ── Success state ── */
  .pf-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.5rem 1rem;
    animation: pf-fade-in 0.3s ease;
  }

  @keyframes pf-fade-in {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pf-thumb {
    width: 56px;
    height: 56px;
    background: #EEEDFE;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    margin-bottom: 1rem;
  }

  .pf-success-title {
    font-size: 16px;
    font-weight: 500;
    color: #1a1a1a;
    margin-bottom: 6px;
  }

  .pf-success-sub {
    font-size: 13px;
    color: #6b6966;
    line-height: 1.6;
  }

  .pf-new-btn {
    margin-top: 1.5rem;
    background: transparent;
    border: 0.5px solid #d5d3ce;
    border-radius: 8px;
    padding: 8px 20px;
    font-size: 13px;
    font-family: 'DM Sans', system-ui, sans-serif;
    color: #6b6966;
    cursor: pointer;
    transition: background 0.15s;
  }

  .pf-new-btn:hover { background: #f5f4f0; }

  /* ── Error ── */
  .pf-error {
    font-size: 12px;
    color: #a32d2d;
    margin-top: 0.75rem;
    text-align: right;
    animation: pf-fade-in 0.2s ease;
  }

  /* ── Dark mode ── */
  @media (prefers-color-scheme: dark) {
    .pf-card { background: #1e1e1c; border-color: #3a3835; }
    .pf-input, .pf-select { color: #f0ede8; }
    .pf-select {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23cfc9ff' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    }
    .pf-select.placeholder { color: #9d9a93; }
    .pf-select option { color: #111110; background: #ffffff; }
    .pf-step.active .pf-step-num { background: #534AB7; border-color: #534AB7; }
    .pf-step-num { background: #2c2c2a; border-color: #4a4845; color: #888780; }
    .pf-field { border-color: #3a3835; }
    .pf-field:focus-within { border-color: #888780; }
    .pf-success-title { color: #f0ede8; }
    .pf-thumb { background: #26215C; }
    .pf-new-btn { border-color: #4a4845; color: #888780; }
    .pf-new-btn:hover { background: #2c2c2a; }
  }
`;

/* ─── Icon helpers ─── */
const Icon = {
  Person: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" width="14" height="14">
      <circle cx="8" cy="5" r="3" />
      <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  ),
  Age: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" width="14" height="14">
      <circle cx="8" cy="8" r="6" />
      <polyline points="8,5 8,8 10,10" />
    </svg>
  ),
  Gender: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" width="14" height="14">
      <circle cx="7" cy="9" r="4" />
      <line x1="10" y1="6" x2="14" y2="2" />
      <polyline points="11,2 14,2 14,5" />
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" width="14" height="14">
      <path d="M3 3h2l1 3-1.5 1.5a9 9 0 004 4L10 10l3 1v2a1 1 0 01-1 1A12 12 0 012 4a1 1 0 011-1z" />
    </svg>
  ),
  Arrow: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
      <line x1="3" y1="8" x2="13" y2="8" />
      <polyline points="9,4 13,8 9,12" />
    </svg>
  ),
};

/* ─── Step indicator ─── */
const STEPS = ['Identificação', 'Dados pessoais', 'Confirmação'];

function StepBar({ current }) {
  return (
    <div className="pf-steps">
      {STEPS.map((label, i) => {
        const idx = i + 1;
        const isDone = idx < current;
        const isActive = idx === current;
        return (
          <>
            <div key={idx} className={`pf-step${isActive ? ' active' : ''}${isDone ? ' done' : ''}`}>
              <div className="pf-step-num">{isDone ? '✓' : idx}</div>
              <span>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div key={`line-${i}`} className="pf-step-line" />}
          </>
        );
      })}
    </div>
  );
}

/* ─── Single field row ─── */
function Field({ icon, label, filled, children }) {
  return (
    <div className="pf-field">
      <span className="pf-field-icon">{icon}</span>
      <span className="pf-label">{label}</span>
      {children}
      <span className={`pf-check${filled ? ' visible' : ''}`}>✓</span>
    </div>
  );
}

/* ─── Style injector (runs once) ─── */
let styleInjected = false;
function injectStyles() {
  if (styleInjected) return;
  const tag = document.createElement('style');
  tag.textContent = CSS;
  document.head.appendChild(tag);
  styleInjected = true;
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
function PacienteForm() {
  injectStyles();
  const toast = useToast();

  const [form, setForm] = useState({ nome: '', idade: '', sexo: '', telefone: '' });
  const [uiState, setUiState] = useState('idle'); // idle | loading | success | error

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.nome.trim()) return;
    setUiState('loading');
    try {
      await api.post('/pacientes', form);
      setUiState('success');
      toast.success('Paciente registado com sucesso.', 'Registo concluído');
    } catch (err) {
      console.error(err);
      setUiState('error');
      toast.error('Erro ao registar paciente. Tente novamente.', 'Falha no registo');
    }
  };

  const reset = () => {
    setForm({ nome: '', idade: '', sexo: '', telefone: '' });
    setUiState('idle');
  };

  const isLoading = uiState === 'loading';
  const isSuccess = uiState === 'success';
  const currentStep = isSuccess ? 3 : 2;

  return (
    <div className="pf-root">
      <StepBar current={currentStep} />

      <div className="pf-card">
        {isSuccess ? (
          <div className="pf-success">
            <div className="pf-thumb">👍</div>
            <p className="pf-success-title">Paciente registado!</p>
            <p className="pf-success-sub">
              Os dados foram guardados com sucesso.<br />
              Pode consultar o perfil na lista de pacientes.
            </p>
            <button className="pf-new-btn" onClick={reset}>
              Novo registo
            </button>
          </div>
        ) : (
          <>
            <p className="pf-section-label">Dados do paciente</p>

            <Field icon={<Icon.Person />} label="Nome" filled={!!form.nome.trim()}>
              <input
                className="pf-input"
                type="text"
                name="nome"
                placeholder="Nome completo"
                value={form.nome}
                onChange={set('nome')}
                autoComplete="off"
                required
              />
            </Field>

            <Field icon={<Icon.Age />} label="Idade" filled={!!form.idade}>
              <input
                className="pf-input"
                type="number"
                name="idade"
                placeholder="e.g. 7"
                value={form.idade}
                onChange={set('idade')}
                min="0"
                max="17"
              />
            </Field>

            <Field icon={<Icon.Gender />} label="Sexo" filled={!!form.sexo}>
              <select
                className={`pf-select${!form.sexo ? ' placeholder' : ''}`}
                name="sexo"
                value={form.sexo}
                onChange={set('sexo')}
              >
                <option value="" disabled>Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
            </Field>

            <Field icon={<Icon.Phone />} label="Telefone" filled={!!form.telefone.trim()}>
              <input
                className="pf-input"
                type="tel"
                name="telefone"
                placeholder="e.g. 84 123 4567"
                value={form.telefone}
                onChange={set('telefone')}
              />
            </Field>

            <div className="pf-footer">
              <span className="pf-hint">* Nome obrigatório</span>
              <button
                className="pf-btn"
                onClick={handleSubmit}
                disabled={isLoading || !form.nome.trim()}
              >
                {isLoading ? (
                  <>
                    <span className="pf-btn-loading" />
                    A guardar…
                  </>
                ) : (
                  <>
                    Guardar paciente
                    <Icon.Arrow />
                  </>
                )}
              </button>
            </div>

          </>
        )}
      </div>
    </div>
  );
}

export default PacienteForm;
