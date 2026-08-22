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
  Eye,
  EyeOff,
  Zap,
  CheckCircle2
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

  const handleQuickFill = (id) => {
    setIdentifier(id);
    setPassword('ldrp123');
    setError('');
  };

  const fieldConfigs = {
    STUDENT: {
      title: 'Student Portal',
      subtitle: '78 Students (Roll 1-70 & D2D)',
      badge: 'Student Cockpit',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      gradient: 'from-blue-600 to-indigo-600',
      icon: GraduationCap,
      placeholder: 'Enter Roll No (e.g. 1, 20) or Enrollment No',
      quickPills: [
        { label: 'Roll 1 (Aal)', id: '1' },
        { label: 'Roll 3 (Harsh)', id: '3' },
        { label: 'D2D-01 (Darshil)', id: 'D2D-CE-01' }
      ]
    },
    COORDINATOR: {
      title: 'Data Coordinator',
      subtitle: 'CR Priyanshu & 8 Group Coordinators',
      badge: 'Coordination Engine',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      gradient: 'from-amber-500 via-orange-500 to-amber-600',
      icon: Layers,
      placeholder: 'Enter Coord Roll No (e.g. 20, 15, 25)',
      quickPills: [
        { label: 'CR (Priyanshu - 20)', id: '20' },
        { label: 'G2 (Kavya - 15)', id: '15' },
        { label: 'G1 (Vyom - 25)', id: '25' },
        { label: 'G8 (Nemish - D2D)', id: 'D2D-CE-03' }
      ]
    },
    MENTOR: {
      title: 'Faculty Mentor',
      subtitle: 'Prof. Avani Patel & Dr. Hitsh Barot',
      badge: 'Mentor Master Desk',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      gradient: 'from-purple-600 via-indigo-600 to-purple-700',
      icon: ShieldCheck,
      placeholder: 'Enter Faculty ID (e.g. FAC-01 or FAC-02)',
      quickPills: [
        { label: 'Dr. Hitsh Barot (FAC-02)', id: 'FAC-02' },
        { label: 'Prof. Avani Patel (FAC-01)', id: 'FAC-01' }
      ]
    }
  };

  const current = fieldConfigs[selectedField];
  const IconComponent = current.icon;

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col justify-between p-3 sm:p-6 lg:p-8 overflow-x-hidden">
      
      {/* Dynamic Background Glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-20 w-72 h-72 sm:w-96 sm:h-96 bg-purple-400/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <header className="relative z-10 max-w-md sm:max-w-2xl lg:max-w-4xl mx-auto w-full flex items-center justify-between py-1 sm:py-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                LDRP <span className="text-blue-600">CE-A</span>
              </span>
              <span className="bg-blue-100 text-blue-800 text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-blue-200">
                Official
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              LDRP Institute of Technology & Research
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-200 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>78 Students</span>
        </div>
      </header>

      {/* Main Login Card - Mobile-First Optimized */}
      <main className="relative z-10 max-w-md sm:max-w-xl mx-auto w-full my-auto py-3 sm:py-6 space-y-4">
        
        {/* Mobile-Friendly Segmented Role Switcher (Horizontal Tabs) */}
        <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => { setSelectedField('STUDENT'); setError(''); }}
            className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              selectedField === 'STUDENT'
                ? 'bg-white text-blue-700 shadow-md shadow-blue-500/10 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 flex-shrink-0" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => { setSelectedField('COORDINATOR'); setError(''); }}
            className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              selectedField === 'COORDINATOR'
                ? 'bg-white text-amber-700 shadow-md shadow-amber-500/10 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 flex-shrink-0" />
            <span>Coordinator</span>
          </button>

          <button
            type="button"
            onClick={() => { setSelectedField('MENTOR'); setError(''); }}
            className={`flex-1 py-2 sm:py-2.5 px-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              selectedField === 'MENTOR'
                ? 'bg-white text-purple-700 shadow-md shadow-purple-500/10 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>Mentor</span>
          </button>
        </div>

        {/* Dynamic Card for Active Role */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xl shadow-slate-200/50 relative overflow-hidden transition-all">
          
          {/* Top colored accent line */}
          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${current.gradient}`}></div>

          {/* Role Header Banner */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${current.gradient} flex items-center justify-center text-white shadow-md`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  {current.title}
                </h2>
                <p className="text-xs text-slate-500 font-medium">{current.subtitle}</p>
              </div>
            </div>
            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${current.badgeColor}`}>
              {current.badge}
            </span>
          </div>

          {/* 1-Tap Quick Fill Chips for Mobile */}
          <div className="py-3 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                <span>1-Tap Instant Fill:</span>
              </span>
              <span className="text-[10px] lowercase text-slate-400 font-normal">tap to enter</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {current.quickPills.map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => quickSwitch(pill.id)}
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200/90 hover:border-blue-400 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 transition flex items-center gap-1 active:scale-95 shadow-2xs"
                >
                  <span>{pill.label}</span>
                  <span className="text-[10px] text-blue-600 font-extrabold">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message if any */}
          {error && (
            <div className="mb-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-3 pt-1">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Roll No / Enrollment / ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder={current.placeholder}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 sm:py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition shadow-2xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <span className="text-[11px] text-blue-600 font-semibold">
                  Default: <code className="bg-blue-50 px-1 py-0.5 rounded font-mono font-bold">ldrp123</code>
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter password (default: ldrp123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none transition shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className={`w-full py-3 sm:py-3.5 bg-gradient-to-r ${current.gradient} hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/20 transition transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 mt-2`}
            >
              {submitting ? 'Verifying Credentials...' : (
                <>
                  <span>Sign In to {current.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>End-to-End Secure JWT Session • LDRP-ITR CE-A</span>
          </div>

        </div>

      </main>

      {/* Mobile Footer */}
      <footer className="relative z-10 max-w-md sm:max-w-xl mx-auto w-full text-center text-[11px] text-slate-400 py-2 border-t border-slate-200/60 flex items-center justify-between">
        <div>© 2026 LDRP-ITR</div>
        <div className="font-semibold text-slate-500">Division CE-A</div>
      </footer>

    </div>
  );
}