import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import HolidayRadarCard from '../components/HolidayRadarCard';
import FormSubmitModal from '../components/FormSubmitModal';
import ApplyLeaveModal from '../components/ApplyLeaveModal';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  BookOpen, 
  Megaphone, 
  Users, 
  Award, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  Send,
  GraduationCap,
  CalendarOff,
  Flame,
  AlertCircle
} from 'lucide-react';

export default function StudentDashboard({ setActiveTab, onOpenNotice }) {
  const { user } = useAuth();
  const [forms, setForms] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFormModal, setActiveFormModal] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [formsRes, annRes, subRes, ttRes] = await Promise.all([
        api.getForms(),
        api.getAnnouncements(),
        api.getSubjects(),
        api.getTimetable()
      ]);

      if (formsRes.success) setForms(formsRes.forms);
      if (annRes.success) setAnnouncements(annRes.announcements);
      if (subRes.success) setSubjects(subRes.subjects);
      if (ttRes.success) setTimetable(ttRes.timetable);
    } catch (e) {
      console.error('Failed to load student dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingForms = forms.filter(f => !f.is_submitted_by_user && f.is_active);
  const submittedForms = forms.filter(f => f.is_submitted_by_user);
  const latestAnnouncement = announcements[0];

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16 md:pb-6 animate-in fade-in">
      
      {/* 1. Mobile-friendly Greeting & Identity Card */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-blue-900/15 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
          <GraduationCap className="w-48 h-48" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.full_name}`}
              alt={user?.full_name}
              className="w-14 h-14 rounded-2xl ring-4 ring-white/20 bg-white/10 object-cover shadow-md"
            />
            <div>
              <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
                <span>LDRP-ITR • Semester 3</span>
                <span>•</span>
                <span>Division CE-A</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                Good Day, {user?.full_name?.split(' ')[0]} 👋
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                <span className="bg-white/20 px-2 py-0.5 rounded-md font-bold">
                  Roll No. {user?.roll_no}
                </span>
                <span className="bg-blue-500/30 text-blue-100 px-2 py-0.5 rounded-md font-mono text-[11px]">
                  {user?.enrollment_no}
                </span>
                <span className="bg-amber-400/20 text-amber-200 px-2 py-0.5 rounded-md font-medium">
                  Group {user?.group_id} ({user?.group?.coordinator_name})
                </span>
              </div>
            </div>
          </div>

          {/* Attendance KPI Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:text-right border border-white/15 self-start sm:self-auto flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
            <span className="text-xs text-blue-100 font-medium">Current Attendance</span>
            <div className="text-2xl font-black text-white sm:mt-0.5">
              {user?.attendance_pct || 89}%
            </div>
            <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded">
              Above 75% Safe Threshold
            </span>
          </div>
        </div>
      </div>

      {/* 2. Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => setActiveTab('forms')}
          className="p-3.5 bg-white hover:bg-blue-50/60 border border-slate-200/90 rounded-2xl flex items-center gap-3 shadow-xs hover:shadow-sm transition text-left group"
        >
          <div className="p-2 bg-blue-100 text-blue-700 rounded-xl group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Forms & Tasks</div>
            <div className="text-[11px] text-slate-500 font-medium">{pendingForms.length} Pending</div>
          </div>
        </button>

        <button
          onClick={() => setShowLeaveModal(true)}
          className="p-3.5 bg-white hover:bg-rose-50/60 border border-slate-200/90 rounded-2xl flex items-center gap-3 shadow-xs hover:shadow-sm transition text-left group"
        >
          <div className="p-2 bg-rose-100 text-rose-700 rounded-xl group-hover:scale-105 transition-transform">
            <CalendarOff className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Apply Leave</div>
            <div className="text-[11px] text-slate-500 font-medium">Medical / Event</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('academics')}
          className="p-3.5 bg-white hover:bg-purple-50/60 border border-slate-200/90 rounded-2xl flex items-center gap-3 shadow-xs hover:shadow-sm transition text-left group"
        >
          <div className="p-2 bg-purple-100 text-purple-700 rounded-xl group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Study Desk</div>
            <div className="text-[11px] text-slate-500 font-medium">PYQs & Notes</div>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className="p-3.5 bg-white hover:bg-amber-50/60 border border-slate-200/90 rounded-2xl flex items-center gap-3 shadow-xs hover:shadow-sm transition text-left group"
        >
          <div className="p-2 bg-amber-100 text-amber-700 rounded-xl group-hover:scale-105 transition-transform">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Notices</div>
            <div className="text-[11px] text-slate-500 font-medium">{announcements.length} Updates</div>
          </div>
        </button>
      </div>

      {/* 3. Holiday Declaration System Radar (Special Core Feature) */}
      <HolidayRadarCard />

      {/* 4. Pending Forms Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Pending Submissions & Forms</h3>
          </div>
          <button
            onClick={() => setActiveTab('forms')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View All ({forms.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingForms.length === 0 ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200/70 rounded-xl flex items-center gap-3 text-xs text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Great job!</span> You have no pending form submissions right now.
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingForms.map(form => (
              <div key={form.id} className="p-3.5 bg-slate-50 hover:bg-blue-50/40 border border-slate-200 rounded-xl flex items-center justify-between gap-3 transition">
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                    {form.title}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-amber-700 font-medium">
                      <Clock className="w-3 h-3" /> Due: {new Date(form.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span>•</span>
                    <span className="text-slate-600 font-medium">By {form.created_by_name}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveFormModal(form)}
                  className="flex-shrink-0 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs shadow-blue-500/20 transition"
                >
                  Submit Form
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Today's Lectures & Labs Schedule */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Today's Class Schedule (Monday)</h3>
          </div>
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
            Semester 3 • CE-A
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {(timetable[0]?.slots || []).map((slot, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-16 font-mono text-[11px] font-bold text-slate-500">
                  {slot.time.split(' - ')[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{slot.subject}</div>
                  <div className="text-[11px] text-slate-500">{slot.faculty}</div>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  slot.type === 'Practical' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {slot.room}
                </span>
                <div className="text-[10px] text-slate-400 mt-0.5">{slot.type}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Subject-Wise Attendance Breakdown */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Subject Attendance & Progress</h3>
          </div>
          <span className="text-xs font-bold text-emerald-700">Overall: 89%</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subjects.map(sub => (
            <div key={sub.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 truncate max-w-[200px]">{sub.name}</span>
                <span className="font-bold text-emerald-700">{sub.attendance_pct}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  style={{ width: `${sub.attendance_pct}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Faculty: {sub.faculty}</span>
                <span>{sub.credits} Credits</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {activeFormModal && (
        <FormSubmitModal
          form={activeFormModal}
          onClose={() => setActiveFormModal(null)}
          onSuccess={loadData}
        />
      )}

      {showLeaveModal && (
        <ApplyLeaveModal
          onClose={() => setShowLeaveModal(false)}
          onSuccess={() => {
            alert('Leave application submitted successfully!');
            loadData();
          }}
        />
      )}

    </div>
  );
}
