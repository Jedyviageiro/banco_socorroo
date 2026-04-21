import { useNavigate } from 'react-router-dom';
import PacienteForm from '../components/PacienteForm';

function Pacientes({ usuario, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/', { replace: true });
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <p className="page-eyebrow">Area autenticada</p>
          <h1>Registo de pacientes</h1>
          <p className="page-copy">
            Sessao iniciada como <strong>{usuario?.nome || usuario?.username}</strong>.
          </p>
        </div>

        <button className="page-logout" onClick={handleLogout}>
          Terminar sessao
        </button>
      </header>

      <PacienteForm />
    </div>
  );
}

export default Pacientes;
