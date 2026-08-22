import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import NewAnnouncementModal from '../components/NewAnnouncementModal';
import { 
  Megaphone, 
  Plus, 
  AlertTriangle, 
  Clock, 
  User, 
  Pin, 
  Filter, 
  Sparkles,
  Trash2
} from 'lucide-react';

export default function AnnouncementsPage() {
  const { user, isMentor, isClassCoord, isGroupCoord } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [showNewModal, setShowNewModal] = useState(false);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.getAnnouncements();
      if (res.success) {
        setAnnouncements(res.announcements);
      }
    } catch (e) {
      console.error('Failed to load notices', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      const res = await api.deleteAnnouncement(id);
      if (res.success) {
        loadAnnouncements();
      }
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  const filtered = announcements.filter(a => {
    if (filterPriority === 'ALL') return true;
    return a.priority === filterPriority;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-in fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Megaphone className="w-7 h-7 text-blue-600" />
            <span>Class Notices & Urgent Broadcasts</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time official announcements from Dr. Hitsh Barot, Prof. Avani Patel, and Priyanshu (CR)
          </p>
        </div>

        {(isMentor || isClassCoord || isGroupCoord) && (
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Broadcast Notice</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {['ALL', 'URGENT', 'IMPORTANT', 'NORMAL'].map((p) => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filterPriority === p
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {p === 'URGENT' && <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />}
            <span>{p === 'ALL' ? 'All Notices' : p}</span>
          </button>
        ))}
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filtered.map(ann => {
          const isUrgent = ann.priority === 'URGENT';
          const isImportant = ann.priority === 'IMPORTANT';

          return (
            <div
              key={ann.id}
              className={`rounded-3xl p-5 sm:p-6 border shadow-xs transition hover:shadow-md ${
                isUrgent
                  ? 'bg-gradient-to-r from-amber-50/90 to-orange-50/80 border-amber-300 ring-1 ring-amber-400/30'
                  : isImportant
                  ? 'bg-gradient-to-r from-blue-50/90 to-indigo-50/60 border-blue-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isUrgent
                      ? 'bg-amber-500 text-white shadow-xs'
                      : isImportant
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {ann.priority}
                  </span>

                  {ann.target_group && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                      Group {ann.target_group} Only
                    </span>
                  )}

                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(ann.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {(isMentor || isClassCoord) && (
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-2.5 leading-snug">
                {ann.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed whitespace-pre-line">
                {ann.content}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Posted by <strong className="text-slate-800">{ann.posted_by_name}</strong> ({ann.posted_by_role})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showNewModal && (
        <NewAnnouncementModal
          onClose={() => setShowNewModal(false)}
          onSuccess={loadAnnouncements}
        />
      )}

    </div>
  );
}
