import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import api from './services/api';
import { clearAuthSession, getAuthSession } from './services/auth';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Pacientes from './pages/Pacientes';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
