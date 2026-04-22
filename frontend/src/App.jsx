import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/ToastProvider';
import api from './services/api';
import { clearAuthSession, getAuthSession } from './services/auth';
import Avaliacao from './pages/Avaliacao';
import BancoSangue from './pages/BancoSangue';
import Dashboard from './pages/Dashboard';
import LaboratorioPrincipal from './pages/LaboratorioPrincipal';
import Login from './pages/Login';
import Pacientes from './pages/Pacientes';
import Triagem from './pages/Triagem';

function App() {
  const [session, setSession] = useState(() => getAuthSession());
  const isAuthenticated = Boolean(session?.token);

  useEffect(() => {
    if (!session?.token) {
      return undefined;
    }

    let isMounted = true;

    api.get('/auth/me').catch(() => {
      if (isMounted) {
        clearAuthSession();
        setSession(null);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [session?.token]);

  const handleLogout = () => {
    clearAuthSession();
    setSession(null);
  };

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={setSession} />}
          />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard usuario={session?.usuario} onLogout={handleLogout} />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/pacientes"
            element={(
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Pacientes usuario={session?.usuario} onLogout={handleLogout} />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/triagens"
            element={(
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Triagem usuario={session?.usuario} onLogout={handleLogout} />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/avaliacoes"
            element={(
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Avaliacao usuario={session?.usuario} onLogout={handleLogout} />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/laboratorio-principal"
            element={(
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                session={session}
                allowedDepartments={['administracao', 'laboratorio_principal']}
              >
                <LaboratorioPrincipal usuario={session?.usuario} onLogout={handleLogout} />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/banco-de-sangue"
            element={(
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                session={session}
                allowedDepartments={['administracao', 'banco_de_sangue']}
              >
                <BancoSangue usuario={session?.usuario} onLogout={handleLogout} />
              </ProtectedRoute>
            )}
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
