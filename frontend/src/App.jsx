import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Pacientes from './pages/Pacientes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Pacientes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;