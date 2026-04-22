import BancoSangueLayout from './BancoSangueLayout';
import { useBancoSangueData } from './useBancoSangueData';

function BancoSangueResumo({ usuario, onLogout }) {
  const { pedidos, stats } = useBancoSangueData();

  return (
    <BancoSangueLayout
      usuario={usuario}
      onLogout={onLogout}
      title="Operacoes do banco de sangue"
      subtitle="Visao geral rapida do estado dos pedidos e da resposta operacional do sector."
    >
      <section className="bs-summary-grid">
        <div className="bs-summary-card">
          <div className="bs-summary-label">Pedidos criticos</div>
          <div className="bs-summary-value">{stats.criticos}</div>
          <div className="bs-summary-note">Solicitacoes que precisam de resposta imediata.</div>
        </div>
        <div className="bs-summary-card">
          <div className="bs-summary-label">Prontos</div>
          <div className="bs-summary-value">{stats.prontos}</div>
          <div className="bs-summary-note">Pedidos preparados para libertacao e entrega.</div>
        </div>
        <div className="bs-summary-card">
          <div className="bs-summary-label">Pendentes</div>
          <div className="bs-summary-value">{stats.pendentes}</div>
          <div className="bs-summary-note">Pedidos ainda em validacao, reserva ou processamento.</div>
        </div>
      </section>

      <section className="bs-panel-grid">
        <div className="bs-side-card">
          <div className="bs-side-label">Foco operacional</div>
          <div className="bs-muted-copy">
            O dashboard ficou limpo para mostrar apenas a visao geral. As funcionalidades agora estao
            separadas em paginas proprias na barra lateral.
          </div>
        </div>

        <div className="bs-side-card">
          <div className="bs-side-label">Volume recente</div>
          <div className="bs-summary-value">{pedidos.length}</div>
          <div className="bs-summary-note">Pedidos registados nesta vista operacional.</div>
        </div>
      </section>
    </BancoSangueLayout>
  );
}

export default BancoSangueResumo;
