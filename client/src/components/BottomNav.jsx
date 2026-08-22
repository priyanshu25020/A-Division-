import React from 'react';
import { LayoutDashboard, FileText, Megaphone, BookOpen, Users } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'forms', label: 'Forms', icon: FileText },
    { id: 'announcements', label: 'Notices', icon: Megaphone },
    { id: 'academics', label: 'Study', icon: BookOpen },
    { id: 'directory', label: 'Class', icon: Users },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-lg px-2 py-1">
      <div className="grid grid-cols-5 gap-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-lg transition ${isActive ? 'bg-blue-50' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
