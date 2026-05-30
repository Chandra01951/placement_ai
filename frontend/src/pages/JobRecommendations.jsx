import { useState, useEffect } from 'react';
import API from '../utils/api';

const sampleJobs = [
  { _id: '1', title: 'Software Development Engineer', company: 'Amazon', location: 'Bangalore', type: 'full-time', salary: { min: 2000000, max: 3500000 }, skills: ['Java', 'AWS', 'DSA', 'System Design'], matchScore: 82, description: 'Join Amazon\'s world-class engineering team. Work on systems that serve millions of customers globally.' },
  { _id: '2', title: 'Frontend Developer Intern', company: 'Flipkart', location: 'Bangalore', type: 'internship', salary: { min: 50000, max: 80000 }, skills: ['React', 'JavaScript', 'CSS'], matchScore: 91, description: '6-month internship working on Flipkart\'s consumer-facing web applications.' },
  { _id: '3', title: 'Data Analyst', company: 'Deloitte', location: 'Mumbai', type: 'full-time', salary: { min: 800000, max: 1500000 }, skills: ['Python', 'SQL', 'Excel', 'Tableau'], matchScore: 68, description: 'Analyze business data and create insights to drive decision making.' },
  { _id: '4', title: 'Full Stack Developer', company: 'Infosys', location: 'Pune', type: 'full-time', salary: { min: 700000, max: 1200000 }, skills: ['React', 'Node.js', 'MongoDB', 'REST APIs'], matchScore: 88, description: 'Build scalable web applications for enterprise clients worldwide.' },
  { _id: '5', title: 'Machine Learning Engineer', company: 'Google', location: 'Hyderabad', type: 'full-time', salary: { min: 3000000, max: 5000000 }, skills: ['Python', 'TensorFlow', 'ML', 'Statistics'], matchScore: 55, description: 'Work on cutting-edge ML systems powering Google products.' },
];

const typeColors = {
  'full-time': 'badge-primary',
  'internship': 'badge-success',
  'part-time': 'badge-warning',
};

const formatSalary = (min, max, type) => {
  if (type === 'internship') return `₹${(min / 1000).toFixed(0)}k–${(max / 1000).toFixed(0)}k/month`;
  return `₹${(min / 100000).toFixed(1)}–${(max / 100000).toFixed(1)} LPA`;
};

export default function JobRecommendations() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: 'all', search: '' });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    API.get('/jobs').then(r => {
      setJobs(r.data.jobs.length > 0 ? r.data.jobs : sampleJobs);
    }).catch(() => {
      setJobs(sampleJobs);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(j =>
    (filter.type === 'all' || j.type === filter.type) &&
    (filter.search === '' || j.title.toLowerCase().includes(filter.search.toLowerCase()) || j.company.toLowerCase().includes(filter.search.toLowerCase()))
  ).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  const matchColor = score => score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';
  const matchBg = score => score >= 80 ? 'bg-emerald-500/10 border-emerald-500/20' : score >= 60 ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20';

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="section-heading">💼 Job Recommendations</h1>
        <p className="text-gray-400 text-sm mt-1">AI-matched job listings based on your skills and profile.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search jobs, companies..."
          value={filter.search}
          onChange={e => setFilter(p => ({ ...p, search: e.target.value }))}
          className="input-field max-w-xs text-sm py-2"
        />
        <div className="flex gap-2">
          {['all', 'full-time', 'internship'].map(t => (
            <button key={t} onClick={() => setFilter(p => ({ ...p, type: t }))} className={`px-4 py-2 text-sm rounded-xl border transition-all capitalize ${filter.type === t ? 'bg-primary-500/20 border-primary-500/40 text-primary-300' : 'bg-white/[0.03] border-white/[0.06] text-gray-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Job list */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            Array(4).fill(0).map((_, i) => <div key={i} className="h-32 skeleton rounded-2xl" />)
          ) : filtered.map(job => (
            <button key={job._id} onClick={() => setSelected(job)} className={`w-full text-left card-hover p-5 ${selected?._id === job._id ? 'border-primary-500/30' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white">{job.title}</h3>
                    <span className={typeColors[job.type] || 'badge-primary'}>{job.type}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{job.company} • {job.location}</p>
                  <p className="text-emerald-400 text-sm mt-1 font-medium">{job.salary ? formatSalary(job.salary.min, job.salary.max, job.type) : 'Salary not disclosed'}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.skills?.slice(0, 4).map(s => <span key={s} className="badge-primary text-xs">{s}</span>)}
                  </div>
                </div>
                {job.matchScore !== undefined && (
                  <div className={`shrink-0 px-3 py-2 rounded-xl border text-center ${matchBg(job.matchScore)}`}>
                    <p className={`text-xl font-bold font-display ${matchColor(job.matchScore)}`}>{job.matchScore}%</p>
                    <p className="text-gray-500 text-xs">match</p>
                  </div>
                )}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-gray-400">No jobs match your filters.</p>
            </div>
          )}
        </div>

        {/* Job detail */}
        <div className="lg:col-span-1">
          {selected ? (
            <div className="card space-y-4 sticky top-4">
              <div>
                <h2 className="font-display font-bold text-white text-lg">{selected.title}</h2>
                <p className="text-gray-400 text-sm">{selected.company} • {selected.location}</p>
              </div>
              {selected.matchScore !== undefined && (
                <div className={`p-4 rounded-xl border text-center ${matchBg(selected.matchScore)}`}>
                  <p className={`text-4xl font-bold font-display ${matchColor(selected.matchScore)}`}>{selected.matchScore}%</p>
                  <p className="text-gray-400 text-sm mt-1">AI Match Score</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-2">Salary Range</p>
                <p className="text-emerald-400 font-medium">{selected.salary ? formatSalary(selected.salary.min, selected.salary.max, selected.type) : 'Not disclosed'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Description</p>
                <p className="text-gray-300 text-sm leading-relaxed">{selected.description}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.skills?.map(s => <span key={s} className="badge-primary">{s}</span>)}
                </div>
              </div>
              {selected.applicationUrl ? (
                <a href={selected.applicationUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center">Apply Now →</a>
              ) : (
                <button className="btn-primary w-full justify-center">Apply Now →</button>
              )}
            </div>
          ) : (
            <div className="card text-center py-12 text-gray-400 text-sm">Select a job to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}
