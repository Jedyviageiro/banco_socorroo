import { useNavigate } from 'react-router-dom';

function Dashboard({ usuario, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/', { replace: true });
  };

  return (
    <main className="dashboard-shell">
      <section className="dashboard-hero">
        <div className="dashboard-copy">
          <p className="dashboard-eyebrow">Dashboard</p>
          <h1>Bem-vindo ao painel do Banco Socorro</h1>
          <p className="dashboard-text">
            Sessao iniciada como <strong>{usuario?.nome || usuario?.username}</strong>.
            A partir daqui, a equipa pode abrir rapidamente as areas principais do sistema.
          </p>
        </div>

        <div className="dashboard-actions">
          <button className="dashboard-primary" onClick={() => navigate('/pacientes')}>
            Abrir registo de pacientes
          </button>
          <button className="dashboard-secondary" onClick={handleLogout}>
            Terminar sessao
          </button>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card dashboard-card-accent">
          <p className="dashboard-card-label">Fluxo principal</p>
          <h2>Cadastro de pacientes</h2>
          <p>
            Abra o formulario de entrada para registar novos pacientes e continuar o atendimento.
          </p>
          <button className="dashboard-card-link" onClick={() => navigate('/pacientes')}>
            Entrar no modulo
          </button>
        </article>

        <article className="dashboard-card">
          <p className="dashboard-card-label">Acesso</p>
          <h2>Autenticacao ativa</h2>
          <p>
            O sistema valida a sessao antes de permitir acesso aos endpoints protegidos do backend.
          </p>
        </article>

        <article className="dashboard-card">
          <p className="dashboard-card-label">Seguranca</p>
          <h2>Passwords com hash</h2>
          <p>
            As passwords nao sao guardadas em texto simples. O login usa comparacao segura no servidor.
          </p>
        </article>
      </section>
    </main>
  );
}

export default Dashboard;
