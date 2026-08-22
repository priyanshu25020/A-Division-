import React, { useState } from 'react';
import { api } from '../api';
import { Megaphone, X, Send, AlertTriangle } from 'lucide-react';

export default function NewAnnouncementModal({ onClose, onSuccess, defaultTargetGroup = null }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [targetGroup, setTargetGroup] = useState(defaultTargetGroup ? defaultTargetGroup.toString() : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError('Please provide title and announcement message.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.createAnnouncement({
        title,
        content,
        priority,
        target_group: targetGroup ? parseInt(targetGroup) : null
      });

      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to post announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full flex flex-col overflow-hidden">
        
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Broadcast Class Announcement</h3>
              <p className="text-xs text-blue-100">Instantly visible on students' phones</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Notice Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Tomorrow's lecture starts at 10:30 AM in Lab 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="NORMAL">Normal Notice</option>
                <option value="IMPORTANT">Important</option>
                <option value="URGENT">🚨 Urgent (Top Banner)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Audience</label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="">Entire Class (All 78 Students)</option>
                <option value="1">Group 1 (Roll 1-10)</option>
                <option value="2">Group 2 (Roll 11-20)</option>
                <option value="3">Group 3 (Roll 21-30)</option>
                <option value="4">Group 4 (Roll 31-40)</option>
                <option value="5">Group 5 (Roll 41-50)</option>
                <option value="6">Group 6 (Roll 51-60)</option>
                <option value="7">Group 7 (Roll 61-70)</option>
                <option value="8">Group 8 (D2D & 326)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Message Content *</label>
            <textarea
              rows={4}
              required
              placeholder="Detailed announcement instructions for students..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
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
              <span>{loading ? 'Posting...' : 'Broadcast Notice'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
