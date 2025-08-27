import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import AutomationsPage from './pages/AutomationsPage';
import SessionsPage from './pages/SessionsPage';

import ListChannelsPage from './pages/ListChannelsPage';
import LogsPage from './pages/LogsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas com o layout principal (menu lateral) */}
        <Route path="/" element={<MainLayout><DashboardPage /></MainLayout>} />
        <Route path="/automations" element={<MainLayout><AutomationsPage /></MainLayout>} />
        <Route path="/sessions" element={<MainLayout><SessionsPage /></MainLayout>} />
        <Route path="/listchannels" element={<MainLayout><ListChannelsPage /></MainLayout>} />
        <Route path="/logs" element={<MainLayout><LogsPage /></MainLayout>} />
        
        {/* Rotas sem o layout principal */}
      </Routes>
    </Router>
  )
}

export default App
