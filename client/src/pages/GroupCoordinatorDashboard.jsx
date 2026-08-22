import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import HolidayRadarCard from '../components/HolidayRadarCard';
import WhatsAppNudgeModal from '../components/WhatsAppNudgeModal';
import NewAnnouncementModal from '../components/NewAnnouncementModal';
import { 
  Layers, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  Phone, 
  ShieldCheck, 
  FileText, 
  Megaphone,
  Sparkles,
  Search
} from 'lucide-react';

export default function GroupCoordinatorDashboard({ setActiveTab }) {
  const { user } = useAuth();
  const [groupData, setGroupData] = useState(null);
  const [forms, setForms] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nudgeModal, setNudgeModal] = useState({ isOpen: false, formId: null, formTitle: '' });
  const [showAnnModal, setShowAnnModal] = useState(false);

  const myGroupId = user?.coord_group_id || user?.group_id || 2;

  const loadData = async () => {
    try {
      setLoading(true);
      const [groupsRes, formsRes, leavesRes] = await Promise.all([
        api.getGroups(),
        api.getForms(),
        api.getLeaves()
      ]);

      if (groupsRes.success) {
        const found = groupsRes.groups.find(g => g.id === myGroupId);
        setGroupData(found || groupsRes.groups[1]);
      }
      if (formsRes.success) setForms(formsRes.forms);
      if (leavesRes.success) setLeaves(leavesRes.leaves);
    } catch (e) {
      console.error('Failed to load group coordinator data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [myGroupId]);

  const verifyLeave = async (leaveId, status) => {
    try {
      const res = await api.updateLeaveStatus(leaveId, { status, level: 'coordinator' });
      if (res.success) {
        alert(`Leave request marked as ${status}`);
        loadData();
      }
    } catch (e) {
      alert(e.message || 'Failed to update leave');
    }
  };

  const members = groupData?.members || [];
  const activeForm = forms[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in">
      
      {/* Group Coordinator Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 rounded-3xl p-6 text-white shadow-xl shadow-amber-900/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold backdrop-blur-md shadow-md">
            <Layers className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-100 bg-white/20 px-2.5 py-0.5 rounded-full">
                Group Coordinator Desk
              </span>
              <span className="text-xs text-amber-200">
                {groupData?.roll_range}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              {groupData?.name || `Group ${myGroupId}`}
            </h1>
            <p className="text-xs text-amber-100 mt-0.5">
              Coordinator: <span className="font-bold">{user?.full_name}</span> (Roll {user?.roll_no}) • {members.length} Assigned Students
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {activeForm && (
            <button
              onClick={() => setNudgeModal({ isOpen: true, formId: activeForm.id, formTitle: activeForm.title })}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <Send className="w-4 h-4" />
              <span>Nudge Pending in Group</span>
            </button>
          )}

          <button
            onClick={() => setShowAnnModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-amber-900 hover:bg-amber-50 rounded-xl text-xs font-bold shadow-md transition"
          >
            <Megaphone className="w-4 h-4" />
            <span>Group Notice</span>
          </button>
        </div>
      </div>

      {/* Holiday Radar */}
      <HolidayRadarCard 
        onOpenNudge={(formId, title) => setNudgeModal({ isOpen: true, formId, formTitle: title })}
      />

      {/* Group Members Table with 1-Click WhatsApp Nudge */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              <span>Assigned Group Members ({members.length} Students)</span>
            </h3>
            <p className="text-xs text-slate-500">Monitor submissions and send direct WhatsApp nudges</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
          {members.map(member => (
            <div key={member.id} className="p-4 bg-white hover:bg-amber-50/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center text-xs flex-shrink-0">
                  {member.roll_no}
                </div>
                <div>
                  <div className="font-extrabold text-sm text-slate-900">
                    {member.full_name}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="font-mono">{member.enrollment_no}</span>
                    <span>•</span>
                    <span className="font-bold text-emerald-700">{member.attendance_pct || 88}% Attendance</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/91${member.phone || '9879000000'}?text=${encodeURIComponent(`Hi ${member.full_name}, please make sure your CE-A portal submissions are updated! - ${user?.full_name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp Nudge</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group Leave Requests Verification */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>Leave Verification Desk ({leaves.length} Applications)</span>
            </h3>
            <p className="text-xs text-slate-500">Verify medical & event absence before Mentor approval</p>
          </div>
        </div>

        {leaves.length === 0 ? (
          <div className="p-4 bg-slate-50 text-slate-500 text-xs rounded-xl text-center">
            No pending leave applications in your group.
          </div>
        ) : (
          <div className="space-y-3">
            {leaves.map(leave => (
              <div key={leave.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-sm text-slate-900">
                    {leave.student_name} (Roll {leave.roll_no})
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    <span className="font-semibold text-slate-800">Duration:</span> {leave.from_date} to {leave.to_date}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    <span className="font-semibold">Reason:</span> {leave.reason}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {leave.coordinator_status === 'VERIFIED' ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-200">
                      Verified & Forwarded
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => verifyLeave(leave.id, 'VERIFIED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                      >
                        Verify & Forward
                      </button>
                      <button
                        onClick={() => verifyLeave(leave.id, 'REJECTED')}
                        className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-lg transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {nudgeModal.isOpen && (
        <WhatsAppNudgeModal
          formId={nudgeModal.formId}
          formTitle={nudgeModal.formTitle}
          onClose={() => setNudgeModal({ isOpen: false, formId: null, formTitle: '' })}
        />
      )}

      {showAnnModal && (
        <NewAnnouncementModal
          defaultTargetGroup={myGroupId}
          onClose={() => setShowAnnModal(false)}
          onSuccess={loadData}
        />
      )}

    </div>
  );
}
