import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import HolidayRadarCard from '../components/HolidayRadarCard';
import WhatsAppNudgeModal from '../components/WhatsAppNudgeModal';
import NewFormModal from '../components/NewFormModal';
import NewAnnouncementModal from '../components/NewAnnouncementModal';
import * as XLSX from 'xlsx';
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Download, 
  Send, 
  Plus, 
  Megaphone, 
  Search, 
  TrendingUp, 
  ShieldCheck, 
  BarChart3, 
  Layers, 
  Sparkles,
  ExternalLink,
  Phone,
  Filter
} from 'lucide-react';

export default function MentorDashboard({ setActiveTab }) {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [forms, setForms] = useState([]);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('');

  // Modals
  const [nudgeModal, setNudgeModal] = useState({ isOpen: false, formId: null, formTitle: '' });
  const [showNewFormModal, setShowNewFormModal] = useState(false);
  const [showNewAnnModal, setShowNewAnnModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ovRes, fRes, gRes, sRes] = await Promise.all([
        api.getAnalyticsOverview(),
        api.getForms(),
        api.getGroups(),
        api.getStudents()
      ]);

      if (ovRes.success) setOverview(ovRes);
      if (fRes.success) setForms(fRes.forms);
      if (gRes.success) setGroups(gRes.groups);
      if (sRes.success) setStudents(sRes.students);
    } catch (e) {
      console.error('Failed to load mentor dashboard', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const exportFormToExcel = async (formId, formTitle) => {
    try {
      const res = await api.exportFormData(formId);
      if (res.success && res.rows) {
        const ws = XLSX.utils.json_to_sheet(res.rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Submissions");
        XLSX.writeFile(wb, `LDRP_CEA_${formTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Report.xlsx`);
      }
    } catch (e) {
      alert('Export failed: ' + e.message);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.enrollment_no.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroupFilter ? s.group_id === parseInt(selectedGroupFilter) : true;
    return matchesSearch && matchesGroup;
  });

  const metrics = overview?.metrics || {
    total_students: 78,
    total_groups: 8,
    active_forms: 3,
    total_submissions: 68,
    average_attendance: 89,
    announcements_count: 3
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in">
      
      {/* 1. Desktop Top Command Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-600/20">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Mentor Command Center
              </span>
              <span className="text-xs font-semibold text-slate-500">LDRP-ITR • Division CE-A</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Welcome, {user?.full_name}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Overseeing 78 Students across 8 Groups with Class Coordinator Priyanshu Bharadava
            </p>
          </div>
        </div>

        {/* Action Buttons for Mentors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowNewFormModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Class Form</span>
          </button>

          <button
            onClick={() => setShowNewAnnModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition"
          >
            <Megaphone className="w-4 h-4" />
            <span>Broadcast Notice</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Metrics Ribbon (Desktop Widescreen) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{metrics.total_students}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Roll 1-70 + D2D (8) + 326</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Class Groups</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{metrics.total_groups}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">8 Group Coordinators</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Active Forms</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{metrics.active_forms}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Currently open for submissions</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Submissions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{metrics.total_submissions}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">92% compliance rate</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Class Attendance</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{metrics.average_attendance}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Division Average</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Class Coordinator</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm font-extrabold text-slate-900 mt-2 truncate">Priyanshu B.</div>
          <div className="text-[11px] text-blue-600 font-bold mt-0.5">Roll No. 20 (CR)</div>
        </div>
      </div>

      {/* 3. Holiday Radar Card */}
      <HolidayRadarCard 
        onOpenNudge={(formId, title) => setNudgeModal({ isOpen: true, formId, formTitle: title })}
      />

      {/* 4. Active Forms & 1-Click WhatsApp Nudge Management */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Form Submissions & Nudge Dashboard</span>
            </h3>
            <p className="text-xs text-slate-500">Track student submissions, trigger WhatsApp reminders, and export data</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
          {forms.map(form => (
            <div key={form.id} className="p-4 bg-white hover:bg-slate-50/70 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">{form.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {form.form_type}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                  <span>Due: {new Date(form.deadline).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  <span>•</span>
                  <span>Created by {form.created_by_name}</span>
                </div>
              </div>

              {/* Progress and actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900">{form.total_submissions} / {form.total_target} Submitted</div>
                  <div className="text-[11px] text-emerald-600 font-semibold">{form.completion_rate}% Completion</div>
                </div>

                <button
                  onClick={() => setNudgeModal({ isOpen: true, formId: form.id, formTitle: form.title })}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp Nudge</span>
                </button>

                <button
                  onClick={() => exportFormToExcel(form.id, form.title)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition"
                  title="Export to Excel / CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export Excel</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. 8 Groups Performance Leaderboard Grid */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <span>8 Groups & Coordinator Structure (78 Students)</span>
            </h3>
            <p className="text-xs text-slate-500">Live accountability of each group coordinator</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {groups.map(group => (
            <div key={group.id} className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl flex flex-col justify-between hover:bg-slate-50 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black px-2 py-0.5 rounded-md text-white" style={{ backgroundColor: group.color || '#3b82f6' }}>
                    {group.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-600">
                    {group.member_count} Students
                  </span>
                </div>

                <div className="font-extrabold text-sm text-slate-900">{group.name}</div>
                <div className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                  <span className="text-slate-400">Coord:</span>
                  <span className="font-semibold text-slate-800">{group.coordinator_name}</span>
                  <span className="text-slate-400 font-mono text-[11px]">(Roll {group.coordinator_roll})</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Avg Attendance</span>
                <span className="font-extrabold text-emerald-700">{group.average_attendance}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Searchable Student Directory of all 78 Students */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Full Class Directory ({students.length} Students)</span>
            </h3>
            <p className="text-xs text-slate-500">Instant search by Roll No, Enrollment, Name, or Group</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search roll, name, enrollment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none w-52 sm:w-64 transition"
              />
            </div>

            <select
              value={selectedGroupFilter}
              onChange={(e) => setSelectedGroupFilter(e.target.value)}
              className="py-2 px-3 bg-slate-100 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="">All Groups</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>Group {g.group_number}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop Data Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Roll No</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5">Enrollment No</th>
                <th className="p-3.5">Assigned Group</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Attendance</th>
                <th className="p-3.5">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.slice(0, 15).map((student) => (
                <tr key={student.id} className="hover:bg-blue-50/30 transition">
                  <td className="p-3.5 font-black text-slate-900">{student.roll_no}</td>
                  <td className="p-3.5 font-bold text-slate-800">{student.full_name}</td>
                  <td className="p-3.5 font-mono text-slate-500">{student.enrollment_no}</td>
                  <td className="p-3.5 text-slate-600">{student.group_name}</td>
                  <td className="p-3.5">
                    {student.role === 'CLASS_COORD' ? (
                      <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-blue-200">CR (Leader)</span>
                    ) : student.role === 'GROUP_COORD' ? (
                      <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-amber-200">Group Coord</span>
                    ) : (
                      <span className="text-slate-500">Student</span>
                    )}
                  </td>
                  <td className="p-3.5 font-bold text-emerald-700">{student.attendance_pct}%</td>
                  <td className="p-3.5 font-mono text-slate-500">{student.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length > 15 && (
            <div className="p-3 bg-slate-50 text-center text-xs text-slate-500 font-semibold border-t border-slate-200">
              Showing top 15 matches of {filteredStudents.length}. Use the Search bar above or click Class Directory to see all.
            </div>
          )}
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
