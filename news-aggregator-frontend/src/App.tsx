import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import { useData } from './context/DataProvider';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './components/dashboard/DashboardPage';
import PredictionsPage from './components/trends/PredictionsPage';
import GeographicPage from './components/dashboard/GeographicPage';
import ContentPage from './components/content/ContentPage';
import SocialHubPage from './components/social/SocialHubPage';
import SettingsPage from './components/dashboard/SettingsPage';

const routeToTab: Record<string, string> = {
  '/': 'dashboard',
  '/predictions': 'predictions',
  '/geographic': 'geographic',
  '/content': 'content',
  '/social': 'social',
  '/settings': 'settings',
};

const tabToRoute: Record<string, string> = {
  dashboard: '/',
  predictions: '/predictions',
  geographic: '/geographic',
  content: '/content',
  social: '/social',
  settings: '/settings',
};

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setSearchQuery, setActivePlatform, activePlatform } = useData();

  const activeTab = routeToTab[location.pathname] || 'dashboard';

  const handleTabChange = (tab: string) => {
    navigate(tabToRoute[tab] || '/');
  };

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 72 : 240 }}
      >
        <Header
          onSearch={setSearchQuery}
          onPlatformFilter={setActivePlatform}
          activePlatform={activePlatform}
        />
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/predictions" element={<PredictionsPage />} />
                <Route path="/geographic" element={<GeographicPage />} />
                <Route path="/content" element={<ContentPage />} />
                <Route path="/social" element={<SocialHubPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
