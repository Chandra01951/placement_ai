import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import API from '../utils/api';
import { useSelector } from 'react-redux';

const TooltipContent = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-900 border border-white/10 rounded-xl px-3 py-2 text-sm">
        <p className="text-gray-400">{label}</p>
        <p className="text-primary-400 font-bold">{payload[0]?.value}%</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { user } = useSelector(s => s.auth);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/analytics/progress').then(r => {
      setProgress(r.data.progress);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const skillData = [
    { name: 'Resume', score: user?.resumeScore || 0, color: '#28a5fd' },
    { name: 'Aptitude', score: user?.aptitudeScore || 0, color: '#8b5cf6' },
    { name: 'Coding', score: user?.codingScore || 0, color: '#10b981' },
    { name: 'Interview', score: user?.interviewScore || 0, color: '#f59e0b' },
  ];

  const aptitudeChart = progress?.aptitude?.map((p, i) => ({
    name: `Test ${i + 1}`,
    score: p.score,
  })) || [{ name: 'Test 1', score: 0 }];

  const interviewChart = progress?.interview?.map((p, i) => ({
    name: `Int ${i + 1}`,
    score: p.score,
  })) || [{ name: 'Int 1', score: 0 }];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-heading">📊 Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Track your placement preparation progress over time.</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {skillData.map(item => (
          <div key={item.name} className="card">
            <p className="text-gray-400 text-xs mb-2">{item.name} Score</p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-3xl font-bold font-display" style={{ color: item.color }}>{item.score}</span>
              <span className="text-gray-500 text-sm mb-0.5">/100</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${item.score}%`, backgroundColor: item.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Placement readiness */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-white">Overall Placement Readiness</h2>
          <span className={`text-2xl font-bold font-display ${user?.placementReadiness >= 70 ? 'text-emerald-400' : user?.placementReadiness >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
            {user?.placementReadiness || 0}%
          </span>
        </div>
        <div className="h-4 bg-surface-950 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${user?.placementReadiness || 0}%`,
              background: 'linear-gradient(90deg, #0a70df, #28a5fd)',
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>0% — Beginner</span>
          <span>50% — Intermediate</span>
          <span>100% — Ready</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <h2 className="font-display font-semibold text-white mb-4">Aptitude Progress</h2>
          {loading ? <div className="h-48 skeleton rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={aptitudeChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip content={<TooltipContent />} />
                <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h2 className="font-display font-semibold text-white mb-4">Interview Progress</h2>
          {loading ? <div className="h-48 skeleton rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={interviewChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip content={<TooltipContent />} />
                <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Skills Bar Chart */}
      <div className="card">
        <h2 className="font-display font-semibold text-white mb-4">Skills Comparison</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={skillData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
              <div className="bg-surface-900 border border-white/10 rounded-xl px-3 py-2 text-sm">
                <p className="text-gray-400">{label}</p>
                <p className="text-white font-bold">{payload[0]?.value}/100</p>
              </div>
            ) : null} />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {skillData.map((s, i) => (
                <rect key={i} fill={s.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Tests Taken', value: progress?.totalTests || 0, icon: '📝' },
          { label: 'Interviews Done', value: progress?.totalInterviews || 0, icon: '🎤' },
          { label: 'Day Streak', value: user?.streak || 0, icon: '🔥' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-3xl font-bold font-display text-white">{s.value}</div>
            <p className="text-gray-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
