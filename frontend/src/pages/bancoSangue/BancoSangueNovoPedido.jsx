import BancoSangueLayout from './BancoSangueLayout';
import { COMPONENTES_SANGUINEOS } from './constants';
import { useBancoSangueData } from './useBancoSangueData';

function BancoSangueNovoPedido({ usuario, onLogout }) {
  const {
    form,
    handleChange,
    isLoading,
    isSubmitting,
    pacienteAtual,
    pacientes,
    submitPedido,
  } = useBancoSangueData();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitPedido();
  };

  return (
    <BancoSangueLayout
      usuario={usuario}
      onLogout={onLogout}
      title="Novo pedido"
      subtitle="Registo rapido de solicitacoes transfusionais com os dados essenciais."
    >
      <section className="bs-panel-grid">
        <div className="bs-card">
          <div className="bs-card-header">
            <div className="bs-card-kicker">Formulario</div>
            <div className="bs-card-title">Solicitacao transfusional</div>
            <div className="bs-card-subtitle">Esta funcionalidade agora vive numa pagina propria da navegacao lateral.</div>
          </div>

          <div className="bs-card-body">
            <form className="bs-form" onSubmit={handleSubmit}>
              <div className="bs-divider">Pedido</div>

              <div className="bs-field">
                <label className="bs-field-label">Paciente</label>
                <select value={form.PacienteId} onChange={handleChange('PacienteId')} required disabled={isLoading}>
                  <option value="">{isLoading ? 'A carregar pacientes...' : 'Selecionar paciente'}</option>
                  {pacientes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bs-field-row">
                <div className="bs-field">
                  <label className="bs-field-label">Tipo de solicitacao</label>
                  <select value={form.tipoSolicitacao} onChange={handleChange('tipoSolicitacao')} required>
                    <option value="tipagem">Tipagem sanguinea</option>
                    <option value="prova_compatibilidade">Prova de compatibilidade</option>
                    <option value="reserva">Reserva de componente</option>
                    <option value="transfusao">Transfusao</option>
                  </select>
                </div>

                <div className="bs-field">
                  <label className="bs-field-label">Componente</label>
                  <select value={form.componente} onChange={handleChange('componente')} required>
                    {COMPONENTES_SANGUINEOS.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bs-field-row">
                <div className="bs-field">
                  <label className="bs-field-label">Grupo sanguineo</label>
                  <input value={form.grupoSanguineo} onChange={handleChange('grupoSanguineo')} placeholder="Ex.: O+" />
                </div>

                <div className="bs-field">
                  <label className="bs-field-label">Unidades</label>
                  <input type="number" min="1" max="8" value={form.unidades} onChange={handleChange('unidades')} required />
                </div>
              </div>

              <div className="bs-field">
                <label className="bs-field-label">Urgencia</label>
                <select value={form.urgencia} onChange={handleChange('urgencia')} required>
                  <option value="baixa">Baixa</option>
                  <option value="moderada">Moderada</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Critica</option>
                </select>
              </div>

              <div className="bs-field">
                <label className="bs-field-label">Justificacao clinica</label>
                <textarea
                  value={form.justificacaoClinica}
                  onChange={handleChange('justificacaoClinica')}
                  placeholder="Descreva o motivo do pedido e o contexto clinico."
                  required
                />
              </div>

              <button className="bs-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'A guardar...' : 'Guardar pedido'}
              </button>
            </form>
          </div>
        </div>

        <div className="bs-stat-stack">
          <div className="bs-side-card">
            <div className="bs-side-label">Paciente seleccionado</div>
            {pacienteAtual ? (
              <div className="bs-list-item">
                <div className="bs-list-title">{pacienteAtual.nome}</div>
                <div className="bs-list-meta">
                  {pacienteAtual.idade ? `${pacienteAtual.idade} anos` : 'Idade nao registada'} · {pacienteAtual.sexo || 'Sexo nao registado'}
                </div>
              </div>
            ) : (
              <div className="bs-list-meta">Seleccione um paciente para iniciar a solicitacao.</div>
            )}
          </div>

          <div className="bs-side-card">
            <div className="bs-side-label">Nota</div>
            <div className="bs-muted-copy">
              O formulario saiu do dashboard principal e passou a ficar apenas neste menu proprio.
            </div>
          </div>
        </div>
      </section>
    </BancoSangueLayout>
  );
}

export default BancoSangueNovoPedido;
