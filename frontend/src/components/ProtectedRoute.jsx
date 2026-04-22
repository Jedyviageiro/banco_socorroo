import { Navigate } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated, session, allowedDepartments, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedDepartments?.length) {
    const userDepartment = session?.usuario?.departamento;

    if (!allowedDepartments.includes(userDepartment)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
