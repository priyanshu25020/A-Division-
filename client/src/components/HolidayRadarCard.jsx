import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import { 
  SunMedium, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  Send, 
  ChevronRight,
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';

export default function HolidayRadarCard({ onOpenNudge }) {
  const { user, isMentor, isClassCoord, isGroupCoord } = useAuth();
  const [pollData, setPollData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChoice, setSelectedChoice] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showGroupBreakdown, setShowGroupBreakdown] = useState(false);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      const res = await api.getActiveHolidayPoll();
      if (res.success && res.poll) {
        setPollData(res.poll);
        if (res.poll.user_response) {
          setSelectedChoice(res.poll.user_response.q1 || '');
          setReason(res.poll.user_response.q2 || '');
        }
      }
    } catch (e) {
      console.error('Failed to load holiday poll', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, []);

  const handleVote = async (choice) => {
    setSelectedChoice(choice);
    try {
      setSubmitting(true);
      const res = await api.voteHoliday({
        form_id: pollData?.id,
        choice,
        reason
      });
      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 }
        });
        await fetchPoll();
      }
    } catch (e) {
      alert(e.message || 'Failed to record vote');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-pulse">
        <div className="h-5 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="h-20 bg-slate-100 rounded-xl mb-4"></div>
      </div>
    );
  }

  if (!pollData) return null;

  const radar = pollData.radar || { total_students: 78, submitted: 0, pending: 78, attending: 0, absent: 0, commuting: 0, attendance_rate: 0 };
  const userHasVoted = !!pollData.user_response;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition hover:shadow-md">
      
      {/* Header Bar */}
      <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-xs">
            <SunMedium className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 bg-white/20 rounded text-blue-100">
                Special System
              </span>
              <span className="text-xs text-blue-200">
                LDRP CE-A
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug mt-0.5">
              {pollData.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {(isMentor || isClassCoord || isGroupCoord) && onOpenNudge && (
            <button
              onClick={() => onOpenNudge(pollData.id, pollData.title)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>1-Tap Nudge ({radar.pending})</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 space-y-5">
        
        {/* Radar Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-emerald-50/80 border border-emerald-200/70 p-3.5 rounded-xl">
            <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Will Attend</span>
            </div>
            <div className="text-2xl font-black text-emerald-950 mt-1">
              {radar.attending} <span className="text-xs font-medium text-emerald-700 font-normal">students</span>
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5">
              {radar.attendance_rate}% intention
            </div>
          </div>

          <div className="bg-rose-50/80 border border-rose-200/70 p-3.5 rounded-xl">
            <div className="text-xs font-semibold text-rose-800 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Absent</span>
            </div>
            <div className="text-2xl font-black text-rose-950 mt-1">
              {radar.absent} <span className="text-xs font-medium text-rose-700 font-normal">students</span>
            </div>
            <div className="text-[11px] text-rose-700 mt-0.5">
              {Math.round((radar.absent / (radar.submitted || 1)) * 100)}% of responses
            </div>
          </div>

          <div className="bg-amber-50/80 border border-amber-200/70 p-3.5 rounded-xl">
            <div className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Commuting / Late</span>
            </div>
            <div className="text-2xl font-black text-amber-950 mt-1">
              {radar.commuting} <span className="text-xs font-medium text-amber-700 font-normal">students</span>
            </div>
            <div className="text-[11px] text-amber-700 mt-0.5">
              From hostel/native
            </div>
          </div>

          <div className="bg-slate-100/80 border border-slate-200 p-3.5 rounded-xl">
            <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-500" />
              <span>Not Responded</span>
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {radar.pending} <span className="text-xs font-medium text-slate-500 font-normal">of {radar.total_students}</span>
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {radar.completion_rate}% class response
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1.5">
            <span>Class-Wide Response Rate ({radar.submitted}/{radar.total_students} Submitted)</span>
            <span className="font-bold text-blue-700">{radar.completion_rate}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/80">
            <div
              style={{ width: `${(radar.attending / radar.total_students) * 100}%` }}
              className="bg-emerald-500 transition-all duration-500"
              title={`Attending: ${radar.attending}`}
            />
            <div
              style={{ width: `${(radar.absent / radar.total_students) * 100}%` }}
              className="bg-rose-500 transition-all duration-500"
              title={`Absent: ${radar.absent}`}
            />
            <div
              style={{ width: `${(radar.commuting / radar.total_students) * 100}%` }}
              className="bg-amber-400 transition-all duration-500"
              title={`Commuting: ${radar.commuting}`}
            />
          </div>
        </div>

        {/* Student Voting Section (For all students) */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Your Personal Attendance Declaration</span>
            </div>
            {userHasVoted && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Submitted
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={() => handleVote('I will attend college (Present)')}
              disabled={submitting}
              className={`p-3 rounded-xl text-left border transition flex items-center justify-between ${
                selectedChoice.includes('Present') || selectedChoice.includes('attend')
                  ? 'bg-emerald-600 text-white border-emerald-700 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50'
              }`}
            >
              <div className="text-xs">
                <div className="font-bold">✅ I Will Attend</div>
                <div className={`text-[11px] ${selectedChoice.includes('attend') ? 'text-emerald-100' : 'text-slate-500'}`}>Present for lectures & lab</div>
              </div>
            </button>

            <button
              onClick={() => handleVote('I will be absent')}
              disabled={submitting}
              className={`p-3 rounded-xl text-left border transition flex items-center justify-between ${
                selectedChoice.includes('absent') || selectedChoice.includes('Absent')
                  ? 'bg-rose-600 text-white border-rose-700 font-bold shadow-md shadow-rose-500/20'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-rose-500 hover:bg-rose-50/50'
              }`}
            >
              <div className="text-xs">
                <div className="font-bold">❌ I Will Be Absent</div>
                <div className={`text-[11px] ${selectedChoice.includes('absent') ? 'text-rose-100' : 'text-slate-500'}`}>Will not attend college</div>
              </div>
            </button>

            <button
              onClick={() => handleVote('Commuting from native/hostel (Late arrival)')}
              disabled={submitting}
              className={`p-3 rounded-xl text-left border transition flex items-center justify-between ${
                selectedChoice.includes('Commuting') || selectedChoice.includes('hostel')
                  ? 'bg-amber-500 text-white border-amber-600 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50'
              }`}
            >
              <div className="text-xs">
                <div className="font-bold">🚌 Commuting / Late</div>
                <div className={`text-[11px] ${selectedChoice.includes('Commuting') ? 'text-amber-100' : 'text-slate-500'}`}>Traveling back from native</div>
              </div>
            </button>
          </div>
        </div>

        {/* Group-by-Group Breakdown Toggle (For Mentors & Coordinators) */}
        <div>
          <button
            onClick={() => setShowGroupBreakdown(!showGroupBreakdown)}
            className="w-full flex items-center justify-between p-3 bg-slate-100/70 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 transition"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>View All 8 Groups Progress Breakdown</span>
            </div>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${showGroupBreakdown ? 'rotate-90' : ''}`} />
          </button>

          {showGroupBreakdown && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 animate-in fade-in">
              {(pollData.group_breakdown || []).map((g) => (
                <div key={g.group_id} className="p-3 bg-white border border-slate-200 rounded-xl text-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">{g.group_name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      g.is_complete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {g.submitted}/{g.total}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-2">
                    Coord: {g.coordinator_name}
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(g.submitted / g.total) * 100}%` }}
                      className={`h-full ${g.is_complete ? 'bg-emerald-500' : 'bg-blue-600'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
