import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  UserCircle2, 
  LogOut, 
  Bell, 
  LayoutDashboard, 
  FileText, 
  Megaphone, 
  BookOpen, 
  Users, 
  CalendarOff,
  ChevronDown,
  ShieldCheck,
  Smartphone,
  Layers,
  Sparkles
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout, demoAccounts, quickSwitch, isMentor, isClassCoord, isGroupCoord } = useAuth();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const getRoleBadge = () => {
    if (isMentor) return <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Faculty Mentor</span>;
    if (isClassCoord) return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Class Coordinator (CR)</span>;
    if (isGroupCoord) return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> Group {user?.coord_group?.group_number || user?.group_id} Coord</span>;
    return <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">Roll {user?.roll_no} • CE-A</span>;
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'forms', label: 'Forms & Submissions', icon: FileText },
    { id: 'announcements', label: 'Notices', icon: Megaphone },
    { id: 'academics', label: 'Study Desk', icon: BookOpen },
    { id: 'directory', label: 'Class Directory (78)', icon: Users },
    { id: 'leaves', label: 'Leave Desk', icon: CalendarOff },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & College Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">LDRP <span className="text-blue-600">CE-A</span></span>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-200">2026-27</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">LDRP-ITR Gandhinagar • Class Command Center</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Profile & Demo Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Persona Switcher (For Testing & Presentations) */}
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                title="Switch role for demo"
              >
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Switch View</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Switch Test Persona
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {demoAccounts.map((acc, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          quickSwitch(acc.roll_no);
                          setShowPersonaMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition ${
                          user?.roll_no === acc.roll_no ? 'bg-blue-50/80 font-bold text-blue-700' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{acc.name}</div>
                          <div className="text-[10px] text-slate-500">{acc.label}</div>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${acc.badgeColor}`}>
                          {acc.roll_no}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Current User Info */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">{user?.full_name}</div>
                <div className="mt-0.5">{getRoleBadge()}</div>
              </div>

              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.full_name}`}
                alt={user?.full_name}
                className="w-9 h-9 rounded-full ring-2 ring-blue-500/20 bg-slate-100 object-cover"
              />

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
