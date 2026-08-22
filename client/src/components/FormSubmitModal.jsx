import React, { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  FileText, 
  X, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  FileCheck2,
  AlertCircle
} from 'lucide-react';

export default function FormSubmitModal({ form, onClose, onSuccess }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Verify required questions
    for (const q of (form.questions || [])) {
      if (q.required && !formData[q.id] && q.type !== 'file') {
        setError(`Please answer question: "${q.label}"`);
        return;
      }
    }

    if (form.requires_file && !file) {
      setError('Please attach the required document/receipt.');
      return;
    }

    try {
      setSubmitting(true);
      const postBody = new FormData();
      postBody.append('response_data', JSON.stringify(formData));
      if (file) {
        postBody.append('attachment', file);
      }

      const res = await api.submitForm(form.id, postBody, true);
      if (res.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">{form.title}</h3>
              <p className="text-xs text-blue-100 mt-0.5">Assigned to CE-A Students</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Pre-filled Identity Badge */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs flex items-center justify-between">
            <div>
              <div className="font-bold text-blue-950">{user?.full_name}</div>
              <div className="text-blue-700">Roll: {user?.roll_no} • {user?.enrollment_no}</div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-200 text-blue-900 rounded-full">
              Group {user?.group_id}
            </span>
          </div>

          {/* Description */}
          {form.description && (
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
              {form.description}
            </p>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Dynamic Questions */}
          {(form.questions || []).map((q, idx) => (
            <div key={q.id || idx} className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>{q.label} {q.required && <span className="text-rose-500">*</span>}</span>
              </label>

              {q.type === 'select' && (
                <select
                  required={q.required}
                  value={formData[q.id] || ''}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="">-- Choose an option --</option>
                  {(q.options || []).map((opt, oIdx) => (
                    <option key={oIdx} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {q.type === 'radio' && (
                <div className="space-y-1.5">
                  {(q.options || []).map((opt, oIdx) => (
                    <label key={oIdx} className="flex items-center gap-2 p-2.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-xl cursor-pointer text-xs">
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={formData[q.id] === opt}
                        onChange={() => handleInputChange(q.id, opt)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-slate-800">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'text' && (
                <input
                  type="text"
                  required={q.required}
                  value={formData[q.id] || ''}
                  onChange={(e) => handleInputChange(q.id, e.target.value)}
                  placeholder="Enter your response..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              )}
            </div>
          ))}

          {/* File Attachment Upload */}
          {form.requires_file && (
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Upload Document / Receipt (PDF/Image) <span className="text-rose-500">*</span></span>
              </label>

              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/30 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition">
                <UploadCloud className="w-8 h-8 text-blue-600 mb-1" />
                <span className="text-xs font-bold text-slate-800">
                  {file ? file.name : 'Tap to select document'}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Supports PDF, JPG, PNG (Max 10MB)'}
                </span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Footer Submit Button */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition transform active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                <>Saving Submission...</>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  Submit Form
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
