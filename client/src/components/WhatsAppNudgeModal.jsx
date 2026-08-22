import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  MessageSquare, 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Phone, 
  User, 
  Send, 
  Search, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function WhatsAppNudgeModal({ formId, formTitle, onClose }) {
  const [loading, setLoading] = useState(true);
  const [nudgeData, setNudgeData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  useEffect(() => {
    async function loadNudges() {
      try {
        setLoading(true);
        const res = await api.getNudgeList(formId);
        if (res.success) {
          setNudgeData(res);
        }
      } catch (e) {
        console.error('Failed to load nudge list', e);
      } finally {
        setLoading(false);
      }
    }
    if (formId) loadNudges();
  }, [formId]);

  const filteredList = (nudgeData?.nudge_list || []).filter(item => 
    item.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.roll_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.group_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyMessage = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyAllNumbers = () => {
    const numbers = filteredList.map(item => item.phone).filter(Boolean).join(', ');
    navigator.clipboard.writeText(numbers);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">1-Tap WhatsApp Nudge Engine</h3>
                <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-semibold">CE-A Turbo</span>
              </div>
              <p className="text-xs text-emerald-100 truncate max-w-md">
                {formTitle || 'Form Submission Reminders'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <div className="animate-spin w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm font-medium">Scanning pending submissions & generating personalized links...</p>
            </div>
          ) : nudgeData?.total_pending === 0 ? (
            <div className="py-12 text-center bg-emerald-50 rounded-xl border border-emerald-200 p-6">
              <Sparkles className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <h4 className="font-bold text-emerald-900 text-base">All Students Have Submitted! 💯</h4>
              <p className="text-xs text-emerald-700 mt-1">Zero pending submissions. Outstanding performance for this form.</p>
            </div>
          ) : (
            <>
              {/* Controls bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search roll no, name, group..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg border border-amber-200">
                    {nudgeData?.total_pending} Pending
                  </span>
                  <button
                    onClick={copyAllNumbers}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition"
                  >
                    {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedAll ? 'Copied!' : 'Copy Numbers'}
                  </button>
                </div>
              </div>

              {/* Notice Tip */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">Coordinator Tip:</span> Clicking <span className="font-bold text-emerald-700">[⚡ Nudge via WhatsApp]</span> directly opens WhatsApp with a pre-filled personalized message including the student's name, roll number, and deadline!
                </div>
              </div>

              {/* Student list */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {filteredList.map((item) => (
                  <div key={item.student_id} className="p-3.5 bg-white hover:bg-emerald-50/40 transition flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold flex items-center justify-center text-xs flex-shrink-0">
                        {item.roll_no}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 leading-tight">
                          {item.full_name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{item.group_name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-600 font-mono">
                            <Phone className="w-3 h-3 text-slate-400" /> {item.phone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => copyMessage(item.raw_message, item.student_id)}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        title="Copy message"
                      >
                        {copiedId === item.student_id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <a
                        href={item.whatsapp_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm shadow-emerald-600/30 transition transform active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp Nudge</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>LDRP-ITR CE-A Class Coordination System</div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 rounded-lg transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
