import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { 
  Users, 
  Search, 
  Layers, 
  Phone, 
  Mail, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Sparkles,
  Crown
} from 'lucide-react';

export default function StudentsDirectoryPage() {
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('ALL');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sRes, gRes] = await Promise.all([
          api.getStudents(),
          api.getGroups()
        ]);
        if (sRes.success) setStudents(sRes.students);
        if (gRes.success) setGroups(gRes.groups);
      } catch (e) {
        console.error('Failed to load students directory', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = students.filter(s => {
    const matchesSearch = 
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll_no.toLowerCase().includes(search.toLowerCase()) ||
      s.enrollment_no.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search);

    const matchesGroup = selectedGroup === 'ALL' || s.group_id === parseInt(selectedGroup);
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-blue-600" />
            <span>Class Directory ({students.length} Students)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete official roster for LDRP-ITR CE-A • Roll No. 1 to 70 & D2D-CE-01 to 08 & 326
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 bg-blue-100 text-blue-800 rounded-xl border border-blue-200">
            8 Groups • 78 Enrolled
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Roll No, Student Name, Enrollment, or Phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedGroup('ALL')}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedGroup === 'ALL' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All (78)
          </button>
          {groups.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGroup(g.id.toString())}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedGroup === g.id.toString() ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              G{g.group_number}
            </button>
          ))}
        </div>
      </div>

      {/* Students Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map(student => (
          <div key={student.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-xs flex-shrink-0 shadow-sm">
                    {student.roll_no}
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-900 leading-tight">
                      {student.full_name}
                    </h3>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      {student.enrollment_no}
                    </div>
                  </div>
                </div>

                {student.role === 'CLASS_COORD' ? (
                  <span className="p-1.5 bg-blue-100 text-blue-800 rounded-lg" title="Class Coordinator (CR)">
                    <Crown className="w-4 h-4 text-blue-600" />
                  </span>
                ) : student.role === 'GROUP_COORD' ? (
                  <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg" title="Group Coordinator">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                  </span>
                ) : null}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  {student.group_name}
                </span>
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {student.attendance_pct}% Att.
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <a
                href={`tel:${student.phone}`}
                className="flex items-center gap-1 hover:text-blue-600 font-mono text-[11px]"
              >
                <Phone className="w-3 h-3 text-slate-400" /> {student.phone}
              </a>

              <a
                href={`https://wa.me/91${student.phone}?text=Hi%20${encodeURIComponent(student.full_name)}%2C%20connecting%20from%20LDRP%20CE-A%20Portal`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[10px] transition"
              >
                WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
