import React, { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { CalendarOff, X, Send, AlertCircle } from 'lucide-react';

export default function ApplyLeaveModal({ onClose, onSuccess }) {
  const { user } = useAuth();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fromDate || !toDate || !reason) {
      setError('Please provide from date, to date, and reason for absence.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.applyLeave({
        from_date: fromDate,
        to_date: toDate,
        reason
      });

      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full flex flex-col overflow-hidden">
        
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <CalendarOff className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Submit Leave Application</h3>
              <p className="text-xs text-blue-100">Reviewed by Coordinator & Mentors</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">From Date *</label>
              <input
                type="date"
                required
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">To Date *</label>
              <input
                type="date"
                required
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Reason for Absence *</label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Medical illness / Attending family function / GTU event..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900">
            <span className="font-bold">Workflow:</span> Group Coordinator (Group {user?.group_id}) will verify and Dr. Hitsh / Prof. Avani will provide final approval.
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Submitting...' : 'Apply Leave'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
