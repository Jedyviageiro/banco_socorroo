import { useEffect, useMemo, useState } from 'react';
import { ToastContext } from './useToast';

const TOAST_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

  .toast-layer {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 1100;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
    font-family: 'Sora', sans-serif;
  }

  .toast-item {
    min-width: 360px;
    max-width: 440px;
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    pointer-events: auto;
    animation: toast-enter 0.26s cubic-bezier(.4,0,.2,1);
    background: #1a1d27;
    border: 1px solid rgba(255,255,255,0.07);
    box-shadow: 0 8px 32px rgba(0,0,0,0.36), 0 1px 0 rgba(255,255,255,0.04) inset;
  }

  /* ── type accent border (left strip via box-shadow) ── */
  .toast-item.success { box-shadow: 0 8px 32px rgba(0,0,0,0.36), inset 3px 0 0 #22c55e; }
  .toast-item.info    { box-shadow: 0 8px 32px rgba(0,0,0,0.36), inset 3px 0 0 #38bdf8; }
  .toast-item.warning { box-shadow: 0 8px 32px rgba(0,0,0,0.36), inset 3px 0 0 #f59e0b; }
  .toast-item.error   { box-shadow: 0 8px 32px rgba(0,0,0,0.36), inset 3px 0 0 #ef4444; }

  /* ── icon ── */
  .toast-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .toast-item.success .toast-icon { background: rgba(34,197,94,.14);  color: #4ade80; }
  .toast-item.info    .toast-icon { background: rgba(56,189,248,.14);  color: #38bdf8; }
  .toast-item.warning .toast-icon { background: rgba(245,158,11,.14);  color: #fbbf24; }
  .toast-item.error   .toast-icon { background: rgba(239,68,68,.14);   color: #f87171; }

  /* ── body ── */
  .toast-body {
    flex: 1;
    min-width: 0;
  }

  .toast-header {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 3px;
  }

  .toast-sparkle {
    opacity: 0.5;
    flex-shrink: 0;
  }

  .toast-title {
    font-size: 13.5px;
    font-weight: 700;
    color: #f0f4ff;
    letter-spacing: -0.01em;
    line-height: 1.3;
  }

  .toast-message {
    font-size: 12px;
    line-height: 1.55;
    color: rgba(200,210,230,0.72);
    margin-bottom: 10px;
  }

  /* ── actions ── */
  .toast-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .toast-action {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 6px;
    color: rgba(200,215,240,0.85);
    font-family: 'Sora', sans-serif;
    font-size: 11.5px;
    font-weight: 600;
    padding: 5px 11px;
    cursor: pointer;
    transition: background .18s, border-color .18s, color .18s;
    letter-spacing: 0.01em;
  }
  .toast-action:hover {
    background: rgba(255,255,255,0.13);
    border-color: rgba(255,255,255,0.18);
    color: #fff;
  }
  .toast-action.primary {
    background: rgba(255,255,255,0.11);
    border-color: rgba(255,255,255,0.16);
    color: #e8f0ff;
  }
  .toast-item.success .toast-action.primary { background: rgba(34,197,94,.18);  border-color: rgba(34,197,94,.28);  color: #86efac; }
  .toast-item.info    .toast-action.primary { background: rgba(56,189,248,.18);  border-color: rgba(56,189,248,.28);  color: #7dd3fc; }
  .toast-item.warning .toast-action.primary { background: rgba(245,158,11,.18);  border-color: rgba(245,158,11,.28);  color: #fcd34d; }
  .toast-item.error   .toast-action.primary { background: rgba(239,68,68,.18);   border-color: rgba(239,68,68,.28);   color: #fca5a5; }

  /* ── close ── */
  .toast-close {
    background: transparent;
    border: none;
    color: rgba(180,195,220,0.45);
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    padding: 2px 4px;
    margin-top: -1px;
    flex-shrink: 0;
    transition: color .16s;
    font-family: sans-serif;
  }
  .toast-close:hover { color: rgba(220,230,255,0.85); }

  /* ── progress bar ── */
  .toast-progress {
    position: absolute;
    bottom: 0; left: 0;
    height: 2px;
    border-radius: 0 0 14px 14px;
    opacity: 0.5;
    animation: toast-progress-shrink linear forwards;
  }
  .toast-item { position: relative; overflow: hidden; }
  .toast-item.success .toast-progress { background: #22c55e; }
  .toast-item.info    .toast-progress { background: #38bdf8; }
  .toast-item.warning .toast-progress { background: #f59e0b; }
  .toast-item.error   .toast-progress { background: #ef4444; }

  @keyframes toast-progress-shrink {
    from { width: 100%; }
    to   { width: 0%; }
  }

  @keyframes toast-enter {
    from { opacity: 0; transform: translateX(18px) scale(0.97); }
    to   { opacity: 1; transform: translateX(0) scale(1); }
  }

  @keyframes toast-confetti-pop {
    0%   { transform: scale(0.75); opacity: 0; }
    55%  { opacity: 0.95; }
    100% { transform: scale(1); opacity: 0.95; }
  }

  @media (max-width: 640px) {
    .toast-layer { top: 16px; right: 16px; left: 16px; }
    .toast-item  { min-width: 0; max-width: none; width: 100%; }
  }
`;

/* ── SVG icons ── */
function IconSuccess() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}
function IconWarning() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
    </svg>
  );
}
function IconError() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}
function IconSparkle() {
  return (
    <svg className="toast-sparkle" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
    </svg>
  );
}

const TYPE_ICONS = {
  success: <IconSuccess />,
  info:    <IconInfo />,
  warning: <IconWarning />,
  error:   <IconError />,
};

let stylesInjected = false;
function injectToastStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.textContent = TOAST_CSS;
  document.head.appendChild(el);
  stylesInjected = true;
}

/* ── single toast ── */
function ToastItem({ toast, onDismiss }) {
  const duration = toast.duration ?? 3600;

  return (
    <div className={`toast-item ${toast.type}`} role="status">
      <div className="toast-icon">{TYPE_ICONS[toast.type]}</div>

      <div className="toast-body">
        <div className="toast-header">
          <IconSparkle />
          <div className="toast-title">{toast.title}</div>
        </div>
        {toast.message && <div className="toast-message">{toast.message}</div>}
        {(toast.actions?.length > 0) && (
          <div className="toast-actions">
            {toast.actions.map((action, i) => (
              <button
                key={i}
                className={`toast-action${i === 0 ? ' primary' : ''}`}
                onClick={() => { action.onClick?.(); onDismiss(toast.id); }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="toast-close" type="button" onClick={() => onDismiss(toast.id)} aria-label="Fechar">
        ×
      </button>

      <div
        className="toast-progress"
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="toast-layer" aria-live="polite" aria-atomic="true">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  injectToastStyles();
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map(toast =>
      setTimeout(() => {
        setToasts(cur => cur.filter(t => t.id !== toast.id));
      }, toast.duration ?? 3600)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts]);

  const api = useMemo(() => {
    const add = (type, message, title, extra = {}) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const durations = { success: 3200, info: 3600, warning: 4000, error: 4500 };
      setToasts(cur => [...cur, { id, type, title, message, duration: durations[type], ...extra }]);
    };
    return {
      success: (message, title = 'Sucesso',  extra) => add('success', message, title, extra),
      info:    (message, title = 'Informação', extra) => add('info',  message, title, extra),
      warning: (message, title = 'Aviso',    extra) => add('warning', message, title, extra),
      error:   (message, title = 'Erro',     extra) => add('error',   message, title, extra),
      dismiss: (id) => setToasts(cur => cur.filter(t => t.id !== id)),
    };
  }, []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={api.dismiss} />
    </ToastContext.Provider>
  );
}