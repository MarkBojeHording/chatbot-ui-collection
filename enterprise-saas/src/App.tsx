import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import ChatInterface from './components/Chat/ChatInterface';
import DocumentManager from './components/Documents/DocumentManager';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import SettingsPanel from './components/Settings/SettingsPanel';
import { ApiService } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      await ApiService.healthCheck();
      setIsOnline(true);
    } catch (error) {
      setIsOnline(false);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'documents':
        return <DocumentManager />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        isOnline={isOnline}
      />
      <main className="flex-1 overflow-hidden">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;