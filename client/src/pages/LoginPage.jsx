import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Layers, 
  AlertCircle,
  GraduationCap,
  Crown,
  Send,
  FileSpreadsheet,
  CheckCircle2,
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';

export default function LoginPage() {
  const { login, quickSwitch, loading } = useAuth();
  
  // 3 Field Options: 'STUDENT', 'COORDINATOR', 'MENTOR'
  const [selectedField, setSelectedField] = useState('STUDENT');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setSubmitting(true);
      await login(identifier, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Field Metadata configurations
  const fieldConfigs = {
    STUDENT: {
      title: 'Student Portal',
      subtitle: 'Roll No. 1 to 70 & D2D Lateral Students (78 Total)',
      badge: 'Student Cockpit',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      themeColor: 'from-blue-600 to-indigo-600',
      activeBorder: 'border-blue-500 ring-4 ring-blue-500/10',
      glowBg: 'bg-blue-500/10',
      icon: GraduationCap,
      placeholder: 'Enter Roll No (e.g. 1, 20) or Enrollment No',
      helper: 'Log in to submit forms, vote attendance radar, and access study materials.',
      quickDemos: [
        { label: 'Aal Anand L. (Roll 1)', id: '1', note: 'Group 1 Student' },
        { label: 'Adroja Harsh (Roll 3)', id: '3', note: 'Group 1 Student' },
        { label: 'Darshil Hadiyal (D2D-01)', id: 'D2D-CE-01', note: 'Group 8 D2D' }
      ]
    },
    COORDINATOR: {
      title: 'Data & Class Coordinator',
      subtitle: 'Class Representative (Priyanshu) & 8 Group Coordinators',
      badge: 'Coordination Engine',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      themeColor: 'from-amber-500 via-orange-500 to-amber-600',
      activeBorder: 'border-amber-500 ring-4 ring-amber-500/10',
      glowBg: 'bg-amber-500/10',
      icon: Layers,
      placeholder: 'Enter Coordinator Roll No (e.g. 20, 15, 25)',
      helper: 'Access 1-Tap WhatsApp Nudge, group tracking, and submission leaderboard.',
      quickDemos: [
        { label: 'Priyanshu Bharadava (CR - Roll 20)', id: '20', note: 'Class Leader & Coord' },
        { label: 'Kavya Barot (Roll 15)', id: '15', note: 'Group 2 Coordinator (Roll 11-20)' },
        { label: 'Vyom Bhatt (Roll 25)', id: '25', note: 'Group 1 Coordinator (Roll 1-10)' },
        { label: 'Nemish Ruparel (D2D-03)', id: 'D2D-CE-03', note: 'Group 8 D2D Coordinator' }
      ]
    },
    MENTOR: {
      title: 'Faculty Mentor Portal',
      subtitle: 'Prof. Avani Patel & Dr. Hitsh Barot',
      badge: 'Mentor Master Desk',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      themeColor: 'from-purple-600 via-indigo-600 to-purple-700',
      activeBorder: 'border-purple-500 ring-4 ring-purple-500/10',
      glowBg: 'bg-purple-500/10',
      icon: ShieldCheck,
      placeholder: 'Enter Faculty ID (e.g. FAC-01 or FAC-02)',
      helper: 'PC widescreen dashboard, class-wide broadcast, and 1-click Excel export.',
      quickDemos: [
        { label: 'Dr. Hitsh Barot (FAC-02)', id: 'FAC-02', note: 'Associate Professor & Mentor' },
        { label: 'Prof. Avani Patel (FAC-01)', id: 'FAC-01', note: 'Assistant Professor & Mentor' }
      ]
    }
  };

  const currentConfig = fieldConfigs[selectedField];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-hidden">
      
      {/* Animated Floating Background Mesh & Gradient Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute top-1/3 -right-24 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl animate-float-reverse pointer-events-none"></div>
      <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl animate-float pointer-events-none"></div>

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/25 transition-transform hover:scale-105">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                LDRP <span className="text-blue-600">CE-A</span>
              </span>
              <span className="bg-blue-100/90 text-blue-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-blue-200 uppercase tracking-wide">
                Unified Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              LDRP Institute of Technology & Research • Gandhinagar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="hidden sm:inline">Official Class Command Center</span>
          <span className="sm:hidden font-mono">78 Students</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl mx-auto w-full my-auto py-6 space-y-6">
        
        {/* Animated 3-Field Role Selection Tabs */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 shadow-xs animate-in fade-in slide-in-from-top-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Select Your Access Role Below</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Choose Your Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pick your field to unlock your specialized workspace with role-based tools
          </p>
        </div>

        {/* 3 Interactive Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          
          {/* 1. Student Field */}
          <div
            onClick={() => {
              setSelectedField('STUDENT');
              setError('');
            }}
            className={`p-4 sm:p-5 rounded-2xl cursor-pointer border-2 transition-all duration-300 card-hover-effect flex flex-col justify-between ${
              selectedField === 'STUDENT'
                ? 'bg-white border-blue-600 shadow-xl shadow-blue-500/15 ring-2 ring-blue-500/20 translate-y-[-2px]'
                : 'bg-white/80 hover:bg-white border-slate-200/90 hover:border-slate-300 shadow-xs opacity-85 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${selectedField === 'STUDENT' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`}>
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${selectedField === 'STUDENT' ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  78 Students
                </span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mt-3">Student</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Mobile cockpit for form submissions, 1-tap holiday voting, timetable, and GTU PYQs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>{selectedField === 'STUDENT' ? 'Selected Field ●' : 'Select Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Data Coordinator Field */}
          <div
            onClick={() => {
              setSelectedField('COORDINATOR');
              setError('');
            }}
            className={`p-4 sm:p-5 rounded-2xl cursor-pointer border-2 transition-all duration-300 card-hover-effect flex flex-col justify-between ${
              selectedField === 'COORDINATOR'
                ? 'bg-white border-amber-500 shadow-xl shadow-amber-500/15 ring-2 ring-amber-500/20 translate-y-[-2px]'
                : 'bg-white/80 hover:bg-white border-slate-200/90 hover:border-slate-300 shadow-xs opacity-85 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${selectedField === 'COORDINATOR' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-800'}`}>
                  <Layers className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${selectedField === 'COORDINATOR' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  CR + 8 Coords
                </span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mt-3">Data Coordinator</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Priyanshu (CR) & Group Coordinators: 1-Tap WhatsApp Nudges, tracking, and leave checks.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>{selectedField === 'COORDINATOR' ? 'Selected Field ●' : 'Select Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Mentor Field */}
          <div
            onClick={() => {
              setSelectedField('MENTOR');
              setError('');
            }}
            className={`p-4 sm:p-5 rounded-2xl cursor-pointer border-2 transition-all duration-300 card-hover-effect flex flex-col justify-between ${
              selectedField === 'MENTOR'
                ? 'bg-white border-purple-600 shadow-xl shadow-purple-500/15 ring-2 ring-purple-500/20 translate-y-[-2px]'
                : 'bg-white/80 hover:bg-white border-slate-200/90 hover:border-slate-300 shadow-xs opacity-85 hover:opacity-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${selectedField === 'MENTOR' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'}`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${selectedField === 'MENTOR' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  2 Mentors
                </span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mt-3">Mentor (Faculty)</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Prof. Avani & Dr. Hitsh: Full class oversight, master Excel exports, and approvals.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>{selectedField === 'MENTOR' ? 'Selected Field ●' : 'Select Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Dynamic Login Panel tailored to the chosen Field */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl relative overflow-hidden transition-all duration-500">
          
          {/* Glowing Top Ribbon */}
          <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${currentConfig.themeColor}`}></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left side of card: 1-Click Fast Test Pills */}
            <div className="lg:col-span-6 space-y-4 border-b lg:border-b-0 lg:border-r border-slate-100 pb-6 lg:pb-0 lg:pr-8">
              <div className="space-y-1">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${currentConfig.badgeColor}`}>
                  {currentConfig.badge}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                  <CurrentIcon className="w-5 h-5 text-slate-800" />
                  <span>{currentConfig.title}</span>
                </h2>
                <p className="text-xs text-slate-500">
                  {currentConfig.helper}
                </p>
              </div>

              {/* 1-Click Demo Accounts for this specific field */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  ⚡ 1-Click Instant Test Access:
                </div>

                <div className="space-y-2">
                  {currentConfig.quickDemos.map((demo, idx) => (
                    <button
                      key={idx}
                      onClick={() => quickSwitch(demo.id)}
                      className="w-full p-3 bg-slate-50 hover:bg-blue-50/80 border border-slate-200/90 hover:border-blue-400 rounded-xl text-left transition flex items-center justify-between group shadow-xs"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                          {demo.label}
                        </div>
                        <div className="text-[10px] text-slate-500">{demo.note}</div>
                      </div>
                      <span className="text-[11px] font-extrabold text-blue-600 bg-white px-2 py-1 rounded-lg border border-slate-200 group-hover:bg-blue-600 group-hover:text-white transition">
                        Enter →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side of card: Standard Credentials Form */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Custom Credentials Sign In</h3>
                <p className="text-xs text-slate-500 mt-0.5">Enter your allocated credentials for {currentConfig.title}</p>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Identification (Roll No / Enrollment / ID)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder={currentConfig.placeholder}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none transition shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Password</label>
                    <span className="text-[11px] text-blue-600 font-semibold">
                      Default: <code className="bg-blue-50 px-1 py-0.5 rounded font-mono">ldrp123</code>
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter password (default: ldrp123)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none transition shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || loading}
                  className={`w-full py-3 bg-gradient-to-r ${currentConfig.themeColor} hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-md transition transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50`}
                >
                  {submitting ? 'Verifying Account...' : (
                    <>
                      <span>Sign In to {currentConfig.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center text-[11px] text-slate-400">
                🔒 Protected by End-to-End JWT Auth & Role Access Control
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full text-center text-xs text-slate-400 py-3 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>© 2026 LDRP Institute of Technology and Research • Gandhinagar</div>
        <div className="font-semibold text-slate-500">Computer Engineering • Division CE-A</div>
      </footer>

    </div>
  );
}