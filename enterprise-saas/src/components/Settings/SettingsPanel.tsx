import React, { useState } from 'react';
import { Save, Bell, Shield, Database, Zap } from 'lucide-react';

const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      escalationAlerts: true,
      dailyReports: false,
    },
    ai: {
      confidenceThreshold: 0.7,
      autoEscalation: true,
      responseLength: 'medium',
    },
    system: {
      apiTimeout: 30,
      maxFileSize: 10,
      retentionDays: 90,
    }
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    alert('Settings saved successfully!');
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">Configure your support system preferences</p>
      </div>

      <div className="p-6 max-w-4xl">
        <div className="space-y-8">
          {/* Notifications */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Email Alerts</label>
                  <p className="text-sm text-gray-500">Receive email notifications for important events</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.emailAlerts}
                  onChange={(e) => updateSetting('notifications', 'emailAlerts', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Escalation Alerts</label>
                  <p className="text-sm text-gray-500">Get notified when cases need human intervention</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.escalationAlerts}
                  onChange={(e) => updateSetting('notifications', 'escalationAlerts', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Daily Reports</label>
                  <p className="text-sm text-gray-500">Receive daily analytics summaries</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.dailyReports}
                  onChange={(e) => updateSetting('notifications', 'dailyReports', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* AI Configuration */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Configuration</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Confidence Threshold
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Minimum confidence level before escalating to human support
                </p>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={settings.ai.confidenceThreshold}
                  onChange={(e) => updateSetting('ai', 'confidenceThreshold', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>50%</span>
                  <span className="font-medium text-primary-600">
                    {Math.round(settings.ai.confidenceThreshold * 100)}%
                  </span>
                  <span>100%</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Auto Escalation</label>
                  <p className="text-sm text-gray-500">Automatically escalate low-confidence responses</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.ai.autoEscalation}
                  onChange={(e) => updateSetting('ai', 'autoEscalation', e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Response Length
                </label>
                <select
                  value={settings.ai.responseLength}
                  onChange={(e) => updateSetting('ai', 'responseLength', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="short">Short (1-2 sentences)</option>
                  <option value="medium">Medium (1-2 paragraphs)</option>
                  <option value="long">Long (Detailed explanations)</option>
                </select>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  API Timeout (seconds)
                </label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={settings.system.apiTimeout}
                  onChange={(e) => updateSetting('system', 'apiTimeout', parseInt(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Max File Size (MB)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={settings.system.maxFileSize}
                  onChange={(e) => updateSetting('system', 'maxFileSize', parseInt(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Data Retention (days)
                </label>
                <input
                  type="number"
                  min="30"
                  max="365"
                  value={settings.system.retentionDays}
                  onChange={(e) => updateSetting('system', 'retentionDays', parseInt(e.target.value))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;