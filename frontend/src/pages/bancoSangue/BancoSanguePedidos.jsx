import BancoSangueLayout from './BancoSangueLayout';
import { useBancoSangueData } from './useBancoSangueData';

function BancoSanguePedidos({ usuario, onLogout }) {
  const { pedidos } = useBancoSangueData();

  return (
    <BancoSangueLayout
      usuario={usuario}
      onLogout={onLogout}
      title="Pedidos recentes"
      subtitle="Lista compacta dos pedidos mais recentes registados no banco de sangue."
    >
      <section className="bs-side-card">
        <div className="bs-side-label">Registos recentes</div>
        <div className="bs-list">
          {pedidos.length ? (
            pedidos.map((pedido) => (
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
                  {pedido.tipoSolicitacao?.replace('_', ' ')} · {pedido.unidades} unidade(s) · {pedido.estado || 'pendente'}
                </div>
              </div>
            ))
          ) : (
            <div className="bs-list-meta">Ainda nao existem pedidos registados.</div>
          )}
        </div>
      </section>
    </BancoSangueLayout>
  );
}

export default BancoSanguePedidos;
