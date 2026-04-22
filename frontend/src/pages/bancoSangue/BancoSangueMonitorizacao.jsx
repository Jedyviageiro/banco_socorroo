import BancoSangueLayout from './BancoSangueLayout';
import { useBancoSangueData } from './useBancoSangueData';

function BancoSangueMonitorizacao({ usuario, onLogout }) {
  const { pedidos, stats } = useBancoSangueData();

  return (
    <BancoSangueLayout
      usuario={usuario}
      onLogout={onLogout}
      title="Monitorizacao"
      subtitle="Acompanhamento dos pedidos urgentes, prontos e pendentes do banco de sangue."
    >
      <section className="bs-summary-grid">
        <div className="bs-summary-card">
          <div className="bs-summary-label">Criticos</div>
          <div className="bs-summary-value">{stats.criticos}</div>
          <div className="bs-summary-note">Casos que devem ser priorizados pela equipa.</div>
        </div>
        <div className="bs-summary-card">
          <div className="bs-summary-label">Prontos</div>
          <div className="bs-summary-value">{stats.prontos}</div>
          <div className="bs-summary-note">Pedidos liberados ou prontos para entrega.</div>
        </div>
        <div className="bs-summary-card">
          <div className="bs-summary-label">Total</div>
          <div className="bs-summary-value">{stats.total}</div>
          <div className="bs-summary-note">Volume total actualmente visivel na fila.</div>
        </div>
      </section>

      <section className="bs-side-card">
        <div className="bs-side-label">Fila operacional</div>
        <div className="bs-list">
          {pedidos.length ? (
            pedidos.slice(0, 8).map((pedido) => (
              <div key={pedido.id} className="bs-list-item">
                <div className="bs-list-top">
                  <div className="bs-list-title">
                    {pedido.Paciente?.nome || 'Paciente'} · {pedido.componente}
                  </div>
                  <span className={`bs-badge${pedido.urgencia === 'critica' ? ' critical' : pedido.urgencia === 'alta' ? ' warn' : ''}`}>
                    {pedido.urgencia}
                  </span>
                </div>
                <div className="bs-list-meta">
                  {pedido.tipoSolicitacao?.replace('_', ' ')} · {pedido.estado || 'estado nao indicado'} · {pedido.unidades} unidade(s)
                </div>
              </div>
            ))
          ) : (
            <div className="bs-list-meta">Ainda nao existem pedidos para monitorizar.</div>
          )}
        </div>
      </section>
    </BancoSangueLayout>
  );
}

export default BancoSangueMonitorizacao;
