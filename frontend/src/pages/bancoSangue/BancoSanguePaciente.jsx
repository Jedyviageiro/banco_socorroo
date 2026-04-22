import BancoSangueLayout from './BancoSangueLayout';
import { useBancoSangueData } from './useBancoSangueData';

function BancoSanguePaciente({ usuario, onLogout }) {
  const { pacientes } = useBancoSangueData();

  return (
    <BancoSangueLayout
      usuario={usuario}
      onLogout={onLogout}
      title="Paciente"
      subtitle="Consulta rapida dos pacientes disponiveis para iniciar pedidos transfusionais."
    >
      <section className="bs-side-card">
        <div className="bs-side-label">Pacientes disponiveis</div>
        <div className="bs-list">
          {pacientes.length ? (
            pacientes.slice(0, 10).map((paciente) => (
              <div key={paciente.id} className="bs-list-item">
                <div className="bs-list-title">{paciente.nome}</div>
                <div className="bs-list-meta">
                  {paciente.idade ? `${paciente.idade} anos` : 'Idade nao registada'} · {paciente.sexo || 'Sexo nao registado'}
                </div>
              </div>
            ))
          ) : (
            <div className="bs-list-meta">Nao existem pacientes disponiveis neste momento.</div>
          )}
        </div>
      </section>
    </BancoSangueLayout>
  );
}

export default BancoSanguePaciente;
