import React, { useState } from 'react';
import { api } from '../api';
import { FilePlus2, X, Plus, Trash2, Calendar, Clock, Check } from 'lucide-react';

export default function NewFormModal({ onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formType, setFormType] = useState('GENERAL_SURVEY');
  const [deadline, setDeadline] = useState('');
  const [requiresFile, setRequiresFile] = useState(false);
  const [questions, setQuestions] = useState([
    { id: 'q1', label: 'Primary Response', type: 'text', required: true, options: [] }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { id: `q${prev.length + 1}`, label: `Question ${prev.length + 1}`, type: 'text', required: true, options: [] }
    ]);
  };

  const removeQuestion = (idx) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const updateQuestion = (idx, field, val) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !deadline) {
      setError('Please provide title and deadline.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.createForm({
        title,
        description,
        form_type: formType,
        deadline,
        requires_file: requiresFile,
        questions
      });

      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to create form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <FilePlus2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Create New Class Form / Survey</h3>
              <p className="text-xs text-blue-100 mt-0.5">Assigned automatically to all 78 students</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg text-white/80 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Form Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Holiday Declaration: 2nd September"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Form Category</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="HOLIDAY_DECLARATION">Holiday Declaration Poll</option>
                <option value="GENERAL_SURVEY">General Class Survey</option>
                <option value="DOCUMENT_UPLOAD">Document Upload Form</option>
                <option value="LEAVE_FORM">Special Leave / Event Form</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">Submission Deadline *</label>
              <input
                type="datetime-local"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Instructions / Description</label>
            <textarea
              rows={2}
              placeholder="Brief explanation for students..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-200">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={requiresFile}
                onChange={(e) => setRequiresFile(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Require document / receipt attachment (PDF/Image)</span>
            </label>
          </div>

          {/* Questions Builder */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Form Questions</span>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Question
              </button>
            </div>

            {questions.map((q, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    placeholder={`Question ${idx + 1} Label`}
                    value={q.label}
                    onChange={(e) => updateQuestion(idx, 'label', e.target.value)}
                    className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestion(idx, 'type', e.target.value)}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="text">Short Text</option>
                    <option value="select">Dropdown Options</option>
                    <option value="radio">Single Choice Radio</option>
                  </select>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(idx)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {(q.type === 'select' || q.type === 'radio') && (
                  <div>
                    <input
                      type="text"
                      placeholder="Options separated by comma (e.g. Yes, No, Maybe)"
                      value={(q.options || []).join(', ')}
                      onChange={(e) => updateQuestion(idx, 'options', e.target.value.split(',').map(s => s.trim()))}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                )}
              </div>
            ))}
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Form'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
