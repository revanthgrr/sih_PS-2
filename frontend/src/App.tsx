import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, NavPage } from './components/layout/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { OverviewPage } from './pages/OverviewPage';
import { FleetPage } from './pages/FleetPage';
import { AircraftDetailPage } from './pages/AircraftDetailPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { MaintenancePlannerPage } from './pages/MaintenancePlannerPage';
import { LogisticsPage } from './pages/LogisticsPage';
import { SimulationLabPage } from './pages/SimulationLabPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer, toast } from './components/ui/Toast';
import { api, setAuthToken } from './services/api';

// ─── Page title map ───────────────────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  overview:    'AeroReady AI — Fleet Availability Overview | Jatayu',
  fleet:       'Fleet Overview | AeroReady AI',
  aircraft:    'Aircraft Digital Twin | AeroReady AI',
  predictions: 'Predictions Center | AeroReady AI',
  maintenance: 'Maintenance Planner | AeroReady AI',
  spares:      'Logistics & Spares | AeroReady AI',
  simulation:  'Simulation Lab | AeroReady AI',
  models:      'Model Performance | AeroReady AI',
  alerts:      'Alerts & Actions | AeroReady AI',
  settings:    'System Architecture & Settings | AeroReady AI',
};

const ALL_PAGES: NavPage[] = [
  'overview', 'fleet', 'aircraft', 'predictions', 'maintenance',
  'spares', 'simulation', 'models', 'alerts', 'settings',
];

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>('Demo User');
  const [currentPage, setCurrentPage] = useState<NavPage>('overview');
  const [selectedAircraftId, setSelectedAircraftId] = useState<string>('A101');
  const [unreadAlerts, setUnreadAlerts] = useState<number>(0);
  const [isSimRunning, setIsSimRunning] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // ─── Dynamic page titles ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) {
      document.title = 'Login | AeroReady AI';
      return;
    }
    if (currentPage === 'aircraft') {
      document.title = `Aircraft ${selectedAircraftId} | AeroReady AI`;
    } else {
      document.title = PAGE_TITLES[currentPage] ?? 'AeroReady AI';
    }
  }, [currentPage, isAuthenticated, selectedAircraftId]);

  // ─── Alert count refresh ──────────────────────────────────────────────────
  const fetchAlertCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.getAlerts(undefined, true);
      setUnreadAlerts(res.total);
    } catch {
      // Backend may still be initializing — silently ignore
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchAlertCount();
  }, [currentPage, fetchAlertCount]);

  // ─── Auth handlers ────────────────────────────────────────────────────────
  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setIsAuthenticated(true);
    setCurrentPage('overview');
  };

  const handleLogout = () => {
    setAuthToken(null);
    setIsAuthenticated(false);
    setCurrentUser('Demo User');
    setCurrentPage('overview');
    setUnreadAlerts(0);
  };

  // ─── Navigation handlers ──────────────────────────────────────────────────
  const handleSelectAircraft = (aircraftId: string) => {
    setSelectedAircraftId(aircraftId);
    setCurrentPage('aircraft');
  };

  const handleNavigatePage = (page: string) => {
    if (ALL_PAGES.includes(page as NavPage)) {
      setCurrentPage(page as NavPage);
    }
  };

  // ─── Simulation handlers ──────────────────────────────────────────────────
  const handleQuickSimulationStep = async () => {
    setIsSimRunning(true);
    try {
      await api.stepSimulation('A101');
      await fetchAlertCount();
    } catch {
      toast.error('Simulation step failed', 'Unable to advance simulation. Is the backend running?');
    } finally {
      setTimeout(() => setIsSimRunning(false), 500);
    }
  };

  const handleResetSimulation = async () => {
    try {
      await api.resetSimulation('A101');
      await fetchAlertCount();
      toast.success('Simulation reset', 'Simulation state has been reset to initial values.');
    } catch {
      toast.error('Reset failed', 'Unable to reset simulation. Please try again.');
    }
  };

  // ─── Login screen ─────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <ToastContainer />
      </>
    );
  }

  // ─── Determine if page is known ───────────────────────────────────────────
  const isKnownPage = ALL_PAGES.includes(currentPage);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onNavigateAlerts={() => setCurrentPage('alerts')}
        onQuickSim={handleQuickSimulationStep}
        onResetSim={handleResetSimulation}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        onLogout={handleLogout}
        alertCount={unreadAlerts}
        isSimRunning={isSimRunning}
        username={currentUser}
      />

      <div className="flex flex-1">
        {/* Left Sidebar — responsive drawer on mobile */}
        <Sidebar
          currentPage={currentPage}
          onSelectPage={(page) => setCurrentPage(page)}
          unreadAlertsCount={unreadAlerts}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main
          id="main-content"
          className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden overflow-y-auto"
        >
          {!isKnownPage ? (
            <NotFoundPage onNavigateHome={() => setCurrentPage('overview')} />
          ) : (
            <>
              {currentPage === 'overview' && (
                <ErrorBoundary moduleName="Overview" onNavigateHome={() => setCurrentPage('overview')}>
                  <OverviewPage
                    onSelectAircraft={handleSelectAircraft}
                    onNavigatePage={handleNavigatePage}
                    onQuickSim={handleQuickSimulationStep}
                  />
                </ErrorBoundary>
              )}

              {currentPage === 'fleet' && (
                <ErrorBoundary moduleName="Fleet Overview" onNavigateHome={() => setCurrentPage('overview')}>
                  <FleetPage onSelectAircraft={handleSelectAircraft} />
                </ErrorBoundary>
              )}

              {currentPage === 'aircraft' && (
                <ErrorBoundary moduleName="Aircraft Digital Twin" onNavigateHome={() => setCurrentPage('overview')}>
                  <AircraftDetailPage
                    aircraftId={selectedAircraftId}
                    onNavigatePage={handleNavigatePage}
                  />
                </ErrorBoundary>
              )}

              {currentPage === 'predictions' && (
                <ErrorBoundary moduleName="Predictions Center" onNavigateHome={() => setCurrentPage('overview')}>
                  <PredictionsPage onSelectAircraft={handleSelectAircraft} />
                </ErrorBoundary>
              )}

              {currentPage === 'maintenance' && (
                <ErrorBoundary moduleName="Maintenance Planner" onNavigateHome={() => setCurrentPage('overview')}>
                  <MaintenancePlannerPage />
                </ErrorBoundary>
              )}

              {currentPage === 'spares' && (
                <ErrorBoundary moduleName="Logistics & Spares" onNavigateHome={() => setCurrentPage('overview')}>
                  <LogisticsPage />
                </ErrorBoundary>
              )}

              {currentPage === 'simulation' && (
                <ErrorBoundary moduleName="Simulation Lab" onNavigateHome={() => setCurrentPage('overview')}>
                  <SimulationLabPage />
                </ErrorBoundary>
              )}

              {currentPage === 'models' && (
                <ErrorBoundary moduleName="Model Performance" onNavigateHome={() => setCurrentPage('overview')}>
                  <ModelPerformancePage />
                </ErrorBoundary>
              )}

              {currentPage === 'alerts' && (
                <ErrorBoundary moduleName="Alerts & Actions" onNavigateHome={() => setCurrentPage('overview')}>
                  <AlertsPage onSelectAircraft={handleSelectAircraft} />
                </ErrorBoundary>
              )}

              {currentPage === 'settings' && (
                <ErrorBoundary moduleName="Settings" onNavigateHome={() => setCurrentPage('overview')}>
                  <SettingsPage />
                </ErrorBoundary>
              )}
            </>
          )}
        </main>
      </div>

      {/* Global toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default App;
