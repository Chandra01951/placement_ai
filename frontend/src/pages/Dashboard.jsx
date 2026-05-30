import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import API from '../utils/api';
import ScoreCircle from '../components/common/ScoreCircle';

const quickLinks = [
  { to: '/resume', icon: '📄', label: 'Analyze Resume', color: 'from-blue-500/20 to-blue-600/10 border-blue-500/20' },
  { to: '/interview', icon: '🎤', label: 'Mock Interview', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/20' },
  { to: '/coding', icon: '💻', label: 'Coding Practice', color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20' },
  { to: '/aptitude', icon: '🧠', label: 'Take Aptitude Test', color: 'from-orange-500/20 to-orange-600/10 border-orange-500/20' },
  { to: '/career', icon: '🚀', label: 'Career Advice', color: 'from-pink-500/20 to-pink-600/10 border-pink-500/20' },
  { to: '/chatbot', icon: '🤖', label: 'AI Chatbot', color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20' },
];

export default function Dashboard() {
  const { user } = useSelector(s => s.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/users/dashboard').then(r => {
      setStats(r.data.stats);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const radarData = [
    { subject: 'Resume', value: stats?.resumeScore || 0 },
    { subject: 'Aptitude', value: stats?.aptitudeScore || 0 },
    { subject: 'Coding', value: stats?.codingScore || 0 },
    { subject: 'Interview', value: stats?.interviewScore || 0 },
  ];

  const readiness = stats?.placementReadiness || user?.placementReadiness || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">Here's your placement readiness overview.</p>
        </div>
        {user?.streak > 0 && (
          <div className="hidden sm:flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2.5 rounded-xl">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-orange-400 font-bold">{user.streak} Day Streak</p>
              <p className="text-gray-500 text-xs">Keep it up!</p>
            </div>
          </div>
        )}
      </div>

      {/* Main stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Readiness Score */}
        <div className="card md:col-span-1 flex flex-col items-center py-8">
          <p className="text-gray-400 text-sm mb-4 font-medium">Placement Readiness</p>
          <ScoreCircle score={readiness} size={140} strokeWidth={10} color={readiness >= 70 ? '#10b981' : readiness >= 40 ? '#f59e0b' : '#ef4444'} />
          <p className="text-gray-400 text-xs mt-4 text-center max-w-[180px]">
            {readiness >= 70 ? '✅ Great! You\'re nearly placement ready.' : readiness >= 40 ? '⚡ Keep practicing to boost your score.' : '🎯 Complete more modules to improve.'}
          </p>
        </div>

        {/* Skill radar */}
        <div className="card md:col-span-2">
          <p className="text-gray-400 text-sm font-medium mb-4">Skills Overview</p>
          {loading ? (
            <div className="h-48 skeleton rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Radar name="Score" dataKey="value" stroke="#28a5fd" fill="#28a5fd" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Resume Score', score: stats?.resumeScore || 0, icon: '📄', color: '#28a5fd' },
          { label: 'Aptitude Score', score: stats?.aptitudeScore || 0, icon: '🧠', color: '#8b5cf6' },
          { label: 'Coding Score', score: stats?.codingScore || 0, icon: '💻', color: '#10b981' },
          { label: 'Interview Score', score: stats?.interviewScore || 0, icon: '🎤', color: '#f59e0b' },
        ].map(item => (
          <div key={item.label} className="card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center text-2xl shrink-0">{item.icon}</div>
            <div>
              <p className="text-gray-400 text-xs mb-1">{item.label}</p>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold font-display" style={{ color: item.color }}>{item.score}</span>
                <span className="text-gray-500 text-sm mb-0.5">/100</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Resumes Uploaded', count: stats?.resumeCount || 0, icon: '📄' },
          { label: 'Interviews Taken', count: stats?.interviewCount || 0, icon: '🎤' },
          { label: 'Tests Completed', count: stats?.testCount || 0, icon: '📝' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-3xl font-bold font-display text-white">{s.count}</div>
            <p className="text-gray-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-lg font-semibold font-display text-white mb-4">Quick Start</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.map(link => (
            <Link key={link.to} to={link.to} className={`p-4 bg-gradient-to-br ${link.color} border rounded-2xl hover:scale-105 transition-all duration-200 text-center group`}>
              <div className="text-3xl mb-2">{link.icon}</div>
              <p className="text-white text-xs font-medium leading-tight">{link.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="card">
        <h2 className="text-lg font-semibold font-display text-white mb-4">🤖 AI Recommendations</h2>
        <div className="space-y-3">
          {[
            { text: 'Upload your resume to get ATS score and AI feedback', action: '/resume', actionText: 'Upload Resume' },
            { text: 'Practice 2 DSA problems daily to improve coding score', action: '/coding', actionText: 'Practice Now' },
            { text: 'Complete a mock interview to boost your confidence', action: '/interview', actionText: 'Start Interview' },
          ].map((rec, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 text-xs font-bold shrink-0">{i + 1}</span>
                <p className="text-gray-300 text-sm">{rec.text}</p>
              </div>
              <Link to={rec.action} className="text-primary-400 hover:text-primary-300 text-xs font-medium whitespace-nowrap ml-4">{rec.actionText} →</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
