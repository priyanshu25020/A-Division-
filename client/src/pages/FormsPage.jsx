import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import FormSubmitModal from '../components/FormSubmitModal';
import WhatsAppNudgeModal from '../components/WhatsAppNudgeModal';
import NewFormModal from '../components/NewFormModal';
import * as XLSX from 'xlsx';
import { 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Send, 
  Download, 
  AlertCircle, 
  Filter, 
  Layers,
  Sparkles
} from 'lucide-react';

export default function FormsPage() {
  const { user, isMentor, isClassCoord, isGroupCoord } = useAuth();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [submitModalForm, setSubmitModalForm] = useState(null);
  const [nudgeModal, setNudgeModal] = useState({ isOpen: false, formId: null, formTitle: '' });
  const [showNewFormModal, setShowNewFormModal] = useState(false);

  const loadForms = async () => {
    try {
      setLoading(true);
      const res = await api.getForms();
      if (res.success) {
        setForms(res.forms);
        if (res.forms.length > 0 && !selectedForm) {
          loadFormDetail(res.forms[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load forms', e);
    } finally {
      setLoading(false);
    }
  };

  const loadFormDetail = async (formId) => {
    try {
      const res = await api.getFormById(formId);
      if (res.success) {
        setSelectedForm(res);
      }
    } catch (e) {
      console.error('Failed to load form detail', e);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const exportCurrentForm = () => {
    if (!selectedForm?.submissions) return;
    const ws = XLSX.utils.json_to_sheet(selectedForm.submissions.map(s => ({
      "Roll No": s.roll_no,
      "Enrollment No": s.enrollment_no,
      "Student Name": s.student_name,
      "Group": `Group ${s.group_id}`,
      "Status": s.status,
      "Response": JSON.stringify(s.response_data),
      "Submitted At": new Date(s.submitted_at).toLocaleString('en-IN')
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Submissions");
    XLSX.writeFile(wb, `${selectedForm.form.title.replace(/[^a-zA-Z0-9]/g, '_')}_Report.xlsx`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-blue-600" />
            <span>Smart Forms & Submissions Desk</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Class surveys, holiday declarations, GTU exam undertakings, and verification workflow
          </p>
        </div>

        {(isMentor || isClassCoord) && (
          <button
            onClick={() => setShowNewFormModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Form</span>
          </button>
        )}
      </div>

      {/* Main Grid: Form List & Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Form List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Available Class Forms ({forms.length})
          </div>

          <div className="space-y-2.5">
            {forms.map(form => {
              const isSelected = selectedForm?.form?.id === form.id;
              return (
                <div
                  key={form.id}
                  onClick={() => loadFormDetail(form.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      {form.form_type}
                    </span>
                    {form.is_submitted_by_user ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Submitted
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 mt-2 leading-snug">
                    {form.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2.5 border-t border-slate-100">
                    <span className="font-semibold text-slate-700">{form.total_submissions} / {form.total_target} Done</span>
                    <span className="font-bold text-blue-600">{form.completion_rate}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Form Detail & Actions */}
        <div className="lg:col-span-8 space-y-5">
          {selectedForm ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
              
              {/* Form Title & Actions Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                    {selectedForm.form.form_type}
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                    {selectedForm.form.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Deadline: <span className="font-bold text-slate-800">{new Date(selectedForm.form.deadline).toLocaleString('en-IN')}</span> • Created by {selectedForm.form.created_by_name}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Student Submit Button */}
                  <button
                    onClick={() => setSubmitModalForm(selectedForm.form)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{selectedForm.user_submission ? 'Update Response' : 'Fill & Submit'}</span>
                  </button>

                  {/* WhatsApp Nudge for Mentors / Coordinators */}
                  {(isMentor || isClassCoord || isGroupCoord) && (
                    <button
                      onClick={() => setNudgeModal({ isOpen: true, formId: selectedForm.form.id, formTitle: selectedForm.form.title })}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>WhatsApp Nudge</span>
                    </button>
                  )}

                  {/* Export Excel for Mentors / CR */}
                  {(isMentor || isClassCoord) && selectedForm.submissions && (
                    <button
                      onClick={exportCurrentForm}
                      className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Export</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Radar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-semibold">Total Target</div>
                  <div className="text-xl font-black text-slate-900 mt-1">{selectedForm.stats.total_students}</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="text-xs text-emerald-800 font-semibold">Submitted</div>
                  <div className="text-xl font-black text-emerald-950 mt-1">{selectedForm.stats.submitted_count}</div>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="text-xs text-amber-800 font-semibold">Pending</div>
                  <div className="text-xl font-black text-amber-950 mt-1">{selectedForm.stats.pending_count}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-xs text-blue-800 font-semibold">Completion %</div>
                  <div className="text-xl font-black text-blue-950 mt-1">{selectedForm.stats.completion_rate}%</div>
                </div>
              </div>

              {/* 8 Groups Breakdown Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>Group-wise Submission Status (8 Groups)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(selectedForm.groupStats || []).map((g) => (
                    <div key={g.group_id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{g.group_name}</div>
                        <div className="text-[11px] text-slate-500">Coord: {g.coordinator_name}</div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          g.is_complete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {g.submitted_count} / {g.total_students} ({g.completion_pct}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submissions List Table (Visible to Mentors & Coordinators) */}
              {selectedForm.submissions && (
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Received Submissions ({selectedForm.submissions.length})
                  </h4>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Roll</th>
                          <th className="p-3">Student</th>
                          <th className="p-3">Group</th>
                          <th className="p-3">Response</th>
                          <th className="p-3">Timestamp</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedForm.submissions.map(sub => (
                          <tr key={sub.id} className="hover:bg-slate-50">
                            <td className="p-3 font-black text-slate-900">{sub.roll_no}</td>
                            <td className="p-3 font-bold text-slate-800">{sub.student_name}</td>
                            <td className="p-3 text-slate-600">Group {sub.group_id}</td>
                            <td className="p-3 text-slate-700 font-medium">{JSON.stringify(sub.response_data)}</td>
                            <td className="p-3 text-slate-400 font-mono text-[11px]">{new Date(sub.submitted_at).toLocaleDateString('en-IN')}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                                {sub.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center text-slate-400">
              Select a form from the left to view details and submission progress.
            </div>
          )}
        </div>

      </div>

      {/* Modals */}
      {submitModalForm && (
        <FormSubmitModal
          form={submitModalForm}
          onClose={() => setSubmitModalForm(null)}
          onSuccess={loadForms}
        />
      )}

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
          onSuccess={loadForms}
        />
      )}

    </div>
  );
}
