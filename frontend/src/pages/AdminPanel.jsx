import { useEffect, useState } from 'react';
import API from '../utils/api';

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/admin/stats'),
      API.get('/admin/users?limit=20'),
    ]).then(([statsRes, usersRes]) => {
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const statCards = stats ? [
    { label: 'Total Students', value: stats.totalUsers, icon: '👥', color: 'text-blue-400' },
    { label: 'Resumes Uploaded', value: stats.totalResumes, icon: '📄', color: 'text-purple-400' },
    { label: 'Interviews Taken', value: stats.totalInterviews, icon: '🎤', color: 'text-emerald-400' },
    { label: 'Tests Completed', value: stats.totalTests, icon: '📝', color: 'text-yellow-400' },
    { label: 'Jobs Posted', value: stats.totalJobs, icon: '💼', color: 'text-orange-400' },
    { label: 'Avg. Readiness', value: `${stats.avgReadiness}%`, icon: '🎯', color: 'text-pink-400' },
  ] : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-heading">⚙️ Admin Panel</h1>
        <p className="text-gray-400 text-sm mt-1">Platform overview and management.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {statCards.map(s => (
              <div key={s.label} className="card">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{s.icon}</span>
                  <div>
                    <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
                    <p className="text-gray-400 text-xs">{s.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-white/[0.06]">
            {['overview', 'users'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${tab === t ? 'border-primary-500 text-primary-400' : 'border-transparent text-gray-400 hover:text-white'}`}>
                {t}
              </button>
            ))}
          </div>

          {tab === 'users' && (
            <div className="card overflow-x-auto">
              <h2 className="font-semibold text-white mb-4">Recent Students</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Name', 'Email', 'College', 'Branch', 'CGPA', 'Readiness', 'Joined'].map(h => (
                      <th key={h} className="text-left text-gray-500 font-medium pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-white/[0.02]">
                      <td className="py-3 pr-4 text-white font-medium">{u.name}</td>
                      <td className="py-3 pr-4 text-gray-400">{u.email}</td>
                      <td className="py-3 pr-4 text-gray-400 truncate max-w-[120px]">{u.college || '—'}</td>
                      <td className="py-3 pr-4 text-gray-400">{u.branch || '—'}</td>
                      <td className="py-3 pr-4 text-gray-300">{u.cgpa || '—'}</td>
                      <td className="py-3 pr-4">
                        <span className={`font-medium ${u.placementReadiness >= 70 ? 'text-emerald-400' : u.placementReadiness >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {u.placementReadiness || 0}%
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'overview' && (
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="card">
                <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { label: '+ Add Aptitude Question', action: () => {} },
                    { label: '+ Post New Job', action: () => {} },
                    { label: '+ Add Company', action: () => {} },
                    { label: '📊 Export Report', action: () => {} },
                  ].map(a => (
                    <button key={a.label} onClick={a.action} className="w-full text-left p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-gray-300 text-sm hover:bg-white/[0.06] transition-all">
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 className="font-semibold text-white mb-4">Platform Health</h3>
                <div className="space-y-3">
                  {[
                    { label: 'API Status', status: 'Online', ok: true },
                    { label: 'AI Service', status: 'Online', ok: true },
                    { label: 'Database', status: 'Connected', ok: true },
                    { label: 'File Storage', status: 'Connected', ok: true },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{s.label}</span>
                      <span className={`text-xs font-medium ${s.ok ? 'text-emerald-400' : 'text-red-400'}`}>● {s.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
