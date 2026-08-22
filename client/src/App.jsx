import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './api';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import UrgentAlertBanner from './components/UrgentAlertBanner';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import ClassCoordinatorDashboard from './pages/ClassCoordinatorDashboard';
import GroupCoordinatorDashboard from './pages/GroupCoordinatorDashboard';
import FormsPage from './pages/FormsPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AcademicsPage from './pages/AcademicsPage';
import StudentsDirectoryPage from './pages/StudentsDirectoryPage';
import LeavesPage from './pages/LeavesPage';

export default function App() {
  const { user, loading, isMentor, isClassCoord, isGroupCoord, isStudent } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [urgentAlert, setUrgentAlert] = useState(null);

  useEffect(() => {
    async function checkAlerts() {
      if (!user) return;
      try {
        const res = await api.getAnnouncements();
        if (res.success && res.urgent_alert) {
          setUrgentAlert(res.urgent_alert);
        }
      } catch (e) {
        console.error('Failed to load alerts', e);
      }
    }
    checkAlerts();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-slate-700">Loading LDRP CE-A Command Center...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderDashboard = () => {
    if (isMentor) {
      return <MentorDashboard setActiveTab={setActiveTab} />;
    }
    if (isClassCoord) {
      return <ClassCoordinatorDashboard setActiveTab={setActiveTab} />;
    }
    if (isGroupCoord) {
      return <GroupCoordinatorDashboard setActiveTab={setActiveTab} />;
    }
    return <StudentDashboard setActiveTab={setActiveTab} onOpenNotice={() => setActiveTab('announcements')} />;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'forms':
        return <FormsPage />;
      case 'announcements':
        return <AnnouncementsPage />;
      case 'academics':
        return <AcademicsPage />;
      case 'directory':
        return <StudentsDirectoryPage />;
      case 'leaves':
        return <LeavesPage />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Urgent Emergency Alert Banner */}
      <UrgentAlertBanner
        alert={urgentAlert}
        onOpenNotice={() => setActiveTab('announcements')}
      />

      {/* Main Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderContent()}
      </main>

      {/* Mobile-Friendly App Bottom Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

    </div>
  );
}
