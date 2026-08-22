import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import HolidayRadarCard from '../components/HolidayRadarCard';
import WhatsAppNudgeModal from '../components/WhatsAppNudgeModal';
import NewFormModal from '../components/NewFormModal';
import NewAnnouncementModal from '../components/NewAnnouncementModal';
import { 
  Sparkles, 
  Users, 
  FileText, 
  Send, 
  Plus, 
  Megaphone, 
  Layers, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ChevronRight,
  PhoneCall,
  Crown
} from 'lucide-react';

export default function ClassCoordinatorDashboard({ setActiveTab }) {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [forms, setForms] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [nudgeModal, setNudgeModal] = useState({ isOpen: false, formId: null, formTitle: '' });
  const [showNewFormModal, setShowNewFormModal] = useState(false);
  const [showNewAnnModal, setShowNewAnnModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ovRes, fRes, gRes] = await Promise.all([
        api.getAnalyticsOverview(),
        api.getForms(),
        api.getGroups()
      ]);

      if (ovRes.success) setOverview(ovRes);
      if (fRes.success) setForms(fRes.forms);
      if (gRes.success) setGroups(gRes.groups);
    } catch (e) {
      console.error('Failed to load CR dashboard', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const leaderboard = overview?.groupLeaderboard || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in">
      
      {/* CR Greeting Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 rounded-3xl p-6 text-white shadow-xl shadow-blue-900/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-amber-300 font-bold backdrop-blur-md shadow-md">
            <Crown className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200 bg-white/20 px-2.5 py-0.5 rounded-full">
                Class Representative (CR)
              </span>
              <span className="text-xs text-blue-200">Roll No. 20</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              Priyanshu's CR Command Desk
            </h1>
            <p className="text-xs text-blue-100 mt-0.5">
              Managing 78 Students & 8 Group Coordinators under Prof. Avani Patel & Dr. Hitsh Barot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowNewFormModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Form</span>
          </button>

          <button
            onClick={() => setShowNewAnnModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-500/30 hover:bg-blue-500/50 text-white rounded-xl text-xs font-bold border border-white/20 transition"
          >
            <Megaphone className="w-4 h-4" />
            <span>Broadcast Notice</span>
          </button>
        </div>
      </div>

      {/* Holiday Attendance Radar */}
      <HolidayRadarCard 
        onOpenNudge={(formId, title) => setNudgeModal({ isOpen: true, formId, formTitle: title })}
      />

      {/* 8 Group Coordinators Accountability Leaderboard */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>8 Group Coordinators Live Leaderboard</span>
            </h3>
            <p className="text-xs text-slate-500">Real-time submission completion rate across groups</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {leaderboard.map((item) => (
            <div key={item.group_id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between hover:bg-blue-50/30 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                    Rank #{item.rank}
                  </span>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                    item.completion_pct === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.completion_pct}%
                  </span>
                </div>

                <div className="font-extrabold text-sm text-slate-900">{item.group_name}</div>
                <div className="text-xs text-slate-600 mt-1">
                  Coord: <span className="font-bold text-slate-800">{item.coordinator_name}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/80">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>{item.submitted} of {item.total_students} Done</span>
                  <span className="text-amber-700 font-semibold">{item.pending} Pending</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${item.completion_pct}%` }}
                    className={`h-full ${item.completion_pct === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forms & Submissions with WhatsApp Nudge */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Forms & Submissions Tracker</span>
            </h3>
            <p className="text-xs text-slate-500">Send WhatsApp reminders to students who have not submitted</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
          {forms.map(form => (
            <div key={form.id} className="p-4 bg-white hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-sm text-slate-900">{form.title}</div>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>Due: {new Date(form.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-700">{form.total_submissions} / {form.total_target} Submitted</span>
                </div>
              </div>

              <button
                onClick={() => setNudgeModal({ isOpen: true, formId: form.id, formTitle: form.title })}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>1-Tap WhatsApp Nudge</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {nudgeModal.isOpen && (
        <WhatsAppNudgeModal
          formId={nudgeModal.formId}
          formTitle={nudgeModal.formTitle}
          onClose={() => setNudgeModal({ isOpen: false, formId: null, formTitle: '' })}
        />
      )}

      {showNewFormModal && (
        <NewFormModal
          onClose={() => setShowNewFormModal(false)}
          onSuccess={loadData}
        />
      )}

      {showNewAnnModal && (
        <NewAnnouncementModal
          onClose={() => setShowNewAnnModal(false)}
          onSuccess={loadData}
        />
      )}

    </div>
  );
}
