import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  BookOpen, 
  Download, 
  FileText, 
  Code, 
  Calendar, 
  Clock, 
  User, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function AcademicsPage() {
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAcademicData() {
      try {
        setLoading(true);
        const [subRes, ttRes] = await Promise.all([
          api.getSubjects(),
          api.getTimetable()
        ]);
        if (subRes.success) {
          setSubjects(subRes.subjects);
          if (subRes.subjects.length > 0) setSelectedSubject(subRes.subjects[0]);
        }
        if (ttRes.success) {
          setTimetable(ttRes.timetable);
        }
      } catch (e) {
        console.error('Failed to load academic data', e);
      } finally {
        setLoading(false);
      }
    }
    loadAcademicData();
  }, []);

  const currentDaySlots = timetable.find(t => t.day === selectedDay)?.slots || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in">
      
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <BookOpen className="w-7 h-7 text-purple-600" />
          <span>LDRP Study Desk & Academic Hub</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Computer Engineering (CE-A) Semester 3 Syllabus, Notes, GTU PYQs, and Timetable
        </p>
      </div>

      {/* 1. Weekly Class & Lab Timetable */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Weekly Lecture & Laboratory Schedule</span>
            </h3>
            <p className="text-xs text-slate-500">Includes Room 304, Computer Labs 2, 3, 5, 7 and D2D Bridge sessions</p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedDay === day
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentDaySlots.map((slot, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between hover:bg-blue-50/40 transition">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-500">{slot.time}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    slot.type === 'Practical' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {slot.room}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{slot.subject}</h4>
                <div className="text-xs text-slate-500 mt-1">{slot.faculty}</div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/80 text-[11px] text-slate-400 font-medium">
                {slot.type} Session
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Subjects, Notes & GTU PYQs Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Subject Navigation */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            CE-A Core Subjects ({subjects.length})
          </div>

          {subjects.map(sub => {
            const isSelected = selectedSubject?.id === sub.id;
            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubject(sub)}
                className={`p-4 rounded-2xl border cursor-pointer transition ${
                  isSelected
                    ? 'bg-purple-50 border-purple-500 shadow-sm ring-1 ring-purple-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Code: {sub.code}</span>
                  <span className="font-bold text-purple-700">{sub.credits} Credits</span>
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 mt-1">{sub.name}</h3>
                <div className="text-xs text-slate-500 mt-1">Faculty: {sub.faculty}</div>
              </div>
            );
          })}
        </div>

        {/* Selected Subject Resource Vault */}
        <div className="lg:col-span-8">
          {selectedSubject ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full font-mono">
                    Subject Code: {selectedSubject.code}
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-1">{selectedSubject.name}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Faculty Lead: {selectedSubject.faculty} • {selectedSubject.credits} Credits</p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-center self-start sm:self-auto">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">Class Avg Attendance</div>
                  <div className="text-lg font-black text-emerald-950">{selectedSubject.attendance_pct}%</div>
                </div>
              </div>

              {/* Materials List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Lecture Notes, GTU PYQs & Lab Codes
                </h4>

                <div className="space-y-2.5">
                  {(selectedSubject.materials || []).map(mat => (
                    <div key={mat.id} className="p-4 bg-slate-50 hover:bg-purple-50/40 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 transition">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl flex-shrink-0">
                          {mat.type === 'Code' ? <Code className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-slate-900">{mat.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                            <span className="font-semibold text-purple-700">{mat.type}</span>
                            <span>•</span>
                            <span>{mat.size}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => alert(`Downloading: ${mat.title}`)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

      </div>

    </div>
  );
}
