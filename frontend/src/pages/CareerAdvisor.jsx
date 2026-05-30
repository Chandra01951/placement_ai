import { useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../utils/api';

const skillOptions = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'MongoDB', 'Machine Learning', 'Data Analysis', 'AWS', 'Docker', 'Git', 'REST APIs', 'TypeScript'];

export default function CareerAdvisor() {
  const { user } = useSelector(s => s.auth);
  const [form, setForm] = useState({
    skills: user?.technicalSkills || [],
    interests: '',
    cgpa: user?.cgpa || '',
    preferredDomain: '',
  });
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSkill = skill => {
    setForm(p => ({
      ...p,
      skills: p.skills.includes(skill) ? p.skills.filter(s => s !== skill) : [...p.skills, skill],
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.skills.length === 0) { setError('Select at least one skill'); return; }
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/ai/career-advice', form);
      setAdvice(data.advice);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get career advice');
    } finally {
      setLoading(false);
    }
  };

  const matchColor = score => score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="section-heading">🚀 AI Career Advisor</h1>
        <p className="text-gray-400 text-sm mt-1">Get personalized career path recommendations based on your profile.</p>
      </div>

      {!advice ? (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          <div className="card">
            <h2 className="font-semibold text-white mb-4">Your Technical Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map(skill => (
                <button key={skill} type="button" onClick={() => toggleSkill(skill)} className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${form.skills.includes(skill) ? 'bg-primary-500/20 border-primary-500/40 text-primary-300' : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:text-white'}`}>
                  {skill}
                </button>
              ))}
            </div>
            {form.skills.length > 0 && (
              <p className="text-primary-400 text-sm mt-3">{form.skills.length} skills selected</p>
            )}
          </div>

          <div className="card space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Interests & Hobbies</label>
              <input type="text" value={form.interests} onChange={e => setForm(p => ({ ...p, interests: e.target.value }))} className="input-field" placeholder="e.g. building web apps, solving puzzles, working with data" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">CGPA</label>
                <input type="number" value={form.cgpa} onChange={e => setForm(p => ({ ...p, cgpa: e.target.value }))} className="input-field" placeholder="8.5" min="0" max="10" step="0.01" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Preferred Domain</label>
                <select value={form.preferredDomain} onChange={e => setForm(p => ({ ...p, preferredDomain: e.target.value }))} className="input-field">
                  <option value="">Any Domain</option>
                  <option>Software Development</option>
                  <option>Data Science & AI</option>
                  <option>Cloud & DevOps</option>
                  <option>Cybersecurity</option>
                  <option>Product Management</option>
                  <option>Web Development</option>
                </select>
              </div>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5">
            {loading ? '🤖 Analyzing your profile...' : '🚀 Get Career Recommendations'}
          </button>
        </form>
      ) : (
        <div className="space-y-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white">Your Career Recommendations</h2>
            <button onClick={() => setAdvice(null)} className="btn-secondary text-sm">← Recalculate</button>
          </div>

          {advice.overallAdvice && (
            <div className="card border-primary-500/20">
              <p className="text-primary-400 text-xs uppercase tracking-wide mb-2">🤖 AI Advice</p>
              <p className="text-gray-300 text-sm leading-relaxed">{advice.overallAdvice}</p>
            </div>
          )}

          <div className="space-y-5">
            {advice.recommendedRoles?.map((role, i) => (
              <div key={i} className="card space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-display font-bold text-white text-lg">{role.title}</h3>
                      {i === 0 && <span className="badge-success">Best Match</span>}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{role.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`text-3xl font-bold font-display ${matchColor(role.matchScore)}`}>{role.matchScore}%</div>
                    <p className="text-gray-500 text-xs">match</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400">Avg Salary:</span>
                  <span className="text-emerald-400 font-medium">{role.avgSalary}</span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {role.requiredSkills?.map(s => <span key={s} className="badge-primary">{s}</span>)}
                    </div>
                  </div>
                  {role.missingSkills?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Skills to Learn</p>
                      <div className="flex flex-wrap gap-1.5">
                        {role.missingSkills?.map(s => <span key={s} className="badge-warning">{s}</span>)}
                      </div>
                    </div>
                  )}
                </div>

                {role.certifications?.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Recommended Certifications</p>
                    <div className="flex flex-wrap gap-1.5">
                      {role.certifications.map(c => <span key={c} className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs rounded-lg">{c}</span>)}
                    </div>
                  </div>
                )}

                {role.roadmap?.length > 0 && (
                  <details className="group">
                    <summary className="text-primary-400 text-sm cursor-pointer hover:text-primary-300 flex items-center gap-2">
                      <span>📍 View Learning Roadmap</span>
                    </summary>
                    <div className="mt-3 space-y-2 pl-4 border-l border-white/[0.08]">
                      {role.roadmap.map((w, wi) => (
                        <div key={wi}>
                          <p className="text-gray-400 text-xs">Week {w.week}</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {w.topics?.map(t => <span key={t} className="text-gray-300 text-xs bg-white/[0.04] px-2 py-1 rounded-md">{t}</span>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
