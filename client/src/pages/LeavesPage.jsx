import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import ApplyLeaveModal from '../components/ApplyLeaveModal';
import { 
  CalendarOff, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ShieldCheck, 
  User, 
  Calendar
} from 'lucide-react';

export default function LeavesPage() {
  const { user, isMentor, isClassCoord, isGroupCoord } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.getLeaves();
      if (res.success) setLeaves(res.leaves);
    } catch (e) {
      console.error('Failed to load leaves', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleUpdateStatus = async (id, status, level) => {
    try {
      const res = await api.updateLeaveStatus(id, { status, level });
      if (res.success) {
        loadLeaves();
      }
    } catch (e) {
      alert('Update failed: ' + e.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <CalendarOff className="w-7 h-7 text-rose-600" />
            <span>Leave Management & Approvals</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Two-tier verified leave processing: Group Coordinator verification & Mentor approval
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* Leaves List */}
      <div className="space-y-3.5">
        {leaves.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-400">
            No leave applications found.
          </div>
        ) : (
          leaves.map(leave => {
            const isCoordApproved = leave.coordinator_status === 'VERIFIED';
            const isMentorApproved = leave.mentor_status === 'APPROVED';

            return (
              <div key={leave.id} className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 font-black flex items-center justify-center text-xs">
                      {leave.roll_no}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">{leave.student_name}</h3>
                      <div className="text-xs text-slate-500">Group {leave.group_id} • Applied {new Date(leave.applied_at).toLocaleDateString('en-IN')}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                      {leave.from_date} to {leave.to_date}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900">Reason:</span> {leave.reason}
                </p>

                {/* Status Badges & Action Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
                      isCoordApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isCoordApproved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      <span>Coord: {leave.coordinator_status}</span>
                    </div>

                    <div className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
                      isMentorApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isMentorApproved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      <span>Mentor: {leave.mentor_status}</span>
                    </div>
                  </div>

                  {/* Mentor Actions */}
                  {isMentor && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(leave.id, 'APPROVED', 'mentor')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        Approve Leave
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(leave.id, 'REJECTED', 'mentor')}
                        className="px-3.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs rounded-xl transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {/* Group Coordinator Actions */}
                  {isGroupCoord && leave.coordinator_status === 'PENDING' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(leave.id, 'VERIFIED', 'coordinator')}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                      >
                        Verify & Forward
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {showApplyModal && (
        <ApplyLeaveModal
          onClose={() => setShowApplyModal(false)}
          onSuccess={loadLeaves}
        />
      )}

    </div>
  );
}
